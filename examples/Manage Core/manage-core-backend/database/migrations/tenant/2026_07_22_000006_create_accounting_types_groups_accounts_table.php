<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('tenant')->create('account_types', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->unique();
            $table->string('code')->nullable()->index();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::connection('tenant')->create('account_groups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('account_type_id')->index();
            $table->string('name')->index();
            $table->string('code')->nullable()->index();
            $table->text('description')->nullable();
            $table->timestamps();
            try { $table->foreign('account_type_id')->references('id')->on('account_types')->onDelete('cascade'); } catch (\Exception $e) {}
        });

        Schema::connection('tenant')->create('accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('account_group_id')->nullable()->index();
            $table->unsignedBigInteger('account_type_id')->nullable()->index();
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->string('code')->index();
            $table->string('name')->index();
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->string('normal_balance')->nullable();
            $table->boolean('is_contra')->default(false);
            $table->boolean('is_draft')->default(false);
            $table->timestamps();

            try { $table->foreign('account_group_id')->references('id')->on('account_groups')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('account_type_id')->references('id')->on('account_types')->onDelete('set null'); } catch (\Exception $e) {}
            try { $table->foreign('parent_id')->references('id')->on('accounts')->onDelete('set null'); } catch (\Exception $e) {}
        });
    }

    public function down()
    {
        Schema::connection('tenant')->dropIfExists('accounts');
        Schema::connection('tenant')->dropIfExists('account_groups');
        Schema::connection('tenant')->dropIfExists('account_types');
    }
};
