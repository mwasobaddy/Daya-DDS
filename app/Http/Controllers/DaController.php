<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDaRequest;
use App\Services\DaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DaController extends Controller
{
    public function __construct(
        private DaService $daService
    ) {}

    public function index(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://youtu.be/KBSQg6WPxtU',
                'title' => 'Become a Digital Ambassador',
                'description' => 'Learn how the DA program works and how to get started.',
            ]);
        }
        return Inertia::render('da/index', [
            'videoUrl' => 'https://youtu.be/KBSQg6WPxtU',
            'title' => 'Become a Digital Ambassador',
            'description' => 'Learn how the DA program works and how to get started.',
        ]);
    }

    public function register(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'form' => 'da/register',
            ]);
        }
        return Inertia::render('da/register');
    }

    public function store(StoreDaRequest $request)
    {
        try {
            $da = $this->daService->createDa($request->validated());

            return redirect()
                ->route('da.register')
                ->with('success', 'Digital Ambassador registration submitted successfully!');
        } catch (\Exception $e) {
            \Log::error('DA registration failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated()
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
