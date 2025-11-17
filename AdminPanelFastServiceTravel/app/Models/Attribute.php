<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Attribute extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $connection = 'mongodb';

    protected $guarded = [];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
