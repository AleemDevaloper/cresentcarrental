<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class BookingStatusHistory extends Model { public $timestamps=false; protected $table='booking_status_history'; protected $fillable=['booking_id','from_status','to_status','changed_by','note','created_at']; protected function casts():array{return ['created_at'=>'datetime'];} public function booking(){return $this->belongsTo(Booking::class);} public function admin(){return $this->belongsTo(User::class,'changed_by');} }
