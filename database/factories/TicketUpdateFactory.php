<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketUpdate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketUpdate>
 */
class TicketUpdateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory(),
            'message' => fake()->sentence(),
            'status_from' => null,
            'status_to' => null,
            'is_internal' => false,
        ];
    }
}
