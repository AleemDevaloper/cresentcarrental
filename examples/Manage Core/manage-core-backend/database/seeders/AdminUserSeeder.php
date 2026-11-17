<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $email = 'admin@managecore.test';
        $user = User::where('email', $email)->first();
        if (!$user) {
            User::create([
                'name' => 'Admin',
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => 'Admin',
            ]);
            echo "Admin user created with Admin role.\n";
        } else {
            $user->password = Hash::make('password123');
            $user->role = 'Admin';
            $user->save();
            echo "Admin user updated (password reset, Admin role restored).\n";
        }
    }
}
