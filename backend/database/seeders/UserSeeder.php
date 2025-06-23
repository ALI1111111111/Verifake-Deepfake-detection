<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'api_token' => Str::random(60),
                'is_admin' => true,
                'api_limit' => 5000,
                'api_usage' => 0,
            ]
        );

        User::factory()->count(3)->create();
    }
}
