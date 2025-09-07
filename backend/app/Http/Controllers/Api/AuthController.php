<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    private function generateToken($user)
    {
        $payload = [
            'iss' => "laravel-jwt", // issuer
            'sub' => $user->id,     // subject (user id)
            'iat' => time(),        // issued at
            'exp' => time() + env('JWT_EXPIRE', 3600) // expire
        ];

        return JWT::encode($payload, env('JWT_SECRET'), 'HS256');
    }

    public function register(Request $request)
    {

        $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:userslogin',
        'password' => 'required|string|min:8',
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        
        $token = $this->generateToken($user);
        return response()->json(['token' => $token]);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $this->generateToken($user);

        return response()->json(['token' => $token]);
    }
}
