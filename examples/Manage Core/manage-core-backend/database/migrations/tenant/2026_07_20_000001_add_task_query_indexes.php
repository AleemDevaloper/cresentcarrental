<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected function addIndex(string $table, string $index, string $columns): void
    {
        if (!Schema::hasTable($table)) {
            return;
        }
        $cols = array_map('trim', explode(',', $columns));
        foreach ($cols as $col) {
            if (!Schema::hasColumn($table, $col)) {
                return;
            }
        }
        if (Schema::hasIndex($table, $index)) {
            return;
        }
        Schema::table($table, function (Blueprint $table) use ($index, $cols) {
            $table->index($cols, $index);
        });
    }

    public function up(): void
    {
        $this->addIndex('tasks', 'idx_tasks_due_date', 'due_date');
        $this->addIndex('tasks', 'idx_tasks_updated_at', 'updated_at');
        $this->addIndex('tasks', 'idx_tasks_status', 'status');
    }

    public function down(): void
    {
        foreach (['idx_tasks_due_date', 'idx_tasks_updated_at', 'idx_tasks_status'] as $index) {
            if (Schema::hasTable('tasks') && Schema::hasIndex('tasks', $index)) {
                Schema::table('tasks', function (Blueprint $table) use ($index) {
                    $table->dropIndex($index);
                });
            }
        }
    }
};
