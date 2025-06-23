<?php

namespace Database\Seeders;

use App\Models\Analysis;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnalysisSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            Analysis::factory()->count(3)->create(['user_id' => $user->id]);
            Analysis::factory()->count(2)->create(['user_id' => $user->id]);
        }
    }
}
