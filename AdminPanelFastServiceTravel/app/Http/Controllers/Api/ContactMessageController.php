<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewContactMessageNotification;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:5000',
        ]);

        $contact = Contact::create($data + ['status' => 'new']);

        // Dispatch notification to admins (all users with role=admin if such a field exists)
        try {
            if (class_exists('App\\Models\\User')) {
                $users = app('App\\Models\\User')::all(); // no role column, notify everyone with access
                if ($users->count() > 0 && class_exists(NewContactMessageNotification::class)) {
                    Notification::send($users, new NewContactMessageNotification($contact));
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Failed sending contact message notification: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Message received, we will contact you soon.'], 201);
    }
}
