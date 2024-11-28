<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactBook;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::factory()->create([
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user);

        Contact::factory(10)->create([
            'contact_book_id' => $contactBook->id,
        ]);
    }
}
