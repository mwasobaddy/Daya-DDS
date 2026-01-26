<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class County extends Model
{
    protected $fillable = ['name', 'country_id', 'code'];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function subcounties()
    {
        return $this->hasMany(Subcounty::class);
    }
}
