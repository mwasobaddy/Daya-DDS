<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => \App\Models\Client::factory(),
            'dcd_id' => null,
            'name' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['Business', 'Artist', 'Label']),
            'music_preferences' => null,
            'digital_product_link' => $this->faker->url(),
            'explainer_video_link' => $this->faker->url(),
            'campaign_objectives' => 'education_learning',
            'budget' => $this->faker->numberBetween(1000, 10000),
            'currency' => 'KES',
            'safety_preferences' => ['Kids Appropriate'],
            'country_target' => 1,
            'county_target' => 1,
            'subcounty_target' => 1,
            'ward_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka'],
            ],
            'target_audience' => $this->faker->paragraph(),
            'campaign_description' => $this->faker->paragraph(),
            'status' => 'pending',
            'cost_per_scan' => '10',
            'credits_allocated' => 1000,
            'credits_balance' => 1000,
            'credits_used' => 0,
            'scan_allocated' => 100,
            'scan_balance' => 100,
            'scan_used' => 0,
            'start_date' => $this->faker->dateTimeBetween('now', '+30 days'),
            'end_date' => $this->faker->dateTimeBetween('+31 days', '+90 days'),
            'engagement_score' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }
}
