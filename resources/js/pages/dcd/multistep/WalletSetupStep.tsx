import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WalletSetupStep({ value, onChange, onNext, onBack }: Props) {
  const [pin, setPin] = useState(String(value.pin ?? ''));
  const [confirmPin, setConfirmPin] = useState(String(value.confirmPin ?? ''));
  const [agreeToTerms, setAgreeToTerms] = useState(Boolean(value.agreeToTerms ?? false));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!pin) newErrors.pin = 'PIN is required.';
    if (!/^[0-9]{4}$/.test(pin)) newErrors.pin = 'PIN must be a 4-digit number.';
    if (pin !== confirmPin) newErrors.confirmPin = 'PINs do not match.';
    if (!agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    onChange({ pin, agreeToTerms });
    onNext();
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* PIN Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="pin">
              Wallet PIN <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                maxLength={4}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none pr-10"
                value={pin}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setPin(numericValue);
                  if (errors.pin) {
                    setErrors(prev => ({ ...prev, pin: '' }));
                  }
                }}
                placeholder="4-digit PIN"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <InputError message={errors.pin} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">
              Confirm PIN <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                maxLength={4}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none pr-10"
                value={confirmPin}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setConfirmPin(numericValue);
                  if (errors.confirmPin) {
                    setErrors(prev => ({ ...prev, confirmPin: '' }));
                  }
                }}
                placeholder="Confirm PIN"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <InputError message={errors.confirmPin} />
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-4">
          <Label className="flex items-start cursor-pointer group">
            <Checkbox
              checked={agreeToTerms}
              onCheckedChange={(checked) => {
                setAgreeToTerms(checked === true);
                if (errors.agreeToTerms) {
                  setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                }
              }}
              className='border-gray-400 dark:border-gray-50/30'
            />
            <span className="ml-3 text-sm text-muted-foreground">
              I agree to the <span className="text-blue-600 underline">terms and conditions</span>
            </span>
          </Label>
          <InputError message={errors.agreeToTerms} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="px-6 py-2.5"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </div>
    </form>
  );
}