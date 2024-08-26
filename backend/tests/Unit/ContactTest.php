<?php

namespace Tests\Unit;

use App\Models\Contact;
use App\Models\ContactBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_contact()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);

        $response = $this->postJson("/api/contact-books/{$contactBook->id}/contacts", [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone' => '1234567890',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'phone',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('contacts', ['email' => 'johndoe@example.com']);
    }

    /** @test */
    public function it_can_view_a_contact()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);

        $contact = Contact::factory()->create([
            'contact_book_id' => $contactBook->id,
            'name' => 'Jane Doe',
        ]);

        $response = $this->getJson("/api/contact-books/{$contactBook->id}/contacts/{$contact->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $contact->id,
                'name' => 'Jane Doe',
            ]);
    }

    /** @test */
    public function it_can_update_a_contact()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);

        $contact = Contact::factory()->create([
            'contact_book_id' => $contactBook->id,
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'phone' => '1234567890',
        ]);

        $response = $this->putJson("/api/contact-books/{$contactBook->id}/contacts/{$contact->id}", [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'phone' => '0987654321',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $contact->id,
                'name' => 'New Name',
                'email' => 'new@example.com',
                'phone' => '0987654321',
            ]);

        $this->assertDatabaseHas('contacts', ['email' => 'new@example.com']);
    }

    /** @test */
    public function it_can_delete_a_contact()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);

        $contact = Contact::factory()->create([
            'contact_book_id' => $contactBook->id,
            'name' => 'Temporary Contact',
        ]);

        $response = $this->deleteJson("/api/contact-books/{$contactBook->id}/contacts/{$contact->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
    }
}
