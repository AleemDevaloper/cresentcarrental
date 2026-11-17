<?php

namespace App\Policies\Crm;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CrmPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) return true;
        return null;
    }

    public function view(User $user, Model $model): bool
    {
        return $user->hasPermission($this->moduleName($model) . '.view')
            || $user->hasPermission('crm.view');
    }

    public function create(User $user, string $module): bool
    {
        return $user->hasPermission($module . '.create') || $user->hasPermission('crm.create');
    }

    public function update(User $user, Model $model): bool
    {
        return $user->hasPermission($this->moduleName($model) . '.edit')
            || $user->hasPermission('crm.edit');
    }

    public function delete(User $user, Model $model): bool
    {
        return $user->hasPermission($this->moduleName($model) . '.delete')
            || $user->hasPermission('crm.delete');
    }

    public function assign(User $user, Model $model): bool
    {
        return $user->hasPermission($this->moduleName($model) . '.assign');
    }

    public function export(User $user): bool
    {
        return $user->hasPermission('crm.export');
    }

    public function import(User $user): bool
    {
        return $user->hasPermission('crm.import');
    }

    public function manageSettings(User $user): bool
    {
        return $user->hasPermission('settings.manage');
    }

    protected function moduleName(Model $model): string
    {
        $class = class_basename($model);
        if (str_starts_with($class, 'Crm')) $class = substr($class, 3);
        $name = strtolower(preg_replace('/(?<!<)[A-Z]/', '-$0', $class));
        $name = ltrim($name, '-');
        if ($name === 'email') return 'email';
        if ($name === 'e-mail-account' || $name === 'email-account') return 'email.account';
        return $name;
    }
}