<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/profile', function (\Illuminate\Http\Request $request) {
        return response()->json([
            'message' => 'Welcome!',
            'user_id' => $request->get('jwt_user_id')
        ]);
    });
});
