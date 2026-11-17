<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccountType;

class AccountTypeController extends Controller
{
    public function index(Request $request)
    {
        $q = AccountType::query();
        if ($request->get('q')) $q->where('name','like','%'.$request->get('q').'%');
        return response()->json($q->get());
    }

    public function store(Request $request)
    {
        $data = $request->only(['name','code','description']);
        $t = AccountType::create($data);
        return response()->json($t,201);
    }

    public function show($id){ return response()->json(AccountType::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $t = AccountType::findOrFail($id);
        $t->fill($request->only(['name','code','description']));
        $t->save();
        return response()->json($t);
    }

    public function destroy($id)
    {
        $t = AccountType::findOrFail($id);
        $t->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
