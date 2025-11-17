<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Country;
use Illuminate\Http\Request;

class VisaAnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::all();
        return view('admin.visa.announcement.index',compact('announcements'));
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.visa.announcement.create',compact('countries'));
    }

    public function store(Request $request)
    {
        $announcement = new Announcement;
        $announcement->course_id = $request->course_id;
        $announcement->title = $request->title;
        $announcement->content = $request->content;
        $announcement->save();

        return redirect()->route('admin.visa.announcement.index');
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $announcement = Announcement::find($id);
        $countries = Country::all();
        return view('admin.visa.announcement.edit',compact('announcement','countries'));
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::find($id);
        $announcement->course_id = $request->course_id;
        $announcement->title = $request->title;
        $announcement->content = $request->content;
        $announcement->save();

        return redirect()->route('admin.visa.announcement.index');
    }

    public function destroy($id)
    {
        Announcement::find($id)->delete();
        return redirect()->route('admin.visa.announcement.index');
    }
}
