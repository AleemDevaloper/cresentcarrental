<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JournalEntryController extends Controller
{
    public function index(Request $request)
    {
        $q = JournalEntry::with(['poster', 'lines.account'])->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->get('search');
            $q->where(function ($query) use ($search) {
                $query->where('entry_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $q->where('status', $request->get('status'));
        }

        if ($request->filled('reference_type')) {
            $q->where('reference_type', $request->get('reference_type'));
        }

        if ($request->filled('date_from')) {
            $q->where('entry_date', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $q->where('entry_date', '<=', $request->get('date_to'));
        }

        if ($request->filled('fiscal_year_id')) {
            $q->where('fiscal_year_id', $request->get('fiscal_year_id'));
        }

        if ($request->filled('period_id')) {
            $q->where('period_id', $request->get('period_id'));
        }

        return response()->json($q->paginate(max(10, (int) $request->get('per_page', 25))));
    }

    public function show($id)
    {
        $entry = JournalEntry::with(['lines.account', 'lines.costCenter', 'lines.analyticAccount', 'poster', 'reversedEntry'])->findOrFail($id);
        return response()->json($entry);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entry_date' => 'required|date',
            'reference_type' => 'required|in:manual,recurring,adjustment,closing',
            'reference_id' => 'nullable|integer',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'fiscal_year_id' => 'nullable|integer|exists:fiscal_years,id',
            'period_id' => 'nullable|integer|exists:fiscal_periods,id',
            'lines' => 'required|array|min:2',
            'lines.*.account_id' => 'required|integer|exists:accounts,id',
            'lines.*.debit' => 'required|numeric|min:0',
            'lines.*.credit' => 'required|numeric|min:0',
            'lines.*.description' => 'nullable|string',
            'lines.*.cost_center_id' => 'nullable|integer|exists:cost_centers,id',
            'lines.*.analytic_account_id' => 'nullable|integer|exists:analytic_accounts,id',
        ]);

        $totalDebit = collect($validated['lines'])->sum('debit');
        $totalCredit = collect($validated['lines'])->sum('credit');

        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            return response()->json(['message' => 'Total debit must equal total credit.', 'total_debit' => $totalDebit, 'total_credit' => $totalCredit], 422);
        }

        $entry = DB::connection('tenant')->transaction(function () use ($validated, $totalDebit, $totalCredit) {
            $entry = JournalEntry::create([
                'entry_number' => JournalEntry::generateEntryNumber(),
                'entry_date' => $validated['entry_date'],
                'reference_type' => $validated['reference_type'],
                'reference_id' => $validated['reference_id'] ?? null,
                'description' => $validated['description'] ?? null,
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'status' => 'draft',
                'fiscal_year_id' => $validated['fiscal_year_id'] ?? null,
                'period_id' => $validated['period_id'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);

            foreach ($validated['lines'] as $line) {
                $entry->lines()->create([
                    'account_id' => $line['account_id'],
                    'debit' => $line['debit'],
                    'credit' => $line['credit'],
                    'description' => $line['description'] ?? null,
                    'cost_center_id' => $line['cost_center_id'] ?? null,
                    'analytic_account_id' => $line['analytic_account_id'] ?? null,
                ]);
            }

            return $entry;
        });

        return response()->json($entry->load('lines.account'), 201);
    }

    public function update(Request $request, $id)
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->status !== 'draft') {
            return response()->json(['message' => 'Only draft entries can be updated.'], 422);
        }

        $validated = $request->validate([
            'entry_date' => 'sometimes|date',
            'reference_type' => 'sometimes|in:manual,recurring,adjustment,closing',
            'reference_id' => 'nullable|integer',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'fiscal_year_id' => 'nullable|integer|exists:fiscal_years,id',
            'period_id' => 'nullable|integer|exists:fiscal_periods,id',
            'lines' => 'sometimes|array|min:2',
            'lines.*.id' => 'nullable|integer',
            'lines.*.account_id' => 'required_with:lines|integer|exists:accounts,id',
            'lines.*.debit' => 'required_with:lines|numeric|min:0',
            'lines.*.credit' => 'required_with:lines|numeric|min:0',
            'lines.*.description' => 'nullable|string',
            'lines.*.cost_center_id' => 'nullable|integer|exists:cost_centers,id',
            'lines.*.analytic_account_id' => 'nullable|integer|exists:analytic_accounts,id',
        ]);

        $entry = DB::connection('tenant')->transaction(function () use ($entry, $validated) {
            $entry->update(Arr::except($validated, ['lines']));

            if (isset($validated['lines'])) {
                $totalDebit = collect($validated['lines'])->sum('debit');
                $totalCredit = collect($validated['lines'])->sum('credit');

                if (round($totalDebit, 2) !== round($totalCredit, 2)) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'lines' => 'Total debit must equal total credit.',
                    ]);
                }

                $entry->update([
                    'total_debit' => $totalDebit,
                    'total_credit' => $totalCredit,
                ]);

                $existingIds = collect($validated['lines'])->pluck('id')->filter()->toArray();
                $entry->lines()->whereNotIn('id', $existingIds)->delete();

                foreach ($validated['lines'] as $line) {
                    if (!empty($line['id'])) {
                        $entry->lines()->where('id', $line['id'])->update([
                            'account_id' => $line['account_id'],
                            'debit' => $line['debit'],
                            'credit' => $line['credit'],
                            'description' => $line['description'] ?? null,
                            'cost_center_id' => $line['cost_center_id'] ?? null,
                            'analytic_account_id' => $line['analytic_account_id'] ?? null,
                        ]);
                    } else {
                        $entry->lines()->create([
                            'account_id' => $line['account_id'],
                            'debit' => $line['debit'],
                            'credit' => $line['credit'],
                            'description' => $line['description'] ?? null,
                            'cost_center_id' => $line['cost_center_id'] ?? null,
                            'analytic_account_id' => $line['analytic_account_id'] ?? null,
                        ]);
                    }
                }
            }

            return $entry;
        });

        return response()->json($entry->load('lines.account'));
    }

    public function destroy($id)
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->status !== 'draft') {
            return response()->json(['message' => 'Only draft entries can be deleted.'], 422);
        }

        DB::connection('tenant')->transaction(function () use ($entry) {
            $entry->lines()->delete();
            $entry->delete();
        });

        return response()->json(['message' => 'Journal entry deleted successfully.']);
    }

    public function post($id)
    {
        $entry = JournalEntry::with('lines')->findOrFail($id);

        if ($entry->status !== 'draft') {
            return response()->json(['message' => 'Only draft entries can be posted.'], 422);
        }

        if ($entry->lines->count() < 2) {
            return response()->json(['message' => 'A journal entry must have at least 2 lines.'], 422);
        }

        if (round($entry->total_debit, 2) !== round($entry->total_credit, 2)) {
            return response()->json(['message' => 'Total debit must equal total credit.'], 422);
        }

        $entry->update([
            'status' => 'posted',
            'posted_by' => Auth::id(),
            'posted_at' => now(),
        ]);

        return response()->json($entry->load(['lines.account', 'poster']));
    }

    public function reverse($id)
    {
        $original = JournalEntry::with('lines')->findOrFail($id);

        if ($original->status !== 'posted') {
            return response()->json(['message' => 'Only posted entries can be reversed.'], 422);
        }

        $reversal = DB::connection('tenant')->transaction(function () use ($original) {
            $reversal = JournalEntry::create([
                'entry_number' => JournalEntry::generateEntryNumber(),
                'entry_date' => now()->toDateString(),
                'reference_type' => $original->reference_type,
                'reference_id' => $original->reference_id,
                'description' => 'Reversal of ' . $original->entry_number . ($original->description ? ': ' . $original->description : ''),
                'total_debit' => $original->total_debit,
                'total_credit' => $original->total_credit,
                'status' => 'posted',
                'fiscal_year_id' => $original->fiscal_year_id,
                'period_id' => $original->period_id,
                'reversal_of' => $original->id,
                'posted_by' => Auth::id(),
                'posted_at' => now(),
                'notes' => 'Reversal of entry ' . $original->entry_number,
                'created_by' => Auth::id(),
            ]);

            foreach ($original->lines as $line) {
                $reversal->lines()->create([
                    'account_id' => $line->account_id,
                    'debit' => $line->credit,
                    'credit' => $line->debit,
                    'description' => $line->description,
                    'cost_center_id' => $line->cost_center_id,
                    'analytic_account_id' => $line->analytic_account_id,
                ]);
            }

            $original->update(['status' => 'reversed']);

            return $reversal;
        });

        return response()->json($reversal->load('lines.account'));
    }

    public function bulkPost(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:journal_entries,id',
        ]);

        $entries = JournalEntry::whereIn('id', $validated['ids'])->with('lines')->get();
        $failed = [];
        $posted = [];

        DB::connection('tenant')->transaction(function () use ($entries, &$posted, &$failed) {
            foreach ($entries as $entry) {
                if ($entry->status !== 'draft') {
                    $failed[] = ['id' => $entry->id, 'entry_number' => $entry->entry_number, 'reason' => 'Entry is not in draft status.'];
                    continue;
                }

                if ($entry->lines->count() < 2) {
                    $failed[] = ['id' => $entry->id, 'entry_number' => $entry->entry_number, 'reason' => 'Entry must have at least 2 lines.'];
                    continue;
                }

                if (round($entry->total_debit, 2) !== round($entry->total_credit, 2)) {
                    $failed[] = ['id' => $entry->id, 'entry_number' => $entry->entry_number, 'reason' => 'Debit and credit totals do not match.'];
                    continue;
                }

                $entry->update([
                    'status' => 'posted',
                    'posted_by' => Auth::id(),
                    'posted_at' => now(),
                ]);

                $posted[] = $entry->id;
            }
        });

        return response()->json([
            'message' => count($posted) . ' entry(ies) posted successfully.',
            'posted' => $posted,
            'failed' => $failed,
        ]);
    }
}
