<?php

namespace App\Services;

use App\Models\Da;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DaService
{
    public function createDa(array $data): Da
    {
        return DB::transaction(function () use ($data) {
            // Create user first
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make('temporary_password'), // Or handle password separately
            ]);

            // Create DA record
            $da = Da::create([
                'user_id' => $user->id,
                'social_platforms' => $data['social_platforms'],
                'prefered_contact_method' => $data['preferred_contact_method'],
                'wallet_address' => $data['wallet_address'] ?? null,
            ]);

            return $da;
        });
    }
}
