<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('certificate_number')->unique();
            $table->string('type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('status', ['draft', 'issued', 'revoked'])->default('draft');
            $table->string('issued_by')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificates');
    }
};
