<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        // Add exceptions here that should not be reported
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            // Customize how exceptions are reported here
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        // Log every exception
        Log::error('Exception caught:', [
            'exception' => $exception,
            'request' => $request->all(),
        ]);

        // Optionally add the exception to Laravel Pulse, if enabled
        if (App::bound('pulse')) {
            App::make('pulse')->addException($exception);
        }

        // Handle authentication exceptions
        if ($exception instanceof AuthenticationException) {
            return response()->json(['error' => 'Unauthenticated.'], Response::HTTP_UNAUTHORIZED);
        }

        // Handle authorization exceptions
        if ($exception instanceof AuthorizationException) {
            return response()->json(['error' => 'This action is unauthorized.'], Response::HTTP_FORBIDDEN);
        }

        // Handle model not found exceptions
        if ($exception instanceof ModelNotFoundException) {
            return response()->json(['error' => 'Resource not found.'], Response::HTTP_NOT_FOUND);
        }

        // Handle validation exceptions
        if ($exception instanceof ValidationException) {
            return response()->json([
                'error' => 'Validation failed.',
                'messages' => $exception->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Handle HTTP exceptions (e.g., those triggered by abort())
        if ($exception instanceof HttpException) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], $exception->getStatusCode());
        }

        // Handle generic HTTP response exceptions
        if ($exception instanceof HttpResponseException) {
            return $exception->getResponse();
        }

        // Handle other exceptions globally
        if ($request->expectsJson()) {
            return response()->json([
                'error' => $exception->getMessage(),
                'trace' => config('app.debug') ? $exception->getTrace() : null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Default to the parent handler for non-JSON requests
        return parent::render($request, $exception);
    }
}
