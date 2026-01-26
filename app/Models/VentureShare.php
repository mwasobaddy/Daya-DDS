<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentureShare extends Model
{
    protected $table = 'ventures_shares';

    protected $fillable = [
        'user_id',
        'dds_earned',
        'dws_earned',
        'reason',
    ];

    protected $casts = [
        'dds_earned' => 'decimal:4',
        'dws_earned' => 'decimal:4',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
