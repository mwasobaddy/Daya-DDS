import React, { useState } from "react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

const walletTypes = ["Personal", "Business", "Both"];
const commChannels = ["WhatsApp", "Telegram", "Email", "Phone"];

export default function WalletSetupStep({ value, onChange, onNext, onBack }: Props) {
  const [walletType, setWalletType] = useState<string>(String(value.walletType || ""));
  const [pin, setPin] = useState<string>(String(value.pin || ""));
  const [confirmPin, setConfirmPin] = useState<string>(String(value.confirmPin || ""));
  const [commChannel, setCommChannel] = useState<string>(String(value.commChannel || ""));
  const [agreed, setAgreed] = useState<boolean>(!!value.agreed);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!walletType) newErrors.walletType = "Wallet type is required.";
    if (!pin) newErrors.pin = "PIN is required.";
    if (!/^[0-9]{4}$/.test(pin)) newErrors.pin = "PIN must be a 4-digit number.";
    if (pin !== confirmPin) newErrors.confirmPin = "PINs do not match.";
    if (!commChannel) newErrors.commChannel = "Communication channel is required.";
    if (!agreed) newErrors.agreed = "You must agree to the terms.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    onChange({ walletType, pin, commChannel, agreed });
    onNext();
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="space-y-5">
        {/* Communication Channel */}
        <div className="space-y-2">
          <Label htmlFor="commChannel">
            Preferred Communication Channel <span className="text-red-500">*</span>
          </Label>
          <Select
            value={commChannel}
            onValueChange={(value) => {
              setCommChannel(value);
              if (errors.commChannel) {
                setErrors(prev => ({ ...prev, commChannel: '' }));
              }
            }}
          >
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {commChannels.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.commChannel} />
        </div>

        {/* Wallet Type */}
        <div className="space-y-2">
          <Label htmlFor="walletType">
            Wallet Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={walletType}
            onValueChange={(value) => {
              setWalletType(value);
              if (errors.walletType) {
                setErrors(prev => ({ ...prev, walletType: '' }));
              }
            }}
          >
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select wallet type" />
            </SelectTrigger>
            <SelectContent>
              {walletTypes.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.walletType} />
        </div>

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
              checked={agreed}
              onCheckedChange={(checked) => {
                setAgreed(checked === true);
                if (errors.agreed) {
                  setErrors(prev => ({ ...prev, agreed: '' }));
                }
              }}
            />
            <span className="ml-3 text-sm text-muted-foreground">
              I agree to the <span className="text-blue-600 underline">terms and conditions</span>
            </span>
          </Label>
          <InputError message={errors.agreed} />
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
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  );
}