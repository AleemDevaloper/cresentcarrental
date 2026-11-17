<?php

namespace App\Http\Controllers\Api\EMS;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Generic CRUD base for EMS resource controllers.
 *
 * Subclasses only need to set $model (and optionally override
 * transformPayload / mapInput for frontend field mapping).
 */
abstract class EmsResourceController extends Controller
{
    /**
     * The Eloquent model class handled by this controller.
     *
     * @var class-string<Model>
     */
    protected string $model;

    /**
     * Map raw request input onto model fillable columns.
     */
    protected function mapInput(Request $request): array
    {
        return $request->all();
    }

    /**
     * Transform a model instance before returning it to the client.
     */
    protected function transform(Model $model): Model
    {
        return $model;
    }

    /**
     * Apply search + filters to the index query.
     */
    protected function applyFilters(Builder $query, Request $request): Builder
    {
        $search = trim((string) $request->get('search', ''));
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search) {
                foreach ($q->getModel()->getFillable() as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        foreach (['status', 'institution_id', 'campus_id', 'program_id', 'academic_year_id', 'semester_id', 'class_id', 'course_id', 'student_id', 'department_id'] as $filter) {
            $value = $request->get($filter);
            if ($value !== null && $value !== '') {
                $query->where($filter, $value);
            }
        }

        return $query;
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->model::query();
        $query = $this->applyFilters($query, $request);

        $perPage = (int) $request->get('per_page', 50);
        if ($request->get('all')) {
            $items = $query->orderByDesc('id')->get();
        } else {
            $items = collect($query->orderByDesc('id')->paginate($perPage)->items());
        }

        return response()->json([
            'success' => true,
            'data' => $items->map(fn ($m) => $this->transform($m))->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $model = $this->model::create($this->mapInput($request));
        return response()->json([
            'success' => true,
            'message' => 'Created',
            'data' => $this->transform($model),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $model = $this->model::findOrFail($id);
        return response()->json(['success' => true, 'data' => $this->transform($model)]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $model = $this->model::findOrFail($id);
        $model->update($this->mapInput($request));
        return response()->json([
            'success' => true,
            'message' => 'Updated',
            'data' => $this->transform($model->fresh()),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $this->model::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}