<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\ApplicantController;
use App\Http\Controllers\Api\UserController;
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

    Route::controller(GenderController::class)->prefix('/gender')->group(function () {
        Route::get('/loadGenders', 'loadGenders');
        Route::get('/getGender/{genderId}', 'getGender');
        Route::post('/storeGender', 'storeGender');
        Route::put('/updateGender/{gender}', 'updateGender');
        Route::put('/destroyGender/{gender}', 'destroyGender');
    });

    Route::controller(ApplicantController::class)->prefix('/applicant')->group(function () {
        Route::get('/loadApplicants', 'loadApplicants');
        Route::get('/getApplicant/{applicantId}', 'getApplicant');
        Route::post('/storeApplicant', 'storeApplicant');
        Route::put('/updateApplicant/{applicant}', 'updateApplicant');
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
