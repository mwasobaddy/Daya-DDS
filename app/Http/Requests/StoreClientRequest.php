<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'companyName' => 'required|string|max:255',
            'contactPerson' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|regex:/^\+\d{1,4}\d+$/|unique:users,phone',
            'businessAddress' => 'required|string|max:500',
            'country' => 'required|exists:countries,id',
            'county' => 'nullable|exists:counties,id',
            'subcounty' => 'nullable|exists:sub_counties,id',
            'ward' => 'nullable|exists:wards,id',
            'accountType' => 'required|in:Startup,Artist,Label,NGO,Agency,Business',
            'selectedMusicGenres' => 'nullable|required_if:accountType,Artist|required_if:accountType,Label|array|min:1',
            'selectedMusicGenres.*' => 'string|in:Afrobeat,Afrobeats,Afro-rave,African hip-hop,Afro fusion,Alté,Amapiano,Benga,Bongo Flava,Blues,Classical,Country,Dancehall,Electronic,Folk,Funk,Gengetone,Gospel,Hip Hop,House,Jazz,Kapuka,Kwaito,Lingala,Ohangla,Pop,R&B,Rap,Reggae,Rock,Rumba,Soul,Taarab,Traditional,Trap',
            'campaignObjective' => 'required|in:music_promotion,app_downloads,product_launch,events_promotions,brand_awareness,surveys',
            'campaignName' => 'required|string|max:255',
            'campaignDescription' => 'required|string|min:50|max:2000',
            'campaignDuration' => 'required|integer|min:1|max:365',
            'startDate' => 'required|date|after_or_equal:today',
            'endDate' => 'required|date|after:startDate',
            'targetAudience' => 'required|string|min:50|max:2000',
            'selectedSafetyPreferences' => 'required|array|min:1',
            'selectedSafetyPreferences.*' => 'string|in:Safe for Work,Safe for Family,No restrictions',
            'selectedBusinessTypes' => 'required|array|min:1',
            'selectedBusinessTypes.*' => 'string|in:kiosk_duka,mini_supermarket,wholesale_shop,hardware_store,agrovet,butchery,boutique,electronics,stationery,general_store,salon,barber_shop,beauty_parlour,tailor,uber,shoe_repair,photography_studio,printing_cyber,laundry,cafe,restaurant,fast_food,mama_mboga,milk_atm,bakery,mobile_money,bank_agent,bill_payment,betting_shop,boda_boda,matatu_sacco,fuel_station,car_wash,church,school_canteen,bar_lounge,pharmacy,clinic,other',
            'otherBusinessType' => 'nullable|required_if:selectedBusinessTypes.*,other|string|max:255',
            'totalBudget' => 'required|numeric|min:0.01',
            'targetCountry' => 'nullable|exists:countries,id',
            'targetCounty' => 'nullable|exists:counties,id',
            'targetSubcounty' => 'nullable|exists:sub_counties,id',
            'targetWard' => 'nullable|exists:wards,id',
        ];

        // Make location fields required based on country
        if ($this->input('country')) {
            $country = \App\Models\Country::find($this->input('country'));
            if ($country) {
                if ($country->name === 'Kenya') {
                    $rules['county'] = 'required|exists:counties,id';
                    $rules['subcounty'] = 'required|exists:sub_counties,id';
                    $rules['ward'] = 'required|exists:wards,id';
                } elseif ($country->name === 'Nigeria') {
                    $rules['county'] = 'required|exists:counties,id';
                    $rules['subcounty'] = 'required|exists:sub_counties,id';
                    $rules['ward'] = 'required|exists:wards,id';
                }
            }
        }

        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'companyName.required' => 'Company name is required.',
            'contactPerson.required' => 'Contact person is required.',
            'businessAddress.required' => 'Business address is required.',
            'accountType.required' => 'Campaign type is required.',
            'accountType.in' => 'Campaign type must be Startup, Artist, Label, NGO, Agency, or Business.',
            'musicPreference.required_if' => 'Music preference is required for Artist and Label campaigns.',
            'musicPreference.in' => 'Music preference must be either Artist or Label.',
            'campaignObjective.required' => 'Campaign objective is required.',
            'campaignObjective.in' => 'Please select a valid campaign objective.',
            'campaignName.required' => 'Campaign name is required.',
            'campaignDescription.required' => 'Campaign description is required.',
            'campaignDescription.min' => 'Campaign description must be at least 50 characters.',
            'campaignDescription.max' => 'Campaign description must not exceed 2000 characters.',
            'campaignDuration.required' => 'Campaign duration is required.',
            'campaignDuration.integer' => 'Campaign duration must be a valid number.',
            'campaignDuration.min' => 'Campaign duration must be at least 1 day.',
            'campaignDuration.max' => 'Campaign duration cannot exceed 365 days.',
            'startDate.required' => 'Start date is required.',
            'startDate.date' => 'Start date must be a valid date.',
            'startDate.after_or_equal' => 'Start date cannot be in the past.',
            'endDate.required' => 'End date is required.',
            'endDate.date' => 'End date must be a valid date.',
            'endDate.after' => 'End date must be after the start date.',
            'targetAudience.required' => 'Target audience description is required.',
            'targetAudience.min' => 'Target audience description must be at least 50 characters.',
            'targetAudience.max' => 'Target audience description must not exceed 2000 characters.',
            'selectedSafetyPreferences.min' => 'At least one safety preference must be selected.',
            'selectedBusinessTypes.required' => 'At least one business type must be selected.',
            'selectedBusinessTypes.min' => 'At least one business type must be selected.',
            'selectedBusinessTypes.*.in' => 'Invalid business type selected.',
            'totalBudget.required' => 'Total budget is required.',
            'totalBudget.numeric' => 'Total budget must be a valid number.',
            'totalBudget.min' => 'Total budget must be greater than 0.',
            'country.required' => 'Please select your country.',
            'county.required' => 'Please select your county/state.',
            'subcounty.required' => 'Please select your subcounty/local government.',
            'ward.required' => 'Please select your ward.',
            'country.exists' => 'Selected country is invalid.',
            'county.exists' => 'Selected county/state is invalid.',
            'subcounty.exists' => 'Selected subcounty/local government is invalid.',
            'ward.exists' => 'Selected ward is invalid.',
            'phone.regex' => 'Phone number must be in format: +254700000000',
        ];
    }
}
