<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('receipts', function (Blueprint $table) {
            $table->bigIncrements('id');
            // client_id references AR customers (clients table)
            $table->unsignedBigInteger('client_id')->nullable()->index();
            $table->string('number')->nullable()->index();
            $table->date('date')->nullable();
            $table->string('method')->nullable();
            $table->string('bank')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('allocated', 15, 2)->default(0);
            $table->string('reference_no')->nullable();
            $table->string('invoice_ref')->nullable();
            $table->string('received_by')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('Pending Approval');
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->timestamps();

            // foreign key if clients table exists
            try {
                $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            } catch (\Exception $e) {
                // ignore if clients table missing during initial deploy
            }
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('receipts');
    }
};
