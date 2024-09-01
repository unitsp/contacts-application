<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;

class PusherAuthController extends Controller
{
    public function __invoke(Request $request)
    {
        return auth()->user()
            ? response()->json(Broadcast::auth($request))
            : response()->json(['message' => 'Unauthorized'], 403);
    }
}
