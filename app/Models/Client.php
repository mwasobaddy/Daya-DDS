<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Client extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'client';

    protected $fillable = [
        'user_id',
        'business_name',
        'full_name',
        'email',
        'phone',
        'country_id',
        'county_id',
        'subcounty_id',
        'ward_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    // Add relationships for country, county, etc. if models exist
}
