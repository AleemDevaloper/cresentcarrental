<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\Service;
class ServiceController extends Controller { public function index(){return response()->json(['data'=>Service::where('status','active')->orderBy('sort_order')->get()]);} public function show(string $slug){return response()->json(['data'=>Service::where('slug',$slug)->firstOrFail()]);} }
