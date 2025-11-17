<?php

namespace Database\Seeders;

use App\Models\Option;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class OptionSeeder extends Seeder
{
    protected $connection = 'mongodb';

    public function run()
    {
        $options = ['logo','favicon','title','headcss','headjs','footerjs','no_index','no_follow'];
        foreach ($options as $key) {
            $opt = Option::where('key', $key)->where('language', 'tr')->first();
            if (!$opt) {
                $opt = new Option();
                $opt->key = $key;
                $opt->language = 'tr';
            }
            // Leave value null unless we set below
            $opt->save();
        }

        foreach (['logo' => 1, 'favicon' => 1] as $k => $v) {
            $option = Option::where('key', $k)->first();
            if ($option) {
                $option->value = $v;
                $option->save();
            }
        }

        // Ensure languages exist once per language
        $langs = [ ['tr','Türkçe'], ['en','English'] ];
        foreach ($langs as [$lang, $label]) {
            $opt = Option::where('key', 'language')->where('language', $lang)->first();
            if (!$opt) { $opt = new Option(); $opt->key = 'language'; $opt->language = $lang; }
            $opt->value = $label;
            $opt->save();
        }
    }
}
