<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ya controlamos rol por middleware
    }

    public function rules(): array
    {
        return [
            'codigo'      => ['nullable','string','max:50','unique:productos,codigo'],
            'nombre'      => ['required','string','max:150'],
            'descripcion' => ['nullable','string'],
            'precio'      => ['required','numeric','min:0'],
            'stock'       => ['required','integer','min:0'],
            'activo'      => ['sometimes','boolean'],
        ];
    }
}
