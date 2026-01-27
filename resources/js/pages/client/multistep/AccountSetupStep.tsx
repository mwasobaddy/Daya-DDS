import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
  value: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onNext: () => void;
}

export default function AccountSetupStep({ value, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!value.businessName) e.businessName = 'Business name is required.';
    if (!value.fullName) e.fullName = 'Full name is required.';
    if (!value.email) e.email = 'Email is required.';
    if (!value.phone) e.phone = 'Phone number is required.';
    if (!value.country) e.country = 'Country is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Account Setup</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Business Name</Label>
          <Input value={value.businessName || ''} onChange={(e) => onChange({ businessName: e.target.value })} />
          {errors.businessName && <InputError>{errors.businessName}</InputError>}
        </div>

        <div>
          <Label>Full Name</Label>
          <Input value={value.fullName || ''} onChange={(e) => onChange({ fullName: e.target.value })} />
          {errors.fullName && <InputError>{errors.fullName}</InputError>}
        </div>

        <div>
          <Label>Email Address</Label>
          <Input type="email" value={value.email || ''} onChange={(e) => onChange({ email: e.target.value })} />
          {errors.email && <InputError>{errors.email}</InputError>}
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input value={value.phone || ''} onChange={(e) => onChange({ phone: e.target.value })} />
          {errors.phone && <InputError>{errors.phone}</InputError>}
        </div>

        <div>
          <Label>Country</Label>
          <Select onValueChange={(val) => onChange({ country: val })} value={value.country || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && <InputError>{errors.country}</InputError>}
        </div>

        <div className="mt-4">
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}
