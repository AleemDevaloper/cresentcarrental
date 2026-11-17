<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmDealStageHistory extends Model
{
    protected $connection = 'tenant';
    protected $table = 'crm_deal_stage_history';

    public $timestamps = true;

    protected $fillable = [
        'deal_id', 'from_stage', 'to_stage', 'from_probability',
        'to_probability', 'moved_by', 'note',
    ];

    public function deal()
    {
        return $this->belongsTo(CrmDeal::class, 'deal_id');
    }

    public function movedByUser()
    {
        return $this->belongsTo(User::class, 'moved_by');
    }
}