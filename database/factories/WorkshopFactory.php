<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Workshop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Workshop>
 */
class WorkshopFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->technician(),
            'name' => fake()->company(),
            'logo' => null,
            'bio' => fake()->paragraph(),
            'city' => fake()->city(),
            'address' => fake()->streetAddress(),
            'rating' => fake()->randomFloat(1, 3.5, 5.0),
            'reviews_count' => fake()->numberBetween(5, 150),
            'is_featured' => false,
            'is_available' => true,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
