<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\Review;
class ReviewController extends Controller { public function index(){return response()->json(['data'=>Review::where('status','active')->orderBy('sort_order')->get()]);} }
