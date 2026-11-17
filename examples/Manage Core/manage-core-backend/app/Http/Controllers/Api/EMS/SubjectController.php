<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Subject;

class SubjectController extends EmsResourceController
{
    protected string $model = Subject::class;
}