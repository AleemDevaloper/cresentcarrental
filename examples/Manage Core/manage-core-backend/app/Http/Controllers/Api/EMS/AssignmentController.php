<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Assignment;

class AssignmentController extends EmsResourceController
{
    protected string $model = Assignment::class;
}