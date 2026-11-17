<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;class SeoMetadata extends Model { protected $table='seo_metadata'; protected $fillable=['route','seo_title','meta_description','canonical_url','og_title','og_description','og_image','twitter_card','structured_data']; protected function casts():array{return ['structured_data'=>'array'];} }
