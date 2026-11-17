<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Campus;

class CampusController extends EmsResourceController
{
    protected string $model = Campus::class;
}