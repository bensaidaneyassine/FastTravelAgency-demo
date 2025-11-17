<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdminOrUser
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $role = Auth::user()->role;
            if ($role === 'admin' || $role === 'user') { // user = internal agent
                return $next($request);
            }
            // Logged in but not permitted (e.g. client)
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Forbidden: insufficient role',
                    'role' => $role,
                ], 403);
            }
            return redirect()->route('login')->withErrors('Your account does not have permission to access the admin area.');
        }

        // Not authenticated
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return redirect()->route('login')->withErrors('Please login with an authorized account to access the admin area.');
    }
}
