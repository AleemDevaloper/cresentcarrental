<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Room;

class RoomController extends EmsResourceController
{
    protected string $model = Room::class;
}