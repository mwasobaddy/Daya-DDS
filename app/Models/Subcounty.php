<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcounty extends Model
{
    protected $table = 'sub_counties';
    protected $fillable = ['name', 'county_id', 'code'];

    public function county()
    {
        return $this->belongsTo(County::class);
    }

    public function wards()
    {
        return $this->hasMany(Ward::class, 'subcounty_id');
    }
}
