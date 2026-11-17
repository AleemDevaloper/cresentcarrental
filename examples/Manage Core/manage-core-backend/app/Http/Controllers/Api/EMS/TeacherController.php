<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Teacher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TeacherController extends EmsResourceController
{
    protected string $model = Teacher::class;

    protected function mapInput(Request $request): array
    {
        $data = $request->all();
        if (isset($data['full_name']) && empty($data['first_name'])) {
            $name = explode(' ', trim($data['full_name']), 2);
            $data['first_name'] = $name[0] ?? '';
            $data['last_name'] = $name[1] ?? '';
        }
        return $data;
    }

    protected function transform(Model $model): Model
    {
        $teacher = $model instanceof Teacher ? $model : Teacher::find($model->id);
        $teacher->setAttribute('full_name', trim(($teacher->first_name ?? '') . ' ' . ($teacher->last_name ?? '')));
        return $teacher;
    }
}