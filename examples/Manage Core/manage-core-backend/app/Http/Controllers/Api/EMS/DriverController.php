<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Driver;

class DriverController extends EmsResourceController
{
    protected string $model = Driver::class;
}