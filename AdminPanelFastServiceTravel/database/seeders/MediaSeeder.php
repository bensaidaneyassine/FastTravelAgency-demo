<?php

namespace Database\Seeders;

// use App\Models\Media; // Use the Media model for Spatie Media Library
// use Illuminate\Database\Seeder;
// use Illuminate\Support\Facades\Storage;

// class FileSeeder extends Seeder
// {
//     public function run()
//     {
//         $filePath = '/home/sfn/projects/laravel-admin/public/admin/img/empty.png'; // Replace with your actual file path

//         // if (Storage::exists($filePath)) {
//             $media = Media::addMediaFromDisk($filePath, 'your_media_collection_name')
//                 ->preservingOriginal(); // Preserve the original filename
//         // } else {
//         //     // Handle the case where the file doesn't exist (optional)
//         //     // You can log an error message or skip seeding this particular file
//         //     echo "File not found: " . $filePath . PHP_EOL;
//         // }
//     }
// }



use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class MediaSeeder extends Seeder
{
    public function run()
    {
            $fileName = 'empty.png';
            $fileUrl = Storage::disk('public')->url('admin/img/' . $fileName);

            Media::create([
                'file_name' => $fileName,
                'file_url' => $fileUrl,
            ]);
    }
}