<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request)
    {
        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            abort(401, 'Invalid login credentials');
        }
        $user = Auth::user();
        return response()->json([
            'user' => $user,
            'token' => $user->createToken('MyApp')->plainTextToken
        ], 200);
    }
}
