<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Situation;
use Illuminate\Http\Request;

class SituationController extends Controller
{
    public function loadSituations()
    {
        $situations = Situation::where('tbl_situations.is_deleted', false)
            ->get();

        return response()->json([
            'situations' => $situations
        ], 200);
    }

    public function storeSituation(Request $request)
    {
        $validated = $request->validate([
            'situation' => ['required', 'min:3', 'max:30']
        ]);

        Situation::create([
            'situation' => $validated['crisis']
        ]);

        return response()->json([
            'message' => 'Situation Successfully Saved.'

        ], 200);
    }

    public function getSituation($situationId)
    {
        $situation = Situation::find($situationId);

        return response()->json([
            'situation' => $situation
        ], 200);
    }

    public function updateSituation(Request $request, Situation $situation)
    {
        $validated = $request->validate([
            'situation' => ['required', 'min:3', 'max:30']
        ]);

        $situation->update([
            'situation' => $validated['situation']
        ]);

        return response()->json([
            'situation' => $situation,
            'message' => 'Situation Successfully Updated.'
        ], 200);
    }

    public function destroySituation(Situation $situation)
    {
        $situation->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Situation Successfully Deleted.'
        ], 200);
    }
}