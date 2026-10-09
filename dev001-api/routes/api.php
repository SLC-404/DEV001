<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login',[AuthController::class,'login'])->middleware('throttle:5,1')->name('auth.login');

Route::middleware('auth:sanctum')->group(
    function(){
        Route::get('/me',[AuthController::class,'me'])->name('auth.me');
        Route::post('/logout',[AuthController::class,'logout'])->name('auth.logout');
    });
