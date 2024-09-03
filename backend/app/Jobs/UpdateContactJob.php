<?php

namespace App\Jobs;

use App\Events\ContactCreated;
use App\Events\ContactUpdated;
use App\Models\ContactBook;
use App\Models\Contact;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $contact;
    protected $contactData;

    /**
     * Create a new job instance.
     *
     * @param ContactBook $contactBook
     * @param array $contactData
     */
    public function __construct($contactId, array $contactData)
    {
        $this->contact = Contact::findOrFail($contactId);
        $this->contactData = $contactData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        sleep(config('app.delay'));
        $this->contact->update($this->contactData);
        broadcast(new ContactUpdated($this->contact->contactBook->id))->toOthers();
    }
}
