<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkshopServiceRequest;
use App\Http\Requests\UpdateWorkshopServiceRequest;
use App\Models\WorkshopService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WorkshopServiceController extends Controller
{
    public function store(StoreWorkshopServiceRequest $request): RedirectResponse
    {
        $request->user()->workshop->services()->create($request->validated());

        return redirect()
            ->route('dashboard.workshop.edit')
            ->with('success', 'تمت إضافة الخدمة بنجاح.');
    }

    public function update(UpdateWorkshopServiceRequest $request, WorkshopService $workshopService): RedirectResponse
    {
        $workshopService->update($request->validated());

        return redirect()
            ->route('dashboard.workshop.edit')
            ->with('success', 'تم تحديث السعر بنجاح.');
    }

    public function destroy(Request $request, WorkshopService $workshopService): RedirectResponse
    {
        $this->authorize('delete', $workshopService);

        $workshopService->delete();

        return redirect()
            ->route('dashboard.workshop.edit')
            ->with('success', 'تم حذف الخدمة.');
    }
}
