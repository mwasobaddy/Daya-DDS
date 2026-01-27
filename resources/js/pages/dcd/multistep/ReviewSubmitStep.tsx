import { CheckCircle, Edit, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  formData: Record<string, unknown>;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (stepIndex: number) => void;
}

const contentTypeLabels: Record<string, string> = {
  music: 'Music',
  video: 'Video',
  books: 'Books',
  podcasts: 'Podcasts',
  games: 'Games',
  software: 'Software',
  courses: 'Courses',
  artwork: 'Artwork'
};

export default function ReviewSubmitStep({ formData, onSubmit, onBack, onEditStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Here you would typically make an API call to submit the form
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // If successful, call onSubmit
      onSubmit();
    } catch (error) {
      console.error('Registration submission failed:', error);
      setSubmitError('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLocation = () => {
    const country = formData.countryName || formData.country;
    const county = formData.countyName || formData.county;
    const subcounty = formData.subcountyName || formData.subcounty;
    const ward = formData.wardName || formData.ward;

    // If we have names, use them; otherwise show a loading state
    if (!country || !county || !subcounty || !ward) {
      return 'Loading location data...';
    }

    // Ensure we're using names, not IDs
    const countryName = typeof country === 'string' && !/^\d+$/.test(country) ? country : 'Unknown Country';
    const countyName = typeof county === 'string' && !/^\d+$/.test(county) ? county : 'Unknown County';
    const subcountyName = typeof subcounty === 'string' && !/^\d+$/.test(subcounty) ? subcounty : 'Unknown Subcounty';
    const wardName = typeof ward === 'string' && !/^\d+$/.test(ward) ? ward : 'Unknown Ward';

    return `${wardName}, ${subcountyName}, ${countyName}, ${countryName}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">Review Your Information</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please review all the information below before submitting your registration.
        </p>
      </div>

      {/* Step Summary Cards */}
      <div className="grid gap-4">
        {/* Account Setup */}
       <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Account Setup</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(0)}
              className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Full Name:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.fullName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">National ID:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.nationalId || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Date of Birth:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.dob || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Gender:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.gender || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Email:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.email || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Phone:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.phone || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Business Address:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.businessAddress || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700 dark:text-neutral-300">Location:</span>
              <p className="text-gray-600 dark:text-neutral-400">{formatLocation()}</p>
            </div>
          </div>
        </Card>

        {/* Separator */}
       <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        {/* Business Information */}
       <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(1)}
              className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Business Name:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.businessName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Business Types:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.businessType as { types: string[]; custom?: string })?.types?.map((type: string) => (
                  <Badge key={type} variant="secondary">
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )) || <span className="text-gray-500 dark:text-neutral-500">None selected</span>}
              </div>
            </div>
            {(formData.businessType as { types: string[]; custom?: string })?.custom && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700 dark:text-neutral-300">Custom Business Type:</span>
                <p className="text-gray-600 dark:text-neutral-400">{String((formData.businessType as { types: string[]; custom?: string }).custom)}</p>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Operational Days:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.operationalDays as string[])?.map((day: string) => (
                  <Badge key={day} variant="outline">
                    {day}
                  </Badge>
                )) || <span className="text-gray-500 dark:text-neutral-500">None selected</span>}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Opening Time:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.openingTime || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Closing Time:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.closingTime || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Daily Foot Traffic:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(formData.footTrafficEstimate || 'Not provided')}</p>
            </div>
          </div>
        </Card>

        {/* Separator */}
       <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        {/* Content Preferences */}
       <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Content Preferences</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(2)}
              className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Content Types:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedContentTypes as string[])?.map((type) => (
                  <Badge key={type} variant="secondary">
                    {contentTypeLabels[type] || type}
                  </Badge>
                )) || <span className="text-gray-500 dark:text-neutral-500">None selected</span>}
              </div>
            </div>

            {(formData.selectedContentTypes as string[])?.includes('music') && (
              <div>
                <span className="font-medium text-gray-700 dark:text-neutral-300">Music Genres:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(formData.selectedMusicGenres as string[])?.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  )) || <span className="text-gray-500 dark:text-neutral-500">None selected</span>}
                </div>
              </div>
            )}

            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Target Audience:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedAudiences as string[])?.map((audience) => (
                  <Badge key={audience} variant="outline">
                    {audience}
                  </Badge>
                )) || <span className="text-gray-500 dark:text-neutral-500">None selected</span>}
              </div>
            </div>
          </div>
        </Card>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        {/* Wallet Setup */}
       <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Wallet Setup</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(3)}
              className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-neutral-300">4-digit PIN has been set</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-neutral-300">Terms of Service accepted</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Separator */}
     <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

      {/* Submit Error */}
      {submitError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
            onClick={onBack}
            disabled={isSubmitting}
            variant="outline"
            className="px-6 py-2.5"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );
}