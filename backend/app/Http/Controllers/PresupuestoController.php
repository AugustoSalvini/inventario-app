<?php

namespace App\Http\Controllers;

use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PresupuestoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $q = trim((string) $request->query('q', ''));
            $query = Presupuesto::query();

            if ($q !== '') {
                if (is_numeric($q)) {
                    $query->where('id', (int)$q);
                } else {
                    $query->where('estado', 'ilike', "%{$q}%");
                }
            }

            return response()->json($query->orderBy('id', 'desc')->get());
        } catch (\Throwable $e) {
            Log::error('Presupuestos@index error', ['e' => $e]);
            return response()->json(['message' => 'Error al listar presupuestos'], 500);
        }
    }

    public function show(Presupuesto $presupuesto)
    {
        return response()->json($presupuesto);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'cliente_id' => 'required|integer|min:1',
                'estado'     => 'required|in:borrador,confirmado,cancelado',
                'total'      => 'required|numeric|min:0',
                'notas'      => 'nullable|string',
            ]);

            // tomar el user autenticado (Sanctum/JWT)
            $data['user_id'] = $request->user()->id ?? null;

            if (!$data['user_id']) {
                return response()->json(['message' => 'No autenticado'], 401);
            }

            // normalizar tipos
            $data['total'] = (float) $data['total'];

            $p = Presupuesto::create($data);
            return response()->json($p, 201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Presupuestos@store error', ['e' => $e, 'payload' => $request->all()]);
            return response()->json(['message' => 'Error al crear el presupuesto'], 500);
        }
    }

    public function update(Request $request, Presupuesto $presupuesto)
    {
        try {
            $data = $request->validate([
                'cliente_id' => 'sometimes|integer|min:1',
                'estado'     => 'sometimes|in:borrador,confirmado,cancelado',
                'total'      => 'sometimes|numeric|min:0',
                'notas'      => 'sometimes|nullable|string',
            ]);

            if (array_key_exists('total', $data)) {
                $data['total'] = (float) $data['total'];
            }

            $presupuesto->update($data);
            return response()->json($presupuesto);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Presupuestos@update error', ['e' => $e, 'id' => $presupuesto->id, 'payload' => $request->all()]);
            return response()->json(['message' => 'Error al actualizar el presupuesto'], 500);
        }
    }

    public function destroy(Presupuesto $presupuesto)
    {
        try {
            $presupuesto->delete();
            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Presupuestos@destroy error', ['e' => $e, 'id' => $presupuesto->id]);
            return response()->json(['message' => 'Error al eliminar'], 500);
        }
    }
}
