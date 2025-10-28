<?php

namespace App\Http\Controllers;

use App\Models\Presupuesto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PresupuestoController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $estado = $request->query('estado');
        $per = (int) ($request->query('per_page', 10));

        $query = Presupuesto::with('cliente');
        if ($q) {
            $query->whereHas('cliente', function($w) use ($q){
                $w->where('nombre','ilike',"%{$q}%");
            });
        }
        if ($estado) {
            $query->where('estado', $estado);
        }

        return $query->orderBy('created_at','desc')->paginate($per);
    }

    public function show($id)
    {
        $p = Presupuesto::with('cliente')->find($id);
        if (!$p) return response()->json(['message' => 'Presupuesto no encontrado'], 404);
        return $p;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente_id' => ['required','exists:clientes,id'],
            'fecha' => ['nullable','date'],
            'estado' => ['nullable','in:borrador,enviado,aceptado,rechazado'],
            'items' => ['required','array','min:1'],
            'items.*.productoId' => ['required','integer'],
            'items.*.nombre' => ['required','string','max:255'],
            'items.*.cantidad' => ['required','numeric','gt:0'],
            'items.*.precio' => ['required','numeric','gte:0'],
        ]);

        $total = collect($data['items'])->reduce(fn($c, $i) => $c + ($i['cantidad'] * $i['precio']), 0);
        $data['total'] = $total;

        $p = Presupuesto::create($data);
        return response()->json($p->load('cliente'), 201);
    }

    public function update(Request $request, $id)
    {
        $p = Presupuesto::find($id);
        if (!$p) return response()->json(['message' => 'Presupuesto no encontrado'], 404);

        $data = $request->validate([
            'cliente_id' => ['sometimes','required','exists:clientes,id'],
            'fecha' => ['nullable','date'],
            'estado' => ['nullable','in:borrador,enviado,aceptado,rechazado'],
            'items' => ['nullable','array','min:1'],
            'items.*.productoId' => ['required_with:items','integer'],
            'items.*.nombre' => ['required_with:items','string','max:255'],
            'items.*.cantidad' => ['required_with:items','numeric','gt:0'],
            'items.*.precio' => ['required_with:items','numeric','gte:0'],
        ]);

        if (isset($data['items'])) {
            $data['total'] = collect($data['items'])->reduce(fn($c, $i) => $c + ($i['cantidad'] * $i['precio']), 0);
        }

        $p->update($data);
        return $p->load('cliente');
    }

    public function destroy($id)
    {
        $p = Presupuesto::find($id);
        if (!$p) return response()->json(['message' => 'Presupuesto no encontrado'], 404);
        $p->delete();
        return response()->json(['message' => 'Presupuesto eliminado']);
    }
}
