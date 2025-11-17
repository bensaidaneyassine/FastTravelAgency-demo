<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;
use App\Models\Menu;
use Throwable;

class ApiMenuController extends Controller
{   
    public function getMenuByName(Request $request)
    {
        try {
            $menu = Menu::where('menuname', $request->query('menuname'))
                ->whereNotNull('title')
                ->orderBy('order', 'ASC')
                ->get();
            if ($menu->isEmpty()) {
                return response()->json(['error' => 'Menu not found'], 404);
            }
    
            // Format and return the page data (modify this section as needed)  
            return response()->json($menu);
        } catch (Throwable $th) {
            // Implement error handling and logging
            Log::create([
                'model' => 'menu',
                'message' => 'API Menu could not be loaded.',
                'th_message' => $th->getMessage(),
                'th_file' => $th->getFile(),
                'th_line' => $th->getLine(),
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
}