<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Country;
use App\Models\Option;
use App\Models\Slug;
use Illuminate\Http\Request;

class VisaCountryController extends Controller
{
    public function index()
    {
        $countries = Country::all();
        return view("admin.visa.country.index",compact('countries'));
    }

    public function create()
    {
        $languages = Option::where('key','=','language')->get();
        $categories = Category::where('type','=','visa-category')->get();
        return view("admin.visa.country.create",compact('languages','categories'));
    }

    public function store(Request $request)
    {
        $slug = new Slug();
        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "article-".$slug_last;
        }else{
            $slug_check = Slug::withTrashed()->where('slug', '=', $request->slug)->first();
            if($slug_check!=null) $request->slug = $request->slug."-".uniqid();
        }
        $slug->owner = 'country';
        $slug->slug = $request->slug;
        $slug->seo_title = $request->seo_title;
        $slug->seo_description = $request->seo_description;
        $slug->no_index = ($request->no_index==null ? 0 : 1);
        $slug->no_follow = ($request->no_follow==null ? 0 : 1);
        $slug->save();

        $country = new Country();
        $country->slug_id = $slug->id;
        $country->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $country->category_id = ($request->category_id==null ? 1 : $request->category_id);
        $country->title = ($request->title==null ? $request->slug : $request->title);
        $country->content = $request->content;
        $country->language = $request->language;
        $country->what_to_learn = $request->what_to_learn;
        $country->requirements = $request->requirements;
        $country->for_who = $request->for_who;
        $country->includes = $request->includes;
        $country->video = $request->video;
        $country->time = serialize($request->time);
        $country->difficulty = $request->difficulty;
        $country->color = $request->color;
        $country->price_type = $request->price_type;
        $country->price_cost = $request->price_cost;
        $country->price_old = $request->price_old;
        $country->price_currency = $request->price_currency;
        $country->price_side = $request->price_side;
        $country->save();

        return redirect()->route('admin.visa.country.index')->with(['type' => 'success', 'message' =>'Country Saved.']);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $country = Country::find($id);
        if (is_string($country->time)) {
            $un = @unserialize($country->time);
            if ($un !== false || $country->time === 'b:0;') {
                $country->time = $un;
            }
        }
        $languages = Option::where('key','=','language')->get();
        $categories = Category::where('type','=','visa-category')->get();

        return view("admin.visa.country.edit",compact('languages','categories','country'));
    }

    public function update(Request $request, $id)
    {
        $country = Country::find($id);
        $slug = Slug::find($country->slug_id);

        if($request->slug==null){
            $slug_last = $slug->latest()->first()->id+1;
            $request->slug = "article-".$slug_last;
        }else{
            $slug_check = Slug::withTrashed()->where('slug', '=', $request->slug)->first();
            if($slug_check!=null) $request->slug = $request->slug."-".uniqid();
        }
        $slug->owner = 'country';
        $slug->slug = $request->slug;
        $slug->seo_title = $request->seo_title;
        $slug->seo_description = $request->seo_description;
        $slug->no_index = ($request->no_index==null ? 0 : 1);
        $slug->no_follow = ($request->no_follow==null ? 0 : 1);
        $slug->save();

        $country->slug_id = $slug->id;
        $country->media_id = ($request->media_id==null ? 1 : $request->media_id);
        $country->category_id = ($request->category_id==null ? 1 : $request->category_id);
        $country->title = ($request->title==null ? $request->slug : $request->title);
        $country->content = $request->content;
        $country->language = $request->language;
        $country->what_to_learn = $request->what_to_learn;
        $country->requirements = $request->requirements;
        $country->for_who = $request->for_who;
        $country->includes = $request->includes;
        $country->video = $request->video;
        $country->difficulty = $request->difficulty;
        $country->color = $request->color;
        $country->price_type = $request->price_type;
        $country->price_cost = $request->price_cost;
        $country->price_old = $request->price_old;
        $country->price_currency = $request->price_currency;
        $country->price_side = $request->price_side;
        $country->save();

        return redirect()->route('admin.visa.country.index')->with(['type' => 'success', 'message' =>'Country Updated.']);
    }

    public function destroy($id)
    {
        Country::find($id)->delete();
        return redirect()->route('admin.visa.country.index')->with(['type' => 'success', 'message' =>'Country Deleted.']);
    }
}
