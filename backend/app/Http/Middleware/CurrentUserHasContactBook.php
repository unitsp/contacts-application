<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CurrentUserHasContactBook
{
    public function handle(Request $request, Closure $next): Response
    {
        $contactBookId = $request->route('contact_book');
        Auth::user()->canAccessContactBook($contactBookId);
        return $next($request);
    }
}
