<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Medicine;

class MedicineController extends EmsResourceController
{
    protected string $model = Medicine::class;
}