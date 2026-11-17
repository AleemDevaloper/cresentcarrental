<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class VehicleCategory extends Model { protected $fillable=['name','slug','description','status','sort_order']; public function vehicles(){return $this->hasMany(Vehicle::class,'category_id');} }
