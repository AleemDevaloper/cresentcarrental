<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Global Tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->default('#6366f1');
            $table->timestamps();
        });

        // Task-Tag Pivot
        Schema::create('task_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Time Logs
        Schema::create('task_time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->integer('duration')->default(0); // in seconds
            $table->text('note')->nullable();
            $table->timestamps();
        });

        // Activity Logs
        Schema::create('task_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., 'created', 'updated_status', 'added_tag'
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Dependencies
        Schema::create('task_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('depends_on_task_id')->constrained('tasks')->onDelete('cascade');
            $table->string('type')->default('FS'); // Finish-to-Start
            $table->timestamps();
        });

        // Attachments
        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->bigInteger('file_size');
            $table->string('file_type')->nullable();
            $table->timestamps();
        });

        // Productivity Records (from TmsAddRecord)
        Schema::create('productivity_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('owner')->nullable();
            $table->string('status')->default('Open');
            $table->string('priority')->default('Medium');
            $table->decimal('amount', 15, 2)->nullable();
            $table->date('due_date')->nullable();
            $table->integer('progress')->default(0);
            $table->text('notes')->nullable();
            $table->string('attachment_name')->nullable();
            $table->timestamps();
        });
        
        // Add progress to tasks table if not exists
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'progress')) {
                $table->integer('progress')->default(0)->after('priority');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('progress');
        });
        Schema::dropIfExists('productivity_records');
        Schema::dropIfExists('task_attachments');
        Schema::dropIfExists('task_dependencies');
        Schema::dropIfExists('task_activity_logs');
        Schema::dropIfExists('task_time_logs');
        Schema::dropIfExists('task_tag');
        Schema::dropIfExists('tags');
    }
};
