<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmCustomFieldValue extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_custom_field_values';

    protected $fillable = [
        'custom_field_id', 'entity_type', 'entity_id', 'value',
    ];

    public function field()
    {
        return $this->belongsTo(CrmCustomField::class, 'custom_field_id');
    }
}