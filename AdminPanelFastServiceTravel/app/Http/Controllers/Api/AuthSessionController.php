<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthSessionController extends Controller
{
    public function register(Request $request)
    {
        // Ensure JWT secret loaded (fallback) before any token operations
        if (empty(config('jwt.secret')) && getenv('JWT_SECRET')) {
            // inject into config repository dynamically
            config(['jwt.secret' => getenv('JWT_SECRET')]);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:30',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'sometimes|same:password',
        ]);

        // Normalize email to lowercase to avoid case mismatch at login
        $validated['email'] = strtolower($validated['email']);

        try {
            if (\App\Models\User::where('email', $validated['email'])->first()) {
                return response()->json(['message' => 'Email already registered'], 422);
            }
            if (\App\Models\User::where('phoneNumber', $validated['phoneNumber'])->first()) {
                return response()->json(['message' => 'Phone number already registered'], 422);
            }
            $user = new \App\Models\User();
            $user->name = $validated['name'];
            $user->phoneNumber = $validated['phoneNumber'];
            $user->email = $validated['email'];
            $user->password = Hash::make($validated['password']);
            $user->role = 'client';
            $user->save();
        } catch (\Throwable $e) {
            \Log::error('Client registration failed', [
                'email' => $validated['email'],
                'phone' => $validated['phoneNumber'],
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Registration failed'], 500);
        }

        // Auto-login after registration
        // Stateless token for SPA
        $token = null; $ttl = config('jwt.ttl');
        try {
            $token = JWTAuth::fromUser($user);
        } catch (\Throwable $e) {
            \Log::error('JWT register token failure: '.$e->getMessage());
        }
        if (empty($token)) {
            \Log::warning('JWT register produced empty token', [
                'user_id' => (string)($user->_id ?? $user->id),
                'secret_present' => empty(config('jwt.secret')) ? 'no' : 'yes'
            ]);
        }
        $response = response()->json([
            'message' => 'Registered',
            'user' => $user,
            'token' => $token,
            'token_type' => $token ? 'bearer' : null,
            'expires_in_minutes' => $token ? $ttl : null,
            'jwt_secret_loaded' => empty(config('jwt.secret')) ? false : true,
            'token_empty' => empty($token)
        ], 201);
        if ($token) { $response->headers->set('X-Token-TTL', $ttl); }
        $response->headers->set('X-Debug-JWT', empty($token)?'empty':'ok');
        return $response;
    }
    public function login(Request $request)
    {
        if (empty(config('jwt.secret')) && getenv('JWT_SECRET')) {
            config(['jwt.secret' => getenv('JWT_SECRET')]);
        }
        // Allow login with either email or phoneNumber + password
        $request->validate([
            'password' => 'required|string',
            // one of email / phoneNumber must be present (custom check below)
            'email' => 'sometimes|nullable|email',
            'phoneNumber' => 'sometimes|nullable|string',
        ]);

        if (!$request->filled('email') && !$request->filled('phoneNumber')) {
            return response()->json(['message' => 'Email or phone number is required'], 422);
        }

    $password = (string)$request->input('password'); // ensure raw string
    $user = null;

        if ($request->filled('email')) {
            $email = strtolower($request->input('email'));
            $user = \App\Models\User::where('email', $email)->first();
        } else {
            // phone login path
            $user = \App\Models\User::where('phoneNumber', $request->string('phoneNumber'))->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }
        if ($user->role !== 'client') {
            return response()->json(['message' => 'This account must login via the admin portal'], 403);
        }
        $hashOk = false;
        try { $hashOk = Hash::check($password, $user->password); } catch (\Throwable $e) { \Log::error('Hash::check failed: '.$e->getMessage()); }
        if (!$hashOk) {
            \Log::warning('Client login password mismatch', ['user_id' => (string)$user->_id ?? $user->id, 'email' => $user->email]);
            return response()->json(['message' => 'Invalid credentials'], 422);
        }
        try {
            $token = JWTAuth::fromUser($user);
        } catch (\Throwable $e) {
            \Log::error('JWT login token failure: '.$e->getMessage());
            return response()->json(['message' => 'Login token generation failed'], 500);
        }
        if (empty($token)) {
            \Log::warning('JWT login produced empty token', [
                'user_id' => (string)($user->_id ?? $user->id),
                'secret_present' => empty(config('jwt.secret')) ? 'no' : 'yes'
            ]);
        }
        $ttl = config('jwt.ttl');
        $response = response()->json([
            'message' => 'Logged in',
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in_minutes' => $ttl,
            'jwt_secret_loaded' => empty(config('jwt.secret')) ? false : true,
            'token_empty' => empty($token)
        ], 200);
        $response->headers->set('X-Token-TTL', $ttl);
        $response->headers->set('X-Debug-JWT', empty($token)?'empty':'ok');
        return $response;
    }

    public function me(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user && $user->role === 'client') {
                $ttl = config('jwt.ttl');
                return response()->json($user, 200)->header('X-Token-TTL', $ttl)->header('X-Debug-Me','ok');
            }
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            return response()->json(null, 204)->header('X-Debug-Me','err');
        }
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::parseToken()->invalidate();
        } catch (\Throwable $e) {
            // ignore
        }
        return response()->json(['message' => 'Logged out'], 200);
    }

    public function refresh(Request $request)
    {
        // Issues a new token (rotating) and returns updated TTL
        try {
            $newToken = JWTAuth::parseToken()->refresh();
            // Use new token to authenticate user context
            $user = JWTAuth::setToken($newToken)->authenticate();
            if(!$user || $user->role !== 'client') {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            $ttl = config('jwt.ttl');
            $response = response()->json([
                'message' => 'Refreshed',
                'token' => $newToken,
                'token_type' => 'bearer',
                'expires_in_minutes' => $ttl,
                'user' => $user,
            ], 200);
            $response->headers->set('X-Token-TTL', $ttl);
            return $response;
        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException $e) {
            // Completely expired, client must re-login
            return response()->json(['message' => 'Token expired, please login again'], 401);
        } catch (\Throwable $e) {
            \Log::warning('JWT refresh failed: '.$e->getMessage());
            return response()->json(['message' => 'Cannot refresh token'], 400);
        }
    }
}
