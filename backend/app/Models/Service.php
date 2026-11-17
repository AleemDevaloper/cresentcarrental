<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class Service extends Model { protected $fillable=['title','slug','description','icon','image','price_information','status','sort_order','seo_title','seo_description']; }
