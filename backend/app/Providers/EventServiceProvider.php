<?php

namespace App\Providers;

use App\Events\ContactUpdated;
use App\Listeners\LogContactUpdates;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ContactUpdated::class => [
            LogContactUpdates::class,
        ]
    ];

    public function boot()
    {
        //
    }
}
