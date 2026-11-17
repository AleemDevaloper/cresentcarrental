<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\Location;
class LocationController extends Controller { public function index(){return response()->json(['data'=>Location::where('status','active')->orderBy('sort_order')->get()]);} public function show(string $slug){return response()->json(['data'=>Location::where('slug',$slug)->firstOrFail()]);} }
