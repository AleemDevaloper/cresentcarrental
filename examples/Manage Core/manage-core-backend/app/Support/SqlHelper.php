<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class SqlHelper
{
    /**
     * Build a cross-dialect month grouping expression (e.g. "2025-08").
     * Returns the SQL fragment for the current connection driver.
     */
    public static function monthGroup(string $column): string
    {
        if (self::isSqlite()) {
            return "strftime('%Y-%m', {$column})";
        }

        return "DATE_FORMAT({$column}, '%Y-%m')";
    }

    /**
     * Build a cross-dialect month-day expression (e.g. "08-20").
     * Returns the SQL fragment for the current connection driver.
     */
    public static function monthDay(string $column): string
    {
        if (self::isSqlite()) {
            return "strftime('%m-%d', {$column})";
        }

        return "DATE_FORMAT({$column}, '%m-%d')";
    }

    /**
     * Build a cross-dialect inclusive day-difference expression between two dates
     * (e.g. DATEDIFF(end, start) + 1).
     */
    public static function dateDiffDays(string $endColumn, string $startColumn): string
    {
        if (self::isSqlite()) {
            return "(julianday({$endColumn}) - julianday({$startColumn}) + 1)";
        }

        return "DATEDIFF({$endColumn}, {$startColumn}) + 1";
    }

    /**
     * Build a cross-dialect day difference expression (e.g. DATEDIFF(end, start)).
     */
    public static function dateDiff(string $endColumn, string $startColumn): string
    {
        if (self::isSqlite()) {
            return "(julianday({$endColumn}) - julianday({$startColumn}))";
        }

        return "DATEDIFF({$endColumn}, {$startColumn})";
    }

    private static function isSqlite(): bool
    {
        return DB::connection()->getDriverName() === 'sqlite';
    }
}