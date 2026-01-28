import { router } from '@inertiajs/react';
import { CheckCircle, Edit, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  formData: Record<string, unknown>;
  onBack: () => void;
  onEditStep: (stepIndex: number) => void;
}

const contentTypeLabels: Record<string, string> = {
  music: 'Music',
  movies: 'Movies',
  games: 'Games',
  surveys: 'Surveys',
  product_promotion: 'Product Promotion',
  events_promotions: 'Events & Promotions',
  apartment_listing: 'Apartment Listing',
  app_downloads: 'App Downloads',
  product_launch: 'Product Launch',
  education_learning: 'Education & Learning',
  civic_political: 'Civic & Political',
};

export default function ReviewSubmitStep({ formData, onBack, onEditStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submitData = {
        // Account Setup
        fullName: String(formData.fullName || ''),
        nationalId: String(formData.nationalId || ''),
        dob: String(formData.dob || ''),
        gender: String(formData.gender || ''),
        email: String(formData.email || ''),
        phone: String(formData.phone || ''),
        businessAddress: String(formData.businessAddress || ''),
        referralCode: formData.referralCode ? String(formData.referralCode) : null,

        // Location
        country: String(formData.country || ''),
        county: String(formData.county || ''),
        subcounty: String(formData.subcounty || ''),
        ward: String(formData.ward || ''),

        // Business Information
        businessName: String(formData.businessName || ''),
        businessType: (() => {
          const bt = formData.businessType as { types?: string[]; custom?: string } | undefined;
          return {
            types: Array.isArray(bt?.types) ? bt.types : [],
            ...(bt?.custom ? { custom: String(bt.custom) } : {}),
          };
        })(),
        operationalDays: Array.isArray(formData.operationalDays) ? formData.operationalDays : [],
        openingTime: String(formData.openingTime || ''),
        closingTime: String(formData.closingTime || ''),
        footTrafficEstimate: String(formData.footTrafficEstimate || ''),

        // Content Preferences
        campaignTypes: Array.isArray(formData.selectedContentTypes) ? formData.selectedContentTypes : (formData.selectedContentTypes ? [formData.selectedContentTypes] : []),
        musicPreferences: Array.isArray(formData.selectedMusicGenres) ? formData.selectedMusicGenres : (formData.selectedMusicGenres ? [formData.selectedMusicGenres] : []),
        safetyPreferences: Array.isArray(formData.selectedAudiences) ? formData.selectedAudiences : (formData.selectedAudiences ? [formData.selectedAudiences] : []),

        // Wallet Setup
        pin: String(formData.pin || ''),
        agreeToTerms: Boolean(formData.agreeToTerms),
      };

      router.post('/dcd/register', submitData, {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success('Registration submitted successfully! Redirecting...');
          // Success handled by redirect
        },
        onError: (errors) => {
          setIsSubmitting(false);
          // Show specific validation errors
          const errorMessages = Object.values(errors).flat().join(', ');
          setSubmitError(errorMessages || 'Failed to submit registration. Please try again.');
          toast.error(errorMessages || 'Failed to submit registration. Please try again.');
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    }
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
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.countryName ? (
                  <>
                    {formData.wardName && <Badge variant="secondary">{String(formData.wardName)}</Badge>}
                    {formData.subcountyName && <Badge variant="secondary">{String(formData.subcountyName)}</Badge>}
                    {formData.countyName && <Badge variant="secondary">{String(formData.countyName)}</Badge>}
                    {formData.countryName && <Badge variant="secondary">{String(formData.countryName)}</Badge>}
                  </>
                ) : (
                  <p className="text-gray-600 dark:text-neutral-400">Not specified (National targeting)</p>
                )}
              </div>
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