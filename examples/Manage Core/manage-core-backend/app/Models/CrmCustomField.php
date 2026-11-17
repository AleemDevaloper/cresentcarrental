<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmCustomField extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_custom_fields';

    protected $fillable = [
        'entity_type', 'name', 'label', 'type', 'options',
        'is_required', 'sort_order', 'is_active', 'created_by'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function values()
    {
        return $this->hasMany(CrmCustomFieldValue::class, 'custom_field_id');
    }
}