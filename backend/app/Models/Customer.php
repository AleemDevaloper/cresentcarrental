<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class Customer extends Model { protected $fillable=['full_name','phone','email','cnic','address','notes']; public function bookings(){return $this->hasMany(Booking::class);} }
