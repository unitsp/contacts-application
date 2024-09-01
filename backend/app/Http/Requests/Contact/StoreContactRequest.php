<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('contacts')->where(function ($query) {
                    return $query->where('contact_book_id', $this->route('contactBookId'));
                }),
            ],
            'phone' => 'required|string|max:15',
        ];
    }

}
