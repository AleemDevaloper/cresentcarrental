<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Period;
use Illuminate\Support\Facades\Auth;

class PeriodController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 25);
        $q = Period::query()->orderBy('start_date', 'desc');
        if ($fy = $request->get('fiscal_year_id')) $q->where('fiscal_year_id', $fy);
        return response()->json($q->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->only(['fiscal_year_id','name','start_date','end_date','is_open','is_draft']);
        $p = Period::create($data);
        return response()->json($p, 201);
    }

    public function show($id) { return response()->json(Period::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $p = Period::findOrFail($id);
        $p->fill($request->only(['name','start_date','end_date','is_open','is_draft']));
        $p->save();
        return response()->json($p);
    }

    public function destroy($id)
    {
        $p = Period::findOrFail($id);
        $p->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
