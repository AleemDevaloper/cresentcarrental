<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Booking;

class BookingController extends EmsResourceController
{
    protected string $model = Booking::class;
}