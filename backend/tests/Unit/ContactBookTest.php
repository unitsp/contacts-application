<?php

namespace Tests\Unit;

use App\Models\ContactBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class ContactBookTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_contact_book()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['api']);

        $response = $this->postJson(route('contact-books.store'), [
            'name' => 'Personal Contacts',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('contact_books', ['name' => 'Personal Contacts']);
    }

    /** @test */
    public function it_can_view_a_contact_book()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['api']);

        $contactBook = ContactBook::factory()->create(['name' => 'Work Contacts']);
        $contactBook->users()->attach($user->id);

        $response = $this->getJson(route('contact-books.show', $contactBook->id));

        $response->assertStatus(200)
            ->assertJson([
                'id' => $contactBook->id,
                'name' => 'Work Contacts',
            ]);
    }

    /** @test */
    public function it_can_update_a_contact_book()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['api']);

        $contactBook = ContactBook::factory()->create(['name' => 'Old Name']);
        $contactBook->users()->attach($user->id);

        $response = $this->putJson(route('contact-books.update', $contactBook->id), [
            'name' => 'Updated Contacts',
        ]);

        $response->assertStatus(200)
            ->assertJson(['name' => 'Updated Contacts']);

        $this->assertDatabaseHas('contact_books', ['name' => 'Updated Contacts']);
    }

    /** @test */
    public function it_can_delete_a_contact_book()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['api']);

        $contactBook = ContactBook::factory()->create(['name' => 'Temporary Contacts']);
        $contactBook->users()->attach($user->id);

        $response = $this->deleteJson(route('contact-books.destroy', $contactBook->id));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contact_books', ['id' => $contactBook->id]);
    }

    /** @test */
    public function it_can_share_a_contact_book_with_another_user()
    {
        $owner = User::factory()->create();
        $userToShareWith = User::factory()->create();
        Sanctum::actingAs($owner, ['api']);
        $contactBook = ContactBook::factory()->create();
        $contactBook->users()->attach($owner->id);

        $response = $this->postJson(route('contact-books.share', $contactBook->id), [
            'user_id' => $userToShareWith->id,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contact book shared successfully.']);

        $this->assertTrue($contactBook->fresh()->users->contains($userToShareWith));
    }
}
