<?php

namespace App\Services;

use App\Models\Dcd;
use App\Models\User;
use App\Models\VentureShare;
use App\Models\Referral;
use App\Notifications\DcdAccountSetupNotification;
use App\Notifications\DcdReferralRewardNotification;
use App\Notifications\DcdWalletCreatedNotification;
use App\Notifications\NewDcdRegistrationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class DcdService
{
    public function __construct(
        private QrCodeService $qrCodeService,
        private PdfService $pdfService
    ) {}

    public function createDcd(array $data): Dcd
    {
        return DB::transaction(function () use ($data) {
            // Validate referral code if provided
            $referrer = $this->validateAndGetReferrer($data['referralCode'] ?? null);

            // Count current DCD users
            $currentDcdCount = User::where('role', 'dcd')->count();
            $shouldAwardTokens = $currentDcdCount < 3000;

            // Map gender
            $gender = match ($data['gender']) {
                'Male' => 'male',
                'Female' => 'female',
                default => 'male',
            };

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
                'wallet_balance' => '0.00',
                'total_DDS_balance' => '0.00',
                'total_DWS_balance' => '0.00',
                'password' => Hash::make('temporary_password'), // TODO: handle proper password
            ]);

            // Generate QR code for the DCD
            $qrCodePath = $this->qrCodeService->generateQrCode($user);

            // Generate PDF guide
            $pdfPath = $this->pdfService->generateQrCodePdf($user, $qrCodePath);

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
                'pdf_guide_path' => $pdfPath,
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

            // Award signup tokens to new DCD if under cap
            if ($shouldAwardTokens) {
                $this->awardSignupTokens($user);
            }

            // Handle referral token awards if DCD count is below 3000 and referrer exists
            if ($shouldAwardTokens && $referrer) {
                $this->awardReferralTokens($referrer, $user);
            }

            // Send notifications
            $this->sendNotifications($user, $referrer, $shouldAwardTokens);

            return $dcd;
        });
    }

    /**
     * Validate referral code and get referrer
     */
    private function validateAndGetReferrer(?string $referralCode): ?User
    {
        if (empty($referralCode)) {
            // No referral code provided - assign to admin with least tokens
            return $this->getAdminWithLeastTokens();
        }

        $referrer = User::where('referral_code', $referralCode)->first();

        if (! $referrer) {
            throw ValidationException::withMessages([
                'referralCode' => ['The referral code is invalid.'],
            ]);
        }

        return $referrer;
    }

    /**
     * Award signup tokens to new DCD
     */
    private function awardSignupTokens(User $user): void
    {
        $ddsAward = 1000.00;
        $dwsAward = 1000.00;

        // Update user's balances
        $user->increment('total_DDS_balance', $ddsAward);
        $user->increment('total_DWS_balance', $dwsAward);

        // Create venture share record
        VentureShare::create([
            'user_id' => $user->id,
            'dds_earned' => $ddsAward,
            'dws_earned' => $dwsAward,
            'reason' => 'DCD Signup Bonus',
        ]);
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
     * Determine the referral type based on referrer and referred user roles
     */
    private function determineReferralType(User $referrer, User $referred): string
    {
        $referrerRole = $referrer->role;
        $referredRole = $referred->role;

        return match ($referrerRole) {
            'admin' => 'admin_to_dcd',
            'da' => 'da_to_dcd',
            'dcd' => 'dcd_to_dcd',
            default => 'admin_to_dcd', // fallback
        };
    }

    /**
     * Award referral tokens to referrer
     */
    private function awardReferralTokens(User $referrer, User $newDcd): void
    {
        $ddsAward = 500.00; // Higher reward for DCD referrals
        $dwsAward = 500.00;

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
        // Send account setup email to new DCD with token info
        $ddsEarned = $tokensAwarded ? 1000 : 0;
        $dwsEarned = $tokensAwarded ? 1000 : 0;
        $newDcd->notify(new DcdAccountSetupNotification($ddsEarned, $dwsEarned));

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
