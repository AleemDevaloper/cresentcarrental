<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Hostel;
use App\Models\EMS\HostelAllocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelController extends EmsResourceController
{
    protected string $model = Hostel::class;

    public function allocate(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['status'] = $data['status'] ?? 'allocated';
        $allocation = HostelAllocation::create($data);

        $hostel = Hostel::find($data['hostel_id'] ?? null);
        if ($hostel && $hostel->available_beds > 0) {
            $hostel->decrement('available_beds');
        }

        return response()->json(['success' => true, 'message' => 'Allocated', 'data' => $allocation], 201);
    }
}