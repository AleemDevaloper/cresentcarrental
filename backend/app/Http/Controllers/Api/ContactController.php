<?php
namespace App\Http\Controllers\Api;use App\Http\Controllers\Controller;use App\Models\ContactSubmission;use Illuminate\Http\Request;
class ContactController extends Controller { public function store(Request $r){$d=$r->validate(['name'=>'required|string|max:150','email'=>'nullable|email|max:190','phone'=>'required|string|max:40','subject'=>'nullable|string|max:190','message'=>'required|string|max:5000']);$c=ContactSubmission::create($d+['status'=>'New']);return response()->json(['message'=>'Your message has been received.','data'=>$c],201);} }
