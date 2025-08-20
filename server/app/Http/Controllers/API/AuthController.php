<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'contact_number' => ['required', 'string', 'max:20'],
            'gmail' => ['required', 'email', 'max:255', Rule::unique('tbl_users', 'gmail')],
            'password' => ['required', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'min:6']
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'contact_number' => $validated['contact_number'],
            'gmail' => $validated['gmail'],
            'password' => $validated['password'],
            'is_deleted' => false,
        ]);

        return response()->json([
            'message' => 'Registration successful! Please log in.'
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'gmail' => ['required', 'email'],
            'password' => ['required', 'min:6']
        ]);

        $user = User::where('gmail', $validated['gmail'])
            ->where('is_deleted', false)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(
                [
                    'message' => 'The provided credentials are incorrect.'
                ],
                401
            );
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken->delete();

        return response()->json([
            'message' => 'Logged Out Successfully'
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user
        ], 200);
    }
}
