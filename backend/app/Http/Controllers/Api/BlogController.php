<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\BlogPost;
class BlogController extends Controller { public function index(){return response()->json(BlogPost::where('status','published')->where(fn($q)=>$q->whereNull('published_at')->orWhere('published_at','<=',now()))->latest('published_at')->paginate(12));} public function show(string $slug){return response()->json(['data'=>BlogPost::where('slug',$slug)->where('status','published')->firstOrFail()]);} }
