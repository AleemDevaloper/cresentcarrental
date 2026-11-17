<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;
class HomepageSection extends Model { protected $fillable=['key','title','subtitle','content','media_path','cta_text','cta_url','settings','status','sort_order']; protected function casts():array{return ['settings'=>'array'];} }
