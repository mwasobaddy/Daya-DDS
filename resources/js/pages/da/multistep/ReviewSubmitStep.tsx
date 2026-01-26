import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Props {
  value: Record<string, unknown>;
  onBack: () => void;
}

export default function ReviewSubmitStep({ value, onBack }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const submitData = {
      name: value.fullName,
      email: value.email,
      phone: value.phone,
      social_platforms: value.socialPlatforms || {},
      preferred_contact_method: value.commChannel,
      wallet_address: value.walletAddress, // Assuming it's added
    };
    router.post('/da/register', submitData, {
      onSuccess: () => {
        setIsSubmitting(false);
        // Success handled by redirect
      },
      onError: (errors) => {
        setIsSubmitting(false);
        // Errors handled by Inertia
      },
    });
  };

  const renderField = (label: string, val: unknown) => {
    if (!val || val === '') return null;
    return (
      <div className="flex justify-between py-3 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm text-gray-900 text-right max-w-xs truncate">{String(val)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Details</h2>
        <p className="text-sm text-gray-500">Please verify all information before submitting</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-1">
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
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media Platforms</h3>
          <div className="space-y-2">
            {Object.entries(value.socialPlatforms as Record<string, string>).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 capitalize">{key}</span>
                <span className="text-gray-600">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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