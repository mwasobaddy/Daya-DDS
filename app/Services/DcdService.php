<?php

namespace App\Services;

use App\Models\Dcd;
use App\Models\User;
use App\Models\VentureShare;
use App\Notifications\DcdAccountSetupNotification;
use App\Notifications\DcdReferralRewardNotification;
use App\Notifications\DcdWalletCreatedNotification;
use App\Notifications\NewDcdRegistrationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

class DcdService
{
    public function createDcd(array $data): Dcd
    {
        return DB::transaction(function () use ($data) {
            // Map gender
            $gender = match ($data['gender']) {
                'Male' => 'male',
                'Female' => 'female',
                default => 'male',
            };

            // Handle referral logic
            $referrer = null;
            if (! empty($data['referralCode'])) {
                $referrer = User::where('referral_code', $data['referralCode'])->first();
            } else {
                // No referral code provided - assign to admin with least tokens
                $referrer = $this->getAdminWithLeastTokens();
            }

            // Count current DCD users
            $currentDcdCount = User::where('role', 'dcd')->count();
            $shouldAwardTokens = $currentDcdCount < 3000;

            // Create user first
            $user = User::create([
                'role' => 'dcd',
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
                'wallet_type' => 'Business', // DCDs have business wallets
                'wallet_status' => 'active',
                'wallet_pin' => $data['pin'],
                'wallet_balance' => '0',
                'total_DDS_balance' => '0',
                'total_DWS_balance' => '0',
                'password' => Hash::make('temporary_password'), // TODO: handle proper password
            ]);

            // Generate QR code for the DCD
            $qrCodePath = $this->generateQrCode($user);

            // Create DCD record
            $dcd = Dcd::create([
                'user_id' => $user->id,
                'business_name' => $data['businessName'],
                'business_address' => $data['businessAddress'],
                'business_type' => $data['businessType'],
                'operating_days' => $data['operationalDays'],
                'opening_time' => $data['openingTime'],
                'closing_time' => $data['closingTime'],
                'foot_traffic_estimate' => $data['footTrafficEstimate'],
                'campaign_types' => $data['campaignTypes'],
                'music_preferences' => $data['musicPreferences'] ?? [],
                'safety_preferences' => $data['safetyPreferences'],
                'qr_code_path' => $qrCodePath,
            ]);

            // Handle token awards if DCD count is below 3000
            if ($shouldAwardTokens && $referrer) {
                $this->awardReferralTokens($referrer, $user);
            }

            // Send notifications
            $this->sendNotifications($user, $referrer, $shouldAwardTokens);

            return $dcd;
        });
    }

    /**
     * Parse operating hours to get operating days
     */
    private function parseOperatingDays(string $operatingHours): array
    {
        // This is a simplified implementation - you might want to make this more sophisticated
        if ($operatingHours === '24/7') {
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        } elseif ($operatingHours === 'Business Hours') {
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        } elseif ($operatingHours === 'Custom Hours') {
            // For custom hours, we'd need to parse the customOperatingHours field
            // For now, return weekdays as default
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        }

        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }

    /**
     * Generate QR code for DCD
     */
    private function generateQrCode(User $user): string
    {
        // Generate a simple QR code path - in a real implementation,
        // you'd use a QR code library to generate the actual image
        $qrCodePath = 'qrcodes/dcd_'.$user->id.'.png';

        // For now, just return the path - QR code generation would be implemented here
        // using a library like simplesoftwareio/simple-qrcode

        return $qrCodePath;
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
            $code = 'DCD'.strtoupper(substr(md5(uniqid()), 0, 8));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * Award referral tokens to referrer
     */
    private function awardReferralTokens(User $referrer, User $newDcd): void
    {
        $ddsAward = 500; // Higher reward for DCD referrals
        $dwsAward = 500;

        // Update referrer's balances
        $referrer->increment('total_DDS_balance', $ddsAward);
        $referrer->increment('total_DWS_balance', $dwsAward);

        // Create venture share record
        VentureShare::create([
            'user_id' => $referrer->id,
            'dds_earned' => $ddsAward,
            'dws_earned' => $dwsAward,
            'reason' => 'DCD Referral: '.$newDcd->full_name,
        ]);
    }

    /**
     * Send all required notifications
     */
    private function sendNotifications(User $newDcd, ?User $referrer, bool $tokensAwarded): void
    {
        // Send account setup email to new DCD
        $newDcd->notify(new DcdAccountSetupNotification);

        // Send wallet creation email to new DCD
        $newDcd->notify(new DcdWalletCreatedNotification($newDcd->wallet_pin));

        // Send referral reward notification to referrer (if tokens were awarded)
        if ($tokensAwarded && $referrer) {
            $referrer->notify(new DcdReferralRewardNotification(
                $newDcd,
                500, // DDS awarded
                500, // DWS awarded
                $referrer->total_DDS_balance,
                $referrer->total_DWS_balance
            ));
        }

        // Send notification to all admins about new DCD
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewDcdRegistrationNotification($newDcd, $referrer));
    }
}
