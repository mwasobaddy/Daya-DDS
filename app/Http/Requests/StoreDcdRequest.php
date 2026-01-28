<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDcdRequest extends FormRequest
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
            // Account Setup
            'fullName' => 'required|string|max:255',
            'nationalId' => 'required|string|unique:users,national_id',
            'dob' => 'required|date|before:18 years ago|after:100 years ago',
            'gender' => 'required|in:Male,Female,Other',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'businessAddress' => 'required|string|max:500',
            'referralCode' => 'nullable|string|exists:users,referral_code',

            // Location
            'country' => 'required|exists:countries,id',
            'county' => 'nullable|exists:counties,id',
            'subcounty' => 'nullable|exists:sub_counties,id',
            'ward' => 'nullable|exists:wards,id',

            // Business Information
            'businessName' => 'required|string|max:255',
            'businessType' => 'required|array',
            'businessType.types' => 'required|array',
            'businessType.types.*' => 'in:kiosk_duka,mini_supermarket,wholesale_shop,hardware_store,agrovet,butchery,boutique,electronics,stationery,general_store,salon,barber_shop,beauty_parlour,tailor,uber,shoe_repair,photography_studio,printing_cyber,laundry,cafe,restaurant,fast_food,mama_mboga,milk_atm,bakery,mobile_money,bank_agent,bill_payment,betting_shop,boda_boda,matatu_sacco,fuel_station,car_wash,church,school_canteen,bar_lounge,pharmacy,clinic,other',
            'businessType.custom' => 'required_if:businessType.types.*,other|string|max:255',
            'operationalDays' => 'required|array|min:1',
            'operationalDays.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'openingTime' => 'required|date_format:H:i',
            'closingTime' => 'required|date_format:H:i',
            'footTrafficEstimate' => 'required|in:1-10 people,11-50 people,51-100 people,101-500 people,500+ people',

            // Content Preferences
            'campaignTypes' => 'required|array|min:1',
            'campaignTypes.*' => 'string|in:music,games,movies,surveys,events_promotions,product_launch,app_downloads,product_promotion,apartment_listing,education_learning,civic_political',
            'musicPreferences' => 'nullable|array',
            'musicPreferences.*' => 'string',
            'safetyPreferences' => 'required|array|min:1',
            'safetyPreferences.*' => 'string|in:Kids Appropriate,Teen Appropriate (13+),Adult Content (18+),No restrictions',
            'footTrafficEstimate' => 'required|string',

            // Wallet Setup
            'pin' => 'required|string|size:4|regex:/^[0-9]+$/',
            'agreeToTerms' => 'required|accepted',
        ];

        // Make location fields required based on country
        if ($this->input('country')) {
            $country = \App\Models\Country::find($this->input('country'));
            if ($country) {
                if (in_array($country->name, ['Kenya', 'Nigeria'])) {
                    $rules['county'] = 'required|exists:counties,id';
                    $rules['subcounty'] = 'required|exists:sub_counties,id';
                    $rules['ward'] = 'required|exists:wards,id';
                }
            }
        }

        return $rules;
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->filled('referralCode')) {
                $referrer = \App\Models\User::where('referral_code', $this->referralCode)->first();
                if (! $referrer) {
                    $validator->errors()->add('referralCode', 'The referral code is invalid.');
                }
            }
        });
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'dob.before' => 'You must be at least 18 years old to register.',
            'dob.after' => 'Please enter a valid date of birth.',
            'country.required' => 'Please select your country.',
            'county.required' => 'Please select your county/state.',
            'subcounty.required' => 'Please select your subcounty/local government.',
            'ward.required' => 'Please select your ward.',
            'country.exists' => 'Selected country is invalid.',
            'county.exists' => 'Selected county/state is invalid.',
            'subcounty.exists' => 'Selected subcounty/local government is invalid.',
            'ward.exists' => 'Selected ward is invalid.',
            'campaignTypes.min' => 'Please select at least one campaign type.',
            'safetyPreferences.min' => 'Please select at least one safety preference.',
        ];
    }
}
