<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable();
            }
            if (!Schema::hasColumn('users', 'dob')) {
                $table->date('dob')->nullable();
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('users', 'employee_type')) {
                $table->string('employee_type')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['dob', 'gender', 'phone', 'address', 'employee_type']);
        });
    }
};
