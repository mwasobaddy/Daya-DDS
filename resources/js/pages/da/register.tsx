import React, { useState } from 'react';
import AccountSetupStep from './multistep/AccountSetupStep';
import SocialMediaStep from './multistep/SocialMediaStep';
import WalletSetupStep from './multistep/WalletSetupStep';
import ReviewSubmitStep from './multistep/ReviewSubmitStep';

const steps = [
  'Account Setup',
  'Social Media Presence',
  'Account & Wallet Setup',
  'Review & Submit',
];

export default function DASignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateForm = (data: any) => setFormData((prev) => ({ ...prev, ...data }));

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        {steps.map((label, i) => (
          <div key={label} className={`flex-1 text-center ${i === currentStep ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{label}</div>
        ))}
      </div>
      {currentStep === 0 && (
        <AccountSetupStep value={formData} onChange={updateForm} onNext={nextStep} />
      )}
      {currentStep === 1 && (
        <SocialMediaStep value={formData} onChange={updateForm} onNext={nextStep} onBack={prevStep} />
      )}
      {currentStep === 2 && (
        <WalletSetupStep value={formData} onChange={updateForm} onNext={nextStep} onBack={prevStep} />
      )}
      {currentStep === 3 && (
        <ReviewSubmitStep value={formData} onBack={prevStep} />
      )}
    </div>
  );
}
