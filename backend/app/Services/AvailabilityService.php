<?php
namespace App\Services;
use App\Models\Booking;use App\Models\Vehicle;use Carbon\CarbonInterface;
class AvailabilityService {
 public const BLOCKING_STATUSES=['Pending','Confirmed','In Progress'];
 public function isVehicleAvailable(Vehicle|int $vehicle, CarbonInterface $pickupAt, CarbonInterface $returnAt, ?int $excludeBookingId=null):bool {
  $vehicleId=$vehicle instanceof Vehicle?$vehicle->id:$vehicle;
  $query=Booking::query()->where('vehicle_id',$vehicleId)->whereIn('status',self::BLOCKING_STATUSES)
   ->where(function($q) use($pickupAt,$returnAt){$q->where('pickup_at','<',$returnAt)->where('return_at','>',$pickupAt);});
  if($excludeBookingId)$query->whereKeyNot($excludeBookingId);
  return !$query->exists();
 }
 public function availableVehicles(CarbonInterface $pickupAt,CarbonInterface $returnAt,?int $locationId=null,?int $categoryId=null){
  return Vehicle::query()->with(['brand','category','location','images','features'])->where('status','active')
   ->when($locationId,fn($q)=>$q->where('location_id',$locationId))->when($categoryId,fn($q)=>$q->where('category_id',$categoryId))
   ->whereDoesntHave('bookings',fn($q)=>$q->whereIn('status',self::BLOCKING_STATUSES)->where('pickup_at','<',$returnAt)->where('return_at','>',$pickupAt))
   ->orderByDesc('featured')->orderBy('sort_order')->get();
 }
}
