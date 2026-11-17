<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = ['name', 'sku', 'category', 'unit', 'description'];

    public function costs(): HasMany
    {
        return $this->hasMany(InventoryCost::class);
    }
}
