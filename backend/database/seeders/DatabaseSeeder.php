<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingStatusHistory;
use App\Models\Customer;
use App\Models\Faq;
use App\Models\HomepageSection;
use App\Models\Location;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleBrand;
use App\Models\VehicleCategory;
use App\Models\VehicleFeature;
use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@crescentrentacar.com'],
            ['name' => 'Crescent Administrator', 'password' => Hash::make('ChangeMe123!'), 'role' => 'super_admin', 'is_active' => true]
        );

        $locations = collect([
            ['name' => 'Lahore', 'description' => 'Premium car rental and chauffeur options across Lahore.'],
            ['name' => 'Islamabad', 'description' => 'Reliable rental mobility for Islamabad and surrounding routes.'],
            ['name' => 'Hunza', 'description' => 'Travel-ready rental options for northern journeys.'],
            ['name' => 'Skardu', 'description' => 'Vehicle options designed for memorable northern travel.'],
        ])->mapWithKeys(function ($row, $i) {
            $location = Location::updateOrCreate(['slug' => Str::slug($row['name'])], $row + ['slug' => Str::slug($row['name']), 'status' => 'active', 'sort_order' => $i + 1]);
            return [$row['name'] => $location];
        });

        $categories = collect(['Economy', 'Sedan', 'SUV', 'Luxury'])->mapWithKeys(function ($name, $i) {
            $category = VehicleCategory::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'slug' => Str::slug($name), 'status' => 'active', 'sort_order' => $i + 1]);
            return [$name => $category];
        });

        $brands = collect(['Toyota', 'Audi', 'BMW', 'Mercedes-Benz'])->mapWithKeys(function ($name, $i) {
            $brand = VehicleBrand::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'slug' => Str::slug($name), 'status' => 'active', 'sort_order' => $i + 1]);
            return [$name => $brand];
        });

        $features = collect(['Air Conditioning', 'Bluetooth', 'Navigation', 'Leather Seats', 'Parking Sensors', 'Reverse Camera', 'Cruise Control'])
            ->mapWithKeys(fn ($name) => [$name => VehicleFeature::firstOrCreate(['name' => $name], ['status' => 'active'])]);

        $vehicleRows = [
            ['name'=>'Toyota Yaris','brand'=>'Toyota','model'=>'Yaris','year'=>2026,'category'=>'Economy','daily_price'=>8500,'weekly_price'=>55000,'monthly_price'=>195000,'deposit'=>30000,'seats'=>5,'doors'=>4,'location'=>'Lahore','featured'=>true],
            ['name'=>'Toyota Corolla','brand'=>'Toyota','model'=>'Corolla','year'=>2026,'category'=>'Sedan','daily_price'=>10000,'weekly_price'=>65000,'monthly_price'=>225000,'deposit'=>35000,'seats'=>5,'doors'=>4,'location'=>'Lahore','featured'=>true],
            ['name'=>'Toyota Fortuner','brand'=>'Toyota','model'=>'Fortuner','year'=>2026,'category'=>'SUV','daily_price'=>22000,'weekly_price'=>145000,'monthly_price'=>520000,'deposit'=>75000,'seats'=>7,'doors'=>5,'location'=>'Lahore','featured'=>true],
            ['name'=>'Audi A6','brand'=>'Audi','model'=>'A6','year'=>2025,'category'=>'Luxury','daily_price'=>35000,'weekly_price'=>225000,'monthly_price'=>790000,'deposit'=>120000,'seats'=>5,'doors'=>4,'location'=>'Islamabad','featured'=>true],
            ['name'=>'BMW 5 Series','brand'=>'BMW','model'=>'5 Series','year'=>2025,'category'=>'Luxury','daily_price'=>40000,'weekly_price'=>255000,'monthly_price'=>890000,'deposit'=>140000,'seats'=>5,'doors'=>4,'location'=>'Lahore','featured'=>true],
            ['name'=>'Mercedes-Benz E-Class','brand'=>'Mercedes-Benz','model'=>'E-Class','year'=>2025,'category'=>'Luxury','daily_price'=>45000,'weekly_price'=>285000,'monthly_price'=>990000,'deposit'=>150000,'seats'=>5,'doors'=>4,'location'=>'Islamabad','featured'=>true],
        ];

        $vehicles = collect($vehicleRows)->map(function ($row, $i) use ($locations, $categories, $brands, $features) {
            $vehicle = Vehicle::updateOrCreate(['slug' => Str::slug($row['name'])], [
                'name'=>$row['name'],'slug'=>Str::slug($row['name']),'brand_id'=>$brands[$row['brand']]->id,'model'=>$row['model'],'year'=>$row['year'],'category_id'=>$categories[$row['category']]->id,
                'transmission'=>'Automatic','fuel_type'=>in_array($row['name'],['Toyota Yaris','Toyota Corolla'])?'Petrol':'Petrol','seats'=>$row['seats'],'doors'=>$row['doors'],'mileage_policy'=>'Standard mileage policy',
                'daily_price'=>$row['daily_price'],'weekly_price'=>$row['weekly_price'],'monthly_price'=>$row['monthly_price'],'deposit'=>$row['deposit'],'driver_fee'=>3500,'extra_km_fee'=>75,'late_return_fee'=>2500,
                'driver_available'=>true,'self_drive_available'=>true,'location_id'=>$locations[$row['location']]->id,'short_description'=>'Premium comfort, professionally maintained and ready for your next journey.',
                'description'=>'A carefully maintained Crescent rental vehicle with a comfortable cabin, modern driving features and flexible booking options.','status'=>'active','featured'=>$row['featured'],'sort_order'=>$i+1,
            ]);
            $vehicle->features()->sync($features->take($row['category']==='Luxury'?7:5)->pluck('id'));
            return $vehicle;
        });

        $services = [
            ['Daily Car Rental','Flexible premium mobility for city days and short journeys.'],
            ['Monthly Car Rental','Long-term convenience with transparent monthly planning.'],
            ['Airport Transfers','Reliable airport pickup and drop-off service.'],
            ['Corporate Car Rental','Professional fleet solutions for teams, executives and guests.'],
            ['Travel Rentals','Comfortable rental options for intercity and leisure travel.'],
            ['Luxury Car Rental','Elevated vehicles for premium occasions and executive movement.'],
            ['Chauffeur Service','Professional driver service where available.'],
        ];
        foreach ($services as $i => [$title, $description]) {
            Service::updateOrCreate(['slug'=>Str::slug($title)], ['title'=>$title,'slug'=>Str::slug($title),'description'=>$description,'status'=>'active','sort_order'=>$i+1]);
        }

        HomepageSection::updateOrCreate(['key'=>'hero'], ['title'=>'DRIVE YOUR NEXT STORY.','subtitle'=>'Premium cars for every journey.','cta_text'=>'BOOK YOUR RIDE','cta_url'=>'/book','status'=>'active','sort_order'=>1]);
        HomepageSection::updateOrCreate(['key'=>'featured_vehicles'], ['title'=>'Choose the car that fits the moment.','subtitle'=>'A curated fleet for different journeys.','status'=>'active','sort_order'=>2]);
        HomepageSection::updateOrCreate(['key'=>'services'], ['title'=>'Built around the way you travel.','status'=>'active','sort_order'=>3]);

        $faqs = [
            ['How do I request a booking?','Select a vehicle, pickup and return details, enter your information and submit the booking form. The system will generate a unique booking reference.'],
            ['Can I rent with a driver?','Yes, where the selected vehicle is configured for chauffeur service. Driver fees are calculated by the pricing service.'],
            ['How does Crescent prevent double booking?','Availability is checked on the server against overlapping active bookings before a new booking is created.'],
            ['Do you offer weekly and monthly pricing?','Yes. Vehicles can have separate daily, weekly and monthly rates managed from the admin dashboard.'],
        ];
        foreach ($faqs as $i => [$question,$answer]) Faq::updateOrCreate(['question'=>$question], ['answer'=>$answer,'status'=>'active','sort_order'=>$i+1]);

        Review::updateOrCreate(['customer_name'=>'Ahsan R.'], ['rating'=>5,'review'=>'Smooth process, clean vehicle and clear communication from booking to handover.','location'=>'Lahore','status'=>'active','sort_order'=>1]);
        Review::updateOrCreate(['customer_name'=>'Mariam K.'], ['rating'=>5,'review'=>'The rental experience felt professional and straightforward, especially for a longer trip.','location'=>'Islamabad','status'=>'active','sort_order'=>2]);

        $settings = [
            'business_name'=>'Crescent Car Rental','phone'=>'+92 308 7923041','whatsapp'=>'923087923041','email'=>'info@crescentrentacar.com','website'=>'https://crescentrentacar.com','currency'=>'PKR','tagline'=>'Drive Your Next Story.'
        ];
        foreach ($settings as $key=>$value) WebsiteSetting::updateOrCreate(['key'=>$key], ['value'=>$value,'group'=>'general','is_public'=>true]);

        $customer = Customer::firstOrCreate(['phone'=>'+92 300 0000000'], ['full_name'=>'Sample Customer','email'=>'sample@example.com','address'=>'Lahore']);
        if (!Booking::where('reference','CR-2026-000001')->exists()) {
            $booking = Booking::create(['reference'=>'CR-2026-000001','customer_id'=>$customer->id,'vehicle_id'=>$vehicles->first()->id,'pickup_location_id'=>$locations['Lahore']->id,'dropoff_location_id'=>$locations['Lahore']->id,'pickup_location_text'=>'Lahore','dropoff_location_text'=>'Lahore','pickup_at'=>now()->addDays(3)->setTime(10,0),'return_at'=>now()->addDays(5)->setTime(10,0),'rental_type'=>'self_drive','duration_days'=>2,'base_price'=>17000,'additional_charges'=>0,'discount'=>0,'total_price'=>17000,'deposit'=>30000,'payment_status'=>'Payment Pending','status'=>'Pending','customer_notes'=>'Sample development booking']);
            BookingStatusHistory::create(['booking_id'=>$booking->id,'from_status'=>null,'to_status'=>'Pending','changed_by'=>$admin->id,'note'=>'Seeder sample booking','created_at'=>now()]);
        }
    }
}
