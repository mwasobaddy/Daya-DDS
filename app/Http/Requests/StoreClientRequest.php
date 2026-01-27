<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Account Setup
            'businessName' => 'required|string|max:255',
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'country' => ['required', Rule::in(['Kenya','Nigeria'])],

            // Campaign Details
            'campaignTitle' => 'required|string|max:255',
            'accountType' => ['required', Rule::in(['Startup','Artist','Label','NGO','Agency','Business'])],
            'musicalGenres' => 'nullable|array',
            'musicalGenres.*' => 'string',
            'digitalProductLink' => 'required|url',
            'explainerVideo' => 'nullable|url',
            'campaignObjective' => ['required', Rule::in(['Music Promotion','App downloads','Brand Awareness','Product Launch','Event Promotion','Survey'])],
            'budget' => 'required|numeric|min:1',

            // Targeting & Budget
            'contentSafety' => 'required|array|min:1',
            'contentSafety.*' => 'string',
            'targetCountry' => ['required', Rule::in(['Kenya','Nigeria'])],
            'county' => 'nullable|string',
            'subcounty' => 'nullable|string',
            'ward' => 'nullable|string',
            'state' => 'nullable|string',
            'lga' => 'nullable|string',
            'businessTypeTargeting' => 'required|array|min:1',
            'businessTypeTargeting.*' => 'string',
            'campaignStart' => 'required|date',
            'campaignEnd' => 'required|date|after_or_equal:campaignStart',
            'targetAudience' => 'nullable|string',
            'keyObjectives' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $safety = $this->input('contentSafety') ?? [];
            if (is_array($safety) && in_array('Kids Appropriate', $safety) && in_array('Adult Content (18+)', $safety)) {
                $validator->errors()->add('contentSafety', 'You cannot select both Kids Appropriate and Adult Content at the same time.');
            }

            // If account type is Artist or Label, recommend at least one genre
            if (in_array($this->input('accountType'), ['Artist', 'Label'])) {
                $genres = $this->input('musicalGenres') ?? [];
                if (empty($genres) || !is_array($genres)) {
                    $validator->errors()->add('musicalGenres', 'Please select at least one genre for Artist/Label account types.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email is already registered.',
            'phone.unique' => 'Phone number is already registered.',
            'budget.numeric' => 'Budget must be a numeric value.',
            'campaignEnd.after_or_equal' => 'Campaign end date must be the same or after the start date.',
        ];
    }
}
