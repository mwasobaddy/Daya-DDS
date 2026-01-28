import { AlertTriangle, User } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  campaign: {
    id: number;
    name: string;
    client: {
      full_name: string;
      email: string;
    };
  };
  adminAction: {
    action: 'approved' | 'rejected';
    admin: {
      name: string;
      email: string;
    };
    created_at: string;
    rejection_reason?: string;
  };
}

export default function CampaignConflict({ campaign, adminAction }: Props) {
  const actionText = adminAction.action === 'approved' ? 'approved' : 'rejected';
  const actionColor = adminAction.action === 'approved' ? 'green' : 'red';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Action Already Taken</h1>
          <p className="mt-2 text-sm text-gray-600">
            This campaign has already been {actionText} by another admin.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900">Campaign Details</h2>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Client:</strong> {campaign.client.full_name} ({campaign.client.email})</p>
        </div>

        <div className={`mb-6 p-4 bg-${actionColor}-50 border border-${actionColor}-200 rounded-lg`}>
          <div className="flex items-center">
            <User className={`h-5 w-5 text-${actionColor}-500 mr-2`} />
            <span className={`text-${actionColor}-800 font-medium`}>
              {actionText.charAt(0).toUpperCase() + actionText.slice(1)} by {adminAction.admin.name}
            </span>
          </div>
          <p className={`text-${actionColor}-700 mt-1`}>
            {adminAction.admin.email} • {new Date(adminAction.created_at).toLocaleString()}
          </p>
          {adminAction.rejection_reason && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">Reason:</p>
              <p className="text-sm text-gray-600 mt-1">{adminAction.rejection_reason}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}