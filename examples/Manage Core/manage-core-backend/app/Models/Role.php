<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Role extends Model
{
    protected $fillable = ['name', 'description', 'color', 'icon', 'level', 'status'];

    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }

    public static function synchronizeLegacyUsers(): void
    {
        if (!Schema::hasTable('roles') || !Schema::hasTable('users')) {
            return;
        }

        User::query()
            ->whereNotNull('role')
            ->where('role', '!=', '')
            ->select('role')
            ->distinct()
            ->pluck('role')
            ->each(function (string $roleName): void {
                $role = static::firstOrCreate(
                    ['name' => trim($roleName)],
                    [
                        'description' => 'Imported from existing user assignments.',
                        'level' => 1,
                        'status' => true,
                    ]
                );

                User::where('role', $roleName)
                    ->whereNull('role_id')
                    ->update(['role_id' => $role->id]);
            });
    }
}
