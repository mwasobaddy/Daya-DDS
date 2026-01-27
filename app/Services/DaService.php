<?php

namespace App\Services;

use App\Models\Da;
use App\Models\User;
use App\Models\VentureShare;
use App\Models\Referral;
use App\Notifications\DaAccountSetupNotification;
use App\Notifications\DaReferralRewardNotification;
use App\Notifications\DaWalletCreatedNotification;
use App\Notifications\NewDaRegistrationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

class DaService
{
    public function createDa(array $data): Da
    {
        return DB::transaction(function () use ($data) {
            // Map gender
            $gender = match ($data['gender']) {
                'Male' => 'male',
                'Female' => 'female',
                default => 'male', // or handle other
            };

            // Handle referral logic
            $referrer = null;
            if (! empty($data['referralCode'])) {
                $referrer = User::where('referral_code', $data['referralCode'])->first();
            } else {
                // No referral code provided - assign to admin with least tokens
                $referrer = $this->getAdminWithLeastTokens();
            }

            // Count current DA users
            $currentDaCount = User::where('role', 'da')->count();
            $shouldAwardTokens = $currentDaCount < 3000;

            // Create user first
            $user = User::create([
                'role' => 'da',
                'full_name' => $data['fullName'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'national_id' => $data['nationalId'],
                'dob' => $data['dob'],
                'gender' => $gender,
                'country_id' => $data['country'] ?? null,
                'county_id' => $data['county'] ?? null,
                'subcounty_id' => $data['subcounty'] ?? null,
                'ward_id' => $data['ward'] ?? null,
                'referral_code' => $this->generateUniqueReferralCode(),
                'wallet_type' => $data['wallet_type'],
                'wallet_status' => 'active', // Changed from pending to active
                'wallet_pin' => $data['pin'],
                'wallet_balance' => '0.00',
                'total_DDS_balance' => '0.00',
                'total_DWS_balance' => '0.00',
                'password' => Hash::make('temporary_password'), // TODO: handle proper password
            ]);

            // Create DA record
            $da = Da::create([
                'user_id' => $user->id,
                'social_platforms' => $data['social_platforms'],
                'prefered_contact_method' => $data['preferred_contact_method'],
            ]);

            // Create referral record
            if ($referrer) {
                $referralType = $this->determineReferralType($referrer, $user);
                Referral::create([
                    'referrer_id' => $referrer->id,
                    'referred_id' => $user->id,
                    'type' => $referralType,
                ]);
            }

            // Handle token awards if DA count is below 3000
            if ($shouldAwardTokens && $referrer) {
                $this->awardReferralTokens($referrer, $user);
            }

            // Send notifications
            $this->sendNotifications($user, $referrer, $shouldAwardTokens);

            return $da;
        });
    }

    /**
     * Get admin with least DDS and DWS tokens combined
     */
    private function getAdminWithLeastTokens(): ?User
    {
        return User::where('role', 'admin')
            ->selectRaw('*, (CAST(total_DDS_balance AS DECIMAL) + CAST(total_DWS_balance AS DECIMAL)) as total_tokens')
            ->orderBy('total_tokens', 'asc')
            ->first();
    }

    /**
     * Generate a unique referral code
     */
    private function generateUniqueReferralCode(): string
    {
        do {
            $code = 'DA'.strtoupper(substr(md5(uniqid()), 0, 8));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * Determine the referral type based on referrer and referred user roles
     */
    private function determineReferralType(User $referrer, User $referred): string
    {
        $referrerRole = $referrer->role;
        $referredRole = $referred->role;

        return match ($referrerRole) {
            'admin' => 'admin_to_da',
            'da' => 'da_to_da',
            'dcd' => 'dcd_to_da',
            default => 'admin_to_da', // fallback
        };
    }

    /**
     * Award referral tokens to referrer
     */
    private function awardReferralTokens(User $referrer, User $newDa): void
    {
        $ddsAward = 200.00;
        $dwsAward = 200.00;

        // Update referrer's balances
        $referrer->increment('total_DDS_balance', $ddsAward);
        $referrer->increment('total_DWS_balance', $dwsAward);

        // Create venture share record
        VentureShare::create([
            'user_id' => $referrer->id,
            'dds_earned' => $ddsAward,
            'dws_earned' => $dwsAward,
            'reason' => 'DA Referral: '.$newDa->full_name,
        ]);
    }

    /**
     * Send all required notifications
     */
    private function sendNotifications(User $newDa, ?User $referrer, bool $tokensAwarded): void
    {
        // Send account setup email to new DA
        $newDa->notify(new DaAccountSetupNotification);

        // Send wallet creation email to new DA
        $newDa->notify(new DaWalletCreatedNotification($newDa->wallet_type, $newDa->wallet_pin));

        // Send referral reward notification to referrer (if tokens were awarded)
        if ($tokensAwarded && $referrer) {
            $referrer->notify(new DaReferralRewardNotification(
                $newDa,
                200, // DDS awarded
                200, // DWS awarded
                $referrer->total_DDS_balance,
                $referrer->total_DWS_balance
            ));
        }

        // Send notification to all admins about new DA
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewDaRegistrationNotification($newDa, $referrer));
    }
}
