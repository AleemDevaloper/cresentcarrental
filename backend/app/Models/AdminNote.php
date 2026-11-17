<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;class AdminNote extends Model { protected $fillable=['noteable_type','noteable_id','user_id','note']; public function noteable(){return $this->morphTo();} public function user(){return $this->belongsTo(User::class);} }
