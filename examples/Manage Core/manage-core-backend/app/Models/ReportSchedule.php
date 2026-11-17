<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportSchedule extends Model
{
    protected $fillable = ['name', 'type', 'frequency', 'recipient_emails', 'last_run_at', 'next_run_at', 'is_active'];

    protected $casts = [
        'last_run_at' => 'datetime',
        'next_run_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
