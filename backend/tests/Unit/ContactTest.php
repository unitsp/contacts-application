<?php

namespace Tests\Unit\Controllers;

use Tests\TestCase;
use App\Models\User;
use App\Models\Contact;
use App\Models\ContactBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Event;
use App\Jobs\CreateContactJob;
use App\Jobs\UpdateContactJob;
use App\Events\ContactDeleted;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        Event::fake();
    }

    public function test_index_returns_contacts_for_contact_book()
    {
        $user = User::factory()->create();
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);
        $contacts = Contact::factory()->for($contactBook)->count(3)->create();

        $response = $this->actingAs($user)->getJson(route('contacts.index', $contactBook));

        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($contacts as $contact) {
            $response->assertJsonFragment($contact->toArray());
        }
    }

    public function test_store_dispatches_create_contact_job()
    {
        $user = User::factory()->create();
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);

        $data = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone' => '1234567890',
        ];

        $response = $this->actingAs($user)->postJson(route('contacts.store', $contactBook), $data);

        $response->assertStatus(202)
            ->assertJson(['message' => 'Contact creation task has been created']);

        Queue::assertPushed(CreateContactJob::class);
    }

    public function test_show_returns_contact()
    {
        $user = User::factory()->create();
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);
        $contact = Contact::factory()->for($contactBook)->create();

        $response = $this->actingAs($user)->getJson(route('contacts.show', [$contactBook->id, $contact->id]));

        $response->assertStatus(200)
            ->assertJson($contact->toArray());
    }

    public function test_update_dispatches_update_contact_job()
    {
        $user = User::factory()->create();
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);
        $contact = Contact::factory()->for($contactBook)->create();

        $data = [
            'name' => 'Jane Doe',
            'email' => 'janedoe@example.com',
            'phone' => '0987654321',
        ];

        $response = $this->actingAs($user)->putJson(route('contacts.update', [$contactBook->id, $contact->id]), $data);
        $response->assertStatus(202)
            ->assertJson(['message' => 'Contact update task has been created']);

        Queue::assertPushed(UpdateContactJob::class);
    }

    public function test_destroy_deletes_contact_and_broadcasts_event()
    {
        $user = User::factory()->create();
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($user->id);
        $contact = Contact::factory()->for($contactBook)->create();

        $response = $this->actingAs($user)->deleteJson(route('contacts.destroy', [$contactBook->id, $contact->id]));

        $response->assertStatus(204);

        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);

        Event::assertDispatched(ContactDeleted::class);
    }
}
