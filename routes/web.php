<?php

use Illuminate\Support\Facades\Route;

// Catch-all for SPA (excludes /api/*)
Route::get('/{any}', function () {
  return view('app');
})->where('any', '.*');
