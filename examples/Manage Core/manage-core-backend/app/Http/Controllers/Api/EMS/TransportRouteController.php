<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\TransportRoute;

class TransportRouteController extends EmsResourceController
{
    protected string $model = TransportRoute::class;
}