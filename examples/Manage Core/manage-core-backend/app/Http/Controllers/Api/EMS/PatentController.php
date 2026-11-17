<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Patent;

class PatentController extends EmsResourceController
{
    protected string $model = Patent::class;
}