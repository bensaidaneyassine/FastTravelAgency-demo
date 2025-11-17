<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(){
        return view('login.index');
    }

    public function loginCheck(Request $request){
        $credentials = $request->only('email', 'password');
        
        if(Auth::guard('web')->attempt($credentials)) {
            session()->regenerate(); // Regenerate session ID after login
            // Always clear previous 2FA flag on new login
            session()->forget('admin_2fa_passed');
            // Only admin and internal user(agent) roles may access admin panel
            if (Auth::user()->role === 'admin' || Auth::user()->role === 'user') {
                // If 2FA enabled, go to challenge first
                if (Auth::user()->two_factor_enabled) {
                    return redirect()->route('admin.2fa.challenge');
                }
                return redirect()->route('admin.home');
            }
            // If authenticated but not authorized for admin panel, logout and show error
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')->withErrors('Your account is not permitted to access the admin area.');
        } else {
            return redirect()->route('login')->withErrors('Email address or password is incorrect!');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

    public function admin(){
        // Provide navbar notifications: pending demands
        try {
            $pendingCount = \App\Models\Demand::where('status', 'pending')->count();
            $recentDemands = \App\Models\Demand::orderBy('created_at', 'desc')->limit(5)->get(['_id','applicantName','demandType','created_at']);
        } catch (\Throwable $e) {
            $pendingCount = 0;
            $recentDemands = collect();
        }
        return view('admin.home', compact('pendingCount','recentDemands'));
    }

    public function registerUser(){
        return view('login.register');
    }

    public function register(Request $request){
        // Basic validation to avoid runtime errors
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'phoneNumber' => 'required|string|max:30',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        try {
            $email = User::where('email','=',$validated['email'])->first();
            if ($email === null) {
                $user = new User();
                $user->name = $validated['name'];
                if(isset($validated['surname'])){ $user->surname = $validated['surname']; }
                $user->phoneNumber = $validated['phoneNumber'];
                $user->email = $validated['email'];
                // Force role user on public registration
                $user->role = 'user';
                $user->password = Hash::make($validated['password']);
                $user->save();
            } else {
                return redirect()->route('register.user')->withErrors('This email is registered. Please enter another email address.');
            }
        } catch (\Throwable $e) {
            return redirect()->route('register.user')->withErrors('Registration failed: '.$e->getMessage());
        }
        return redirect()->route('login');
    }
}
