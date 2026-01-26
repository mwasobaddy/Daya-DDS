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
        return [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'nationalId' => 'required|string|unique:users,national_id',
            'dob' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'referralCode' => 'required|string|unique:users,referral_code',
            'country' => 'required|string',
            'county' => 'nullable|string',
            'subcounty' => 'nullable|string',
            'ward' => 'nullable|string',
            'state' => 'nullable|string',
            'lga' => 'nullable|string',
            'nigeriaWard' => 'nullable|string',
            'social_platforms' => 'required|array',
            'social_platforms.*' => 'nullable|string',
            'preferred_contact_method' => 'required|string|in:WhatsApp,Telegram,Email,Phone',
            'wallet_type' => 'required|in:Personal,Business,Both',
            'pin' => 'required|string|size:4|regex:/^[0-9]+$/',
        ];
    }
}
