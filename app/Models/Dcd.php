<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dcd extends Model
{
    protected $table = 'dcd';

    protected $fillable = [
        'user_id',
        'business_name',
        'business_address',
        'business_type',
        'operating_days',
        'opening_time',
        'closing_time',
        'foot_traffic_estimate',
        'campaign_types',
        'music_preferences',
        'safety_preferences',
        'qr_code_path',
    ];

    protected $casts = [
        'business_type' => 'array',
        'operating_days' => 'array',
        'campaign_types' => 'array',
        'music_preferences' => 'array',
        'safety_preferences' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
