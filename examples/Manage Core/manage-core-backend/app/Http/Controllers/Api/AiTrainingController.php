<?php

namespace App\Http\Controllers\Api;

use App\Models\AiTrainingModel;
use App\Models\AiTrainingDataset;
use App\Models\AiTrainingSession;
use App\Models\AiTrainingAgent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiTrainingController
{
    private function db()
    {
        return DB::connection('tenant');
    }

    // ========================
    // Models
    // ========================
    public function listModels(): JsonResponse
    {
        $models = AiTrainingModel::withCount(['datasets', 'sessions', 'agents'])->latest()->get();
        return response()->json(['data' => $models]);
    }

    public function createModel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'base_model' => 'required|string|max:100',
            'description' => 'nullable|string',
            'learning_rate' => 'nullable|numeric|min:0',
            'epochs' => 'nullable|integer|min:1',
            'batch_size' => 'nullable|integer|min:1',
        ]);

        $model = AiTrainingModel::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return response()->json(['data' => $model], 201);
    }

    public function updateModel(Request $request, int $id): JsonResponse
    {
        $model = AiTrainingModel::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:100',
            'base_model' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'learning_rate' => 'nullable|numeric|min:0',
            'epochs' => 'nullable|integer|min:1',
            'batch_size' => 'nullable|integer|min:1',
        ]);

        $model->update($validated);
        return response()->json(['data' => $model]);
    }

    public function deleteModel(int $id): JsonResponse
    {
        AiTrainingModel::findOrFail($id)->delete();
        return response()->json(['message' => 'Model deleted']);
    }

    // ========================
    // Datasets
    // ========================
    public function listDatasets(int $modelId): JsonResponse
    {
        $datasets = AiTrainingDataset::where('model_id', $modelId)->latest()->get();
        return response()->json(['data' => $datasets]);
    }

    public function uploadDataset(Request $request, int $modelId): JsonResponse
    {
        AiTrainingModel::findOrFail($modelId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'file_type' => 'nullable|string|max:20',
            'row_count' => 'nullable|integer|min:0',
            'file_size' => 'nullable|string|max:50',
        ]);

        $dataset = AiTrainingDataset::create([
            ...$validated,
            'model_id' => $modelId,
            'status' => 'ready',
        ]);

        AiTrainingModel::where('id', $modelId)->increment('datasets_count');

        return response()->json(['data' => $dataset], 201);
    }

    public function deleteDataset(int $modelId, int $datasetId): JsonResponse
    {
        AiTrainingDataset::where('model_id', $modelId)->where('id', $datasetId)->delete();
        return response()->json(['message' => 'Dataset deleted']);
    }

    // ========================
    // Training Sessions
    // ========================
    public function startTraining(Request $request, int $modelId): JsonResponse
    {
        $model = AiTrainingModel::findOrFail($modelId);
        abort_if($model->status === 'training', 422, 'Model is already training.');

        $session = AiTrainingSession::create([
            'model_id' => $modelId,
            'status' => 'running',
            'progress' => 0,
            'current_epoch' => "0/{$model->epochs}",
            'loss' => 1.0,
            'accuracy' => 0,
            'started_at' => now(),
        ]);

        $model->update(['status' => 'training', 'last_trained_at' => now()]);

        // Simulate training progress in background
        $this->simulateTraining($model, $session);

        return response()->json(['data' => $session], 201);
    }

    public function trainingStatus(int $modelId): JsonResponse
    {
        $session = AiTrainingSession::where('model_id', $modelId)
            ->latest()
            ->first();

        return response()->json(['data' => $session]);
    }

    public function stopTraining(int $modelId): JsonResponse
    {
        $model = AiTrainingModel::findOrFail($modelId);
        $session = AiTrainingSession::where('model_id', $modelId)
            ->where('status', 'running')
            ->latest()
            ->first();

        if ($session) {
            $session->update(['status' => 'stopped', 'completed_at' => now()]);
        }

        $model->update(['status' => 'idle']);

        return response()->json(['message' => 'Training stopped']);
    }

    public function listSessions(int $modelId): JsonResponse
    {
        $sessions = AiTrainingSession::where('model_id', $modelId)
            ->with('model:id,name')
            ->latest()
            ->get();
        return response()->json(['data' => $sessions]);
    }

    private function simulateTraining(AiTrainingModel $model, AiTrainingSession $session): void
    {
        // This is a simplified simulation. In production, you'd dispatch a job.
        $epochs = $model->epochs;
        $progressPerEpoch = 100 / max($epochs, 1);

        for ($i = 1; $i <= $epochs; $i++) {
            $progress = min((int) ($i * $progressPerEpoch), 99);
            $loss = max(0.01, 1.0 - ($i / $epochs) * 0.95 + (mt_rand(-5, 5) / 100));
            $accuracy = min(99.9, ($i / $epochs) * 95 + (mt_rand(0, 50) / 10));

            $session->update([
                'progress' => $progress,
                'current_epoch' => "{$i}/{$epochs}",
                'loss' => round($loss, 4),
                'accuracy' => round($accuracy, 1),
            ]);

            usleep(500000); // 0.5 seconds per epoch for simulation
        }

        $finalAccuracy = round(85 + mt_rand(0, 140) / 10, 1);
        $session->update([
            'status' => 'completed',
            'progress' => 100,
            'current_epoch' => "{$epochs}/{$epochs}",
            'loss' => round(mt_rand(1, 50) / 1000, 4),
            'accuracy' => $finalAccuracy,
            'completed_at' => now(),
        ]);

        $model->update([
            'status' => 'active',
            'accuracy' => $finalAccuracy,
            'loss' => $session->loss,
            'last_trained_at' => now(),
        ]);
    }

    // ========================
    // Agents
    // ========================
    public function listAgents(): JsonResponse
    {
        $agents = AiTrainingAgent::with('model:id,name,type')->latest()->get();
        return response()->json(['data' => $agents]);
    }

    public function createAgent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model_id' => 'required|integer|exists:ai_training_models,id',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $agent = AiTrainingAgent::create($validated);
        return response()->json(['data' => $agent], 201);
    }

    public function updateAgent(Request $request, int $id): JsonResponse
    {
        $agent = AiTrainingAgent::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'model_id' => 'sometimes|integer|exists:ai_training_models,id',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:draft,deployed',
        ]);

        $agent->update($validated);
        return response()->json(['data' => $agent]);
    }

    public function deleteAgent(int $id): JsonResponse
    {
        AiTrainingAgent::findOrFail($id)->delete();
        return response()->json(['message' => 'Agent deleted']);
    }

    // ========================
    // Dashboard Stats
    // ========================
    public function dashboardStats(): JsonResponse
    {
        $totalModels = AiTrainingModel::count();
        $activeModels = AiTrainingModel::where('status', 'active')->count();
        $trainingModels = AiTrainingModel::where('status', 'training')->count();
        $totalDatasets = AiTrainingDataset::count();
        $totalRows = AiTrainingDataset::sum('row_count');
        $totalSessions = AiTrainingSession::count();
        $runningSessions = AiTrainingSession::where('status', 'running')->count();
        $completedSessions = AiTrainingSession::where('status', 'completed')->count();
        $totalAgents = AiTrainingAgent::count();
        $deployedAgents = AiTrainingAgent::where('status', 'deployed')->count();
        $totalUsage = AiTrainingAgent::sum('usage_count');
        $avgAccuracy = AiTrainingModel::where('status', 'active')->avg('accuracy') ?? 0;

        $recentSessions = AiTrainingSession::with('model:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json(['data' => [
            'total_models' => $totalModels,
            'active_models' => $activeModels,
            'training_models' => $trainingModels,
            'total_datasets' => $totalDatasets,
            'total_rows' => $totalRows,
            'total_sessions' => $totalSessions,
            'running_sessions' => $runningSessions,
            'completed_sessions' => $completedSessions,
            'total_agents' => $totalAgents,
            'deployed_agents' => $deployedAgents,
            'total_usage' => $totalUsage,
            'avg_accuracy' => round($avgAccuracy, 1),
            'recent_sessions' => $recentSessions,
        ]]);
    }
}
