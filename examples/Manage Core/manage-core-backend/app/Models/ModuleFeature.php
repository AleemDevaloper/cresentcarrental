<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleFeature extends Model
{
    protected $connection = 'mysql';

    protected $fillable = ['module_id', 'name', 'code', 'description', 'is_enabled'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
