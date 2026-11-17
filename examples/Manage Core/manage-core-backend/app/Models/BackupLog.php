<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BackupLog extends Model
{
    protected $fillable = ['status', 'file_path', 'file_size', 'type', 'error_message'];
}
