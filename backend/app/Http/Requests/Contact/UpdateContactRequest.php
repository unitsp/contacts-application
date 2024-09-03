<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Extract the contact_book ID and contact ID from the route parameters
        $contactBookId = $this->route('contact_book')['id'] ?? $this->route('contact_book');
        $contactId = $this->route('contact')['id'] ?? $this->route('contact');

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('contacts')->where(function ($query) use ($contactBookId, $contactId) {
                    return $query->where('contact_book_id', $contactBookId)
                        ->where('id', '!=', $contactId);
                }),
            ],
            'phone' => 'required|string|max:15',
        ];
    }
}

