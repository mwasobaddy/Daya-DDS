<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDcdRequest;
use App\Services\DcdService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DcdController extends Controller
{
    public function __construct(
        private DcdService $dcdService
    ) {}

    public function index(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://youtu.be/KBSQg6WPxtU', // Same video as DA for now
                'title' => 'Become a Digital Content Distributor',
                'description' => 'Learn how the DCD program works and how to get started distributing digital content.',
            ]);
        }

        return Inertia::render('dcd/index', [
            'videoUrl' => 'https://youtu.be/KBSQg6WPxtU',
            'title' => 'Become a Digital Content Distributor',
            'description' => 'Learn how the DCD program works and how to get started distributing digital content.',
        ]);
    }

    public function register(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'form' => 'dcd/register',
            ]);
        }

        return Inertia::render('dcd/register');
    }

    public function store(StoreDcdRequest $request)
    {
        try {
            $dcd = $this->dcdService->createDcd($request->validated());

            return redirect()
                ->route('dcd.register')
                ->with('success', 'Digital Content Distributor registration submitted successfully!');
        } catch (\Exception $e) {
            \Log::error('DCD registration failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
