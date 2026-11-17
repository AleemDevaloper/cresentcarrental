<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Event;

class EventController extends EmsResourceController
{
    protected string $model = Event::class;
}