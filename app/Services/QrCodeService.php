<?php

namespace App\Services;

use App\Models\User;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate QR code for a DCD user
     */
    public function generateQrCode(User $user): string
    {
        // Create QR code with user ID
        $qrCode = new QrCode(
            data: $user->id,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $writer = new PngWriter();

        // Generate the QR code image
        $result = $writer->write($qrCode);

        // Generate filename
        $filename = 'qrcodes/dcd_'.$user->id.'.png';

        // Save to storage
        Storage::disk('public')->put($filename, $result->getString());

        return $filename;
    }
}
