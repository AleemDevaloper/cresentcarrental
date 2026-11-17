<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Vehicle;

class VehicleController extends EmsResourceController
{
    protected string $model = Vehicle::class;
}