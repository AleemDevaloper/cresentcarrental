<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Admission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdmissionController extends EmsResourceController
{
    protected string $model = Admission::class;

    protected function mapInput(Request $request): array
    {
        $data = $request->all();

        if (isset($data['application_no']) && empty($data['admission_number'])) {
            $data['admission_number'] = $data['application_no'];
        }
        unset($data['application_no']);

        if (isset($data['student_name']) && empty($data['first_name'])) {
            $name = explode(' ', trim($data['student_name']), 2);
            $data['first_name'] = $name[0] ?? '';
            $data['last_name'] = $name[1] ?? '';
        }
        unset($data['student_name']);

        if (isset($data['student_email'])) {
            $data['email'] = $data['student_email'];
            unset($data['student_email']);
        }
        if (isset($data['student_phone'])) {
            $data['phone'] = $data['student_phone'];
            unset($data['student_phone']);
        }
        if (isset($data['documents']) && !isset($data['remarks'])) {
            $data['remarks'] = $data['documents'];
        }
        unset($data['documents']);

        if (empty($data['admission_number'])) {
            $data['admission_number'] = 'APP-' . Str::upper(Str::random(6));
        }

        return $data;
    }

    protected function transform(Model $model): Model
    {
        $admission = $model instanceof Admission ? $model : Admission::find($model->id);
        $admission->setAttribute('application_no', $admission->admission_number);
        $admission->setAttribute('student_name', trim(($admission->first_name ?? '') . ' ' . ($admission->last_name ?? '')));
        $admission->setAttribute('student_email', $admission->email);
        $admission->setAttribute('student_phone', $admission->phone);
        $admission->setAttribute('program_name', $admission->program?->name);
        return $admission;
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $admission = Admission::findOrFail($id);
        $admission->update(['status' => $request->get('status', $admission->status)]);
        return response()->json(['success' => true, 'message' => 'Status updated', 'data' => $this->transform($admission->fresh())]);
    }

    public function comments($id): JsonResponse
    {
        $admission = Admission::findOrFail($id);
        $decoded = json_decode((string) $admission->remarks, true);
        $comments = is_array($decoded) && isset($decoded['comments']) ? $decoded['comments'] : [];
        return response()->json(['success' => true, 'data' => $comments]);
    }

    public function addComment(Request $request, $id): JsonResponse
    {
        $admission = Admission::findOrFail($id);
        $decoded = json_decode((string) $admission->remarks, true);
        $comments = is_array($decoded) && isset($decoded['comments']) ? $decoded['comments'] : [];
        $comments[] = [
            'id' => count($comments) + 1,
            'body' => $request->get('comment') ?? $request->get('body') ?? '',
            'created_at' => now()->toDateTimeString(),
        ];
        $admission->update(['remarks' => json_encode(['comments' => $comments])]);
        return response()->json(['success' => true, 'message' => 'Comment added', 'data' => $comments]);
    }
}