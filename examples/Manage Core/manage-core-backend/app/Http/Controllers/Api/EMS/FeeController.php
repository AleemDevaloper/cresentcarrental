<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Fee;
use Illuminate\Http\Request;

class FeeController extends EmsResourceController
{
    protected string $model = Fee::class;

    protected function mapInput(Request $request): array
    {
        $data = $request->all();
        if (isset($data['amount']) && !isset($data['total_amount'])) {
            $discount = (float) ($data['discount'] ?? 0);
            $fine = (float) ($data['fine'] ?? 0);
            $data['total_amount'] = max(0, (float) $data['amount'] - $discount + $fine);
        }
        return $data;
    }
}