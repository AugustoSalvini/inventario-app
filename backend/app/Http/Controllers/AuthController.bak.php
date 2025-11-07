<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function normalizeRole(?string $r): string {
        $map = ['admin'=>'admin','empleado'=>'empleado','employee'=>'empleado','user'=>'usuario','usuario'=>'usuario'];
        $r = strtolower($r ?? '');
        return $map[$r] ?? 'usuario';
    }

    public function register(Request $request) {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:6'],
            'role'     => ['nullable','string'],
        ]);

        $role = $this->normalizeRole($data['role'] ?? 'usuario');

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
            'user' => [
                'id'=>$user->id,'name'=>$user->name,'email'=>$user->email,
                'role'=>$user->role,'rol'=>$user->role,
            ],
        ], 201);
    }

    public function login(Request $request) {
        $data = $request->validate([
            'email' => ['required','email'],
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
            'user' => [
                'id'=>$user->id,'name'=>$user->name,'email'=>$user->email,
                'role'=>$user->role,'rol'=>$user->role,
            ],
        ]);
    }

    public function me(Request $request) {
        $u = $request->user();
        return response()->json([
            'id'=>$u->id,'name'=>$u->name,'email'=>$u->email,'role'=>$u->role,'rol'=>$u->role,
        ]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
