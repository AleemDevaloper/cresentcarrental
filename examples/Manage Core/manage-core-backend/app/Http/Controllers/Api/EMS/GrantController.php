<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Grant;

class GrantController extends EmsResourceController
{
    protected string $model = Grant::class;
}