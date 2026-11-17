<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class Location extends Model { protected $fillable=['name','slug','description','image','address','phone','service_availability','latitude','longitude','seo_title','seo_description','status','sort_order']; protected function casts():array{return ['service_availability'=>'array'];} public function vehicles(){return $this->hasMany(Vehicle::class);} }
