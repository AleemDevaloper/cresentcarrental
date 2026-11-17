<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            if (!Schema::hasColumn('attendance', 'site_id')) {
                $table->foreignId('site_id')->nullable()->after('user_id')->constrained('sites');
            } else {
                // If column exists but no foreign key, add it
                // $table->foreign('site_id')->references('id')->on('sites');
            }
            
            if (!Schema::hasColumn('attendance', 'shift_id')) {
                $table->foreignId('shift_id')->nullable()->after('site_id')->constrained('shifts');
            }

            // In data
            if (!Schema::hasColumn('attendance', 'latitude_in')) {
                $table->decimal('latitude_in', 10, 8)->nullable()->after('clock_in');
            }
            if (!Schema::hasColumn('attendance', 'longitude_in')) {
                $table->decimal('longitude_in', 11, 8)->nullable()->after('latitude_in');
            }
            if (!Schema::hasColumn('attendance', 'selfie_in')) {
                $table->string('selfie_in')->nullable()->after('longitude_in');
            }
            
            // Out data
            if (!Schema::hasColumn('attendance', 'latitude_out')) {
                $table->decimal('latitude_out', 10, 8)->nullable()->after('clock_out');
            }
            if (!Schema::hasColumn('attendance', 'longitude_out')) {
                $table->decimal('longitude_out', 11, 8)->nullable()->after('latitude_out');
            }
            if (!Schema::hasColumn('attendance', 'selfie_out')) {
                $table->string('selfie_out')->nullable()->after('longitude_out');
            }
            
            // Meta
            if (!Schema::hasColumn('attendance', 'device_info')) {
                $table->string('device_info')->nullable();
            }
            if (!Schema::hasColumn('attendance', 'ip_address')) {
                $table->string('ip_address')->nullable();
            }
            if (!Schema::hasColumn('attendance', 'verification_status')) {
                $table->string('verification_status')->default('pending'); // pending, verified, rejected
            }
            if (!Schema::hasColumn('attendance', 'verification_notes')) {
                $table->text('verification_notes')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropForeign(['shift_id']);
            $table->dropColumn([
                'site_id', 'shift_id',
                'latitude_in', 'longitude_in', 'selfie_in',
                'latitude_out', 'longitude_out', 'selfie_out',
                'device_info', 'ip_address', 'verification_status', 'verification_notes'
            ]);
        });
    }
};
