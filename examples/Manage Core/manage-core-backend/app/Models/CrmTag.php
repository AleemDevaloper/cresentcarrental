<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmTag extends Model
{
    use SoftDeletes;

    protected $connection = 'tenant';
    protected $table = 'crm_tags';

    protected $fillable = [
        'name', 'slug', 'color', 'category', 'description', 'is_active', 'created_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function taggables()
    {
        return $this->hasMany(CrmTaggable::class, 'tag_id');
    }

    public static function findOrCreateByName(string $name, array $extra = []): self
    {
        $slug = \Illuminate\Support\Str::slug($name);
        return static::firstOrCreate(
            ['slug' => $slug],
            array_merge(['name' => $name, 'slug' => $slug], $extra)
        );
    }
}