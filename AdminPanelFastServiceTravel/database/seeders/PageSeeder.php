<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Slug;
use App\Models\Attribute;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    protected $connection = 'mongodb';

    public function run()
    {
        $pages = ['Home','Blog','Contact'];
        foreach ($pages as $page) {
            $slugValue = Str::slug($page);
            $slug = Slug::where('slug', $slugValue)->where('owner', 'page')->first();
            if (!$slug) {
                $slug = new Slug();
                $slug->slug = $slugValue;
                $slug->owner = 'page';
                $slug->save();
            }

            $pag = Page::where('slug_id', $slug->id)->first();
            if ($pag) {
                // Ensure minimum fields
                $pag->title = $pag->title ?: $page;
                $pag->status = $pag->status ?? 1;
                $pag->template = $pag->template ?: $slugValue;
                // Media model may rely on a SQL connection in this app; guard its usage
                $first = null;
                try { if (class_exists(\App\Models\Media::class)) { $first = Media::query()->first(); } } catch (\Throwable $e) { $first = null; }
                if (empty($pag->media_id) && $first) {
                    $pag->media_id = $first->_id;
                }
                $pag->save();
                continue;
            }

            $pag = new Page();
            $pag->title = $page;
            $pag->slug_id = $slug->id;
            try { $first = Media::query()->first(); } catch (\Throwable $e) { $first = null; }
            if ($first) { $pag->media_id = $first->_id ?? $first->id ?? null; }
            $pag->status = 1;
            $pag->template = $slugValue;
            $pag->save();
        }
    }
}
