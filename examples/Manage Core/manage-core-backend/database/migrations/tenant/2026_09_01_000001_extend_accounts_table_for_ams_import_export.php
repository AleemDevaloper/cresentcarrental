<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $connection = 'tenant';
        if (!Schema::connection($connection)->hasTable('accounts')) {
            return;
        }

        $columns = Schema::connection($connection)->getColumnListing('accounts');
        $addColumn = function (string $name, \Closure $callback) use ($connection, $columns) {
            if (in_array($name, $columns, true)) {
                return;
            }
            Schema::connection($connection)->table('accounts', function (Blueprint $table) use ($name, $callback) {
                $callback($table);
            });
        };

        // account_type_id (FK)
        $addColumn('account_type_id', function (Blueprint $t) {
            $t->unsignedBigInteger('account_type_id')->nullable()->index()->after('account_group_id');
        });
        // parent_id (self-FK)
        $addColumn('parent_id', function (Blueprint $t) {
            $t->unsignedBigInteger('parent_id')->nullable()->index()->after('account_type_id');
        });
        // normal_balance
        $addColumn('normal_balance', function (Blueprint $t) {
            $t->string('normal_balance', 10)->nullable()->after('description');
        });
        // is_control_account
        $addColumn('is_control_account', function (Blueprint $t) {
            $t->boolean('is_control_account')->default(false)->after('normal_balance');
        });
        // is_cash_account
        $addColumn('is_cash_account', function (Blueprint $t) {
            $t->boolean('is_cash_account')->default(false)->after('is_control_account');
        });
        // is_bank_account
        $addColumn('is_bank_account', function (Blueprint $t) {
            $t->boolean('is_bank_account')->default(false)->after('is_cash_account');
        });
        // allow_manual_entries
        $addColumn('allow_manual_entries', function (Blueprint $t) {
            $t->boolean('allow_manual_entries')->default(true)->after('is_bank_account');
        });
        // tax_category
        $addColumn('tax_category', function (Blueprint $t) {
            $t->string('tax_category', 100)->nullable()->after('allow_manual_entries');
        });
        // currency
        $addColumn('currency', function (Blueprint $t) {
            $t->string('currency', 10)->nullable()->default('USD')->after('tax_category');
        });
        // current_balance
        $addColumn('current_balance', function (Blueprint $t) {
            $t->decimal('current_balance', 18, 2)->default(0)->after('opening_balance');
        });
        // is_contra (legacy)
        $addColumn('is_contra', function (Blueprint $t) {
            $t->boolean('is_contra')->default(false)->after('current_balance');
        });
        // is_draft (legacy)
        $addColumn('is_draft', function (Blueprint $t) {
            $t->boolean('is_draft')->default(false)->after('is_contra');
        });
        // sort_order
        $addColumn('sort_order', function (Blueprint $t) {
            $t->unsignedInteger('sort_order')->default(0)->after('is_draft');
        });

        // Indexes (idempotent)
        try {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) {
                $t->index('status');
            });
        } catch (\Throwable $e) {}
        try {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) {
                $t->unique('code');
            });
        } catch (\Throwable $e) {}

        // Add FKs (idempotent with try/catch)
        try {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) {
                $t->foreign('account_type_id')->references('id')->on('account_types')->onDelete('set null');
            });
        } catch (\Throwable $e) {}
        try {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) {
                $t->foreign('account_group_id')->references('id')->on('account_groups')->onDelete('set null');
            });
        } catch (\Throwable $e) {}
        try {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) {
                $t->foreign('parent_id')->references('id')->on('accounts')->onDelete('set null');
            });
        } catch (\Throwable $e) {}
    }

    public function down(): void
    {
        $connection = 'tenant';
        if (!Schema::connection($connection)->hasTable('accounts')) {
            return;
        }
        $columns = Schema::connection($connection)->getColumnListing('accounts');
        $drop = array_intersect([
            'account_type_id', 'parent_id', 'normal_balance',
            'is_control_account', 'is_cash_account', 'is_bank_account',
            'allow_manual_entries', 'tax_category', 'currency',
            'current_balance', 'is_contra', 'is_draft', 'sort_order',
        ], $columns);
        if (!empty($drop)) {
            Schema::connection($connection)->table('accounts', function (Blueprint $t) use ($drop) {
                $t->dropColumn($drop);
            });
        }
    }
};