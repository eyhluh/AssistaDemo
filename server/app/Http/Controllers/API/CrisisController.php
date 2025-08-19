<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crisis;
use Illuminate\Http\Request;

class CrisisController extends Controller
{
    public function loadCrisiss()
    {
        $crisiss = Crisis::where('tbl_crisiss.is_deleted', false)
            ->get();

        return response()->json([
            'crisiss' => $crisiss
        ], 200);
    }

    public function storeCrisis(Request $request)
    {
        $validated = $request->validate([
            'crisis' => ['required', 'min:3', 'max:30']
        ]);

        Crisis::create([
            'crisis' => $validated['crisis']
        ]);

        return response()->json([
            'message' => 'Crisis Successfully Saved.'

        ], 200);
    }

    public function getCrisis($crisisId)
    {
        $crisis = Crisis::find($crisisId);

        return response()->json([
            'crisis' => $crisis
        ], 200);
    }

    public function updateCrisis(Request $request, Crisis $crisis)
    {
        $validated = $request->validate([
            'crisis' => ['required', 'min:3', 'max:30']
        ]);

        $crisis->update([
            'crisis' => $validated['crisis']
        ]);

        return response()->json([
            'crisis' => $crisis,
            'message' => 'Crisis Successfully Updated.'
        ], 200);
    }

    public function destroyCrisis(Crisis $crisis)
    {
        $crisis->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Crisis Successfully Deleted.'
        ], 200);
    }
}