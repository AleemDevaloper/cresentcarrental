<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;




class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);

        User::firstOrCreate(
            ['email' => 'admin@managecore.test'],
            [
                'name' => 'Admin',
                'emp_id' => 'ADMIN-1',
                'role' => 'Admin',
                'password' => 'password123',
            ],
        );

        User::firstOrCreate(
            ['email' => 'superadmin@managecore.test'],
            [
                'name' => 'superadmin',
                'emp_id' => 'SUPERADMIN-1',
                'role' => 'SuperAdmin',
                'password' => 'Superadmin@123!',
            ],
        );

    }
}
