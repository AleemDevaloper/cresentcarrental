<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->string('recipient_type');
            $table->json('recipient_ids')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('type');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->json('attachments')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->enum('status', ['draft', 'sent', 'failed'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('communications');
    }
};
