<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkshopReview;

class WorkshopReviewPolicy
{
    public function update(User $user, WorkshopReview $workshopReview): bool
    {
        return $workshopReview->workshop->user_id === $user->id;
    }
}
