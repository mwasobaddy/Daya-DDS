<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDaRequest extends FormRequest
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
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'nationalId' => 'required|string|unique:users,national_id',
            'dob' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'referralCode' => 'required|string|unique:users,referral_code',
            'country' => 'required|exists:countries,id',
            'county' => 'nullable|exists:counties,id',
            'subcounty' => 'nullable|exists:sub_counties,id',
            'ward' => 'nullable|exists:wards,id',
            'social_platforms' => 'required|array',
            'social_platforms.*' => 'nullable|string',
            'preferred_contact_method' => 'required|string|in:WhatsApp,Telegram,Email,Phone',
            'wallet_type' => 'required|in:Personal,Business,Both',
            'pin' => 'required|string|size:4|regex:/^[0-9]+$/',
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
            'country.required' => 'Please select your country.',
            'county.required' => 'Please select your county/state.',
            'subcounty.required' => 'Please select your subcounty/local government.',
            'ward.required' => 'Please select your ward.',
            'country.exists' => 'Selected country is invalid.',
            'county.exists' => 'Selected county/state is invalid.',
            'subcounty.exists' => 'Selected subcounty/local government is invalid.',
            'ward.exists' => 'Selected ward is invalid.',
        ];
    }
}
