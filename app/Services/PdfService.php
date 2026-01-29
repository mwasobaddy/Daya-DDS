<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use TCPDF;

class PdfService
{
    /**
     * Generate QR code PDF for DCD
     */
    public function generateQrCodePdf(User $user, string $qrCodePath): string
    {
        // Get the QR code image data
        $qrCodeContent = Storage::disk('public')->get($qrCodePath);

        // Create new PDF document
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

        // Set document information
        $pdf->SetCreator('Daya DDS');
        $pdf->SetAuthor('Daya Distribution System');
        $pdf->SetTitle('DCD Guide - '.$user->full_name);
        $pdf->SetSubject('QR Code Guide for '.$user->full_name);

        // Remove default header/footer
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // Set margins
        $pdf->SetMargins(20, 20, 20);

        // Disable auto page breaks for first page
        $pdf->SetAutoPageBreak(false);

        // Add first page
        $pdf->AddPage();

        // Set font for DAYA title
        $pdf->SetFont('helvetica', 'B', 48);

        // Set background color for DAYA (#7ac4db)
        $pdf->SetFillColor(122, 196, 219); // #7ac4db in RGB
        $pdf->SetTextColor(255, 255, 255); // White text

        // Add DAYA title with background
        $pdf->Cell(0, 30, 'DAYA', 0, 1, 'C', true);
        $pdf->Ln(20);

        // Reset text color to black
        $pdf->SetTextColor(0, 0, 0);

        // Add description
        $pdf->SetFont('helvetica', '', 18);
        $pdf->Cell(0, 15, 'discover with daya', 0, 1, 'C');
        $pdf->Ln(20);

        // Add big QR code covering most of the remaining page
        $pdf->Image('@'.$qrCodeContent, 20, 105, 170, 140, 'PNG', '', '', false, 300, 'C');

        // Add footer at bottom of page
        $pdf->SetY(270);
        $pdf->SetFont('helvetica', '', 12);
        $pdf->Cell(0, 10, 'dayadistribution.com', 0, 1, 'C');

        // Enable auto page breaks for second page
        $pdf->SetAutoPageBreak(true, 20);

        // Add second page
        $pdf->AddPage();

        // Add small QR code in the middle
        $pdf->Image('@'.$qrCodeContent, '', '', 100, 100, 'PNG', '', '', false, 300, 'C');

        $filename = 'qrcodes/dcd_'.$user->id.'_guide.pdf';
        Storage::disk('public')->put($filename, $pdf->Output('', 'S'));

        return $filename;
    }
}
