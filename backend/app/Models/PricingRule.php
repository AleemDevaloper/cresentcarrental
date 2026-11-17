<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class PricingRule extends Model { protected $fillable=['name','type','vehicle_id','category_id','location_id','starts_at','ends_at','days_of_week','amount','percentage','priority','status','conditions']; protected function casts():array{return ['starts_at'=>'datetime','ends_at'=>'datetime','days_of_week'=>'array','conditions'=>'array','amount'=>'decimal:2','percentage'=>'decimal:2'];} }
