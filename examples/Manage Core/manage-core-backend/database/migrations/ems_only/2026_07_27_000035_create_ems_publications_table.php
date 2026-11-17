<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('research_project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('abstract')->nullable();
            $table->json('authors');
            $table->string('journal')->nullable();
            $table->string('volume')->nullable();
            $table->string('issue')->nullable();
            $table->string('pages')->nullable();
            $table->string('doi')->nullable();
            $table->string('issn')->nullable();
            $table->date('publication_date')->nullable();
            $table->string('publisher')->nullable();
            $table->json('keywords')->nullable();
            $table->string('file_path')->nullable();
            $table->string('url')->nullable();
            $table->string('type')->nullable();
            $table->enum('status', ['draft', 'submitted', 'published', 'rejected'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('publications');
    }
};
