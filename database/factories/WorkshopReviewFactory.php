<?php

namespace Database\Factories;

use App\Models\Workshop;
use App\Models\WorkshopReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkshopReview>
 */
class WorkshopReviewFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workshop_id' => Workshop::factory(),
            'client_name' => fake()->name(),
            'rating' => fake()->numberBetween(3, 5),
            'comment' => fake()->sentence(12),
            'is_approved' => true,
        ];
    }

    public function unapproved(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_approved' => false,
        ]);
    }
}
