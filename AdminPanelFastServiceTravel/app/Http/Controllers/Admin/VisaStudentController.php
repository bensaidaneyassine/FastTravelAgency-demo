<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\User;
use App\Models\UserMeta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class VisaStudentController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('admin.visa.student.index',compact('users'));
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.visa.student.create',compact('countries'));
    }

    public function store(Request $request)
    {
        $user = new User();
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->password = Hash::make($request->password);
        $user->save();

        $meta = new UserMeta();
        $meta->user_id = $user->id;
        $meta->key = 'enrolled_courses';
        $meta->value = serialize($request->countries);
        $meta->save();

        return redirect()->route('admin.visa.student.edit',$user->id);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $countries = Country::all();
        $user = User::find($id);
        $metas = UserMeta::where('user_id','=',$id)->get();
        foreach ($metas as $meta){
            $user_meta[$meta->key] = $meta->value;
        };
        isset($user_meta)? '': $user_meta = [];
        return view('admin.visa.student.edit',compact('countries','user','user_meta'));
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->role = $request->role;
        $request->password==null ? "" : $user->password = Hash::make($request->password);
        $user->save();

        foreach($request->metas as $key => $value){
            $meta = UserMeta::where('user_id','=',$user->id)->where('key','=',$key)->first();
            if($meta!=null){
                $meta->value = serialize($value);
                $meta->save();
            }
            else{
                $meta = new UserMeta();
                $meta->user_id = $user->id;
                $meta->key = $key;
                $meta->value = serialize($value);
                $meta->save();
            }
        }
        return redirect()->route('admin.visa.student.edit',$id);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        $metas = UserMeta::where('user_id','=',$user->id)->get();
        foreach($metas as $meta){
            $meta->delete();
        }
        $user->delete();
    }
}
