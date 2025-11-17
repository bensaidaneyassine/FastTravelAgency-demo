<?php

namespace App\Http\Controllers\Admin;

use App\Models\Demand;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Notifications\NewDemandNotification;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class DemandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    $demands = Demand::with('user')->get();
        return view("admin.demand.index",compact('demands'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(Request $request)
    // {
    //     // Validate the incoming request data
    //     // $validatedData = $request->validate([
    //     //     'user_id' => 'required|string',
    //     //     'visa_type_id' => 'required|string',
    //     // ]);


    //     $clientApplication = new Demand();
    //         // $clientApplication->user_id = $validatedData['user_id'];
    //         // $clientApplication->visa_type_id = $validatedData['visa_type_id'];
    //     $clientApplication->status = "pending";

    //     foreach($request->keys() as $key => $value){
    //         $clientApplication->$value = $request->get($value);
    //     }
    //     // Save the client application data to the database
    //     $clientApplication->save();

    //     // Optionally, you can return a response indicating success
    //     return response()->json(['message' => 'Client application saved successfully'], 201);
    // }

    public function store(Request $request)
    {
        $clientApplication = new Demand();
        $clientApplication->status = "pending";

        // Determine requester via session or JWT (Bearer) token
        $reqUser = null;
        if (auth()->check()) {
            $reqUser = auth()->user();
        } else {
            try { $reqUser = JWTAuth::parseToken()->authenticate(); } catch (\Throwable $e) { $reqUser = null; }
        }
        if ($reqUser) {
            $clientApplication->user_id = (string)($reqUser->_id ?? $reqUser->id);
            // Persist an account snapshot for easy admin display even if user later changes profile
            $clientApplication->account_name = $reqUser->name ?? null;
            $clientApplication->account_email = $reqUser->email ?? null;
            $clientApplication->account_phone = $reqUser->phoneNumber ?? null;
        }

        // Process each key-value pair
        foreach ($request->keys() as $key) {
            $value = $request->get($key);

            // Check if the value is a Base64 encoded file
            if(is_array($value)){
                foreach(array_keys($value[0]) as $k){
                    $v = $value[0][$k];
                    if (!is_array($v) && $this->isBase64($v)) {
                        // Extract the Base64 data
                        $base64Data = $this->getBase64Data($v);
        
                        $extension = $this->getFileTypeFromBase64($v);

                        // Generate a unique filename
                        $filename = $k."_".uniqid() . '.' . $extension;
        
                        // Define the path to save the file
                        $filePath = 'media/' . $filename;
                        
                        // Save the file to the storage (public disk -> storage/app/public)
                        Storage::disk('public')->put($filePath, base64_decode($base64Data));
        
                        // Update the field with the file path and type
                        $value[0][$k] = json_encode([
                            'path' => $filePath,
                            'type' => $this->isImageBase64($v) ? "image" : "file",
                        ]);
                    } 
                }
                $clientApplication->$key = $value;
            } else {
                if ($this->isBase64($value)) {
                    $base64Data = $this->getBase64Data($value);
    
                    $extension = $this->getFileTypeFromBase64($value);

                    // Generate a unique filename
                    $filename = $key."_".uniqid() . '.' . $extension;
    
                    $filePath = 'media/' . $filename;
                    
                    // Save file under storage/app/public
                    Storage::disk('public')->put($filePath, base64_decode($base64Data));
    
                    $clientApplication->$key = json_encode([
                        'path' => $filePath,
                        'type' => $this->isImageBase64($value) ? "image" : "file",
                    ]);
                } else {
                    $clientApplication->$key = $value;
                }
            }
        }

        // Derive top-level fields expected by admin list from travelers[0] or fallbacks
        try {
            // If travelers array exists, lift primary applicant info
            if ($request->has('travelers') && is_array($request->input('travelers')) && count($request->input('travelers')) > 0) {
                $primary = $request->input('travelers')[0];
                if (is_array($primary)) {
                    $first = trim(($primary['name'] ?? ''));
                    $last = trim(($primary['firstName'] ?? ''));
                    $fullName = trim($first . ' ' . $last);
                    if ($fullName !== '') {
                        $clientApplication->applicantName = $fullName;
                    }
                    if (!empty($primary['email'])) {
                        $clientApplication->email = $primary['email'];
                    }
                    if (!empty($primary['phone'])) {
                        $clientApplication->phoneNumber = $primary['phone'];
                    }
                }
            }

            // Fallbacks: if not set above, map common top-level aliases
            if (empty($clientApplication->email) && $request->filled('email')) {
                $clientApplication->email = $request->string('email');
            }
            // Support both phoneNumber and phone
            if (empty($clientApplication->phoneNumber)) {
                if ($request->filled('phoneNumber')) {
                    $clientApplication->phoneNumber = $request->string('phoneNumber');
                } elseif ($request->filled('phone')) {
                    $clientApplication->phoneNumber = $request->string('phone');
                }
            }
            if (empty($clientApplication->applicantName) && $request->filled('applicantName')) {
                $clientApplication->applicantName = $request->string('applicantName');
            }
        } catch (\Throwable $e) {
            // ignore mapping errors to not block saving
        }

        // If authenticated (session or JWT) and applicant fields still empty, derive from user
        if ($reqUser) {
            if (empty($clientApplication->applicantName) && isset($reqUser->name)) { $clientApplication->applicantName = $reqUser->name; }
            if (empty($clientApplication->email) && isset($reqUser->email)) { $clientApplication->email = $reqUser->email; }
            if (empty($clientApplication->phoneNumber) && isset($reqUser->phoneNumber)) { $clientApplication->phoneNumber = $reqUser->phoneNumber; }
        }

        // Save the client application data to the database
        $clientApplication->save();

        // Dispatch notification to all users (admins) similar to contact messages
        try {
            $users = User::all();
            if ($users->count() > 0 && class_exists(NewDemandNotification::class)) {
                Notification::send($users, new NewDemandNotification($clientApplication));
            }
        } catch (\Throwable $e) {
            // Silently ignore notification errors to not block API
        }

        return response()->json(['message' => 'Client application saved successfully'], 201);
    }

    private function isBase64($value)
    {
        if (preg_match('/^data:[a-zA-Z0-9\/\+\-]+;base64,/', $value)) {
            return true;
        }
        return false;
    }

    private function getBase64Data($value)
    {
        if (preg_match('/^data:[a-zA-Z0-9\/\+\-]+;base64,(.+)$/', $value, $matches)) {
            return $matches[1];
        }
        return $value;
    }

    private function getFileTypeFromBase64($value)
    {
        return explode('/', mime_content_type($value))[1];
    }

    // Removed unused getFileExtensionFromMimeType()

    private function isImageBase64($value)
    {
        // data:image/<type>;base64,....
        return (bool) preg_match('/^data:image\/[a-zA-Z0-9.+-]+;base64,/', (string) $value);
    }


    /**
     * Store new client in storage.
     */
    public function storeClient(Request $request)
    {

        $client = new Customer();

        $exist = Customer::where('email', $request->email)->first();

        if(!$exist){
            foreach($request->keys() as $key => $value){
                $client->$value = $request->get($value);
            }
            // Save the client application data to the database
            $client->save();
    
            // Optionally, you can return a response indicating success
            return response()->json(['message' => 'Client saved successfully'], 201);
        } else {
            return response()->json(['message' => 'Client already exist'], 200);  
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
    $demand = Demand::with('user')->find($id);

        if (!$demand) {
            return response()->json(['message' => 'Demand not found'], 404);
        }

    // Do not auto-change status on view; keep 'pending' until admin updates it explicitly

        // Prepare structured travelers & documents for cleaner view layer
        $travelers = [];
        $documents = [];
        try {
            $raw = $demand->travelers ?? [];
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $raw = $decoded;
                }
            }
            if (is_array($raw)) {
                foreach ($raw as $idx => $traveler) {
                    if (!is_array($traveler)) continue;
                    $normalized = [];
                    foreach ($traveler as $k => $v) {
                        $fileMeta = null;
                        if (is_string($v)) {
                            $json = json_decode($v, true);
                            if (is_array($json) && isset($json['path'])) {
                                $fileMeta = $json;
                            }
                        }
                        if ($fileMeta) {
                            $fileMeta['original_key'] = $k;
                            $documents[] = $fileMeta;
                            $normalized[$k] = $fileMeta; // keep file meta
                        } else {
                            $normalized[$k] = $v;
                        }
                    }
                    $travelers[] = $normalized;
                }
            }
        } catch (\Throwable $e) {}

        return view("admin.demand.show",compact('demand','travelers','documents'));
    }

    /**
     * Secure download for demand attachment.
     */
    public function download($id, $hash)
    {
        $demand = Demand::find($id);
        if(!$demand){
            abort(404);
        }
        // Collect all file json blobs
        $paths = [];
        $walker = function($value) use (&$paths, &$walker){
            if (is_string($value)) {
                $decoded = json_decode($value, true);
                if (is_array($decoded) && isset($decoded['path'])) {
                    $paths[] = $decoded['path'];
                }
            } elseif (is_array($value)) {
                foreach ($value as $v) { $walker($v); }
            }
        };
        foreach ($demand->getAttributes() as $attr => $val) { $walker($val); }
        // Find path whose sha1 matches provided hash
        $match = collect($paths)->first(function($p) use ($hash){ return sha1($p) === $hash; });
        if(!$match){
            abort(404);
        }
        if(!Storage::disk('public')->exists($match)){
            abort(404);
        }
        $filename = basename($match);
        return Storage::disk('public')->download($match, $filename);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $demand = Demand::find($id);
        if (!$demand) {
            return redirect()->route('admin.demand.index')->withErrors(__('main.Demand not found'));
        }
        return view('admin.demand.edit', compact('demand'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the demand by ID
        $demand = Demand::find($id);
    
        // Check if the demand exists
        if (!$demand) {
            return redirect()->route('admin.demand.index')->withErrors(__('main.Demand not found'));
        }
    
        // Update other fields dynamically
        foreach ($request->except(['_token','_method']) as $key => $value) {
            $demand->$key = $value;
        }

        $demand->save();

        return redirect()->route('admin.demand.show', $demand->_id)->with('success', __('main.Demand updated successfully'));
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $demand = Demand::find($id);
        if (!$demand) {
            return redirect()->route('admin.demand.index')->withErrors(__('main.Demand not found'));
        }
        $demand->delete();
        return redirect()->route('admin.demand.index')->with('success', __('main.Demand deleted successfully'));
    }

    /**
     * Get demands by userId (Exp: Connected user can request to see his vis applications).
     */
    public function getByUserId($userId)
    {
        // Find demands by user_id
        $demands = Demand::where('user_id', $userId)->get();

        // Check if demands exist
        if ($demands->isEmpty()) {
            return response()->json(['message' => 'No demands found for this user'], 404);
        }

        // Return demands
        return response()->json($demands, 200);
    }

    /**
     * List demands for the authenticated user (client) via session or JWT.
     */
    public function myDemands(Request $request)
    {
        $user = null;
        if (auth()->check()) {
            $user = auth()->user();
        } else {
            try { $user = JWTAuth::parseToken()->authenticate(); } catch (\Throwable $e) { $user = null; }
        }
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $items = Demand::where('user_id', (string)($user->_id ?? $user->id))
            ->orderBy('created_at', 'desc')
            ->get(['_id','status','demandType','country','visaType','visaDate','noOfTraverlers','created_at']);
        // Normalize legacy/unknown statuses to one of: pending, approved, rejected
        $normalized = $items->map(function($d){
            $st = in_array($d->status, ['approved','rejected','pending']) ? $d->status : 'pending';
            $d->status = $st;
            return $d;
        })->values();
        return response()->json($normalized, 200);
    }
}
