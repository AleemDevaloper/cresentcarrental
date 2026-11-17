<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->string('category')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('dosage_form')->nullable();
            $table->string('strength')->nullable();
            $table->string('unit')->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('minimum_quantity')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->date('expiry_date')->nullable();
            $table->string('batch_number')->nullable();
            $table->string('storage_conditions')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'low_stock', 'out_of_stock', 'expired'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('medicines');
    }
};
