<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class UserMeta extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';

    protected $guarded = [];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
