<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Program;

class ProgramController extends EmsResourceController
{
    protected string $model = Program::class;
}