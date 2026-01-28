import { router } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  campaign: {
    id: number;
    name: string;
    client: {
      full_name: string;
      email: string;
    };
  };
}

export default function CampaignReject({ campaign }: Props) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(`/admin/campaign/${campaign.id}/reject`, {
      rejection_reason: rejectionReason,
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Reject Campaign</h1>
          <p className="mt-2 text-sm text-gray-600">
            Provide a reason for rejecting this campaign. The client will be notified.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900">Campaign Details</h2>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Client:</strong> {campaign.client.full_name} ({campaign.client.email})</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rejectionReason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this campaign is being rejected..."
              rows={4}
              required
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Rejecting...' : 'Reject Campaign'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}