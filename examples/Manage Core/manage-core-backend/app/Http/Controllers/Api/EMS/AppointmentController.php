<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Appointment;

class AppointmentController extends EmsResourceController
{
    protected string $model = Appointment::class;
}