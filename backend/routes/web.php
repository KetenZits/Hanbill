<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'message' => 'Welcome!',
            'user_id' => $request->get('jwt_user_id')
        ]);
    });
});
