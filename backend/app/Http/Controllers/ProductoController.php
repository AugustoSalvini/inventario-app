public function index(Request $request)
{
    $q = $request->query('q');
    $query = Producto::query();

    if ($q) {
        $query->where(function ($sub) use ($q) {
            $sub->where('nombre', 'ilike', "%{$q}%")
                ->orWhere('codigo', 'ilike', "%{$q}%")
                ->orWhere('id', $q);
        });
    }

    return response()->json($query->orderBy('id', 'desc')->get());
}

public function store(Request $request)
{
    $data = $request->validate([
        'codigo'      => ['required','string','max:50','unique:productos,codigo'],
        'nombre'      => ['required','string','max:255'],
        'descripcion' => ['nullable','string'],
        'precio'      => ['required','numeric','min:0'],
        'stock'       => ['required','integer','min:0'],
        'activo'      => ['sometimes','boolean'],
    ]);

    // por si no viene "activo"
    $data['activo'] = array_key_exists('activo', $data) ? (bool)$data['activo'] : true;

    $p = Producto::create($data);
    return response()->json($p, 201);
}

public function update(Request $request, Producto $producto)
{
    $data = $request->validate([
        'codigo'      => ['sometimes','string','max:50',"unique:productos,codigo,{$producto->id}"],
        'nombre'      => ['sometimes','string','max:255'],
        'descripcion' => ['sometimes','nullable','string'],
        'precio'      => ['sometimes','numeric','min:0'],
        'stock'       => ['sometimes','integer','min:0'],
        'activo'      => ['sometimes','boolean'],
    ]);

    $producto->update($data);
    return response()->json($producto);
}
