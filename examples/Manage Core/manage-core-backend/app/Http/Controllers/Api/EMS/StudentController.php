<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Student;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends EmsResourceController
{
    protected string $model = Student::class;

    protected function transform(Model $student): Model
    {
        $student = $student instanceof Student ? $student : Student::find($student->id);
        if ($student->relationLoaded('program')) {
            $student->setAttribute('program_name', $student->program?->name);
        }
        $student->setAttribute('full_name', trim(($student->first_name ?? '') . ' ' . ($student->last_name ?? '')));
        return $student;
    }

    public function profile($id): JsonResponse
    {
        $student = Student::with(['program', 'institution'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $this->transform($student)]);
    }
}