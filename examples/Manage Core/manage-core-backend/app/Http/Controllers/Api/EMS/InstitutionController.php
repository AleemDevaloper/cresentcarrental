<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Institution;

class InstitutionController extends EmsResourceController
{
    protected string $model = Institution::class;
}