<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'full_name',
        'phone',
        'national_id',
        'dob',
        'gender',
        'country_id',
        'county_id',
        'subcounty_id',
        'ward_id',
        'referral_code',
        'wallet_type',
        'wallet_status',
        'wallet_pin',
        'wallet_balance',
        'total_DDS_balance',
        'total_DWS_balance',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'total_DDS_balance' => 'decimal:2',
            'total_DWS_balance' => 'decimal:2',
            'wallet_balance' => 'decimal:2',
        ];
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function da()
    {
        return $this->hasOne(Da::class);
    }

    public function dcd()
    {
        return $this->hasOne(Dcd::class);
    }

    public function referralsMade()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    public function referralsReceived()
    {
        return $this->hasMany(Referral::class, 'referred_id');
    }

    public function ventureShares()
    {
        return $this->hasMany(VentureShare::class);
    }

    public function earnings()
    {
        return $this->hasMany(Earning::class);
    }

    public function scans()
    {
        return $this->hasMany(Scan::class, 'dcd_id');
    }

    /**
     * Get the user's name (alias for full_name).
     */
    public function getNameAttribute(): string
    {
        return $this->full_name;
    }

    /**
     * Set the user's name (alias for full_name).
     */
    public function setNameAttribute(string $value): void
    {
        $this->attributes['full_name'] = $value;
    }
}
