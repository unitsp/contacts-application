<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Jobs\CreateContactJob;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request, $contactBookId)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($contactBookId);
        // Dispatch the job to create the contact
        CreateContactJob::dispatch($contactBook, $request->validated());
        // Return a 202 Accepted response indicating the task has been created
        return response()->json(['message' => 'Contact creation task has been created'], 202);
    }

    public function show($contactBookId, $id)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($contactBookId);
        $contact = $contactBook->contacts()->findOrFail($id);
        return response()->json($contact);
    }

    public function update(UpdateContactRequest $request, $contactBookId, $id)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($contactBookId);
        $contact = $contactBook->contacts()->findOrFail($id);

        $contact->update($request->validated());

        return response()->json($contact);
    }

    public function destroy($contactBookId, $id)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($contactBookId);
        $contact = $contactBook->contacts()->findOrFail($id);
        $contact->delete();

        return response()->json(null, 204);
    }
}
