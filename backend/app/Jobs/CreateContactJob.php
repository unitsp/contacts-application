<?php

namespace App\Jobs;

use App\Events\ContactCreated;
use App\Models\ContactBook;
use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CreateContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $contactBook;
    protected $contactData;

    /**
     * Create a new job instance.
     *
     * @param ContactBook $contactBook
     * @param array $contactData
     */
    public function __construct(ContactBook $contactBook, array $contactData)
    {
        $this->contactBook = $contactBook;
        $this->contactData = $contactData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('CreateContactJob has been processed.');
        sleep(config('app.delay'));
        $contact = $this->contactBook->contacts()->create($this->contactData);
        broadcast(new ContactCreated($contact))->toOthers();
    }
}
