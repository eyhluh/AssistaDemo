<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\GenderController;

Route::controller(GenderController::class)->prefix('/gender')->group(function () {
    Route::get('/loadGenders', 'loadGenders');
    Route::get('/getGender/{genderId}', 'getGender');
    Route::post('/storeGender', 'storeGender');
});

    
    

//Route::get('/user', function (Request $request) {
//    // return $request->user();
//})->middleware('auth:sanctum');
