<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:6'],
            // opcional: permitir elegir rol
            'role'     => ['nullable','string'],
        ]);

        // Normaliza el rol (acepta EN y ES). Default: 'usuario'
        $map = [
            'admin'     => 'admin',
            'empleado'  => 'empleado',
            'employee'  => 'empleado',
            'usuario'   => 'usuario',
            'user'      => 'usuario',
        ];
        $roleInput = strtolower($data['role'] ?? '');
        $role = $map[$roleInput] ?? 'usuario';

        // Valida contra los valores permitidos por el CHECK de Postgres
        if (!in_array($role, ['admin','empleado','usuario'], true)) {
            return response()->json(['message' => 'Rol inválido'], 422);
        }

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $role,
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'user'         => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        // Importante: acá comparamos contra el HASH almacenado
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'user'         => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function refresh(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $new = $request->user()->createToken('auth')->plainTextToken;

        return response()->json([
            'access_token' => $new,
            'token_type'   => 'bearer',
            'user'         => $request->user(),
        ]);
    }
}
