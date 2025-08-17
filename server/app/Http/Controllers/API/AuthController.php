<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'gmail' => ['required', 'email'],
            'password' => ['required', 'min:6']
        ]);

        $user = User::with(['gender'])
            ->where('gmail', $validated['gmail'])
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

        // Format profile picture URL
        $user->profile_picture = $user->profile_picture ? url('storage/public/img/user/profile_picture/' . $user->profile_picture) : null;

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
        $user = $request->user()->load(['gender']);
        
        // Format profile picture URL
        $user->profile_picture = $user->profile_picture ? url('storage/public/img/user/profile_picture/' . $user->profile_picture) : null;

        return response()->json([
            'user' => $user
        ], 200);
    }
}