<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Permission;
use App\Models\Role;
use App\Models\TaskAttachment;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'organization',
        'city',
        'country',
        'avatar',
        'email',
        'phone',
        'address',
        'emp_id',
        'employee_type',
        'joining_date',
        'probation_end_date',
        'confirmation_date',
        'exit_date',
        'status',
        'role',
        'role_id',
        'manager_id',
        'password',
        'storage_limit_mb',
        'bank_name',
        'account_number',
        'cnic_passport',
        'emergency_contact_name',
        'emergency_contact_phone',
        'blood_group',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['is_online', 'all_permissions'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dob' => 'date',
            'joining_date' => 'date',
            'probation_end_date' => 'date',
            'confirmation_date' => 'date',
            'exit_date' => 'date',
            'last_seen_at' => 'datetime',
        ];
    }

    public function profile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(EmployeeProfile::class);
    }

    public function manager(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function subordinates(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    public function getUsedStorageMbAttribute()
    {
        return $this->storageUsedMb();
    }

    public function storageUsedMb(): float
    {
        return (float) Cache::remember("user.{$this->id}.storage_mb", 300, function () {
            $projectFilesSize = (int) Project::where('created_by', $this->id)->sum('file_size');
            $userDocumentsSize = (int) $this->documents()->sum('file_size');
            $taskAttachmentsSize = (int) TaskAttachment::where('user_id', $this->id)->sum('file_size');

            return round(($projectFilesSize + $userDocumentsSize + $taskAttachmentsSize) / (1024 * 1024), 2);
        });
    }

    public function clearStorageCache(): void
    {
        Cache::forget("user.{$this->id}.storage_mb");
    }

    public function taskAttachments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function getIsOnlineAttribute()
    {
        if (!$this->last_seen_at) return false;
        // User is online if active in the last 5 minutes
        return $this->last_seen_at->gt(now()->subMinutes(5));
    }

    public function role_ref(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function getAllPermissionsAttribute()
    {
        return $this->loadPermissions();
    }

    public function loadPermissions(): array
    {
        if (!Schema::hasTable('permissions')) {
            return [];
        }

        if ($this->hasRole('super_admin')) {
            return Cache::remember('permissions.all_slugs', 86400, function () {
                return Permission::pluck('slug')->toArray();
            });
        }

        return Cache::remember("user.{$this->id}.permissions", 3600, function () {
            $rolePermissions = [];

            if (!empty($this->role_id) && Schema::hasTable('roles') && Schema::hasTable('permission_role')) {
                $role = Role::with('permissions')->find($this->role_id);
                if ($role) {
                    $rolePermissions = $role->permissions->pluck('slug')->toArray();
                }
            }

            if (empty($rolePermissions) && !empty($this->role) && Schema::hasTable('roles') && Schema::hasTable('permission_role')) {
                $role = Role::where('name', trim($this->role))->with('permissions')->first();
                if ($role) {
                    $rolePermissions = $role->permissions->pluck('slug')->toArray();
                }
            }

            $userPermissions = Schema::hasTable('permission_user')
                ? $this->permissions()->pluck('slug')->toArray()
                : [];

            return array_values(array_unique(array_filter(array_merge($rolePermissions, $userPermissions))));
        });
    }

    public function hasRole(string $role): bool
    {
        $normalize = static fn (?string $value): string => strtolower(str_replace(['-', '_', ' '], '', trim((string) $value)));

        return $normalize($this->role) === $normalize($role)
            || ($this->role_ref && $normalize($this->role_ref->name) === $normalize($role));
    }

    public function clearPermissionCache(): void
    {
        Cache::forget("user.{$this->id}.permissions");
        Cache::forget('permissions.all_slugs');
    }

    public function hasPermission($permission): bool
    {
        if ($this->hasRole('super_admin')) return true;
        
        return in_array($permission, $this->all_permissions);
    }

    public function teams(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function ledTeams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Team::class, 'lead_id');
    }

    public function managedTeams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Team::class, 'manager_id');
    }

    public function attendance(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaves(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Leave::class);
    }

    public function department(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function departments(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function documents(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UserDocument::class);
    }
}
