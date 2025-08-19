<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use Illuminate\Http\Request;

class applicantController extends Controller
{
    public function loadApplicants()
    {
        $applicants = Applicant::where('tbl_applicants.is_deleted', false)
            ->get();

        return response()->json([
            'applicants' => $applicants
        ], 200);
    }

    public function storeapplicant(Request $request)
    {
        $validated = $request->validate([
            'applicant' => ['required', 'min:3', 'max:30']
        ]);

        Applicant::create([
            'applicant' => $validated['applicant']
        ]);

        return response()->json([
            'message' => 'Applicant Successfully Saved.'

        ], 200);
    }

    public function getApplicant($applicantId)
    {
        $applicant = Applicant::find($applicantId);

        return response()->json([
            'applicant' => $applicant
        ], 200);
    }

    public function updateApplicant(Request $request, applicant $applicant)
    {
        $validated = $request->validate([
            'applicant' => ['required', 'min:3', 'max:30']
        ]);

        $applicant->update([
            'applicant' => $validated['applicant']
        ]);

        return response()->json([
            'applicant' => $applicant,
            'message' => 'Applicant Successfully Updated.'
        ], 200);
    }

    public function destroyApplicant(applicant $applicant)
    {
        $applicant->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Applicant Successfully Deleted.'
        ], 200);
    }
}