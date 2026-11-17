<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Building;

class BuildingController extends EmsResourceController
{
    protected string $model = Building::class;
}