<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Models\Slug;

class CategorySeeder extends Seeder
{
    protected $connection = 'mongodb';

    public function run()
    {
        $categories = ['Unnamed','Articles','Videos'];
        foreach ($categories as $category) {
            $slugValue = Str::slug($category);
            // Reuse existing slug if present to avoid unique index violations
            $slug = Slug::where('slug', $slugValue)->first();
            if (!$slug) {
                $slug = new Slug();
                $slug->slug = $slugValue;
                $slug->owner = 'category';
                $slug->save();
            }

            // Avoid duplicate categories by title
            $existing = Category::where('title', $category)->first();
            if ($existing) {
                // Ensure slug_id is set if missing
                if (empty($existing->slug_id)) {
                    $existing->slug_id = $slug->id;
                    $existing->save();
                }
                continue;
            }

            $cat = new Category();
            $cat->title = $category;
            $cat->type = 'article-category';
            $cat->slug_id = $slug->id;
            $cat->media_id = 1;
            $cat->save();
        }
    }
}
