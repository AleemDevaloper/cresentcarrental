<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmCustomField;
use App\Models\CrmCustomFieldValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmCustomFieldController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrmCustomField::query();
        if ($request->filled('entity_type')) $query->where('entity_type', $request->input('entity_type'));
        $query->orderBy('sort_order');
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|in:lead,contact,customer,deal,task',
            'name' => 'required|string|max:100',
            'label' => 'required|string|max:255',
            'type' => 'required|in:text,textarea,number,currency,date,datetime,dropdown,multi_select,radio,checkbox,url,email,phone',
            'options' => 'nullable|array',
            'is_required' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);
        $validated['created_by'] = auth()->id();
        $field = CrmCustomField::create($validated);
        return response()->json(['success' => true, 'data' => $field], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $field = CrmCustomField::findOrFail($id);
        $validated = $request->validate([
            'label' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:text,textarea,number,currency,date,datetime,dropdown,multi_select,radio,checkbox,url,email,phone',
            'options' => 'nullable|array',
            'is_required' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);
        $field->update($validated);
        return response()->json(['success' => true, 'data' => $field->fresh()]);
    }

    public function destroy($id): JsonResponse
    {
        $field = CrmCustomField::findOrFail($id);
        CrmCustomFieldValue::where('custom_field_id', $field->id)->delete();
        $field->delete();
        return response()->json(['success' => true, 'message' => 'Field deleted']);
    }

    public function saveValues(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
            'values' => 'required|array',
        ]);
        DB::connection('tenant')->transaction(function () use ($validated) {
            foreach ($validated['values'] as $fieldId => $value) {
                CrmCustomFieldValue::updateOrCreate(
                    [
                        'custom_field_id' => $fieldId,
                        'entity_type' => $validated['entity_type'],
                        'entity_id' => $validated['entity_id'],
                    ],
                    ['value' => is_array($value) ? json_encode($value) : $value]
                );
            }
        });
        return response()->json(['success' => true]);
    }

    public function getValues(Request $request): JsonResponse
    {
        $entity_type = $request->input('entity_type');
        $entity_id = $request->input('entity_id');
        $values = CrmCustomFieldValue::where('entity_type', $entity_type)
            ->where('entity_id', $entity_id)
            ->get()
            ->pluck('value', 'custom_field_id');
        return response()->json(['success' => true, 'data' => $values]);
    }
}