<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateWorkshopReviewRequest;
use App\Models\WorkshopReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $workshop = $request->user()->workshop;

        $reviews = WorkshopReview::query()
            ->where('workshop_id', $workshop?->id ?? 0)
            ->latest()
            ->paginate(10);

        return Inertia::render('dashboard/reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function update(UpdateWorkshopReviewRequest $request, WorkshopReview $workshopReview): RedirectResponse
    {
        $workshopReview->update($request->validated());
        $workshopReview->workshop->recalculateRatingStats();

        return redirect()
            ->route('dashboard.reviews.index')
            ->with('success', 'تم تحديث حالة المراجعة.');
    }
}
