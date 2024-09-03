<?php

namespace App\Http\Controllers;

use App\Events\ContactDeleted;
use App\Events\ContactUpdated;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Jobs\CreateContactJob;
use App\Jobs\UpdateContactJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\ContactBook;
use App\Models\Contact;

class ContactController extends Controller
{

    public function index(ContactBook $contactBook): JsonResponse
    {
        $contacts = $contactBook->contacts()->get();
        return response()->json($contacts);
    }

    public function store(StoreContactRequest $request, ContactBook $contactBook): JsonResponse
    {
        CreateContactJob::dispatch($contactBook, $request->validated());
        return response()->json(['message' => 'Contact creation task has been created'], 202);
    }

    public function show($contactBookId, Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(UpdateContactRequest $request, $contactBookId, $contactId): JsonResponse
    {
        UpdateContactJob::dispatch($contactId, $request->validated());
        return response()->json(['message' => 'Contact update task has been created'], 202);
    }

    public function destroy($contactBookId, Contact $contact): JsonResponse
    {
        $contact->delete();
        broadcast(new ContactDeleted($contactBookId))->toOthers();
        return response()->json(null, 204);
    }
}
