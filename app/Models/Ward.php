<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    protected $table = 'wards';
    protected $fillable = ['name', 'subcounty_id', 'code'];

    public function subcounty()
    {
        return $this->belongsTo(Subcounty::class, 'subcounty_id');
    }
}
