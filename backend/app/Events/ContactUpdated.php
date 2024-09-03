<?php

namespace App\Events;

use App\Models\Contact;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ContactUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Contact $contact;
    public array $original;

    public function __construct(Contact $contact, array $original)
    {
        $this->contact = $contact;
        $this->original = $original;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('contact-book.' . $this->contact->contact_book_id);
    }
}
