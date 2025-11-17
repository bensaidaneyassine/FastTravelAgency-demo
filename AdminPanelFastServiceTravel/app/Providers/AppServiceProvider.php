<?php

namespace App\Providers;

use App\Models\File;
use App\Models\Option;
use App\Models\Widget;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer('admin.layouts.master',function($view){
            $notificationCount = 0;
            $recentItems = collect();
            try {
                $unreadDemands = \App\Models\Demand::where('status','pending')->get(['_id','applicantName','demandType','created_at']);
                $unreadContacts = \App\Models\Contact::where('status','new')->get(['_id','name','subject','created_at']);
                $notificationCount = $unreadDemands->count() + $unreadContacts->count();
                // Merge and sort by created_at desc, limit 7
                $recentItems = $unreadDemands->map(function($d){
                        return [
                            'type' => 'demand',
                            'id' => $d->_id,
                            'title' => $d->demandType ?? 'Demand',
                            'subtitle' => $d->applicantName,
                            'created_at' => $d->created_at,
                            'route' => route('admin.demand.show',$d->_id),
                        ];
                    })->merge(
                        $unreadContacts->map(function($c){
                            return [
                                'type' => 'contact',
                                'id' => $c->_id,
                                'title' => $c->subject ?? 'Contact Message',
                                'subtitle' => $c->name,
                                'created_at' => $c->created_at,
                                'route' => route('admin.contact-messages.show',$c->_id),
                            ];
                        })
                    )->sortByDesc('created_at')->values()->take(7);
            } catch (\Throwable $e) {}
            $view->with([
                'auth'=>Auth::user(),
                'languages' => Option::where('key','=','language')->get(),
                'notificationCount' => $notificationCount,
                'recentNotifications' => $recentItems,
                ]);
        });
        view()->composer('admin.layouts.media',function($view){
            $view->with('medias',File::orderBy('created_at', 'desc')->where('collection','=','default')->simplePaginate(80));
        });
        view()->composer('layouts.master',function($view){
            $option = [
                'no_index' => Option::where('key','=','no_index')->first()->value,
                'no_follow' => Option::where('key','=','no_follow')->first()->value,
                'logo' => Option::where('key','=','logo')->first()->value,
                'favicon' => Option::where('key','=','favicon')->first()->value,
                'headcss' => Option::where('key','=','headcss')->first()->value,
                'headjs' => Option::where('key','=','headjs')->first()->value,
                'footerjs' => Option::where('key','=','footerjs')->first()->value,

            ];
            $view->with([
                'widget' => Widget::all(),
                'option' => $option,
                'languages' => Option::where('key','=','language')->get(),
                ]);
        });
    }
}
