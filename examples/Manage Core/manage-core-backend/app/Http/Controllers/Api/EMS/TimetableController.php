<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Timetable;

class TimetableController extends EmsResourceController
{
    protected string $model = Timetable::class;
}