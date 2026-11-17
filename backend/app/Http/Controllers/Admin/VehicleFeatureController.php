<?php
namespace App\Http\Controllers\Admin;
class VehicleFeatureController extends CrudController {
 protected string $model = \App\Models\VehicleFeature::class;
 protected array $rules = [
  'name' => 'required|string|max:255',
  'icon' => 'nullable|string|max:255',
  'status' => 'required|in:active,inactive',
 ];
}
