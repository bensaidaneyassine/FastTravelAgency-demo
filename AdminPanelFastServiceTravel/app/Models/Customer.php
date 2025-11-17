<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Customer extends Model
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'email',
        'name',
        'phone',
    ];
}
