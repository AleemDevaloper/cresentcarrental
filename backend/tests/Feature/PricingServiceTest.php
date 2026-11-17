<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use App\Services\PricingService;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class PricingServiceTest extends TestCase
{
    public function test_duration_pricing_prefers_weekly_rate_when_it_is_better(): void
    {
        $vehicle = new Vehicle(['daily_price'=>10000,'weekly_price'=>60000,'monthly_price'=>230000,'deposit'=>30000,'driver_fee'=>3000]);
        $quote = (new PricingService())->quote($vehicle, Carbon::parse('2026-09-01 10:00'), Carbon::parse('2026-09-08 10:00'));
        $this->assertSame(7, $quote['duration_days']);
        $this->assertSame(60000.0, $quote['base_price']);
    }
}
