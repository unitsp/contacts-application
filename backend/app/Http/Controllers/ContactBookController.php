<?php

namespace App\Http\Controllers;

use App\Models\ContactBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactBookController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->contactBooks()->with('contacts')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $contactBook = ContactBook::create($validated);
        $contactBook->users()->attach(Auth::id());

        return response()->json($contactBook, 201);
    }

    public function show($id)
    {
        $contactBook = Auth::user()->contactBooks()->with('contacts')->findOrFail($id);
        return response()->json($contactBook);
    }

    public function update(Request $request, $id)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
        ]);

        $contactBook->update($validated);

        return response()->json($contactBook);
    }

    public function destroy($id)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($id);
        $contactBook->delete();

        return response()->json(null, 204);
    }

    public function share($id, Request $request)
    {
        $contactBook = Auth::user()->contactBooks()->findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $contactBook->users()->attach($validated['user_id']);

        return response()->json(['message' => 'Contact book shared successfully.']);
    }
}
