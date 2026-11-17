<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_clearances', function (Blueprint $table) {
            if (!Schema::hasColumn('asset_clearances', 'remarks')) {
                $table->text('remarks')->nullable()->after('status');
            }
            if (!Schema::hasColumn('asset_clearances', 'items')) {
                $table->json('items')->nullable()->after('remarks');
            }
            if (!Schema::hasColumn('asset_clearances', 'cleared_by')) {
                $table->foreignId('cleared_by')->nullable()->after('items')->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('asset_clearances', 'resignation_id')) {
                $table->unsignedBigInteger('resignation_id')->nullable()->after('cleared_by');
            }
            if (!Schema::hasColumn('asset_clearances', 'deleted_at')) {
                $table->softDeletes()->after('updated_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('asset_clearances', function (Blueprint $table) {
            $table->dropColumn(['remarks', 'items', 'cleared_by', 'resignation_id', 'deleted_at']);
        });
    }
};
