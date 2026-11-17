<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class Review extends Model { protected $fillable=['customer_name','customer_image','rating','review','location','status','sort_order']; }
