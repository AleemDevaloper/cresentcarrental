<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Semester;

class SemesterController extends EmsResourceController
{
    protected string $model = Semester::class;
}