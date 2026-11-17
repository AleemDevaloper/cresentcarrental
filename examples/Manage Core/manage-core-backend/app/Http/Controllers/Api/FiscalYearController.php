<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FiscalYear;
use Illuminate\Support\Facades\Auth;

class FiscalYearController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 25);
        $q = FiscalYear::query()->orderBy('start_date', 'desc');
        if ($request->get('q')) {
            $q->where('name', 'like', '%'.$request->get('q').'%');
        }
        return response()->json($q->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->only(['name','start_date','end_date','status','is_draft']);
        $data['created_by'] = Auth::id();
        $fy = FiscalYear::create($data);
        return response()->json($fy, 201);
    }

    public function show($id) { return response()->json(FiscalYear::findOrFail($id)); }

    public function update(Request $request, $id)
    {
        $fy = FiscalYear::findOrFail($id);
        $fy->fill($request->only(['name','start_date','end_date','status','is_draft']));
        $fy->save();
        return response()->json($fy);
    }

    public function destroy($id)
    {
        $fy = FiscalYear::findOrFail($id);
        $fy->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
