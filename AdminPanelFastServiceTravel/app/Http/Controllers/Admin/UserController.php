<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private function normalizePhone(?string $raw): ?string
    {
        if (!$raw) return null;
        $raw = trim($raw);
        if (preg_match('/^\+[0-9]{6,15}$/', $raw)) return $raw;
        $digits = preg_replace('/[^0-9]/', '', $raw);
        if (!$digits) return null;
        if (strlen($digits) >= 10) return '+' . $digits;
        return null;
    }

    public function index()
    {
        $users = User::all();
        return view('admin.user.index',compact('users'));
    }

    public function create()
    {
        return view('admin.user.create');
    }

    public function store(Request $request)
    {
        // Basic validation for phone and 2FA checkbox
    $rules = [
            'email' => 'required|email',
            'password' => 'required|min:6',
            'phoneNumber' => 'nullable|string|max:30',
            'two_factor_enabled' => 'nullable|boolean',
        ];
    // If 2FA requested AND role is eligible (admin/user), require a valid E.164 phone number
    if ($request->boolean('two_factor_enabled') && in_array($request->role, ['admin','user'])) {
            $rules['phoneNumber'] = ['required','regex:/^\+[1-9]\d{6,14}$/'];
        }
        $request->validate($rules, [
            'phoneNumber.regex' => 'Phone must be in E.164 format like +212612345678.',
        ]);
        $user = new User;
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->phoneNumber = $this->normalizePhone($request->phoneNumber);
        $user->email = $request->email;
    $user->role = $request->role;
        $user->password = Hash::make($request->password);
    // Only allow 2FA for admin/user roles
    $user->two_factor_enabled = in_array($user->role, ['admin','user']) && $request->boolean('two_factor_enabled');
        $user->save();

    return redirect()->route('admin.user.edit',$user->id)->with(['type' => 'success', 'message' =>'User Updated.']);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('admin.user.edit',compact('user'));
    }

    public function update(Request $request, $id)
    {
    $rules = [
            'email' => 'required|email',
            'phoneNumber' => 'nullable|string|max:30',
            'two_factor_enabled' => 'nullable|boolean',
        ];
    if ($request->boolean('two_factor_enabled') && in_array($request->role, ['admin','user'])) {
            $rules['phoneNumber'] = ['required','regex:/^\+[1-9]\d{6,14}$/'];
        }
        $request->validate($rules, [
            'phoneNumber.regex' => 'Phone must be in E.164 format like +212612345678.',
        ]);
        $user = User::find($id);
        $user->email = $request->email;
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->phoneNumber = $this->normalizePhone($request->phoneNumber);
    $user->role = $request->role;
        $request->password==null ? "" : $user->password = Hash::make($request->password);
    $user->two_factor_enabled = in_array($user->role, ['admin','user']) && $request->boolean('two_factor_enabled');
        $user->save();

        return redirect()->route('admin.user.edit',$user->id)->with(['type' => 'success', 'message' =>'User Created.']);
    }

    public function delete($id)
    {
        $user = User::find($id);
        $user->delete();
        return redirect()->route('admin.user.index')->with(['type' => 'success', 'message' =>'User Moved to Recycle Bin.']);
    }

    public function trash()
    {
        $users = User::onlyTrashed()->get();
        return view('admin.user.trash',compact('users'));
    }

    public function recover($id)
    {
        $user = User::withTrashed()->find($id);
        $user->restore();
        return redirect()->route('admin.user.trash')->with(['type' => 'success', 'message' =>'User Recovered.']);
    }

    public function destroy($id)
    {
        $user = User::withTrashed()->find($id);
        $user->forceDelete();
        return redirect()->route('admin.user.trash')->with(['type' => 'error', 'message' =>'User Deleted.']);
    }

}
