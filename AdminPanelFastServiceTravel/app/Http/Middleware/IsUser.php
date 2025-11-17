<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsUser
{
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check()){
            if(Auth::user()->role=='user'){
                return $next($request);
            }
            else return redirect()->route('login')->withErrors('You must be a user to access this area.');
        }
        else{
            return redirect()->route('login');
        }
    }
}
