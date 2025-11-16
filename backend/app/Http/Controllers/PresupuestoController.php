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
        $user = $request->user();

        $q = trim((string) $request->query('q', ''));
        
        // Si es rol "user", solo ve los presupuestos que él mismo creó
        if ($user->rol === 'user') {
            $query = Presupuesto::with(['cliente', 'items', 'user'])
                ->where('user_id', $user->id);
        } else {
            // Admin y empleado ven todos los presupuestos
            $query = Presupuesto::with(['cliente', 'items', 'user']);
        }

        // Filtro de búsqueda por cliente, estado o id
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

    public function show(Request $request, Presupuesto $presupuesto)
    {
        $user = $request->user();

        // El rol "user" no puede ver presupuestos de otro usuario
        if ($user->rol === 'user' && $presupuesto->user_id !== $user->id) {
            return response()->json(['message' => 'Sin permiso'], 403);
        }

        $presupuesto->load(['cliente', 'items.producto']);
        return response()->json($presupuesto);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $rol = $user?->rol ? strtolower($user->rol) : null;
        $esUser = in_array($rol, ['user', 'usuario']);

        if ($esUser) {
            // Usuario común: no elige cliente ni estado desde el frontend
            $data = $request->validate([
                'notas'      => ['nullable', 'string', 'max:1000'],

                'items'      => ['required', 'array', 'min:1'],
                'items.*.producto_id'     => ['nullable', 'exists:productos,id'],
                'items.*.descripcion'     => ['nullable', 'string', 'max:255'],
                'items.*.cantidad'        => ['required', 'numeric', 'min:0.01'],
                'items.*.precio_unitario' => ['required', 'numeric', 'min:0'],
            ]);

            // Para user uso su propio id como cliente y siempre en estado borrador
            $clienteId = $user->id;
            $estado    = 'borrador';

        } else {
            // Empleado / admin: usan la validación completa con cliente y estado
            $data = $request->validate([
                'cliente_id' => ['required', 'exists:clientes,id'],
                'estado'     => ['required', 'in:borrador,enviado,aceptado,rechazado,vencido'],
                'notas'      => ['nullable', 'string', 'max:1000'],

                'items'      => ['required', 'array', 'min:1'],
                'items.*.producto_id'     => ['nullable', 'exists:productos,id'],
                'items.*.descripcion'     => ['nullable', 'string', 'max:255'],
                'items.*.cantidad'        => ['required', 'numeric', 'min:0.01'],
                'items.*.precio_unitario' => ['required', 'numeric', 'min:0'],
            ]);

            $clienteId = $data['cliente_id'];
            $estado    = $data['estado'];
        }

        // Creo el presupuesto inicial en la base
        $presu = Presupuesto::create([
            'user_id'    => $user->id,
            'cliente_id' => $clienteId,
            'estado'     => $estado,
            'notas'      => $data['notas'] ?? null,
            'total'      => 0,
        ]);

        // Recorro los ítems, los guardo y voy sumando el total
        $total = 0;
        foreach ($data['items'] as $it) {
            $cantidad = (float) $it['cantidad'];
            $precio   = (float) $it['precio_unitario'];
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

        // Actualizo el total final del presupuesto
        $presu->update(['total' => $total]);

        return response()->json($presu->load('cliente', 'items'), 201);
    }

    public function update(Request $request, Presupuesto $presupuesto)
    {
        $user = $request->user();

        // El usuario común no puede editar presupuestos de otros
        if ($user->rol === 'user' && $presupuesto->user_id !== $user->id) {
            return response()->json(['message' => 'Sin permiso'], 403);
        }

        try {
            $data = $request->validate([
                'cliente_id' => ['sometimes', 'exists:clientes,id'],
                'estado'     => ['sometimes', 'in:borrador,enviado,aceptado,rechazado,vencido'],
                'notas'      => ['sometimes', 'nullable', 'string', 'max:1000'],

                'items'      => ['sometimes', 'array'],
                'items.*.producto_id'     => ['nullable', 'exists:productos,id'],
                'items.*.descripcion'     => ['nullable', 'string', 'max:255'],
                'items.*.cantidad'        => ['required_with:items', 'numeric', 'min:0.01'],
                'items.*.precio_unitario' => ['required_with:items', 'numeric', 'min:0'],
            ]);

            // El rol user no puede cambiar cliente_id ni estado
            if ($user->rol === 'user') {
                $data['cliente_id'] = $presupuesto->cliente_id;
                $data['estado']     = 'borrador';
            }

            // Actualizo datos generales del presupuesto
            $presupuesto->update([
                'cliente_id' => $data['cliente_id'] ?? $presupuesto->cliente_id,
                'estado'     => $data['estado']     ?? $presupuesto->estado,
                'notas'      => $data['notas']      ?? $presupuesto->notas
            ]);

            // Si vienen ítems en el request, los reemplazo
            if (array_key_exists('items', $data)) {

                // Borro todos los ítems anteriores
                $presupuesto->items()->delete();

                $total = 0;

                foreach ($data['items'] as $it) {
                    $cantidad = (float) $it['cantidad'];
                    $precio   = (float) $it['precio_unitario'];
                    $subtotal = $cantidad * $precio;

                    $presupuesto->items()->create([
                        'producto_id'     => $it['producto_id'] ?? null,
                        'descripcion'     => $it['descripcion'] ?? null,
                        'cantidad'        => $cantidad,
                        'precio_unitario' => $precio,
                        'subtotal'        => $subtotal,
                    ]);

                    $total += $subtotal;
                }

                // Actualizo el total con los nuevos ítems
                $presupuesto->update(['total' => $total]);
            }

            return response()->json($presupuesto->load(['cliente', 'items']));
        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            // Logueo el error para poder revisarlo si algo falla
            Log::error('Presupuestos@update', [
                'e' => $e,
                'payload' => $request->all(),
                'id' => $presupuesto->id
            ]);
            return response()->json(['message' => 'Error al actualizar presupuesto'], 500);
        }
    }

    public function destroy(Request $request, Presupuesto $presupuesto)
    {
        $user = $request->user();

        // El rol user no puede borrar presupuestos
        if ($user->rol === 'user') {
            return response()->json(['message' => 'Sin permiso'], 403);
        }

        // Primero borro los ítems y después el presupuesto
        $presupuesto->items()->delete();
        $presupuesto->delete();
        return response()->json(['ok' => true]);
    }
}
