<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_demo_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->string('product')->nullable();
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('email');
        });

        Schema::create('website_contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->string('service')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_contact_messages');
        Schema::dropIfExists('website_demo_requests');
    }
};
