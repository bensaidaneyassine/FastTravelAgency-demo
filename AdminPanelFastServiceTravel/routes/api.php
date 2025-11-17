<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ApiPageController;
use App\Http\Controllers\Api\ApiMenuController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::controller(AuthController::class)->group(function(){
    Route::post('register','register');
    Route::post('login','login');
    Route::get('userdetail','userDetails');
});

Route::prefix('/demands')->name('demands.')->group(function(){
    Route::post('/client-application', [App\Http\Controllers\Admin\DemandController::class, 'store']);
    Route::post('/save-client', [App\Http\Controllers\Admin\DemandController::class, 'storeClient']);
    Route::put('/client-application/{id}', [App\Http\Controllers\Admin\DemandController::class, 'update']);
    Route::get('/client-application/user/{userId}', [App\Http\Controllers\Admin\DemandController::class, 'getByUserId']);
    // Authenticated user demands (JWT or session)
    Route::get('/my', [App\Http\Controllers\Admin\DemandController::class, 'myDemands']);
});

    // Session-based auth endpoints for the frontend (SPA)
    // Use web middleware here to enable session cookies on these endpoints
    Route::prefix('/auth')->group(function(){
        Route::post('/register', [App\Http\Controllers\Api\AuthSessionController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\AuthSessionController::class, 'login'])->middleware('throttle:login');
        Route::post('/logout', [App\Http\Controllers\Api\AuthSessionController::class, 'logout']);
        Route::get('/me', [App\Http\Controllers\Api\AuthSessionController::class, 'me']);
    Route::post('/refresh', [App\Http\Controllers\Api\AuthSessionController::class, 'refresh']);
    Route::post('/google', [App\Http\Controllers\Api\GoogleAuthController::class, 'login'])->middleware('throttle:login');
    });

// (removed) Temporary JWT debug route

Route::get('pages', [ApiPageController::class, 'getPageBySlug']);
Route::get('menus', [ApiMenuController::class, 'getMenuByName']);

// Contact messages (public)
Route::post('message/client-message', [App\Http\Controllers\Api\ContactMessageController::class, 'store']);
