<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\CrisisController;
use App\Http\Controllers\Api\SituationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicantController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->prefix('/auth')->group(function () {
    Route::post('login', 'login');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::controller(AuthController::class)->prefix('/auth')->group(function () {
        Route::get('/me', 'me');
        Route::post('logout', 'logout');
    });

    Route::controller(SituationController::class)->prefix('/situation')->group(function () {
        Route::get('/loadSituations', 'loadSituations');
        Route::get('/getSituation/{situationId}', 'getSituation');
        Route::post('/storeSituation', 'storeSituation');
        Route::put('/updateSituation/{situation}', 'updateSituation');
        Route::put('/destroySituation/{situation}', 'destroySituation');
    });

    Route::controller(GenderController::class)->prefix('/gender')->group(function () {
        Route::get('/loadGenders', 'loadGenders');
        Route::get('/getGender/{genderId}', 'getGender');
        Route::post('/storeGender', 'storeGender');
        Route::put('/updateGender/{gender}', 'updateGender');
        Route::put('/destroyGender/{gender}', 'destroyGender');
    });

    Route::controller(CrisisController::class)->prefix('/crisis')->group(function () {
        Route::get('/loadCrisiss', 'loadCrisiss');
        Route::get('/getCrisis/{crisisId}', 'getCrisis');
        Route::post('/storeCrisis', 'storeCrisis');
        Route::put('/updateCrisis/{crisis}', 'updateCrisis');
        Route::put('/destroyCrisis/{crisis}', 'destroyCrisis');
    });

    Route::controller(ApplicantController::class)->prefix('/applicant')->group(function () {
        Route::get('/loadApplicants', 'loadApplicants');
        // Route for getting a single applicant (if needed, replace {applicantId} with actual ID parameter)
        Route::get('/getApplicant/{applicantId}', 'getApplicant');
        Route::post('/storeApplicant', 'storeApplicant');
        Route::post('/updateApplicant/{applicant}', 'updateApplicant'); // Using POST for file uploads with PUT method spoofing
        Route::put('/destroyApplicant/{applicant}', 'destroyApplicant');
    });

    Route::controller(UserController::class)->prefix('/user')->group(function () {
        Route::get('/loadUsers', 'loadUsers');
        Route::get('/getUser/{user}', 'getUser');
        Route::post('/storeUser', 'storeUser');
        Route::put('/updateUser/{user}', 'updateUser');
        Route::put('/destroyUser/{user}', 'destroyUser');
    });

    Route::controller(DashboardController::class)->prefix('/statistics')->group(function () {
        Route::get('/test', 'test');
        Route::get('/dashboard', 'dashboard');
        Route::get('/gender', 'gender');
        Route::get('/users', 'users');
    });
});


// Test route to check if API is working
//Route::get('/test', function () {
    //return response()->json(['message' => 'API is working'], 200);
//});    
    

//Route::get('/user', function (Request $request) {
//    // return $request->user();
//})->middleware('auth:sanctum');
