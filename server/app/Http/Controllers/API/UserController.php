<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required', 'min:6', 'max:12'],
        ]);

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username'],
            'password' => $validated['password']
        ]);

        return response()->json([
            'message' => 'User created successfully',
        ], 200);
    }

    public function loadUsers()
    {
        $users = User::with(['gender'])->where('tbl_users.is_deleted', false
        )->get();
        
        return response()->json([
            'users' => $users
        ], 200);
    }

    public function getUser($userId)
    {
        $user = User::with('gender')->find($userId);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        
        return response()->json([
            'user' => $user
        ], 200);
    }

    public function updateUser(Request $request, $userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $validatedData = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')->ignore($userId, 'user_id')],
            'password' => ['nullable', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:6', 'max:12'],
        ]);

        $age = date_diff(date_create($validatedData['birth_date']), date_create('now'))->y;

        $updateData = [
            'first_name' => $validatedData['first_name'],
            'middle_name' => $validatedData['middle_name'],
            'last_name' => $validatedData['last_name'],
            'suffix_name' => $validatedData['suffix_name'],
            'gender_id' => $validatedData['gender'],
            'birth_date' => $validatedData['birth_date'],
            'age' => $age,
            'username' => $validatedData['username'],
        ];

        if (isset($validatedData['password'])) {
            $updateData['password'] = bcrypt($validatedData['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
        ], 200);
    }

    public function destroyUser($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $user->update(['is_deleted' => 1]);

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }
}
