<?php

namespace App\Http\Controllers;

use App\Models\Presupuesto;
use App\Models\PresupuestoItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PresupuestoController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $query = Presupuesto::with(['cliente', 'items']);

        if ($q !== '') {
            $query->whereHas('cliente', function ($sub) use ($q) {
                $sub->where('nombre', 'ilike', "%{$q}%");
            })->orWhere('estado', 'ilike', "%{$q}%")
              ->orWhere('id', $q);
        }

        return response()->json(
            $query->orderBy('id', 'desc')->paginate(10)
        );
    }

    public function show(Presupuesto $presupuesto)
    {
        $presupuesto->load(['cliente', 'items.producto']);
        return response()->json($presupuesto);
    }

    public function store(Request $request)
    {
        // ✅ Usar precio_unitario (coincide con modelo y migración)
        $data = $request->validate([
            'cliente_id' => ['required','exists:clientes,id'],
            'estado'     => ['required','in:borrador,confirmado,cancelado'],
            'notas'      => ['nullable','string','max:1000'],

            // conviene requerir items
            'items'      => ['required','array','min:1'],
            'items.*.producto_id'     => ['nullable','exists:productos,id'],
            'items.*.descripcion'     => ['nullable','string','max:255'],
            'items.*.cantidad'        => ['required','numeric','min:0.01'],
            'items.*.precio_unitario' => ['required','numeric','min:0'],
        ]);

        $user = $request->user();

        $presu = Presupuesto::create([
            'user_id'    => $user->id,
            'cliente_id' => $data['cliente_id'],
            'estado'     => $data['estado'],
            'notas'      => $data['notas'] ?? null,
            'total'      => 0,
        ]);

        $total = 0;
        foreach ($data['items'] as $it) {
            $cantidad = (float)$it['cantidad'];
            $precio   = (float)$it['precio_unitario'];
            $subtotal = $cantidad * $precio;

            PresupuestoItem::create([
                'presupuesto_id'  => $presu->id,
                'producto_id'     => $it['producto_id'] ?? null,
                'descripcion'     => $it['descripcion'] ?? null,
                'cantidad'        => $cantidad,
                'precio_unitario' => $precio,
                'subtotal'        => $subtotal,
            ]);

            $total += $subtotal;
        }

        $presu->update(['total' => $total]);

        return response()->json($presu->load('cliente','items'), 201);
    }

    public function update(Request $request, Presupuesto $presupuesto)
    {
        try {
            // ✅ Mantener el mismo contrato que store()
            $data = $request->validate([
                'cliente_id' => ['sometimes','integer','exists:clientes,id'],
                'estado'     => ['sometimes','string','in:borrador,confirmado,cancelado'],
                'notas'      => ['sometimes','nullable','string','max:1000'],

                'items'      => ['sometimes','array'],
                'items.*.producto_id'     => ['nullable','integer','exists:productos,id'],
                'items.*.descripcion'     => ['nullable','string','max:255'],
                'items.*.cantidad'        => ['required_with:items','numeric','min:0.01'],
                'items.*.precio_unitario' => ['required_with:items','numeric','min:0'],
            ]);

            $presupuesto->update($request->only('cliente_id','estado','notas'));

            if (array_key_exists('items', $data)) {
                // estrategia simple: regrabar
                $presupuesto->items()->delete();

                $total = 0;
                foreach ($data['items'] as $it) {
                    $cantidad = (float)$it['cantidad'];
                    $precio   = (float)$it['precio_unitario'];
                    $subtotal = $cantidad * $precio;

                    PresupuestoItem::create([
                        'presupuesto_id'  => $presupuesto->id,
                        'producto_id'     => $it['producto_id'] ?? null,
                        'descripcion'     => $it['descripcion'] ?? null,
                        'cantidad'        => $cantidad,
                        'precio_unitario' => $precio,
                        'subtotal'        => $subtotal,
                    ]);
                    $total += $subtotal;
                }
                $presupuesto->update(['total' => $total]);
            }

            return response()->json($presupuesto->load(['cliente','items']));
        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Presupuestos@update', ['e' => $e, 'payload' => $request->all(), 'id' => $presupuesto->id]);
            return response()->json(['message' => 'Error al actualizar presupuesto'], 500);
        }
    }

    public function destroy(Presupuesto $presupuesto)
    {
        $presupuesto->items()->delete();
        $presupuesto->delete();
        return response()->json(['ok' => true]);
    }
}
