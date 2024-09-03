<?php

namespace App\Models;

use App\Events\ContactUpdated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = ['contact_book_id', 'name', 'email', 'phone'];

    protected static function boot()
    {
        parent::boot();

        static::updating(function ($contact) {
            $original = $contact->getOriginal();
            event(new ContactUpdated($contact, $original));
        });
    }

    public function contactBook(): BelongsTo
    {
        return $this->belongsTo(ContactBook::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ContactHistory::class);
    }
}

