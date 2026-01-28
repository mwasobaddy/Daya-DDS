import { router } from '@inertiajs/react';
import { CheckCircle, Edit, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  value: Record<string, unknown>;
  onBack: () => void;
  onEditStep: (stepIndex: number) => void;
}

const campaignObjectives = [
  { id: 'music', label: 'Music', description: 'Audio content including songs, albums, and playlists' },
  { id: 'games', label: 'Games', description: 'Video games, mobile games, and interactive content' },
  { id: 'product_launch', label: 'Product Launch', description: 'New product announcements and launch campaigns' },
  { id: 'events_promotions', label: 'Events & Promotions', description: 'Event marketing, promotional campaigns, and special offers' },
  { id: 'movies', label: 'Movies', description: 'Film content including movies, documentaries, and cinematic works' },
  { id: 'mobile_apps', label: 'Mobile Apps', description: 'Mobile applications for iOS and Android platforms' },
  { id: 'surveys', label: 'Surveys', description: 'Market research, feedback collection, and data gathering tools' },
];

const getCampaignObjectiveLabel = (id: string): string => {
  const objective = campaignObjectives.find(obj => obj.id === id);
  return objective ? objective.label : id;
};

export default function ReviewSubmitStep({ value, onBack, onEditStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submitData = {
        companyName: String(value.companyName || ''),
        contactPerson: String(value.contactPerson || ''),
        email: String(value.email || ''),
        phone: String(value.phone || ''),
        businessAddress: String(value.businessAddress || ''),
        country: String(value.country || ''),
        county: String(value.county || ''),
        subcounty: String(value.subcounty || ''),
        ward: String(value.ward || ''),
        campaignType: String(value.campaignType || ''),
        musicPreference: value.musicPreference ? String(value.musicPreference) : null,
        campaignObjective: String(value.campaignObjective || ''),
        campaignName: String(value.campaignName || ''),
        campaignDescription: String(value.campaignDescription || ''),
        safetyPreference: String(value.safetyPreference || ''),
        selectedSafetyPreferences: Array.isArray(value.selectedSafetyPreferences) ? value.selectedSafetyPreferences : [],
        selectedBusinessTypes: Array.isArray(value.selectedBusinessTypes) ? value.selectedBusinessTypes : [],
        totalBudget: Number(value.totalBudget || 0),
        targetCountry: value.targetCountry ? String(value.targetCountry) : null,
        targetCounty: value.targetCounty ? String(value.targetCounty) : null,
        targetSubcounty: value.targetSubcounty ? String(value.targetSubcounty) : null,
        targetWard: value.targetWard ? String(value.targetWard) : null,
      };

      router.post('/client/register', submitData, {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success('Campaign registration submitted successfully! Redirecting...');
          // Success handled by redirect
        },
        onError: (errors) => {
          setIsSubmitting(false);
          // Show specific validation errors
          const errorMessages = Object.values(errors).flat().join(', ');
          setSubmitError(errorMessages || 'Failed to submit campaign registration. Please try again.');
          toast.error(errorMessages || 'Failed to submit campaign registration. Please try again.');
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const formatLocation = (country?: unknown, county?: unknown, subcounty?: unknown, ward?: unknown) => {
    const countryName = country || 'Not specified';
    const countyName = county || 'Not specified';
    const subcountyName = subcounty || 'Not specified';
    const wardName = ward || 'Not specified';

    if (countryName === 'Not specified') {
      return 'Not specified';
    }

    return `${wardName}, ${subcountyName}, ${countyName}, ${countryName}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">Review Your Campaign</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please review all the information below before submitting your campaign registration.
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
              <span className="font-medium text-gray-700 dark:text-neutral-300">Company Name:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.companyName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Contact Person:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.contactPerson || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Email:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.email || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Phone:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.phone || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700 dark:text-neutral-300">Business Address:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.businessAddress || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700 dark:text-neutral-300">Location:</span>
              <p className="text-gray-600 dark:text-neutral-400">
                {formatLocation(value.countryName, value.countyName, value.subcountyName, value.wardName)}
              </p>
            </div>
          </div>
        </Card>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        {/* Campaign Details */}
        <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Campaign Details</h3>
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
              <span className="font-medium text-gray-700 dark:text-neutral-300">Campaign Type:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.campaignType || 'Not provided')}</p>
            </div>
            {(value.campaignType === 'Artist' || value.campaignType === 'Label') && Array.isArray(value.selectedMusicGenres) && value.selectedMusicGenres.length > 0 && (
              <div>
                <span className="font-medium text-gray-700 dark:text-neutral-300">Music Genres:</span>
                <p className="text-gray-600 dark:text-neutral-400">{value.selectedMusicGenres.join(', ')}</p>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Campaign Objective:</span>
              <p className="text-gray-600 dark:text-neutral-400">{value.campaignObjective ? getCampaignObjectiveLabel(String(value.campaignObjective)) : 'Not provided'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Campaign Name:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.campaignName || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700 dark:text-neutral-300">Campaign Description:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.campaignDescription || 'Not provided')}</p>
            </div>
          </div>
        </Card>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        {/* Targeting & Budget */}
        <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Targeting & Budget</h3>
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
              <span className="font-medium text-gray-700 dark:text-neutral-300">Safety Preferences:</span>
              <p className="text-gray-600 dark:text-neutral-400">
                {Array.isArray(value.selectedSafetyPreferences) && value.selectedSafetyPreferences.length > 0
                  ? value.selectedSafetyPreferences.join(', ')
                  : 'Not provided'}
              </p>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Target Location:</span>
              <p className="text-gray-600 dark:text-neutral-400">
                {value.targetCountryName
                  ? formatLocation(value.targetCountryName, value.targetCountyName, value.targetSubcountyName, value.targetWardName)
                  : 'Not specified (National targeting)'}
              </p>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Business Types:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {Array.isArray(value.selectedBusinessTypes) && value.selectedBusinessTypes.length > 0
                  ? value.selectedBusinessTypes.map((type, index) => (
                      <Badge key={index} variant="secondary">{String(type)}</Badge>
                    ))
                  : <p className="text-gray-600 dark:text-neutral-400">Not specified</p>
                }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700 dark:text-neutral-300">Total Budget:</span>
                <p className="text-gray-600 dark:text-neutral-400">
                  {value.countryName ? `${value.countryName === 'Kenya' ? 'KES' : 'NGN'}` : 'KES'} {value.totalBudget ? Number(value.totalBudget).toLocaleString() : '0'}
                </p>
              </div>
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
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            'Submit Campaign'
          )}
        </Button>
      </div>
    </div>
  );
}