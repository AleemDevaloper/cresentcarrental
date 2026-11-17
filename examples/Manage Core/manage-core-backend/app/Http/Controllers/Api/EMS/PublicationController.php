<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Publication;

class PublicationController extends EmsResourceController
{
    protected string $model = Publication::class;
}