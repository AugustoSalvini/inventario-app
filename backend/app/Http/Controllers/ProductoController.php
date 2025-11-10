<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $q = trim((string) $request->query('q', ''));
            $query = Producto::query();

            if ($q !== '') {
                $query->where(function ($sub) use ($q) {
                    $sub->where('nombre', 'ilike', "%{$q}%")
                        ->orWhere('codigo', 'ilike', "%{$q}%");
                    if (ctype_digit($q)) {
                        $sub->orWhere('id', (int) $q);
                    }
                });
            }

            return response()->json($query->orderBy('id', 'desc')->get());
        } catch (\Throwable $e) {
            Log::error('Productos@index error', ['e' => $e]);
            return response()->json(['message' => 'Error al listar productos'], 500);
        }
    }

    public function show(Producto $producto)
    {
        return response()->json($producto);
    }

    public function store(Request $request)
    {
        try {
            // ✅ VALIDACIÓN SÓLO DE PRODUCTOS
            $data = $request->validate([
                'codigo'      => ['nullable','string','max:50','unique:productos,codigo'],
                'nombre'      => ['required','string','max:255'],
                'descripcion' => ['nullable','string'],
                'precio'      => ['required','numeric','min:0'],
                'stock'       => ['required','integer','min:0'],
                'activo'      => ['boolean'],
            ]);

            // Normalizaciones
            $data['precio'] = (float) $data['precio'];
            $data['stock']  = (int)   $data['stock'];
            $data['activo'] = (bool) ($data['activo'] ?? true);

            $p = Producto::create($data);
            return response()->json($p, 201);

        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (QueryException $e) {
            // clave única (pgsql)
            if ($e->getCode() === '23505') {
                return response()->json(['message' => 'El código ya existe'], 422);
            }
            Log::error('Productos@store SQL error', ['e' => $e]);
            return response()->json(['message' => 'Error al crear el producto'], 500);
        } catch (\Throwable $e) {
            Log::error('Productos@store error', ['e' => $e]);
            return response()->json(['message' => 'Error inesperado'], 500);
        }
    }

    public function update(Request $request, Producto $producto)
    {
        try {
            $data = $request->validate([
                'codigo'      => ['sometimes','string','max:50','unique:productos,codigo,'.$producto->id],
                'nombre'      => ['sometimes','string','max:255'],
                'descripcion' => ['sometimes','nullable','string'],
                'precio'      => ['sometimes','numeric','min:0'],
                'stock'       => ['sometimes','integer','min:0'],
                'activo'      => ['sometimes','boolean'],
            ]);

            if (isset($data['precio'])) $data['precio'] = (float) $data['precio'];
            if (isset($data['stock']))  $data['stock']  = (int)   $data['stock'];
            if (isset($data['activo'])) $data['activo'] = (bool)  $data['activo'];

            $producto->update($data);
            return response()->json($producto);

        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Productos@update error', ['e' => $e]);
            return response()->json(['message' => 'Error al actualizar el producto'], 500);
        }
    }

    public function updateStock(Request $request, Producto $producto)
    {
        try {
            $data = $request->validate([
                'stock' => ['required','integer','min:0'],
            ]);

            $producto->update(['stock' => (int) $data['stock']]);
            return response()->json($producto);

        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Productos@updateStock error', ['e' => $e]);
            return response()->json(['message' => 'Error al actualizar stock'], 500);
        }
    }

    public function destroy(Producto $producto)
    {
        try {
            $producto->delete();
            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Productos@destroy error', ['e' => $e]);
            return response()->json(['message' => 'Error al eliminar'], 500);
        }
    }
}
