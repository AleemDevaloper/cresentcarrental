<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Facility;

class FacilityController extends EmsResourceController
{
    protected string $model = Facility::class;
}