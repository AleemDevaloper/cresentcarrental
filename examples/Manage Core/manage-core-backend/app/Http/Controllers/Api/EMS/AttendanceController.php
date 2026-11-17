<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Attendance;

class AttendanceController extends EmsResourceController
{
    protected string $model = Attendance::class;
}