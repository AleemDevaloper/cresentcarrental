<?php
namespace App\Services;use App\Models\ActivityLog;use Illuminate\Database\Eloquent\Model;use Illuminate\Http\Request;
class ActivityLogService { public static function record(string $action,?Model $subject=null,?array $old=null,?array $new=null,?Request $request=null,?string $description=null):void { ActivityLog::create(['user_id'=>auth()->id(),'action'=>$action,'subject_type'=>$subject?->getMorphClass(),'subject_id'=>$subject?->getKey(),'description'=>$description,'old_values'=>$old,'new_values'=>$new,'ip_address'=>$request?->ip(),'user_agent'=>$request?->userAgent()]); } }
