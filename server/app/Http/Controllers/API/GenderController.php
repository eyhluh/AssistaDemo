<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;


class GenderController extends Controller
{
    public function  loadGenders()
    {
        $genders = Gender::where('tbl_genders.is_deleted', false
        )->get();

        return response()->json([
            'genders' => $genders
        ], 200);
    }
    
    public function storeGender(Request $request)
    {
        $validate=$request->validate([
            'gender' => ['required', 'min:3', 'max:30']
        ]);

        Gender::create([
            'gender' => $validate['gender']
        ]);
        return response()->json([
            'message' => 'Gender created successfully'
        ], 200);
    }

    public function getGender($genderId)
    {
        $gender = Gender::find($genderId);

        return response()->json([
            'gender' => $gender
        ], 200);
    }
}