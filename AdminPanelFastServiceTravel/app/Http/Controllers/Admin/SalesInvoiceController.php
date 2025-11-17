<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Option;
use App\Models\Slug;

class SalesInvoiceController extends Controller
{
    public function index()
    {
        $invoices = Category::where('type','=','visa-invoice')->get();
        return view("admin.sales.invoice.index",compact('invoices'));
    }

    public function create()
    {
        $languages = Option::where('key','=','language')->get();
        $invoices = Category::where('type','=','visa-invoice')->get();
        return view("admin.sales.invoice.create",compact('invoices','languages'));
    }

    public function store(Request $request)
    {
        $slug = new Slug;
        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "invoice-".$slug_last;
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

        $invoice = new Category;
        $invoice->title = $request->title;
        $invoice->slug_id = $slug->id;
        $invoice->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $invoice->upper = $request->upper;
        $invoice->content = $request->content;
        $invoice->type = $request->type;
        $invoice->language = $request->language;
        $invoice->save();
        return redirect()->route('admin.sales.invoice.index')->with(['type' => 'success', 'message' =>'Category Saved.']);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $invoice = Category::findOrFail($id);
        $invoices = Category::all();
        $languages = Option::where('key','=','language')->get();
        return view('admin.sales.invoice.edit',compact('invoice','invoices','languages'));
    }

    public function update(Request $request, $id)
    {
        $invoice = Category::find($id);
        $slug = Slug::find($invoice->slug_id);

        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "invoice-".$slug_last;
        }else{
            $slug_check = Slug::withTrashed()->where('slug', '=', $request->slug)->first();
            if($slug_check!=null){
                if($slug_check->id!=$invoice->slug_id) $request->slug = $request->slug."-".uniqid();
            }
        }

        $slug->owner = $request->type;;
        $slug->slug = $request->slug;
        $slug->seo_title = $request->seo_title;
        $slug->seo_description = $request->seo_description;
        $slug->no_index = ($request->no_index==null ? 0 : 1);
        $slug->no_follow = ($request->no_follow==null ? 0 : 1);
        $slug->save();

        $invoice->title = ($request->title==null ? $request->slug : $request->title);
        $invoice->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $invoice->upper = $request->upper;
        $invoice->content = $request->content;
        $invoice->type = $request->type;
        $invoice->language = $request->language;
        $invoice->save();
        return redirect()->route('admin.sales.invoice.edit',$id)->with(['type' => 'success', 'message' =>'Category Updated.']);
    }

    public function destroy($id)
    {
        $invoice = Category::findOrFail($id);
        $slug_id = Slug::findOrFail($invoice->slug_id);
        $invoice->delete();
        $slug_id->forceDelete();
        return redirect()->route('admin.sales.invoice.index')->with(['type' => 'success', 'message' =>'Category Deleted.']);
    }
}
