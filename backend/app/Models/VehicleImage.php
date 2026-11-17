<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class VehicleImage extends Model { protected $fillable=['vehicle_id','path','alt_text','sort_order','is_primary']; protected function casts():array{return ['is_primary'=>'boolean'];} public function vehicle(){return $this->belongsTo(Vehicle::class);} }
