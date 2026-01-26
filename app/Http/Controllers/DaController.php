<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DaController extends Controller
{
    public function index(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://youtu.be/KBSQg6WPxtU',
                'title' => 'DA Explainer',
                'description' => 'Learn how the DA program works and how to get started.',
            ]);
        }
        return Inertia::render('da/index', [
            'videoUrl' => 'https://youtu.be/KBSQg6WPxtU',
            'title' => 'DA Explainer',
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
}
