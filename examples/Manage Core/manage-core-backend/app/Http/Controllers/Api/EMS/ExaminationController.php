<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Examination;

class ExaminationController extends EmsResourceController
{
    protected string $model = Examination::class;
}