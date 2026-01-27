<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['male', 'female']);
        $firstName = fake()->firstName($gender === 'male' ? 'male' : 'female');
        $lastName = fake()->lastName();
        $fullName = $firstName.' '.$lastName;

        return [
            'role' => 'da', // Default to DA, can be overridden
            'full_name' => $fullName,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->unique()->phoneNumber(),
            'national_id' => fake()->unique()->numerify('##########'), // 10 digit national ID
            'dob' => fake()->date('Y-m-d', '-18 years'), // At least 18 years old
            'gender' => $gender,
            'country_id' => 1, // Default to Kenya (ID 1)
            'county_id' => 1, // Default to first county
            'subcounty_id' => 1, // Default to first subcounty
            'ward_id' => 1, // Default to first ward
            'referral_code' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'), // Format like DA123456
            'wallet_type' => fake()->randomElement(['personal', 'business', 'both']),
            'wallet_status' => 'active',
            'wallet_pin' => fake()->numerify('####'), // 4-digit PIN
            'wallet_balance' => '0.00',
            'total_DDS_balance' => '0.00',
            'total_DWS_balance' => '0.00',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'wallet_type' => 'business',
            'wallet_status' => 'active',
        ]);
    }

    /**
     * Create a digital ambassador user.
     */
    public function da(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'da',
            'wallet_type' => fake()->randomElement(['personal', 'business', 'both']),
            'wallet_status' => 'active',
        ]);
    }

    /**
     * Create a digital content distributor user.
     */
    public function dcd(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'dcd',
            'wallet_type' => 'business',
            'wallet_status' => 'active',
        ]);
    }

    /**
     * Create a client user.
     */
    public function client(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'client',
            'wallet_type' => 'business',
            'wallet_status' => 'active',
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
