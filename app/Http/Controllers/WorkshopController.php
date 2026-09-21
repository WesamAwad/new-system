<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexWorkshopRequest;
use App\Models\Category;
use App\Models\Workshop;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopController extends Controller
{
    public function index(IndexWorkshopRequest $request): Response
    {
        $filters = $request->filters();

        $workshops = Workshop::query()
            ->with(['services.category:id,name,slug'])
            ->when($filters['search'], function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($filters['city'], fn ($query, string $city) => $query->where('city', 'like', "%{$city}%"))
            ->when($filters['category'], function ($query, string $category): void {
                $query->whereHas('services.category', fn ($query) => $query->where('slug', $category));
            })
            ->when($filters['min_rating'], fn ($query, string $minRating) => $query->where('rating', '>=', $minRating))
            ->orderByDesc('rating')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('workshops/index', [
            'workshops' => $workshops,
            'filters' => $filters,
            'categories' => Category::query()->active()->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function show(Workshop $workshop): Response
    {
        $workshop->load([
            'services.category:id,name,slug',
            'reviews' => fn ($query) => $query->approved()->latest(),
        ]);

        return Inertia::render('workshops/show', [
            'workshop' => $workshop,
        ]);
    }
}
