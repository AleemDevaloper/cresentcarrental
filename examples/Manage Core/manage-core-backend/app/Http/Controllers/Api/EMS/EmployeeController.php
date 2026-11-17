<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class EmployeeController extends EmsResourceController
{
    protected string $model = Employee::class;

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
        $employee = $model instanceof Employee ? $model : Employee::find($model->id);
        $employee->setAttribute('full_name', trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? '')));
        return $employee;
    }
}