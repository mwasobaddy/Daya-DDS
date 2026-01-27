import React, { useState } from 'react';
import AccountSetupStep from './multistep/AccountSetupStep';
import CampaignDetailsStep from './multistep/CampaignDetailsStep';
import TargetingBudgetStep from './multistep/TargetingBudgetStep';
import ReviewSubmitStep from './multistep/ReviewSubmitStep';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ClientRegister() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    // step 1
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    country: '',
    // step 2
    campaignTitle: '',
    accountType: '',
    musicalGenres: [],
    digitalProductLink: '',
    explainerVideo: '',
    campaignObjective: '',
    budget: '',
    // step 3
    contentSafety: [],
    targetCountry: '',
    county: '',
    subcounty: '',
    ward: '',
    state: '',
    lga: '',
    businessTypeTargeting: [],
    campaignStart: '',
    campaignEnd: '',
    targetAudience: '',
    keyObjectives: '',
  });

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleChange = (changes: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...changes }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-900 text-slate-900 selection:bg-indigo-100">
      <div className="relative max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <Card className="p-6">
          {currentStep === 0 && (
            <AccountSetupStep value={formData} onChange={handleChange} onNext={nextStep} />
          )}

          {currentStep === 1 && (
            <CampaignDetailsStep value={formData} onChange={handleChange} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 2 && (
            <TargetingBudgetStep value={formData} onChange={handleChange} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 3 && (
            <ReviewSubmitStep value={formData} onBack={prevStep} />
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>Back</Button>
            <Button onClick={() => (currentStep < 3 ? nextStep() : null)}>{currentStep < 3 ? 'Next' : 'Submit'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
