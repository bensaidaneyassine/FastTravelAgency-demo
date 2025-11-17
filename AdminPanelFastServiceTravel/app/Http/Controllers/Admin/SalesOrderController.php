<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Option;
use App\Models\Slug;

class SalesOrderController extends Controller
{
    public function index()
    {
        $orders = Category::where('type','=','visa-order')->get();
        return view("admin.sales.order.index",compact('orders'));
    }

    public function create()
    {
        $languages = Option::where('key','=','language')->get();
        $orders = Category::where('type','=','visa-order')->get();
        return view("admin.sales.order.create",compact('orders','languages'));
    }

    public function store(Request $request)
    {
        $slug = new Slug;
        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "order-".$slug_last;
        }else{
            $slug_check = Slug::withTrashed()->where('slug', '=', $request->slug)->first();
            if($slug_check!=null) $request->slug = $request->slug."-".uniqid();
        }
        $slug->owner = $request->type;;
        $slug->slug = $request->slug;
        $slug->seo_title = $request->seo_title;
        $slug->seo_description = $request->seo_description;
        $slug->no_index = ($request->no_index==null ? 0 : 1);
        $slug->no_follow = ($request->no_follow==null ? 0 : 1);
        $slug->save();

        $order = new Category;
        $order->title = $request->title;
        $order->slug_id = $slug->id;
        $order->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $order->upper = $request->upper;
        $order->content = $request->content;
        $order->type = $request->type;
        $order->language = $request->language;
        $order->save();
        return redirect()->route('admin.sales.order.index')->with(['type' => 'success', 'message' =>'Category Saved.']);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $order = Category::findOrFail($id);
        $orders = Category::all();
        $languages = Option::where('key','=','language')->get();
        return view('admin.sales.order.edit',compact('order','orders','languages'));
    }

    public function update(Request $request, $id)
    {
        $order = Category::find($id);
        $slug = Slug::find($order->slug_id);

        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "order-".$slug_last;
        }else{
            $slug_check = Slug::withTrashed()->where('slug', '=', $request->slug)->first();
            if($slug_check!=null){
                if($slug_check->id!=$order->slug_id) $request->slug = $request->slug."-".uniqid();
            }
        }

        $slug->owner = $request->type;;
        $slug->slug = $request->slug;
        $slug->seo_title = $request->seo_title;
        $slug->seo_description = $request->seo_description;
        $slug->no_index = ($request->no_index==null ? 0 : 1);
        $slug->no_follow = ($request->no_follow==null ? 0 : 1);
        $slug->save();

        $order->title = ($request->title==null ? $request->slug : $request->title);
        $order->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $order->upper = $request->upper;
        $order->content = $request->content;
        $order->type = $request->type;
        $order->language = $request->language;
        $order->save();
        return redirect()->route('admin.sales.order.edit',$id)->with(['type' => 'success', 'message' =>'Category Updated.']);
    }

    public function destroy($id)
    {
        $order = Category::findOrFail($id);
        $slug_id = Slug::findOrFail($order->slug_id);
        $order->delete();
        $slug_id->forceDelete();
        return redirect()->route('admin.sales.order.index')->with(['type' => 'success', 'message' =>'Category Deleted.']);
    }
}
