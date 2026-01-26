<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\County;
use App\Models\Subcounty;
use App\Models\Ward;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function countries()
    {
        return response()->json(
            Country::select('id', 'name', 'code')->get()
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
}
