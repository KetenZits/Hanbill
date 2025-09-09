<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BillController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/profile', function (\Illuminate\Http\Request $request) {
        return response()->json([
            'message' => 'Welcome!',
            'user_id' => $request->get('jwt_user_id')
        ]);
    });

    // Bill routes
    Route::prefix('bills')->group(function () {
        Route::post('/', [BillController::class, 'create']);
        Route::get('/', [BillController::class, 'list']);
        Route::get('/{id}', [BillController::class, 'get']);
        Route::delete('/{id}', [BillController::class, 'delete']);
    });
});
