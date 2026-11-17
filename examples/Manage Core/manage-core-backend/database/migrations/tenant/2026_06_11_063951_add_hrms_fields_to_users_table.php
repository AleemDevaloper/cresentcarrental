<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // gender and dob already exist
            // phone and address already exist
            
            // Employment Details
            // employee_type already exists
            // joining_date already exists
            $table->date('probation_end_date')->nullable()->after('joining_date');
            $table->date('confirmation_date')->nullable()->after('probation_end_date');
            $table->date('exit_date')->nullable()->after('confirmation_date');
            
            // Hierarchy
            $table->foreignId('manager_id')->nullable()->after('role_id')->constrained('users')->onDelete('set null');
            
            // Banking & Legal
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('cnic_passport')->nullable();
            
            // Social/Emergency
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('blood_group')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn([
                'probation_end_date', 'confirmation_date', 'exit_date',
                'manager_id', 'bank_name', 'account_number', 'cnic_passport',
                'emergency_contact_name', 'emergency_contact_phone', 'blood_group'
            ]);
        });
    }
};
