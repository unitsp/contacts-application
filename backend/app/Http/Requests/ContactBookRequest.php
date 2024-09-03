<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactBookRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
