<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;


class Contact extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $guarded = [];
    protected $fillable = ['name','email','subject','message','status'];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
