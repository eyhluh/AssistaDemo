<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    public function loadApplications(Request $request)
    {
        $search = $request->input('search');

        // Select specific columns to avoid conflicts and optimize query
        $applications = Application::with(['gender', 'crisis', 'situation'])
            ->leftJoin('tbl_genders', 'tbl_applications.gender_id', '=', 'tbl_genders.gender_id')
            ->leftJoin('tbl_crisiss', 'tbl_applications.crisis_id', '=', 'tbl_crisiss.crisis_id')
            ->leftJoin('tbl_situations', 'tbl_applications.situation_id', '=', 'tbl_situations.situation_id')
            ->select(
                'tbl_applications.*', // Select all columns from applications table
                'tbl_genders.gender', // Select gender name
                'tbl_crisiss.crisis',  // Select crisis name
                'tbl_situations.situation'  // Select situation name
            )
            ->where('tbl_applications.is_deleted', false)
            ->orderBy('tbl_applications.last_name', 'asc')
            ->orderBy('tbl_applications.first_name', 'asc')
            ->orderBy('tbl_applications.middle_name', 'asc')
            ->orderBy('tbl_applications.suffix_name', 'asc');

        if ($search) {
            $applications->where(function ($application) use ($search) {
                $application->where('tbl_applications.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applications.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applications.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_applications.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
                    ->orWhere('tbl_crisiss.crisis', 'like', "%{$search}%")
                    ->orWhere('tbl_situations.situation', 'like', "%{$search}%");
            });
        }

        $applications = $applications->paginate(15);

        // Transform collection to add full URLs for attached_file
        $applications->getCollection()->transform(function ($application) {
            // Check if attached_file exists and append full URL
            $application->attached_file_url = $application->attached_file ?
                url('storage/img/application/files/' . $application->attached_file) : null;

            // Remove raw attached_file name if you only want URLs in the response
            unset($application->attached_file);

            return $application;
        });

        return response()->json([
            'applications' => $applications
        ], 200);
    }

    public function storeApplication(Request $request)
    {
        $validated = $request->validate([
            // Personal Details
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'], // This is gender_id from frontend
            'civil_status' => ['required', 'string', 'max:50'], // Added civil_status validation

            // Contact Information
            'contact_number' => ['required', 'string', 'max:20'],
            'gmail' => ['required', 'email', 'max:255'],
            'house_no' => ['required', 'string', 'max:100'],
            'street' => ['required', 'string', 'max:100'],
            'subdivision' => ['nullable', 'string', 'max:100'],
            'barangay' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],

            // Crisis Details
            'crisis' => ['required'], // This is crisis_id from frontend
            'incident_date' => ['required', 'date'], // Added incident_date validation
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
            $filenameWithExtension->storeAs('public/img/application/files', $filenameToStore);
            $attachedFileFilenameToStore = $filenameToStore;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        Application::create([
            'attached_file' => $attachedFileFilenameToStore, // Store the new attached file
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'civil_status' => $validated['civil_status'], // Added civil_status field
            'crisis_id' => $validated['crisis'],
            'incident_date' => $validated['incident_date'], // Added incident_date field
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
            'message' => 'Application Successfully Submitted'
        ], 200);
    }

    public function updateApplication(Request $request, Application $application)
    {
        $validated = $request->validate([
            // Personal Details
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'],
            'civil_status' => ['required', 'string', 'max:50'], // Added civil_status validation

            // Contact Information
            'contact_number' => ['required', 'string', 'max:20'],
            'gmail' => ['required', 'email', 'max:255'],
            'house_no' => ['required', 'string', 'max:100'],
            'street' => ['required', 'string', 'max:100'],
            'subdivision' => ['nullable', 'string', 'max:100'],
            'barangay' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],

            // Crisis Details
            'crisis' => ['required'],
            'incident_date' => ['required', 'date'], // Added incident_date validation
            'situation' => ['required'], // This is situation_id from frontend

            // Attached File
            'edit_application_file' => ['nullable', 'file', 'mimes:jpeg,pdf', 'max:5120'],
            'remove_attached_file' => ['nullable', 'boolean'],
        ]);

        // Handle general attached file removal/update
        if ($request->has('remove_attached_file') && $request->remove_attached_file == '1') {
            if ($application->attached_file && Storage::exists('public/img/application/files/' . $application->attached_file)) {
                Storage::delete('public/img/application/files/' . $application->attached_file);
            }
            $validated['attached_file'] = null; // Set to null after removal
        } elseif ($request->hasFile('edit_application_file')) {
            if ($application->attached_file && Storage::exists('public/img/application/files/' . $application->attached_file)) {
                Storage::delete('public/img/application/files/' . $application->attached_file);
            }
            $filenameWithExtension = $request->file('edit_application_file');
            $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $filenameWithExtension->getClientOriginalExtension();
            $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
            $filenameWithExtension->storeAs('public/img/application/files', $filenameToStore);
            $validated['attached_file'] = $filenameToStore; // Store new filename
        } else {
            $validated['attached_file'] = $application->attached_file; // Retain existing if not updated/removed
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $application->update([
            'attached_file' => $validated['attached_file'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'civil_status' => $validated['civil_status'], // Added civil_status field
            'crisis_id' => $validated['crisis'],
            'incident_date' => $validated['incident_date'], // Added incident_date field
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

        // Transform the application object for the response, adding full URLs
        $application->attached_file_url = $application->attached_file ?
            url('storage/img/application/files/' . $application->attached_file) : null;

        // Remove raw filenames if you prefer only URLs in the response
        unset($application->attached_file);

        return response()->json([
            'message' => 'Application Successfully Updated.',
            'application' => $application
        ], 200);
    }

    public function destroyApplication(Application $application)
    {
        $application->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Application Successfully Deleted.'
        ], 200);
    }
}
