<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\SettingsController as PublicSettingsController;
use App\Http\Controllers\Admin;

Route::prefix('v1')->group(function () {
    Route::get('/homepage', HomeController::class);
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/featured-vehicles', [VehicleController::class, 'featured']);
    Route::get('/vehicles/{slug}', [VehicleController::class, 'show']);
    Route::post('/availability', AvailabilityController::class)->middleware('throttle:60,1');
    Route::post('/pricing/quote', [PricingController::class, 'quote'])->middleware('throttle:90,1');
    Route::post('/bookings', [BookingController::class, 'store'])->middleware('throttle:20,1');
    Route::get('/bookings/reference/{reference}', [BookingController::class, 'byReference'])->middleware('throttle:60,1');
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1');
    Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:20,1');
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);
    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/locations/{slug}', [LocationController::class, 'show']);
    Route::get('/faqs', [FaqController::class, 'index']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/{slug}', [BlogController::class, 'show']);
    Route::get('/settings/public', [PublicSettingsController::class, 'public']);
    Route::post('/analytics/events', [AnalyticsController::class, 'store'])->middleware('throttle:180,1');

    Route::prefix('admin')->group(function () {
        Route::post('/login', [Admin\AuthController::class, 'login'])->middleware('throttle:6,1');
        Route::post('/forgot-password', [Admin\AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
        Route::post('/reset-password', [Admin\AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::post('/logout', [Admin\AuthController::class, 'logout']);
            Route::get('/dashboard', Admin\DashboardController::class);
            Route::get('/analytics', [Admin\DashboardController::class, 'analytics']);

            Route::apiResource('vehicles', Admin\VehicleController::class);
            Route::apiResource('vehicle-brands', Admin\VehicleBrandController::class);
            Route::apiResource('vehicle-categories', Admin\VehicleCategoryController::class);
            Route::apiResource('vehicle-features', Admin\VehicleFeatureController::class);
            Route::get('/bookings', [Admin\BookingController::class, 'index']);
            Route::get('/bookings/{booking}', [Admin\BookingController::class, 'show']);
            Route::get('/bookings/{booking}/timeline', [Admin\BookingController::class, 'timeline']);
            Route::patch('/bookings/{booking}', [Admin\BookingController::class, 'update']);

            Route::get('/contacts', [Admin\ContactController::class, 'index']);
            Route::patch('/contacts/{contact}', [Admin\ContactController::class, 'update']);
            Route::delete('/contacts/{contact}', [Admin\ContactController::class, 'destroy']);

            Route::apiResource('services', Admin\ServiceController::class);
            Route::apiResource('locations', Admin\LocationController::class);
            Route::apiResource('faqs', Admin\FaqController::class);
            Route::apiResource('reviews', Admin\ReviewController::class);
            Route::apiResource('blog-posts', Admin\BlogPostController::class);
            Route::apiResource('homepage-sections', Admin\HomepageSectionController::class);
            Route::apiResource('customers', Admin\CustomerController::class);
            Route::apiResource('leads', Admin\LeadController::class);
            Route::apiResource('pricing-rules', Admin\PricingRuleController::class);
            Route::apiResource('discounts', Admin\DiscountController::class);
            Route::apiResource('seo', Admin\SeoMetadataController::class);
            Route::apiResource('media', Admin\MediaController::class)->parameters(['media'=>'medium']);
            Route::apiResource('users', Admin\AdminUserController::class)->except(['show']);

            Route::get('/settings', [Admin\SettingsController::class, 'index']);
            Route::put('/settings', [Admin\SettingsController::class, 'update']);

            Route::get('/{type}', [Admin\UtilityController::class, 'collection'])
                ->whereIn('type', ['pricing','notifications','reports','activity']);
        });
    });
});
