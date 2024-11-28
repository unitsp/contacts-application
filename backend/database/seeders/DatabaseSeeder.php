<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactBook;
use App\Models\User;
use Database\Factories\ContactFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ContactSeeder::class);
    }
}
