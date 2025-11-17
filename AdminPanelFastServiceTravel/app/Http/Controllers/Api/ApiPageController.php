<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Slug;
use App\Models\Option;
use Throwable;

class ApiPageController extends Controller
{
    public function getPageBySlug(Request $request)
    {
        try {
            $slugValue = $request->query('slug');
            if(!$slugValue){
                return response()->json(['error' => 'Missing slug parameter'], 400);
            }

            // Find slug for pages (owner filter prevents collisions with categories/articles)
            $slug = Slug::where('slug', $slugValue)->where('owner', 'page')->first();

            // Try to fetch the related page if slug exists
            $page = $slug ? Page::where('slug_id', $slug->id)->first() : null;

            if ($page) {
                // Eager-load common relations when available
                try { $page->load(['slug','media']); } catch (\Throwable $e) { /* ignore */ }
                return response()->json($page);
            }

            // Graceful fallback: return a lightweight placeholder so frontend doesn't break
            $placeholder = [
                'title'   => ucfirst($slugValue),
                'content' => null,
                'slug'    => $slugValue,
                'slug_id' => $slug ? (string) $slug->id : null,
                'exists'  => [ 'slug' => (bool) $slug, 'page' => false ],
            ];

            // Log once for visibility (non-blocking)
            try {
                Log::create([
                    'model' => 'page',
                    'message' => "Placeholder page returned for slug '{$slugValue}'",
                    'th_message' => null,
                    'th_file' => __FILE__,
                    'th_line' => __LINE__,
                ]);
            } catch (\Throwable $e) { /* ignore logging issues */ }

            return response()->json($placeholder, 200);
        } catch (Throwable $th) {
            // Implement error handling and logging
            Log::create([
                'model' => 'page',
                'message' => 'API Page could not be loaded.',
                'th_message' => $th->getMessage(),
                'th_file' => $th->getFile(),
                'th_line' => $th->getLine(),
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
}