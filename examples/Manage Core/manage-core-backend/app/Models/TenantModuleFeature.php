<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantModuleFeature extends Model
{
    protected $connection = 'mysql';

    protected $fillable = ['tenant_id', 'module_feature_id', 'is_enabled'];
}
