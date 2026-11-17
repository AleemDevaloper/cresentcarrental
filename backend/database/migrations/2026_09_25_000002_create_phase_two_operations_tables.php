<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            if (!Schema::hasColumn('vehicles', 'operational_status')) {
                $table->string('operational_status')->default('Available')->after('status')->index();
            }
            if (!Schema::hasColumn('vehicles', 'odometer')) {
                $table->unsignedInteger('odometer')->default(0)->after('operational_status');
            }
            if (!Schema::hasColumn('vehicles', 'registration_expires_at')) {
                $table->date('registration_expires_at')->nullable()->after('odometer')->index();
            }
            if (!Schema::hasColumn('vehicles', 'insurance_expires_at')) {
                $table->date('insurance_expires_at')->nullable()->after('registration_expires_at')->index();
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'handover_at')) {
                $table->dateTime('handover_at')->nullable()->after('return_at');
            }
            if (!Schema::hasColumn('bookings', 'actual_return_at')) {
                $table->dateTime('actual_return_at')->nullable()->after('handover_at');
            }
            if (!Schema::hasColumn('bookings', 'handover_odometer')) {
                $table->unsignedInteger('handover_odometer')->nullable()->after('actual_return_at');
            }
            if (!Schema::hasColumn('bookings', 'return_odometer')) {
                $table->unsignedInteger('return_odometer')->nullable()->after('handover_odometer');
            }
            if (!Schema::hasColumn('bookings', 'assigned_to')) {
                $table->foreignId('assigned_to')->nullable()->after('return_odometer')->constrained('users')->nullOnDelete();
            }
        });

        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'assigned_to')) {
                $table->foreignId('assigned_to')->nullable()->after('admin_notes')->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('leads', 'next_follow_up_at')) {
                $table->dateTime('next_follow_up_at')->nullable()->after('assigned_to')->index();
            }
        });

        Schema::create('vehicle_maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type');
            $table->text('description')->nullable();
            $table->decimal('cost', 12, 2)->default(0);
            $table->unsignedInteger('odometer')->nullable();
            $table->date('performed_at');
            $table->date('next_due_at')->nullable()->index();
            $table->string('status')->default('Completed')->index();
            $table->timestamps();
        });

        Schema::create('vehicle_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('inspected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('Routine');
            $table->string('result')->default('Pending')->index();
            $table->unsignedInteger('odometer')->nullable();
            $table->json('checklist')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('inspected_at')->nullable();
            $table->timestamps();
        });

        Schema::create('lead_follow_ups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('channel')->default('Phone');
            $table->text('note');
            $table->dateTime('scheduled_at')->nullable()->index();
            $table->dateTime('completed_at')->nullable();
            $table->string('status')->default('Open')->index();
            $table->timestamps();
        });
    }
};
