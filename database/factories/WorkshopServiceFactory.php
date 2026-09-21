<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Workshop;
use App\Models\WorkshopService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkshopService>
 */
class WorkshopServiceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workshop_id' => Workshop::factory(),
            'category_id' => Category::factory(),
            'starting_price' => fake()->randomFloat(2, 50, 300),
        ];
    }
}
