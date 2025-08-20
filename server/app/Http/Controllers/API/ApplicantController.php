<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Applicant; // Make sure this model exists and maps to tbl_applicants
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicantController extends Controller
{

    public function loadApplicants(Request $request)
    {
        $search = $request->input('search');

        // Select specific columns to avoid conflicts and optimize query
        $applicants = Applicant::with(['gender', 'crisis'])
            ->leftJoin('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
            ->leftJoin('tbl_crisiss', 'tbl_applicants.crisis_id', '=', 'tbl_crisiss.crisis_id')
            ->select(
                'tbl_applicants.*', // Select all columns from applicants table
                'tbl_genders.gender', // Select gender name
                'tbl_crisiss.crisis'  // Select crisis name
            )
            ->where('tbl_applicants.is_deleted', false)
            ->orderBy('tbl_applicants.last_name', 'asc')
            ->orderBy('tbl_applicants.first_name', 'asc')
            ->orderBy('tbl_applicants.middle_name', 'asc')
            ->orderBy('tbl_applicants.suffix_name', 'asc');

        if ($search) {
            $applicants->where(function ($applicant) use ($search) {
                $applicant->where('tbl_applicants.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applicants.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applicants.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applicants.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
                    ->orWhere('tbl_crisiss.crisis', 'like', "%{$search}%");
            });
        }

        $applicants = $applicants->paginate(15);

        // Transform collection to add full URLs for attached_file
        $applicants->getCollection()->transform(function ($applicant) {
            // Check if attached_file exists and append full URL
            $applicant->attached_file_url = $applicant->attached_file ?
                url('storage/img/applicant/files/' . $applicant->attached_file) : null;

            // Remove raw attached_file name if you only want URLs in the response
            unset($applicant->attached_file);

            return $applicant;
        });

        return response()->json([
            'applicants' => $applicants
        ], 200);
    }

    public function storeApplicant(Request $request)
    {
        $validated = $request->validate([
            // Personal Details
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'], // This is gender_id from frontend

            // Contact Information
            'contact_number' => ['required', 'string', 'max:20'],
            'gmail' => ['required', 'min:6', 'max:255', Rule::unique('tbl_applicants', 'gmail')],
            'house_no' => ['required', 'string', 'max:100'],
            'street' => ['required', 'string', 'max:100'],
            'subdivision' => ['nullable', 'string', 'max:100'],
            'barangay' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],

            // Crisis Details
            'crisis' => ['required'], // This is crisis_id from frontend
            'situation' => ['required'], // This is situation_id from frontend

            // Attached File
            'add_applicant_file' => ['nullable', 'file', 'mimes:jpeg,pdf', 'max:5120'], // General attached file (e.g., medical cert)
        ]);

        $attachedFileFilenameToStore = null;
        if ($request->hasFile('add_applicant_file')) {
            $filenameWithExtension = $request->file('add_applicant_file');
            $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $filenameWithExtension->getClientOriginalExtension();
            $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension; // Unique hash for files
            $filenameWithExtension->storeAs('public/img/applicant/files', $filenameToStore);
            $attachedFileFilenameToStore = $filenameToStore;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        Applicant::create([
            'attached_file' => $attachedFileFilenameToStore, // Store the new attached file
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'crisis_id' => $validated['crisis'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'gmail' => $validated['gmail'],
            'contact_number' => $validated['contact_number'],
            'house_no' => $validated['house_no'],
            'street' => $validated['street'],
            'subdivision' => $validated['subdivision'],
            'barangay' => $validated['barangay'],
            'city' => $validated['city'],
            'situation_id' => $validated['situation'], // Store as situation_id, not situation
            'is_deleted' => false, // Ensure default is_deleted status
        ]);

        return response()->json([
            'message' => 'Applicant Successfully Saved.'
        ], 200);
    }

    public function updateApplicant(Request $request, Applicant $applicant)
    {
        $validated = $request->validate([
            // Personal Details
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'],

            // Contact Information
            'contact_number' => ['required', 'string', 'max:20'],
            'gmail' => ['required', 'min:6', 'max:255', Rule::unique('tbl_applicants', 'gmail')->ignore($applicant->applicant_id, 'applicant_id')],
            'house_no' => ['required', 'string', 'max:100'],
            'street' => ['required', 'string', 'max:100'],
            'subdivision' => ['nullable', 'string', 'max:100'],
            'barangay' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],

            // Crisis Details
            'crisis' => ['required'],
            'situation' => ['required'], // This is situation_id from frontend

            // Attached File
            'edit_applicant_file' => ['nullable', 'file', 'mimes:jpeg,pdf', 'max:5120'],
            'remove_attached_file' => ['nullable', 'boolean'],
        ]);

        // Handle general attached file removal/update
        if ($request->has('remove_attached_file') && $request->remove_attached_file == '1') {
            if ($applicant->attached_file && Storage::exists('public/img/applicant/files/' . $applicant->attached_file)) {
                Storage::delete('public/img/applicant/files/' . $applicant->attached_file);
            }
            $validated['attached_file'] = null; // Set to null after removal
        } elseif ($request->hasFile('edit_applicant_file')) {
            if ($applicant->attached_file && Storage::exists('public/img/applicant/files/' . $applicant->attached_file)) {
                Storage::delete('public/img/applicant/files/' . $applicant->attached_file);
            }
            $filenameWithExtension = $request->file('edit_applicant_file');
            $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $filenameWithExtension->getClientOriginalExtension();
            $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
            $filenameWithExtension->storeAs('public/img/applicant/files', $filenameToStore);
            $validated['attached_file'] = $filenameToStore; // Store new filename
        } else {
            $validated['attached_file'] = $applicant->attached_file; // Retain existing if not updated/removed
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $applicant->update([
            'attached_file' => $validated['attached_file'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'crisis_id' => $validated['crisis'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'gmail' => $validated['gmail'],
            'contact_number' => $validated['contact_number'],
            'house_no' => $validated['house_no'],
            'street' => $validated['street'],
            'subdivision' => $validated['subdivision'],
            'barangay' => $validated['barangay'],
            'city' => $validated['city'],
            'situation_id' => $validated['situation'], // Store as situation_id, not situation
        ]);

        // Transform the applicant object for the response, adding full URLs
        $applicant->attached_file_url = $applicant->attached_file ?
            url('storage/img/applicant/files/' . $applicant->attached_file) : null;

        // Remove raw filenames if you prefer only URLs in the response
        unset($applicant->attached_file);


        return response()->json([
            'message' => 'Applicant Successfully Updated.',
            'applicant' => $applicant
        ], 200);
    }

    public function destroyApplicant(Applicant $applicant)
    {
        $applicant->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Applicant Successfully Deleted.'
        ], 200);
    }
}
