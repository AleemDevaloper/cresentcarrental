<?php

namespace App\Http\Controllers\Api\EMS;

use App\Models\EMS\Book;
use App\Models\EMS\BookIssue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends EmsResourceController
{
    protected string $model = Book::class;

    public function issue(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['status'] = $data['status'] ?? 'issued';
        $data['issue_date'] = $data['issue_date'] ?? now()->toDateString();
        $issue = BookIssue::create($data);

        $book = Book::find($data['book_id'] ?? null);
        if ($book) {
            $book->decrement('available_quantity');
        }

        return response()->json(['success' => true, 'message' => 'Issued', 'data' => $issue], 201);
    }

    public function returnBook(Request $request): JsonResponse
    {
        $issue = BookIssue::find($request->get('id'));
        if (!$issue) {
            return response()->json(['success' => false, 'message' => 'Issue record not found'], 404);
        }
        $issue->update([
            'return_date' => $request->get('return_date') ?? now()->toDateString(),
            'status' => 'returned',
        ]);

        $book = Book::find($issue->book_id);
        if ($book) {
            $book->increment('available_quantity');
        }

        return response()->json(['success' => true, 'message' => 'Returned', 'data' => $issue]);
    }
}