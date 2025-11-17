<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Country;
use App\Models\Slug;

class CountrySeeder extends Seeder
{
    protected $connection = 'mongodb';

    public function run()
    {
        $names = [
            'Armenia','Australia','Austria','Azerbaijan','Bosnia and Herzegovina',
            'Switzerland','China','Cyprus','Czech Republic','Germany',
            'Denmark','Egypt','France','Hungary','Greece',
            'Indonesia','Ireland','India','Italy','Japan',
            'South Korea','Malaysia','Netherlands','Norway','New Zealand',
            'Portugal','Russia','Sweden','Singapore','United Kingdom',
            'United States','Vietnam'
        ];

        foreach ($names as $name) {
            // Avoid duplicates if re-run
            if (Country::where('title', $name)->exists()) {
                continue;
            }

            $slug = new Slug();
            $slug->owner = 'country';
            $slug->slug = Str::slug($name);
            $slug->seo_title = $name;
            $slug->seo_description = $name . ' visa information';
            $slug->no_index = 0;
            $slug->no_follow = 0;
            $slug->save();

            $country = new Country();
            $country->slug_id = $slug->id;
            $country->media_id = 1;
            $country->category_id = null;
            $country->title = $name;
            $country->content = '';
            $country->language = 'en';
            $country->what_to_learn = '';
            $country->requirements = '';
            $country->for_who = '';
            $country->includes = '';
            $country->video = '';
            $country->time = serialize(['h' => '00', 'm' => '00', 's' => '00']);
            $country->difficulty = 0;
            $country->color = '#2bb1a6';
            $country->price_type = 'paid';
            $country->price_cost = 121;
            $country->price_old = null;
            $country->price_currency = '$';
            $country->price_side = 'left';
            $country->save();
        }
    }
}
