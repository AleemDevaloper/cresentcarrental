<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Patient;

class PatientController extends EmsResourceController
{
    protected string $model = Patient::class;
}