<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Course;

class CourseController extends EmsResourceController
{
    protected string $model = Course::class;
}