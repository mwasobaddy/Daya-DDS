import { router, usePage } from '@inertiajs/react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
  dcdAssigned: boolean;
  dcdName?: string;
  success?: string;
}

export default function CampaignApprove({ campaign, dcdAssigned, dcdName, success }: Props) {
  const [isApproving, setIsApproving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!success);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    }
  }, [success]);

  const handleApprove = () => {
    setIsApproving(true);

    router.post(`/admin/campaign/${campaign.id}/approve`, {}, {
      onSuccess: () => {
        setIsApproving(false);
        setShowSuccess(true);
      },
      onError: () => {
        setIsApproving(false);
      },
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6">
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Campaign Approved!</h1>
            <p className="mt-2 text-lg text-gray-600">
              The campaign has been successfully approved and the client has been notified.
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900">Campaign Details</h2>
            <p><strong>Name:</strong> {campaign.name}</p>
            <p><strong>Client:</strong> {campaign.client.full_name} ({campaign.client.email})</p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => window.location.href = '/admin'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Admin Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Approve Campaign</h1>
          <p className="mt-2 text-sm text-gray-600">
            Confirm approval of this campaign. The client will be notified once approved.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900">Campaign Details</h2>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Client:</strong> {campaign.client.full_name} ({campaign.client.email})</p>
        </div>

        {dcdAssigned ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800 font-medium">DCD Assigned</span>
            </div>
            <p className="text-green-700 mt-1">
              This campaign will be assigned to {dcdName} immediately upon approval.
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-yellow-800 font-medium">DCD Assignment Pending</span>
            </div>
            <p className="text-yellow-700 mt-1">
              No matching DCD found. This campaign will be queued for assignment and processed hourly.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproving ? 'Approving...' : 'Approve Campaign'}
          </Button>
        </div>
      </Card>
    </div>
  );
}