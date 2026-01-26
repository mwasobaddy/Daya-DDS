import type { LucideIcon } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

interface Step {
    number: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

interface TopStepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export default function TopStepIndicator({ steps, currentStep }: TopStepIndicatorProps) {
    return (
        <div className="w-full">
            {/* Main container changed to flex-row */}
            <div className="flex flex-row items-start justify-between max-w-5xl mx-auto">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                        <div key={step.number} className="flex flex-col items-center flex-1 relative">
                            {/* Top side - Icon and horizontal connector line */}
                            <div className="flex items-center w-full">
                                {/* Left half-line (for centering the icon) */}
                                <div className={`flex-1 h-0.5 ${index === 0 ? 'bg-transparent' : (isCompleted || isActive ? 'bg-green-600' : 'bg-gray-300')}`} />
                                
                                <div 
                                    className={`relative z-10 ${
                                        isCompleted ? 'bg-green-200 dark:bg-green-700/25 p-2 rounded-full transition-all' : 'p-2'
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                            isActive
                                                ? 'bg-white text-green-600 shadow-lg border-2 border-green-400'
                                                : isCompleted
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-500 border-2 border-gray-300'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-7 w-7" />
                                        ) : (
                                            <Icon className="h-7 w-7" />
                                        )}
                                    </div>
                                </div>

                                {/* Right half-line */}
                                <div className={`flex-1 h-0.5 ${index === steps.length - 1 ? 'bg-transparent' : (isCompleted ? 'bg-green-600' : 'bg-gray-300')}`} />
                            </div>

                            {/* Bottom side - Content */}
                            <div className="mt-4 text-center px-2">
                                <h3 className={`hidden text-lg font-bold mb-1 ${isActive ? 'text-green-600' : 'text-foreground'}`}>
                                    {step.title}
                                </h3>
                                <p className="hidden text-sm text-muted-foreground max-w-37.5">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}