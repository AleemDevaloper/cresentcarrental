<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends EmsResourceController
{
    protected string $model = Certificate::class;

    protected function mapInput(Request $request): array
    {
        $data = $request->all();
        if (empty($data['certificate_number'])) {
            $data['certificate_number'] = 'CERT-' . Str::upper(Str::random(8));
        }
        return $data;
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['certificate_number'] = $data['certificate_number'] ?? 'CERT-' . Str::upper(Str::random(8));
        $data['status'] = 'generated';
        $certificate = Certificate::create($data);
        return response()->json(['success' => true, 'message' => 'Generated', 'data' => $certificate], 201);
    }
}