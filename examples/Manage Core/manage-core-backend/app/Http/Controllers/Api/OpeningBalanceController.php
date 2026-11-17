<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OpeningBalance;
use Illuminate\Support\Facades\Auth;

class OpeningBalanceController extends Controller
{
    public function index(Request $request)
    {
        $q = OpeningBalance::query()->orderBy('created_at','desc');
        if ($request->get('account_id')) $q->where('account_id', $request->get('account_id'));
        return response()->json($q->paginate(max(10, (int)$request->get('per_page',25))));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'account_id' => 'required|integer',
            'amount' => 'required|numeric',
        ]);
        $payload = $request->only(['account_id','period_id','amount','currency','note','is_draft']);
        $payload['created_by'] = Auth::id();
        $ob = OpeningBalance::create($payload);
        return response()->json($ob,201);
    }

    public function show($id){ return response()->json(OpeningBalance::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $ob = OpeningBalance::findOrFail($id);
        $ob->fill($request->only(['period_id','amount','currency','note','is_draft']));
        $ob->save();
        return response()->json($ob);
    }

    public function destroy($id)
    {
        $ob = OpeningBalance::findOrFail($id);
        $ob->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
