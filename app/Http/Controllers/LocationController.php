<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\County;
use App\Models\Da;
use App\Models\Dcd;
use App\Models\Subcounty;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function countries()
    {
        return response()->json(
            Country::select('id', 'name', 'code', 'currency_code', 'currency_symbol')->get()
        );
    }

    public function counties(Request $request)
    {
        $countryId = $request->query('country_id');
        if (! $countryId) {
            return response()->json(['error' => 'Country ID is required'], 400);
        }

        return response()->json(
            County::where('country_id', $countryId)
                ->select('id', 'name', 'code')
                ->get()
        );
    }

    public function subcounties(Request $request)
    {
        $countyId = $request->query('county_id');
        if (! $countyId) {
            return response()->json(['error' => 'County ID is required'], 400);
        }

        return response()->json(
            Subcounty::where('county_id', $countyId)
                ->select('id', 'name', 'code')
                ->get()
        );
    }

    public function wards(Request $request)
    {
        $subcountyId = $request->query('subcounty_id');
        if (! $subcountyId) {
            return response()->json(['error' => 'Subcounty ID is required'], 400);
        }

        return response()->json(
            Ward::where('subcounty_id', $subcountyId)
                ->select('id', 'name', 'code')
                ->get()
        );
    }

    public function validateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');
        $exists = User::where('email', $email)->exists() ||
                 Da::where('email', $email)->exists() ||
                 Dcd::where('email', $email)->exists();

        return response()->json([
            'valid' => !$exists,
            'message' => $exists ? 'This email address is already registered.' : null,
        ]);
    }

    public function validateNationalId(Request $request)
    {
        $request->validate([
            'national_id' => 'required|string',
        ]);

        $nationalId = $request->input('national_id');
        $exists = Da::where('national_id', $nationalId)->exists() ||
                 Dcd::where('national_id', $nationalId)->exists();

        return response()->json([
            'valid' => !$exists,
            'message' => $exists ? 'This National ID is already registered.' : null,
        ]);
    }

    public function validatePhone(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $phone = $request->input('phone');
        $exists = User::where('phone', $phone)->exists() ||
                 Da::where('phone', $phone)->exists() ||
                 Dcd::where('phone', $phone)->exists();

        return response()->json([
            'valid' => !$exists,
            'message' => $exists ? 'This phone number is already registered.' : null,
        ]);
    }
}
