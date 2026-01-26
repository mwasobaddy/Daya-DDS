<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Earning extends Model
{
    protected $fillable = [
        'user_id',
        'campaign_id',
        'scan_id',
        'credits_earned',
        'description',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'credits_earned' => 'decimal:4',
        'paid_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function scan()
    {
        return $this->belongsTo(Scan::class);
    }
}
