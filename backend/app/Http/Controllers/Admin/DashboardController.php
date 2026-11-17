<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;use App\Models\Booking;use App\Models\ContactSubmission;use App\Models\Lead;use App\Models\Vehicle;
use App\Models\WebsiteAnalyticsEvent;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller {
 public function __invoke(){
   $periodStart=now()->subMonths(11)->startOfMonth();
   $bookingQuery=Booking::query();
   $totalVehicles=Vehicle::count();
   $activeVehicles=Vehicle::where('status','active')->count();
   return response()->json(['data'=>[
     'stats'=>[
       'total_bookings'=>(clone $bookingQuery)->count(),
       'pending_bookings'=>(clone $bookingQuery)->where('status','Pending')->count(),
       'confirmed_bookings'=>(clone $bookingQuery)->where('status','Confirmed')->count(),
       'active_rentals'=>(clone $bookingQuery)->where('status','In Progress')->count(),
       'completed_rentals'=>(clone $bookingQuery)->where('status','Completed')->count(),
       'total_revenue'=>(float)(clone $bookingQuery)->whereIn('status',['Confirmed','In Progress','Completed'])->sum('total_price'),
       'completed_revenue'=>(float)(clone $bookingQuery)->where('status','Completed')->sum('total_price'),
       'available_vehicles'=>$activeVehicles,
       'total_vehicles'=>$totalVehicles,
       'fleet_utilization'=>$totalVehicles?round(((float)$totalVehicles-$activeVehicles)/(float)$totalVehicles*100,1):0,
       'new_contacts'=>ContactSubmission::where('status','New')->count(),
       'new_leads'=>Lead::where('status','New')->count(),
     ],
     'booking_statuses'=>(clone $bookingQuery)->select('status',DB::raw('COUNT(*) as total'))->groupBy('status')->orderByDesc('total')->get(),
     'monthly_performance'=>(clone $bookingQuery)->where('created_at','>=',$periodStart)->select(DB::raw("DATE_FORMAT(created_at, '%b') as month"),DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),DB::raw('COUNT(*) as bookings'),DB::raw('COALESCE(SUM(total_price),0) as revenue'))->groupBy('period','month')->orderBy('period')->get(),
     'fleet_statuses'=>Vehicle::select('status',DB::raw('COUNT(*) as total'))->groupBy('status')->orderByDesc('total')->get(),
     'recent_bookings'=>Booking::with(['customer','vehicle'])->latest()->limit(8)->get(),
     'recent_contacts'=>ContactSubmission::latest()->limit(5)->get(),
     'recent_leads'=>Lead::latest()->limit(5)->get()
   ]]);
 }

 public function analytics(){
   $events=WebsiteAnalyticsEvent::where('occurred_at','>=',now()->subDays(30));
   return response()->json(['data'=>[
     'stats'=>[
       'page_views'=>(clone $events)->where('event_name','page_view')->count(),
       'unique_sessions'=>(clone $events)->distinct('session_id')->count('session_id'),
       'cta_clicks'=>(clone $events)->whereIn('event_name',['button_click','cta_click'])->count(),
       'blog_reads'=>(clone $events)->where('event_name','blog_read')->count(),
     ],
     'top_pages'=>(clone $events)->where('event_name','page_view')->select('page_path',DB::raw('COUNT(*) as views'))->groupBy('page_path')->orderByDesc('views')->limit(10)->get(),
     'top_actions'=>(clone $events)->whereIn('event_name',['button_click','cta_click'])->select('target_label',DB::raw('COUNT(*) as clicks'))->groupBy('target_label')->orderByDesc('clicks')->limit(10)->get(),
     'daily_views'=>(clone $events)->where('event_name','page_view')->select(DB::raw('DATE(occurred_at) as day'),DB::raw('COUNT(*) as views'))->groupBy('day')->orderBy('day')->get(),
   ]]);
 }
}
