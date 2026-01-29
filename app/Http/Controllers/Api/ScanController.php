<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ScanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    public function __construct(
        private ScanService $scanService
    ) {}

    /**
     * Process QR code scan
     */
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'dcd_user_id' => 'required|integer|exists:users,id',
            'device_identifier' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $geo = null;
        if ($request->has(['latitude', 'longitude'])) {
            $geo = [
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ];
        }

        $result = $this->scanService->processScan(
            $request->dcd_user_id,
            $request->device_identifier,
            $geo,
            $request->userAgent(), // User-Agent header
            $request->ip() // IP address
        );

        if (! $result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'redirect_url' => $result['redirect_url'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'redirect_url' => $result['redirect_url'],
        ]);
    }
}
