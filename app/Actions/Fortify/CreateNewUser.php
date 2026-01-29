<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'role' => 'da', // Default role
            'full_name' => $input['name'],
            'name' => $input['name'],
            'email' => $input['email'],
            'phone' => fake()->unique()->phoneNumber(),
            'national_id' => fake()->unique()->numerify('##########'),
            'dob' => fake()->date('Y-m-d', '-18 years'),
            'gender' => fake()->randomElement(['male', 'female']),
            'country_id' => 1, // Default to Kenya
            'county_id' => 1,
            'subcounty_id' => 1,
            'ward_id' => 1,
            'referral_code' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
            'wallet_type' => 'personal',
            'wallet_status' => 'active',
            'wallet_pin' => fake()->numerify('####'),
            'wallet_balance' => '0.00',
            'total_DDS_balance' => '0.00',
            'total_DWS_balance' => '0.00',
            'password' => bcrypt($input['password']),
        ]);
    }
}
