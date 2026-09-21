<?php

namespace App\Http\Requests;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(TicketStatus::class)],
            'priority' => ['nullable', Rule::enum(TicketPriority::class)],
        ];
    }

    /**
     * @return array{search: string|null, status: string|null, priority: string|null}
     */
    public function filters(): array
    {
        $status = $this->validated('status');
        $priority = $this->validated('priority');

        return [
            'search' => $this->validated('search'),
            'status' => $status instanceof TicketStatus ? $status->value : $status,
            'priority' => $priority instanceof TicketPriority ? $priority->value : $priority,
        ];
    }
}
