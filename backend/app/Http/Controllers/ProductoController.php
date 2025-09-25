<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;

class ProductoController extends Controller
{
    // GET /api/productos
    public function index(Request $request)
    {
        $q = Producto::query();

        if ($search = $request->query('q')) {
            $q->where(function ($qq) use ($search) {
                $qq->where('nombre', 'ilike', "%{$search}%")
                   ->orWhere('codigo', 'ilike', "%{$search}%");
            });
        }

        // simple paginación
        $productos = $q->orderBy('nombre')->paginate(10);

        return response()->json($productos);
    }

    // POST /api/productos
    public function store(StoreProductoRequest $request)
    {
        $producto = Producto::create($request->validated());
        return response()->json($producto, 201);
    }

    // GET /api/productos/{producto}
    public function show(Producto $producto)
    {
        return response()->json($producto);
    }

    // PUT/PATCH /api/productos/{producto}
    public function update(UpdateProductoRequest $request, Producto $producto)
    {
        $producto->update($request->validated());
        return response()->json($producto);
    }

    // DELETE /api/productos/{producto}
    public function destroy(Producto $producto)
    {
        $producto->delete();
        return response()->json(['deleted' => true]);
    }

    // PATCH /api/productos/{producto}/stock
    public function updateStock(Request $request, Producto $producto)
    {
        $data = $request->validate([
            'stock' => ['required','integer','min:0'],
        ]);

        $producto->update(['stock' => $data['stock']]);

        return response()->json($producto);
    }
}
