<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dcd>
 */
class DcdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'business_name' => $this->faker->company(),
            'business_address' => $this->faker->address(),
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'operating_days' => ['Monday', 'Tuesday', 'Wednesday'],
            'opening_time' => '08:00:00',
            'closing_time' => '18:00:00',
            'foot_traffic_estimate' => '11-50',
            'campaign_types' => ['surveys'],
            'music_preferences' => null,
            'safety_preferences' => ['Kids Appropriate'],
            'qr_code_path' => 'qr_codes/test.png',
            'pdf_guide_path' => 'pdf_guides/test.pdf',
        ];
    }
}
