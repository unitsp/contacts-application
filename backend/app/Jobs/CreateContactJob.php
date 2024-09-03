<?php

namespace App\Jobs;

use App\Events\ContactCreated;
use App\Models\ContactBook;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected ContactBook $contactBook;
    protected array $contactData;

    public function __construct(ContactBook $contactBook, array $contactData)
    {
        $this->contactBook = $contactBook;
        $this->contactData = $contactData;
    }

    public function handle()
    {
        sleep(config('app.delay'));
        $contact = $this->contactBook->contacts()->firstOrCreate(
            [
                'email' => $this->contactData['email']
            ],
            $this->contactData
        );
        broadcast(new ContactCreated($this->contactBook->id))->toOthers();
    }
}
