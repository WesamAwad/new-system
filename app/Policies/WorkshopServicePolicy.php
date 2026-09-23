<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkshopService;

class WorkshopServicePolicy
{
    public function create(User $user): bool
    {
        return $user->isTechnician() && $user->workshop !== null;
    }

    public function update(User $user, WorkshopService $workshopService): bool
    {
        return $workshopService->workshop->user_id === $user->id;
    }

    public function delete(User $user, WorkshopService $workshopService): bool
    {
        return $this->update($user, $workshopService);
    }
}
