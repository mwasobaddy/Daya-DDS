{{-- resources/views/emails/admin-campaign-notification.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Campaign Registration Requires Review</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td>
                <table width="600" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">New Campaign Registration Requires Review</h1>

                            <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">Hello Admin,</p>

                            <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">A new campaign has been registered and requires your review.</p>

                            <h2 style="color: #333333; margin: 30px 0 15px 0; font-size: 18px;">Client Details:</h2>
                            <ul style="color: #666666; margin: 0 0 30px 0; padding-left: 20px;">
                                <li><strong>Name:</strong> {{ $client->full_name }}</li>
                                <li><strong>Email:</strong> {{ $client->email }}</li>
                                <li><strong>Phone:</strong> {{ $client->phone }}</li>
                                <li><strong>Business:</strong> {{ $client->business_name }}</li>
                            </ul>

                            <h2 style="color: #333333; margin: 30px 0 15px 0; font-size: 18px;">Campaign Details:</h2>
                            <ul style="color: #666666; margin: 0 0 40px 0; padding-left: 20px;">
                                <li><strong>Name:</strong> {{ $campaign->name }}</li>
                                <li><strong>Type:</strong> {{ $campaign->type }}</li>
                                <li><strong>Objective:</strong> {{ $campaign->campaign_objectives }}</li>
                                <li><strong>Budget:</strong> {{ $campaign->budget }} {{ $campaign->currency }}</li>
                                <li><strong>Description:</strong> {{ $campaign->campaign_description }}</li>
                            </ul>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                                <tr>
                                    <td align="center" style="padding: 0 10px;">
                                        <a href="{{ $approveUrl }}" style="background-color: #28a745; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Approve Campaign</a>
                                    </td>
                                    <td align="center" style="padding: 0 10px;">
                                        <a href="{{ $rejectUrl }}" style="background-color: #dc3545; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reject Campaign</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 16px; line-height: 1.5;">Please review and take appropriate action.</p>

                            <p style="color: #666666; margin: 20px 0 0 0; font-size: 16px; line-height: 1.5;">Best regards,<br>Daya DDS Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>