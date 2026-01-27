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

export default function ReviewSubmitStep({ value, onBack, onEditStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submitData = {
        fullName: String(value.fullName || ''),
        email: String(value.email || ''),
        phone: String(value.phone || ''),
        nationalId: String(value.nationalId || ''),
        dob: String(value.dob || ''),
        gender: String(value.gender || ''),
        referralCode: String(value.referralCode || ''),
        country: String(value.country || ''),
        county: String(value.county || ''),
        subcounty: String(value.subcounty || ''),
        ward: String(value.ward || ''),
        social_platforms: (value.socialPlatforms as Record<string, string>) || {},
        preferred_contact_method: String(value.commChannel || ''),
        wallet_type: String(value.walletType || ''),
        pin: String(value.pin || ''),
      };

      router.post('/da/register', submitData, {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success('Application submitted successfully! Redirecting...');
          // Success handled by redirect
        },
        onError: (errors) => {
          setIsSubmitting(false);
          // Show specific validation errors
          const errorMessages = Object.values(errors).flat().join(', ');
          setSubmitError(errorMessages || 'Failed to submit application. Please try again.');
          toast.error(errorMessages || 'Failed to submit application. Please try again.');
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const formatLocation = () => {
    const country = value.countryName || value.country;
    const county = value.countyName || value.county;
    const subcounty = value.subcountyName || value.subcounty;
    const ward = value.wardName || value.ward;

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
          Please review all the information below before submitting your application.
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
              <p className="text-gray-600 dark:text-neutral-400">{String(value.fullName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">National ID:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.nationalId || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Date of Birth:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.dob || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Gender:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.gender || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Email:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.email || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Phone:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.phone || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Address:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.address || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700 dark:text-neutral-300">Location:</span>
              <p className="text-gray-600 dark:text-neutral-400">{formatLocation()}</p>
            </div>
            {(() => {
              const referralCode = value.referralCode;
              return referralCode && String(referralCode).trim() !== '' ? (
                <div>
                  <span className="font-medium text-gray-700 dark:text-neutral-300">Referral Code:</span>
                  <p className="text-gray-600 dark:text-neutral-400">{String(referralCode)}</p>
                </div>
              ) : null;
            })()}
          </div>
        </Card>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>

        <>
        {/* Social Media Platforms */}
        {value.socialPlatforms && Object.keys(value.socialPlatforms).length > 0 && (
          <React.Fragment>
            <Card className="p-0 bg-transparent border-0 shadow-none">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Social Media Platforms</h3>
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
              <div className="space-y-3 text-sm">
                {Object.entries(value.socialPlatforms as Record<string, string>).map(([platform, username]) => (
                  <div key={platform} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-neutral-300 capitalize">
                      {platform.replace(/_/g, ' ')}:
                    </span>
                    <Badge variant="secondary">{username}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-neutral-700 my-6"></div>
          </React.Fragment>
        )}
        </>

        {/* Communication & Wallet Setup */}
        <Card className="p-0 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Communication & Wallet</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Communication Channel:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.commChannel || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-neutral-300">Wallet Type:</span>
              <p className="text-gray-600 dark:text-neutral-400">{String(value.walletType || 'Not provided')}</p>
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-neutral-300">4-digit PIN has been set</span>
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
            'Submit Application'
          )}
        </Button>
      </div>
    </div>
  );
}