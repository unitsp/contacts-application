<?php
namespace App\Listeners;

use App\Events\ContactUpdated;
use App\Models\ContactHistory;
use Illuminate\Support\Facades\Log;

class LogContactUpdates
{
    public function handle(ContactUpdated $event)
    {
        $changes = [];

        foreach ($event->contact->getDirty() as $attribute => $new_value) {
            $old_value = $event->original[$attribute];
            $changes[$attribute] = [
                'old' => $old_value,
                'new' => $new_value,
            ];
        }

        if (!empty($changes)) {
            ContactHistory::create([
                'contact_id' => $event->contact->id,
                'changes' => $changes,
            ]);
        }
    }
}

