<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = Contact::orderByDesc('created_at')->paginate(20);
        return view('admin.contact_messages.index', compact('messages'));
    }

    public function show($id)
    {
        $message = Contact::findOrFail($id);
        if($message->status === 'new'){
            try {
                $message->status = 'read';
                $message->save();
            } catch(\Throwable $e) {}
        }
        return view('admin.contact_messages.show', compact('message'));
    }
}
