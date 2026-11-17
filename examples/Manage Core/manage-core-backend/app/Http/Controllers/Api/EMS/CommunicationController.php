<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Communication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunicationController extends EmsResourceController
{
    protected string $model = Communication::class;

    public function send(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['status'] = $data['status'] ?? 'sent';
        $data['sent_at'] = $data['sent_at'] ?? now();
        $communication = Communication::create($data);
        return response()->json([
            'success' => true,
            'message' => 'Sent',
            'data' => $communication,
        ], 201);
    }
}