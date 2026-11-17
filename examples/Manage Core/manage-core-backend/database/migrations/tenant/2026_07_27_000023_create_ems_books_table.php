<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('author')->nullable();
            $table->string('publisher')->nullable();
            $table->string('isbn')->nullable();
            $table->string('edition')->nullable();
            $table->year('publication_year')->nullable();
            $table->string('category')->nullable();
            $table->string('language')->default('en');
            $table->text('description')->nullable();
            $table->string('shelf_location')->nullable();
            $table->integer('quantity')->default(1);
            $table->integer('available_quantity')->default(1);
            $table->string('cover_image')->nullable();
            $table->enum('status', ['available', 'unavailable', 'lost', 'damaged'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};
