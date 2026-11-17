<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class ContactSubmission extends Model { protected $fillable=['name','email','phone','subject','message','status','admin_notes','read_at','contacted_at','archived_at']; protected function casts():array{return ['read_at'=>'datetime','contacted_at'=>'datetime','archived_at'=>'datetime'];} }
