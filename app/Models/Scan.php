<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{
    protected $fillable = [
        'dcd_id',
        'campaign_id',
        'geo',
        'device_identifier',
        'scanned_at',
    ];

    protected $casts = [
        'geo' => 'array',
        'scanned_at' => 'datetime',
    ];

    public function dcd()
    {
        return $this->belongsTo(User::class, 'dcd_id');
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function earnings()
    {
        return $this->hasMany(Earning::class);
    }
}
