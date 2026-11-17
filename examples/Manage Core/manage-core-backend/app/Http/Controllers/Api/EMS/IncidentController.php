<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Incident;

class IncidentController extends EmsResourceController
{
    protected string $model = Incident::class;
}