<?php
namespace App\Services;
use App\Models\Booking;use App\Models\BookingStatusHistory;use App\Models\Customer;use App\Models\Location;use App\Models\Vehicle;use Carbon\Carbon;use Illuminate\Support\Facades\DB;use Illuminate\Validation\ValidationException;use Illuminate\Support\Facades\Notification;use App\Models\User;use App\Notifications\AdminNewBookingNotification;use App\Notifications\CustomerBookingReceivedNotification;use App\Notifications\CustomerBookingStatusNotification;
class BookingService {
 public function __construct(private AvailabilityService $availability,private PricingService $pricing){}
 public function create(array $data):Booking {
  $booking=DB::transaction(function() use($data){
   /** @var Vehicle $vehicle */$vehicle=Vehicle::query()->lockForUpdate()->findOrFail($data['vehicle_id']);
   if($vehicle->status!=='active')throw ValidationException::withMessages(['vehicle_id'=>'This vehicle is not currently available for booking.']);
   $pickup=Carbon::parse($data['pickup_date'].' '.($data['pickup_time']??'10:00'));
   $return=Carbon::parse($data['return_date'].' '.($data['return_time']??'10:00'));
   if(!$this->availability->isVehicleAvailable($vehicle,$pickup,$return))throw ValidationException::withMessages(['vehicle_id'=>'This vehicle has another active booking during the selected period.']);
   if(($data['rental_type']??'self_drive')==='with_driver'&&!$vehicle->driver_available)throw ValidationException::withMessages(['rental_type'=>'This vehicle is not available with a driver.']);
   if(($data['rental_type']??'self_drive')==='self_drive'&&!$vehicle->self_drive_available)throw ValidationException::withMessages(['rental_type'=>'This vehicle is not available for self drive.']);
   $customer=Customer::updateOrCreate(['phone'=>$data['phone']],['full_name'=>$data['full_name'],'email'=>$data['email']??null,'cnic'=>$data['cnic']??null,'address'=>$data['address']??null]);
   $quote=$this->pricing->quote($vehicle,$pickup,$return,$data['rental_type']??'self_drive');
   $pickupLocation=$this->findLocation($data['pickup_location']??null);$dropoffLocation=$this->findLocation($data['dropoff_location']??null);
   $booking=Booking::create(['reference'=>$this->nextReference(),'customer_id'=>$customer->id,'vehicle_id'=>$vehicle->id,'pickup_location_id'=>$pickupLocation?->id,'dropoff_location_id'=>$dropoffLocation?->id,'pickup_location_text'=>$data['pickup_location']??null,'dropoff_location_text'=>$data['dropoff_location']??null,'pickup_at'=>$pickup,'return_at'=>$return,'rental_type'=>$data['rental_type']??'self_drive','duration_days'=>$quote['duration_days'],'base_price'=>$quote['base_price'],'additional_charges'=>$quote['additional_charges'],'discount'=>$quote['discount'],'total_price'=>$quote['total'],'deposit'=>$quote['deposit'],'payment_status'=>'Payment Pending','status'=>'Pending','customer_notes'=>$data['notes']??null]);
   BookingStatusHistory::create(['booking_id'=>$booking->id,'from_status'=>null,'to_status'=>'Pending','note'=>'Booking Created','created_at'=>now()]);
   return $booking->load(['customer','vehicle','pickupLocation','dropoffLocation','statusHistory']);
  },3);
  try {
   $admins=User::where('is_active',true)->whereIn('role',['admin','super_admin'])->get();
   if($admins->isNotEmpty()) Notification::send($admins,new AdminNewBookingNotification($booking));
   if($booking->customer?->email) Notification::route('mail',$booking->customer->email)->notify(new CustomerBookingReceivedNotification($booking));
  } catch (\Throwable $e) { report($e); }
  return $booking;
 }
 public function changeStatus(Booking $booking,string $status,?int $userId=null,?string $note=null):Booking {
  $allowed=['Pending','Confirmed','In Progress','Completed','Cancelled','Rejected']; if(!in_array($status,$allowed,true))throw ValidationException::withMessages(['status'=>'Invalid booking status.']);
  $old=$booking->status;
  $updated=DB::transaction(function()use($booking,$status,$userId,$note,$old){$booking->update(['status'=>$status]);BookingStatusHistory::create(['booking_id'=>$booking->id,'from_status'=>$old,'to_status'=>$status,'changed_by'=>$userId,'note'=>$note,'created_at'=>now()]);return $booking->fresh(['customer','vehicle','pickupLocation','dropoffLocation','statusHistory']);});
  try { if($updated->customer?->email) Notification::route('mail',$updated->customer->email)->notify(new CustomerBookingStatusNotification($updated,$old)); } catch (\Throwable $e) { report($e); }
  return $updated;
 }
 private function findLocation(?string $value):?Location { if(!$value)return null; return Location::query()->where('name',$value)->orWhere('slug',$value)->first(); }
 private function nextReference():string { $year=now()->year;DB::table('booking_sequences')->insertOrIgnore(['year'=>$year,'last_number'=>0,'created_at'=>now(),'updated_at'=>now()]);$row=DB::table('booking_sequences')->where('year',$year)->lockForUpdate()->first();$next=((int)$row->last_number)+1;DB::table('booking_sequences')->where('year',$year)->update(['last_number'=>$next,'updated_at'=>now()]);return "CR-$year-".str_pad((string)$next,6,'0',STR_PAD_LEFT); }
}
