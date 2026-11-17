<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\WebsiteSetting;
class SettingsController extends Controller { public function public(){return response()->json(['data'=>WebsiteSetting::where('is_public',true)->pluck('value','key')]);} }
