<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\MaintenanceRequest;

class MaintenanceController extends EmsResourceController
{
    protected string $model = MaintenanceRequest::class;
}