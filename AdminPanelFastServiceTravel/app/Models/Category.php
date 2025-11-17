<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Category extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';

    protected $guarded = [];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    function getSlug(){
        return $this->hasOne('App\Models\Slug','_id','slug_id');
    }
    function getMedia(){
        return $this->hasOne('App\Models\Media','id','media_id');
    }
}
