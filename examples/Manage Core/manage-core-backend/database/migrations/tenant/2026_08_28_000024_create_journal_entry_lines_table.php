<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('journal_entry_lines', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('journal_entry_id')->index();
            $table->unsignedBigInteger('account_id')->index();
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('cost_center_id')->nullable()->index();
            $table->unsignedBigInteger('analytic_account_id')->nullable()->index();
            $table->timestamps();

            try { $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade'); } catch (\Exception $e) {}
            try { $table->foreign('cost_center_id')->references('id')->on('cost_centers')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('analytic_account_id')->references('id')->on('analytic_accounts')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('journal_entry_lines');
    }
};
