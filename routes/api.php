<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/application/submit', [ApplicationController::class, 'submit']);




Route::get('/user', function (Request $request) {
  return $request->user();
})->middleware('auth:sanctum');
