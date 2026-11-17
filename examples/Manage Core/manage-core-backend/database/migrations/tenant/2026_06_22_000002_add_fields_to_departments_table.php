<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->string('code')->nullable()->after('name');
            $table->string('head_of_department')->nullable()->after('description');
            $table->decimal('budget', 15, 2)->nullable()->after('head_of_department');
            $table->string('location')->nullable()->after('budget');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['code', 'head_of_department', 'budget', 'location', 'status']);
        });
    }
};
