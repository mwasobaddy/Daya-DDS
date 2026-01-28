<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'client_id',
        'dcd_id',
        'name',
        'type',
        'music_preferences',
        'digital_product_link',
        'explainer_video_link',
        'campaign_objectives',
        'budget',
        'currency',
        'safety_preferences',
        'country_target',
        'county_target',
        'subcounty_target',
        'ward_target',
        'business_target',
        'target_audience',
        'campaign_description',
        'status',
        'cost_per_scan',
        'credits_allocated',
        'credits_balance',
        'credits_used',
        'scan_allocated',
        'scan_balance',
        'scan_used',
    ];

    protected $casts = [
        'music_preferences' => 'array',
        'safety_preferences' => 'array',
        'business_target' => 'array',
        'campaign_description' => 'string',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function dcd()
    {
        return $this->belongsTo(Dcd::class);
    }

    public function adminActions()
    {
        return $this->hasMany(AdminAction::class);
    }

    public function scans()
    {
        return $this->hasMany(Scan::class);
    }

    public function earnings()
    {
        return $this->hasMany(Earning::class);
    }
}
