<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Grade;

class GradeController extends EmsResourceController
{
    protected string $model = Grade::class;
}