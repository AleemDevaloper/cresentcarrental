<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_quotas', function (Blueprint $table) {
            $table->id();
            $table->string('organization');
            $table->integer('request_limit')->default(0)->comment('Max AI requests per period. 0 = unlimited.');
            $table->bigInteger('token_limit')->default(0)->comment('Max tokens per period. 0 = unlimited.');
            $table->decimal('cost_limit', 12, 4)->default(0)->comment('Max estimated cost (USD) per period. 0 = unlimited.');
            $table->enum('period', ['daily', 'weekly', 'monthly'])->default('monthly');
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique('organization');
            $table->index(['organization', 'enabled']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_quotas');
    }
};
