<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\ParentModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ParentController extends EmsResourceController
{
    protected string $model = ParentModel::class;

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
        $parent = $model instanceof ParentModel ? $model : ParentModel::find($model->id);
        $parent->setAttribute('full_name', trim(($parent->first_name ?? '') . ' ' . ($parent->last_name ?? '')));
        return $parent;
    }
}