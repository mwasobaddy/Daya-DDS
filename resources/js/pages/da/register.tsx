import { User, Share2, Wallet, CheckCircle, BadgeCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import LeftStepIndicator from '../components/LeftStepIndicator';
import TopStepIndicator from '../components/TopStepIndicator';
import AccountSetupStep from './multistep/AccountSetupStep';
import ReviewSubmitStep from './multistep/ReviewSubmitStep';
import SocialMediaStep from './multistep/SocialMediaStep';
import WalletSetupStep from './multistep/WalletSetupStep';

const steps = [
	{
		number: 0,
		title: 'Account Setup',
		description: 'Set up your account details',
		icon: User,
	},
	{
		number: 1,
		title: 'Social Media Presence',
		description: 'Provide your social media details',
		icon: Share2,
	},
	{
		number: 2,
		title: 'Account & Wallet Setup',
		description: 'Link your wallet and finalize account setup',
		icon: Wallet,
	},
	{
		number: 3,
		title: 'Review & Submit',
		description: 'Review your details and submit',
		icon: CheckCircle,
	},
];

export default function DASignup() {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, unknown>>({});

	const nextStep = () =>
		setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
	const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

	const updateForm = (data: Record<string, unknown>) =>
		setFormData((prev) => ({ ...prev, ...data }));

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-neutral-900 py-8 px-4">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-3xl font-bold">
					Digital Ambassador Registration
				</h1>
			</div>
			<div className="max-w-7xl mx-auto grid grid-cols-7 gap-8">
        {/* Top */}
        <Card className="lg:hidden shadow-xl col-span-7 p-0 pt-3 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
          <TopStepIndicator
            steps={steps}
            currentStep={currentStep}
          />
        </Card>

				{/* Left Card - Progress and Welcome */}
				<Card className="hidden lg:block shadow-xl col-span-7 lg:col-span-3 px-8 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
          <div className="flex gap-4 mb-8 pt-6 items-center">
              <div className="flex justify-center mb-4">
                  <div className="h-8 w-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <BadgeCheck className="h-8 w-8 text-white" />
                  </div>
              </div>
              <div>
                  <h1 className="text-xl font-bold mb-0">
                      Welcome, aboard!
                  </h1>
                  <p className="text-muted-foreground">
                      Let's get workspace set up in just a few steps
                  </p>
                  <p className="text-muted-foreground">
                    Complete all steps to join our ambassador program
                  </p>
              </div>
          </div>
          <div>
            <LeftStepIndicator
              steps={steps}
              currentStep={currentStep}
            />
          </div>
				</Card>

				{/* Right Card - Form Content */}
				<Card className="col-span-7 lg:col-span-4 bg-transparent border-0 shadow-none">
					<CardHeader>
						<CardTitle>
							<p className='text-md uppercase mb-2 font-black! text-blue-800 dark:text-blue-400'>
								STEP {currentStep + 1} OF {steps.length}
							</p>
							<h2 className='text-2xl'>
								{steps[currentStep].title}
							</h2>
							<div className='h-1 bg-linear-to-r from-green-500 to-blue-500 rounded-full mb-2 w-24'>
							</div>
						</CardTitle>
						<CardDescription>
							{steps[currentStep].description}
						</CardDescription>
					</CardHeader>

					<CardContent>
						{currentStep === 0 && (
							<AccountSetupStep
								value={formData}
								onChange={updateForm}
								onNext={nextStep}
							/>
						)}
						{currentStep === 1 && (
							<SocialMediaStep
								value={formData}
								onChange={updateForm}
								onNext={nextStep}
								onBack={prevStep}
							/>
						)}
						{currentStep === 2 && (
							<WalletSetupStep
								value={formData}
								onChange={updateForm}
								onNext={nextStep}
								onBack={prevStep}
							/>
						)}
						{currentStep === 3 && (
							<ReviewSubmitStep value={formData} onBack={prevStep} />
						)}
					</CardContent>

					{/* Footer */}
					<div className="mt-6 text-center text-sm text-gray-500">
						Need help?{' '}
						<a href="#" className="text-blue-600 hover:underline">
							Contact support
						</a>
					</div>
				</Card>
			</div>
		</div>
	);
}
