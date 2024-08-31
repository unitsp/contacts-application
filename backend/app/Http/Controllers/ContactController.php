<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Jobs\CreateContactJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\ContactBook;
use App\Models\Contact;

class ContactController extends Controller
{
    protected function findContactBook($contactBookId): ContactBook
    {
        return Auth::user()->contactBooks()->findOrFail($contactBookId);
    }

    protected function findContact(ContactBook $contactBook, $contactId): Contact
    {
        return $contactBook->contacts()->findOrFail($contactId);
    }

    public function index($contactBookId): JsonResponse
    {
        $contactBook = $this->findContactBook($contactBookId);
        $contacts = $contactBook->contacts()->get();
        return response()->json($contacts);
    }

    public function store(StoreContactRequest $request, $contactBookId): JsonResponse
    {
        $contactBook = $this->findContactBook($contactBookId);
        CreateContactJob::dispatch($contactBook, $request->validated());
        return response()->json(['message' => 'Contact creation task has been created'], 202);
    }

    public function show($contactBookId, $contactId): JsonResponse
    {
        $contactBook = $this->findContactBook($contactBookId);
        $contact = $this->findContact($contactBook, $contactId);
        return response()->json($contact);
    }

    public function update(UpdateContactRequest $request, $contactBookId, $contactId): JsonResponse
    {
        $contactBook = $this->findContactBook($contactBookId);
        $contact = $this->findContact($contactBook, $contactId);
        $contact->update($request->validated());
        return response()->json($contact);
    }

    public function destroy($contactBookId, $contactId): JsonResponse
    {
        $contactBook = $this->findContactBook($contactBookId);
        $contact = $this->findContact($contactBook, $contactId);
        $contact->delete();
        return response()->json(null, 204);
    }
}
