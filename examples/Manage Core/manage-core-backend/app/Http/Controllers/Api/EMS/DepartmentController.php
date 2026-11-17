<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Department;

class DepartmentController extends EmsResourceController
{
    protected string $model = Department::class;
}