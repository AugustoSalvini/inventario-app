<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $per = (int) ($request->query('per_page', 10));
        $query = Cliente::query();
        if ($q) {
            $query->where(function($w) use ($q) {
                $w->where('nombre', 'ilike', "%{$q}%")
                  ->orWhere('email', 'ilike', "%{$q}%")
                  ->orWhere('telefono', 'ilike', "%{$q}%");
            });
        }
        return $query->orderBy('created_at','desc')->paginate($per);
    }

    public function show($id)
    {
        $c = Cliente::find($id);
        if (!$c) return response()->json(['message' => 'Cliente no encontrado'], 404);
        return $c;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['required','string','max:255'],
            'email' => ['nullable','email','max:255', Rule::unique('clientes','email')],
            'telefono' => ['nullable','string','max:50'],
            'direccion' => ['nullable','string','max:255'],
            'cuit' => ['nullable','string','max:50'],
        ]);
        $c = Cliente::create($data);
        return response()->json($c, 201);
    }

    public function update(Request $request, $id)
    {
        $c = Cliente::find($id);
        if (!$c) return response()->json(['message' => 'Cliente no encontrado'], 404);

        $data = $request->validate([
            'nombre' => ['sometimes','required','string','max:255'],
            'email' => ['nullable','email','max:255', Rule::unique('clientes','email')->ignore($c->id)],
            'telefono' => ['nullable','string','max:50'],
            'direccion' => ['nullable','string','max:255'],
            'cuit' => ['nullable','string','max:50'],
        ]);
        $c->update($data);
        return $c;
    }

    public function destroy($id)
    {
        $c = Cliente::find($id);
        if (!$c) return response()->json(['message' => 'Cliente no encontrado'], 404);
        $c->delete();
        return response()->json(['message' => 'Cliente eliminado']);
    }
}
