import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  value: Record<string, any>;
  onBack: () => void;
}

export default function ReviewSubmitStep({ value, onBack }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Post to API - leave integration to backend wiring
      // router.post('/client/register', value, { ... })
      await new Promise((r) => setTimeout(r, 800));
      // On success, redirect handled by backend
      // For now, show success
      // TODO: use Inertia router in next iteration
      alert('Campaign submitted successfully (stub).');
    } catch (error) {
      setSubmitError('Failed to submit campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>

      <Card className="p-4 mb-4">
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
      </Card>

      {submitError && <div className="text-red-600 mb-4">{submitError}</div>}

      <div className="flex gap-2">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </div>
  );
}
