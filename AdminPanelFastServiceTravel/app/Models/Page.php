<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $connection = 'mongodb';

    protected $guarded = [];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Define canonical relation name 'slug' for eager loading
    public function slug()
    {
        return $this->hasOne('App\\Models\\Slug','_id','slug_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'media_id', 'id');
    }

    function getSlug(){
        return $this->hasOne('App\\Models\\Slug','_id','slug_id');
    }
    function getMedia(){
        return $this->hasOne('App\Models\Media','_id','media_id');
    }
}
