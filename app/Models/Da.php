<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Da extends Model
{
    protected $table = 'da';

    protected $fillable = [
        'user_id',
        'social_platforms',
        'prefered_contact_method',
    ];

    protected $casts = [
        'social_platforms' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
