<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateWorkshopProfileRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $workshop = $request->user()->workshop;

        $addedCategoryIds = $workshop
            ? $workshop->services()->pluck('category_id')
            : collect();

        return Inertia::render('dashboard/workshop', [
            'workshop' => $workshop,
            'services' => $workshop
                ? $workshop->services()->with('category:id,name,slug')->get()
                : [],
            'availableCategories' => Category::query()
                ->active()
                ->whereNotIn('id', $addedCategoryIds)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(UpdateWorkshopProfileRequest $request): RedirectResponse
    {
        $request->user()->workshop()->updateOrCreate([], $request->validated());

        return redirect()
            ->route('dashboard.workshop.edit')
            ->with('success', 'تم حفظ بيانات الورشة بنجاح.');
    }
}
