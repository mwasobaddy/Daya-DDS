<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://youtu.be/McXEUnrJ3-E',
                'title' => 'Create a Campaign',
                'description' => 'Create targeted campaigns and reach customers through the DCD network.'
            ]);
        }

        return Inertia::render('client/index', [
            'videoUrl' => 'https://youtu.be/McXEUnrJ3-E',
            'title' => 'Create a Campaign',
            'description' => 'Create targeted campaigns and reach customers through the DCD network.'
        ]);
    }

    public function register(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json(['form' => 'client/register']);
        }

        return Inertia::render('client/register');
    }

    public function store(StoreClientRequest $request)
    {
        try {
            // TODO: Implement client campaign creation with a service
            // $campaign = $this->clientService->createCampaign($request->validated());

            return redirect()
                ->route('client.register')
                ->with('success', 'Campaign submitted successfully!');
        } catch (\Exception $e) {
            Log::error('Client campaign submission failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Campaign submission failed. Please try again.']);
        }
    }
}
