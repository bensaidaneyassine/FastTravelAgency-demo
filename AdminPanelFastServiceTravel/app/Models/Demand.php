<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use App\Models\User;

class Demand extends Model
{
    use HasFactory;


    protected $connection = 'mongodb';

    protected $attributes = [
        'status' => 'pending',
    ];

    // Do NOT declare public properties for persisted fields; it breaks Eloquent's attribute handling.
    // Use $fillable and dynamic attributes instead.

    protected $fillable = [
        'user_id',
        'visa_type_id',
        'status',
        'additional_informations',
        'applicantName',
        'email',
        'phoneNumber',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Normalize legacy/unknown statuses to one of: pending, approved, rejected.
     */
    public function getStatusAttribute($value)
    {
        return in_array($value, ['approved','rejected','pending']) ? $value : 'pending';
    }
}
