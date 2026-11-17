<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;class Discount extends Model { protected $fillable=['name','code','type','value','starts_at','ends_at','usage_limit','used_count','status']; protected function casts():array{return ['starts_at'=>'datetime','ends_at'=>'datetime','value'=>'decimal:2'];} }
