<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('tenant')->create('crm_notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index();
            $table->string('type', 80)->index();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->string('link')->nullable();
            $table->string('entity_type')->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable()->index();
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamps();

            try { $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::connection('tenant')->dropIfExists('crm_notifications');
    }
};