<?php

namespace Database\Factories;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_number' => 'SWIFT-'.Str::upper(Str::random(6)),
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'assigned_to' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'priority' => TicketPriority::Medium,
            'status' => TicketStatus::Pending,
            'estimated_cost' => null,
            'scheduled_at' => null,
            'completed_at' => null,
        ];
    }

    public function assignedTo(User $technician): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_to' => $technician->id,
            'status' => TicketStatus::Assigned,
        ]);
    }
}
