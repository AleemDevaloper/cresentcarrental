<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $q = Account::query()->orderBy('code');
        if ($request->get('q')) $q->where('name','like','%'.$request->get('q').'%')->orWhere('code','like','%'.$request->get('q').'%');
        return response()->json($q->paginate(max(10,(int)$request->get('per_page',25))));
    }

    public function store(Request $request)
    {
        $data = $request->only(['account_group_id','account_type_id','parent_id','code','name','opening_balance','normal_balance','is_contra','is_draft']);
        $a = Account::create($data);
        return response()->json($a,201);
    }

    public function show($id){ return response()->json(Account::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $a = Account::findOrFail($id);
        $a->fill($request->only(['account_group_id','account_type_id','parent_id','code','name','opening_balance','normal_balance','is_contra','is_draft']));
        $a->save();
        return response()->json($a);
    }

    public function destroy($id)
    {
        $a = Account::findOrFail($id);
        $a->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
