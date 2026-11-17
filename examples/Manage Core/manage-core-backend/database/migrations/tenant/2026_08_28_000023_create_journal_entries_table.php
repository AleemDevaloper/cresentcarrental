<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('journal_entries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entry_number')->unique();
            $table->date('entry_date');
            $table->enum('reference_type', ['manual', 'recurring', 'adjustment', 'closing'])->default('manual');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description')->nullable();
            $table->decimal('total_debit', 15, 2)->default(0);
            $table->decimal('total_credit', 15, 2)->default(0);
            $table->enum('status', ['draft', 'posted', 'reversed'])->default('draft');
            $table->unsignedBigInteger('fiscal_year_id')->nullable()->index();
            $table->unsignedBigInteger('period_id')->nullable()->index();
            $table->unsignedBigInteger('reversal_of')->nullable()->index();
            $table->unsignedBigInteger('posted_by')->nullable()->index();
            $table->timestamp('posted_at')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            try { $table->foreign('fiscal_year_id')->references('id')->on('fiscal_years')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('period_id')->references('id')->on('periods')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('reversal_of')->references('id')->on('journal_entries')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('posted_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('created_by')->references('id')->on('users')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('journal_entries');
    }
};
