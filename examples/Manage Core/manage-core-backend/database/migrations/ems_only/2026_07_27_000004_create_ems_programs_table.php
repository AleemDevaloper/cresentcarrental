<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->integer('duration_years')->nullable();
            $table->integer('duration_semesters')->nullable();
            $table->string('degree_type')->nullable();
            $table->integer('credit_hours')->nullable();
            $table->decimal('tuition_fee', 12, 2)->nullable();
            $table->decimal('admission_fee', 12, 2)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
};
