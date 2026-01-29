{{-- resources/views/emails/admin-campaign-notification.blade.php --}}
<x-mail::message>
# New Campaign Registration Requires Review

Hello Admin,

A new campaign has been registered and requires your review.

**Client Details:**
- **Name:** {{ $client->full_name }}
- **Email:** {{ $client->email }}
- **Phone:** {{ $client->phone }}
- **Business:** {{ $client->business_name }}

**Campaign Details:**
- **Name:** {{ $campaign->name }}
- **Type:** {{ $campaign->type }}
- **Objective:** {{ $campaign->campaign_objectives }}
- **Budget:** {{ $campaign->budget }} {{ $campaign->currency }}
- **Description:** {{ $campaign->campaign_description }}

<x-mail::button :url="$approveUrl" color="success">
Approve Campaign
</x-mail::button>

<x-mail::button :url="$rejectUrl" color="danger">
Reject Campaign
</x-mail::button>

Please review and take appropriate action.

Best regards,<br>
Daya DDS Team
</x-mail::message>