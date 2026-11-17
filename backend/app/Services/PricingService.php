<?php
namespace App\Services;
use App\Models\Vehicle;use Carbon\CarbonInterface;use InvalidArgumentException;
class PricingService {
 public function quote(Vehicle $vehicle,CarbonInterface $pickupAt,CarbonInterface $returnAt,string $rentalType='self_drive'):array {
  if($returnAt->lessThanOrEqualTo($pickupAt)) throw new InvalidArgumentException('Return date/time must be after pickup date/time.');
  $minutes=abs($pickupAt->diffInMinutes($returnAt));
  $days=max(1,(int)ceil($minutes/1440));
  $base=$this->durationPrice($vehicle,$days);
  $additional=0.0;
  if($rentalType==='with_driver') $additional+=(float)$vehicle->driver_fee*$days;
  $discount=0.0;
  $total=max(0,$base+$additional-$discount);
  return ['duration_days'=>$days,'base_price'=>round($base,2),'additional_charges'=>round($additional,2),'discount'=>round($discount,2),'deposit'=>(float)$vehicle->deposit,'total'=>round($total,2),'currency'=>'PKR'];
 }
 private function durationPrice(Vehicle $vehicle,int $days):float {
  $daily=(float)$vehicle->daily_price;
  $weekly=(float)($vehicle->weekly_price?:$daily*7);
  $monthly=(float)($vehicle->monthly_price?:$weekly*4);
  $dp=array_fill(0,$days+1,INF);$dp[0]=0.0;
  for($i=0;$i<=$days;$i++){
   if(!is_finite($dp[$i]))continue;
   if($i+1<=$days)$dp[$i+1]=min($dp[$i+1],$dp[$i]+$daily);
   if($i+7<=$days)$dp[$i+7]=min($dp[$i+7],$dp[$i]+$weekly);
   if($i+30<=$days)$dp[$i+30]=min($dp[$i+30],$dp[$i]+$monthly);
  }
  return (float)$dp[$days];
 }
}
