<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request, $contactBookId)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($contactBookId);

        $contact = $contactBook->contacts()->create($request->validated());

        return response()->json($contact, 201);
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
