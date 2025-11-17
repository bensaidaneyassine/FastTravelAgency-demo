<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    protected $connection = 'mongodb';

    public function run()
    {
        // Ensure menu containers exist
        if (!Menu::where('menuname', 'Main Menu')->whereNull('title')->exists()) {
            $menu = new Menu();
            $menu->menuname = 'Main Menu';
            $menu->position = 1;
            $menu->save();
        }
        if (!Menu::where('menuname', 'Footer')->whereNull('title')->exists()) {
            $menu = new Menu();
            $menu->menuname = 'Footer';
            $menu->save();
        }

        // Upsert menu items
        $items = [
            ['menuname' => 'Main Menu', 'title' => 'Blog', 'link' => 'blog', 'order' => 1, 'position' => 1],
            ['menuname' => 'Main Menu', 'title' => 'Contact', 'link' => 'contact', 'order' => 2, 'position' => 1],
        ];
        foreach ($items as $it) {
            $exists = Menu::where('menuname', $it['menuname'])
                ->where('title', $it['title'])
                ->where('link', $it['link'])
                ->first();
            if ($exists) {
                // Update order/position if changed
                $exists->order = $it['order'];
                $exists->position = $it['position'];
                $exists->save();
                continue;
            }
            $menu = new Menu();
            $menu->menuname = $it['menuname'];
            $menu->title = $it['title'];
            $menu->link = $it['link'];
            $menu->order = $it['order'];
            $menu->position = $it['position'];
            $menu->save();
        }
    }
}
