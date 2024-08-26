<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;
    protected $fillable = ['contact_book_id', 'name', 'email', 'phone'];

    public function contactBook()
    {
        return $this->belongsTo(ContactBook::class);
    }
}
