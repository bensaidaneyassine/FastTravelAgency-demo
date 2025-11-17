<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Slug;
class Country extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $connection = 'mongodb';

    protected $guarded = [];
    /**
     * @var string
     */
    public $name;
    /**
     * @var string
     */
    public $flag;
    /**
     * @var string|null
     */
    public $description;
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /** @return \MongoDB\Laravel\Relations\HasMany|\Illuminate\Database\Eloquent\Relations\HasMany */
    function getTopics(){
        return $this->hasMany('App\Models\Lesson');
    }
    /** @return \MongoDB\Laravel\Relations\HasOne|\Illuminate\Database\Eloquent\Relations\HasOne */
    function getMedia(){
        return $this->hasOne('App\Models\Media','id','media_id');
    }
    /** @return \MongoDB\Laravel\Relations\HasOne|\Illuminate\Database\Eloquent\Relations\HasOne */
    function getSlug(){
        // $slug = Slug::find($this->slug_id);
        // return $slug;
        return $this->hasOne('App\Models\Slug','_id','slug_id');
    }
    /** @return \MongoDB\Laravel\Relations\HasOne|\Illuminate\Database\Eloquent\Relations\HasOne */
    function getCategory(){
        return $this->hasOne('App\Models\Category','id','category_id');
    }

}
