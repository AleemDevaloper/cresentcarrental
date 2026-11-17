<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('fx_revaluations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('revaluation_date');
            $table->date('period_start');
            $table->date('period_end');
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft');
            $table->decimal('total_gain', 20, 4)->default(0);
            $table->decimal('total_loss', 20, 4)->default(0);
            $table->decimal('net_position', 20, 4)->default(0);
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('revaluation_date');
            $table->index('period_start');
            $table->index('period_end');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('fx_revaluations');
    }
};
