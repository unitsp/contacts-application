<?php

namespace App\Http\Controllers;

use App\Events\ContactBooksListChanged;
use App\Events\ContactDeleted;
use App\Http\Requests\ContactBookRequest;
use App\Models\ContactBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactBookController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->contactBooks()->with('contacts')->get());
    }

    public function store(ContactBookRequest $request)
    {
        $contactBook = ContactBook::create($request->validated());
        $currentUserId = Auth::id();
        $contactBook->users()->attach($currentUserId);
        broadcast(new ContactBooksListChanged($currentUserId))->toOthers();
        return response()->json($contactBook, 201);
    }

    public function show($id)
    {
        $contactBook = Auth::user()->contactBooks()->with('contacts')->findOrFail($id);
        return response()->json($contactBook);
    }

    public function update(ContactBookRequest $request, ContactBook $contactBook)
    {

        $contactBook->update($request->validated());
        broadcast(new ContactBooksListChanged(Auth::id()))->toOthers();
        return response()->json($contactBook);
    }

    public function destroy(ContactBook $contactBook)
    {
        $contactBook->delete();
        broadcast(new ContactBooksListChanged(Auth::id()))->toOthers();
        return response()->json(null, 204);
    }
}
