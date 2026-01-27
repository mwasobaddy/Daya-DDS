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
  onPrevious: () => void;
}

export default function WalletSetupStep({ value, onChange, onNext, onPrevious }: Props) {
  const [pin, setPin] = useState(String(value.pin ?? ''));
  const [confirmPin, setConfirmPin] = useState(String(value.confirmPin ?? ''));
  const [agreeToTerms, setAgreeToTerms] = useState(Boolean(value.agreeToTerms ?? false));

  const [errors, setErrors] = useState<Record<string, string>>({});

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
            <Input
              id="pin"
              type="password"
              maxLength={4}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (errors.pin) {
                  setErrors(prev => ({ ...prev, pin: '' }));
                }
              }}
              placeholder="4-digit PIN"
            />
            <InputError message={errors.pin} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">
              Confirm PIN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPin"
              type="password"
              maxLength={4}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                if (errors.confirmPin) {
                  setErrors(prev => ({ ...prev, confirmPin: '' }));
                }
              }}
              placeholder="Confirm PIN"
            />
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
          onClick={onPrevious}
          variant="outline"
          className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
        >
          Complete Registration
        </Button>
      </div>
    </form>
  );
}