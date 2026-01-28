<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct(
        private ClientService $clientService
    ) {}

    public function index(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://www.youtube.com/embed/KBSQg6WPxtU',
                'title' => 'Launch Your Digital Campaign',
                'description' => 'Discover how the Daya ecosystem empowers you to distribute digital content and reach targeted audiences.',
            ]);
        }

        return Inertia::render('client/index', [
            'videoUrl' => 'https://www.youtube.com/embed/KBSQg6WPxtU',
            'title' => 'Launch Your Digital Campaign',
            'description' => 'Discover how the Daya ecosystem empowers you to distribute digital content and reach targeted audiences.',
        ]);
    }

    public function register(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'form' => 'client/register',
            ]);
        }

        return Inertia::render('client/register');
    }

    public function store(StoreClientRequest $request)
    {
        try {
            $client = $this->clientService->createClient($request->validated());

            return redirect()
                ->route('client.register')
                ->with('success', 'Client campaign registration submitted successfully!');
        } catch (\Exception $e) {
            \Log::error('Client registration failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
