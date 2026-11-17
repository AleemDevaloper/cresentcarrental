<?php
use Illuminate\Support\Facades\Route;
Route::get('/', fn () => response()->json(['name' => 'Crescent Car Rental API', 'status' => 'ok']));
