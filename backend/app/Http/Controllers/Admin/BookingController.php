<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\ActivityLogService;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private BookingService $service) {}

    public function index(Request $request)
    {
        $query = Booking::with(['customer', 'vehicle', 'pickupLocation', 'dropoffLocation'])
            ->when($request->status, fn ($builder, $status) => $builder->where('status', $status))
            ->when($request->payment_status, fn ($builder, $status) => $builder->where('payment_status', $status))
            ->when($request->search, function ($builder, $value) {
                $builder->where(function ($nested) use ($value) {
                    $nested->where('reference', 'like', "%{$value}%")
                        ->orWhereHas('customer', fn ($customer) => $customer->where('full_name', 'like', "%{$value}%")->orWhere('phone', 'like', "%{$value}%"))
                        ->orWhereHas('vehicle', fn ($vehicle) => $vehicle->where('name', 'like', "%{$value}%"));
                });
            })
            ->latest();

        return BookingResource::collection($query->paginate(50));
    }

    public function show(Booking $booking)
    {
        return new BookingResource($booking->load(['customer', 'vehicle', 'pickupLocation', 'dropoffLocation', 'statusHistory.admin']));
    }

    public function timeline(Booking $booking)
    {
        return response()->json([
            'data' => $booking->statusHistory()->with('admin:id,name,email')->latest()->get(),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'status' => 'nullable|in:Pending,Confirmed,In Progress,Completed,Cancelled,Rejected',
            'payment_status' => 'nullable|in:Payment Pending,Partially Paid,Paid,Refunded',
            'admin_notes' => 'nullable|string|max:5000',
            'note' => 'nullable|string|max:1000',
            'handover_at' => 'nullable|date',
            'actual_return_at' => 'nullable|date',
            'handover_odometer' => 'nullable|integer|min:0',
            'return_odometer' => 'nullable|integer|min:0',
        ]);

        $old = $booking->toArray();
        if (!empty($data['status']) && $data['status'] !== $booking->status) {
            $booking = $this->service->changeStatus($booking, $data['status'], $request->user()?->id, $data['note'] ?? null);
        }

        $booking->update(array_filter([
            'payment_status' => $data['payment_status'] ?? null,
            'admin_notes' => $data['admin_notes'] ?? null,
            'handover_at' => $data['handover_at'] ?? null,
            'actual_return_at' => $data['actual_return_at'] ?? null,
            'handover_odometer' => $data['handover_odometer'] ?? null,
            'return_odometer' => $data['return_odometer'] ?? null,
        ], fn ($value) => $value !== null));

        ActivityLogService::record('Updated', $booking, $old, $booking->fresh()->toArray(), $request, 'Updated booking operations');

        return new BookingResource($booking->fresh()->load(['customer', 'vehicle', 'pickupLocation', 'dropoffLocation', 'statusHistory.admin']));
    }
}
