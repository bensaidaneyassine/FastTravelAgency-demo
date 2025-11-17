<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;

class VisaZoomController extends Controller
{
    public function index()
    {
        $zooms = Lesson::where('zoom','!=',null)->get();
        return view('admin.visa.zoom.index',compact('zooms'));
    }

    public function create($country,$topic)
    {
        return view('admin.visa.zoom.create',compact('country','topic'));
    }

    public function store(Request $request, $country, $topic)
    {
        $zoom = [
            'zoomTitle' => $request->title,
            'zoomContent' => $request->content,
            'zoomDate' => $request->date,
            'zoomTime' => $request->time,
            'zoomTimeZone' => $request->time_zone,
            'zoomRecord' => $request->record,
            'zoomDuration' => $request->duration,
            'zoomPassword' => $request->password,
        ];
        $lesson = new Lesson;
        $lesson->course_id = $country;
        $lesson->lesson_id = $topic;
        $lesson->zoom = serialize($zoom);
        $lesson->media_id = $request->media_id==""? 1 : $request->media_id;
        $lesson->preview = $request->preview=='on'? 1 : 0;
        $lesson->save();
        return redirect()->route('admin.visa.zoom.index');
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $zoom = Lesson::find($id);
        return view('admin.visa.zoom.edit',compact('zoom'));
    }

    public function update(Request $request, $id)
    {

        $zoom = [
            'zoomTitle' => $request->title,
            'zoomContent' => $request->content,
            'zoomDate' => $request->date,
            'zoomTime' => $request->time,
            'zoomTimeZone' => $request->time_zone,
            'zoomRecord' => $request->record,
            'zoomDuration' => $request->duration,
            'zoomPassword' => $request->password,
        ];
        $lesson = Lesson::find($id);
        $lesson->zoom = serialize($zoom);
        $lesson->save();
        return redirect()->route('admin.visa.zoom.index');
    }

    public function destroy($id)
    {
        Lesson::find($id)->delete();
        return redirect()->route('admin.visa.zoom.index');
    }
}
