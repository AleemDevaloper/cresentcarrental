<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class BlogPost extends Model { protected $fillable=['title','slug','featured_image','excerpt','content','author','category','tags','seo_title','seo_description','published_at','status']; protected function casts():array{return ['tags'=>'array','published_at'=>'datetime'];} }
