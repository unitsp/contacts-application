<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function rules(): array
    {
        $contactBookId = $this->route('contact_book')['id'] ?? $this->route('contact_book');
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('contacts')->where(function ($query) use ($contactBookId) {
                    return $query->where('contact_book_id', $contactBookId);
                }),
            ],
            'phone' => ['required', 'string', 'max:20'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
