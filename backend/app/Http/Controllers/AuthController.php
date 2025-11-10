<?php

namespace App\Http\Controllers;

use App\Models\Cliente; 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Normaliza cualquier variante hacia: admin | empleado | usuario
    private function normalizeRole(?string $r): string
    {
        $map = [
            'admin' => 'admin',
            'empleado' => 'empleado',
            'employee' => 'empleado',
            'user' => 'usuario',
            'usuario' => 'usuario',
        ];
        $r = strtolower($r ?? '');
        return $map[$r] ?? 'usuario';
    }

      public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'role'     => 'nullable|in:admin,empleado,usuario',
            ]);

            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => $data['role'] ?? 'usuario',
            ]);

            // 🔽 Auto-crear su Cliente asociado
            Cliente::create([
                'user_id'  => $user->id,
                'nombre'   => $user->name,
                'telefono' => null,
                'email'    => $user->email,
                'direccion'=> null,
            ]);

            $token = $user->createToken('api')->plainTextToken;

            return response()->json([
                'user'  => $user,
                'token' => $token,
            ], 201);

        } catch (ValidationException $ve) {
            return response()->json(['errors' => $ve->errors()], 422);
        } catch (\Throwable $e) {
            // log simple para depurar si querés
            // \Log::error('Register error', ['e' => $e]);
            return response()->json(['message' => 'No se pudo registrar'], 500);
        }
    }


    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Credenciales incorrectas']);
        }

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'rol'   => $user->role,   // alias
            ],
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user();
        return response()->json([
            'id'    => $u->id,
            'name'  => $u->name,
            'email' => $u->email,
            'role'  => $u->role,
            'rol'   => $u->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function refresh(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        $new = $request->user()->createToken('auth')->plainTextToken;

        return response()->json([
            'access_token' => $new,
            'token_type'   => 'bearer',
            'user'         => [
                'id'    => $request->user()->id,
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
                'role'  => $request->user()->role,
                'rol'   => $request->user()->role,
            ],
        ]);
    }
}
