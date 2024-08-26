<?php

namespace Database\Factories;

use App\Models\ContactBook;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactBookFactory extends Factory
{
    protected $model = ContactBook::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
        ];
    }
}
