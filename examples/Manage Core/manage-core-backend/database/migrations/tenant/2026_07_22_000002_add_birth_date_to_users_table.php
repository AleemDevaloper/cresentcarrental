<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add nullable birth_date to tenant users table if missing
        if (!Schema::connection('tenant')->hasColumn('users', 'birth_date')) {
            Schema::connection('tenant')->table('users', function (Blueprint $table) {
                $table->date('birth_date')->nullable()->after('email');
            });
        }
    }

    public function down()
    {
        if (Schema::connection('tenant')->hasColumn('users', 'birth_date')) {
            Schema::connection('tenant')->table('users', function (Blueprint $table) {
                $table->dropColumn('birth_date');
            });
        }
    }
};
