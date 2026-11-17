<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class VehicleFeature extends Model { protected $fillable=['name','icon','status']; public function vehicles(){return $this->belongsToMany(Vehicle::class, 'vehicle_feature_vehicle');} }
