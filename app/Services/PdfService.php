<?php

namespace App\Services;

use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfService
{
    /**
     * Generate QR code PDF for DCD
     */
    public function generateQrCodePdf(User $user, string $qrCodePath): string
    {
        // Get the absolute path to the QR code file
        $qrCodeFullPath = Storage::disk('public')->path($qrCodePath);

        // Page 1: Full scale QR code
        $page1Html = $this->getPage1Html($user, $qrCodeFullPath);

        // Page 2: Mobile sized QR code
        $page2Html = $this->getPage2Html($user, $qrCodeFullPath);

        $fullHtml = $page1Html.$page2Html;

        $pdf = Pdf::loadHTML($fullHtml)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true
            ]);

        $filename = 'qrcodes/dcd_'.$user->id.'_guide.pdf';
        Storage::disk('public')->put($filename, $pdf->output());

        return $filename;
    }

    /**
     * Get HTML for page 1 (full scale QR code)
     */
    private function getPage1Html(User $user, string $qrCodePath): string
    {
        return '
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .header { background-color: #1e40af; color: white; padding: 30px; text-align: center; margin: -20px -20px 30px -20px; }
                .header h1 { margin: 0; font-size: 36px; font-weight: bold; }
                .content { text-align: center; padding: 20px; }
                .qr-section { margin: 40px 0; }
                .qr-code { max-width: 400px; margin: 0 auto; }
                .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 20px; border-top: 1px solid #eee; }
                .discover { font-size: 24px; margin-bottom: 20px; color: #1e40af; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>'.htmlspecialchars($user->full_name).'</h1>
            </div>
            <div class="content">
                <div class="discover">Discover with Daya</div>
                <div class="qr-section">
                    <img src="'.$qrCodePath.'" alt="QR Code" class="qr-code" />
                </div>
            </div>
            <div class="footer">
                <p>dayadistribution.com</p>
            </div>
        </body>
        </html>';
    }

    /**
     * Get HTML for page 2 (mobile sized QR code)
     */
    private function getPage2Html(User $user, string $qrCodePath): string
    {
        return '
        <div style="page-break-before: always;">
            <div style="text-align: center; padding: 100px 20px;">
                <h2 style="color: #1e40af; margin-bottom: 50px;">Mobile QR Code</h2>
                <img src="'.$qrCodePath.'" alt="Mobile QR Code" style="max-width: 200px; margin: 0 auto;" />
            </div>
        </div>';
    }
}
