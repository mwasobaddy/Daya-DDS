import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface Props {
  value: Record<string, unknown>;
  onBack: () => void;
}

export default function ReviewSubmitStep({ value, onBack }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
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
      state: String(value.state || ''),
      lga: String(value.lga || ''),
      nigeriaWard: String(value.nigeriaWard || ''),
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
        toast.error('Failed to submit application. Please try again.');
        // Errors handled by Inertia
      },
    });
  };

  const renderField = (label: string, val: unknown) => {
    if (!val || val === '') return null;
    return (
      <div className="flex justify-between py-3 border-b border-gray-100 dark:border-neutral-700">
        <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">{label}</span>
        <span className="text-sm text-gray-900 dark:text-white text-right max-w-xs truncate">{String(val)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white dark:bg-neutral-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 dark:text-neutral-400 font-medium">Submitting your application...</p>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review Your Details</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Please verify all information before submitting</p>
      </div>

      <div className={`bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 space-y-1 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
        {renderField('Full Name', value.fullName)}
        {renderField('Email', value.email)}
        {renderField('Phone', value.phone)}
        {renderField('National ID', value.nationalId)}
        {renderField('Date of Birth', value.dob)}
        {renderField('Gender', value.gender)}
        {renderField('Address', value.address)}
        {renderField('Country', value.country)}
        {renderField('Referral Code', value.referralCode)}
        {renderField('County', value.county)}
        {renderField('Subcounty', value.subcounty)}
        {renderField('Ward', value.ward)}
        {renderField('State', value.state)}
        {renderField('LGA', value.lga)}
        {renderField('Ward (Nigeria)', value.nigeriaWard)}
        {renderField('Wallet Type', value.walletType)}
        {renderField('Communication Channel', value.commChannel)}
      </div>

      {value.socialPlatforms ? (
        <div className={`bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-lg p-6 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Social Media Platforms</h3>
          <div className="space-y-2">
            {Object.entries(value.socialPlatforms as Record<string, string>).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-neutral-300 capitalize">{key}</span>
                <span className="text-gray-600 dark:text-neutral-400">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-medium border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-neutral-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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