<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmTaggable extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_taggables';

    public $timestamps = true;

    protected $fillable = [
        'tag_id', 'taggable_type', 'taggable_id', 'created_by',
    ];

    public function tag()
    {
        return $this->belongsTo(CrmTag::class, 'tag_id');
    }

    public function taggable()
    {
        return $this->morphTo();
    }
}