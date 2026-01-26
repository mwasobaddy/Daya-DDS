<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = ['name', 'code', 'currency_code', 'currency_symbol', 'county_label', 'subcounty_label'];

    public function counties()
    {
        return $this->hasMany(County::class);
    }
}
