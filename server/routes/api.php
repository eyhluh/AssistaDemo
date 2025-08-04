<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\GenderController;

Route::controller(GenderController::class)->prefix('/gender')->group(function () {
    Route::get('/loadGenders', 'loadGenders');
    Route::get('/getGender/{genderId}', 'getGender');
    Route::post('/storeGender', 'storeGender');
    Route::put('/updateGender/{gender}', 'updateGender');
    Route::put('/destroyGender/{gender}', 'destroyGender');
});

Route::controller(UserController::class)->prefix('/user')->group(function () {
    Route::get('/loadUsers', 'loadUsers');
    Route::get('/getUser/{userId}', 'getUser');
    Route::post('/storeUser', 'storeUser');
    Route::put('/updateUser/{User}', 'updateUser');
    Route::put('/destroyUser/{User}', 'destroyUser');
});

// Test route to check if API is working
//Route::get('/test', function () {
    //return response()->json(['message' => 'API is working'], 200);
//});    
    

//Route::get('/user', function (Request $request) {
//    // return $request->user();
//})->middleware('auth:sanctum');
