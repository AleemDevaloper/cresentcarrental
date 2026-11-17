<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccountGroup;

class AccountGroupController extends Controller
{
    public function index(Request $request)
    {
        $q = AccountGroup::query();
        if ($request->get('q')) $q->where('name','like','%'.$request->get('q').'%');
        return response()->json($q->get());
    }

    public function store(Request $request)
    {
        $data = $request->only(['account_type_id','name','code','description']);
        $g = AccountGroup::create($data);
        return response()->json($g,201);
    }

    public function show($id){ return response()->json(AccountGroup::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $g = AccountGroup::findOrFail($id);
        $g->fill($request->only(['account_type_id','name','code','description']));
        $g->save();
        return response()->json($g);
    }

    public function destroy($id)
    {
        $g = AccountGroup::findOrFail($id);
        $g->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
