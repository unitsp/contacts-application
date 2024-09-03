<?php

namespace App\Events;

use App\Models\Contact;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContactUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $contactBookId;
    public function __construct(int $contactBookId)
    {
        $this->contactBookId = $contactBookId;
    }
    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('contact-book.' . $this->contactBookId);
    }
}
