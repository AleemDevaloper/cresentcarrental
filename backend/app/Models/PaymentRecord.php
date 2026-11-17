<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;class PaymentRecord extends Model { protected $fillable=['booking_id','provider','transaction_reference','amount','status','meta']; protected function casts():array{return ['amount'=>'decimal:2','meta'=>'array'];} public function booking(){return $this->belongsTo(Booking::class);} }
