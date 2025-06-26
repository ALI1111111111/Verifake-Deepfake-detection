<?php

namespace Database\Factories;

use App\Models\Analysis;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalysisFactory extends Factory
{
    protected $model = Analysis::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'file_path' => 'analyses/sample.jpg',
            'result' => ['score' => $this->faker->randomFloat(2, 0, 1)],
            'service' => $this->faker->randomElement(['deepfake', 'face', 'wad', 'offensive', 'properties', 'celebrity']),
        ];
    }
}
