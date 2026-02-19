<?php

use App\Http\Controllers\ApplicationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/application/submit', [ApplicationController::class, 'submit']);




Route::get('/user', function (Request $request) {
  return $request->user();
})->middleware('auth:sanctum');
