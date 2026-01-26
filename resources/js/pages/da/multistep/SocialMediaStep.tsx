import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

const platforms = [
  { key: 'instagram', label: 'Instagram', options: ['Less than 1K', '1K-10K', '10K-50K', '50K-100K', '100K+'] },
  { key: 'x', label: 'X (Twitter)', options: ['Less than 1K', '1K-10K', '10K-50K', '50K-100K', '100K+'] },
  { key: 'facebook', label: 'Facebook', options: ['Less than 1K', '1K-10K', '10K-50K', '50K-100K', '100K+'] },
  { key: 'tiktok', label: 'TikTok', options: ['Less than 1K', '1K-10K', '10K-50K', '50K-100K', '100K+'] },
  { key: 'linkedin', label: 'LinkedIn', options: ['Less than 1K', '1K-10K', '10K-50K', '50K-100K', '100K+'] },
  { key: 'whatsapp', label: 'WhatsApp', options: ['Less than 50', '51-100 views', '101-200 views', '201-500 views', '500+ views'] },
];

export default function SocialMediaStep({ value, onChange, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Record<string, string | undefined>>(
    (value.socialPlatforms as Record<string, string | undefined>) || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCheck = (key: string, checked: boolean) => {
    setSelected((prev: Record<string, string | undefined>) => {
      const next = { ...prev };
      if (checked) {
        next[key] = '';
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const handleSelect = (key: string, val: string) => {
    setSelected((prev: Record<string, string | undefined>) => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (Object.keys(selected).length === 0) {
      newErrors.socialPlatforms = 'Select at least one platform and fill reach.';
    }

    if (Object.values(selected).some((val) => !val)) {
      newErrors.socialPlatforms = 'All selected platforms must have a reach value.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onChange({ socialPlatforms: selected });
    onNext();
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-4">
        <div className="space-y-3">
          {platforms.map(p => (
            <div key={p.key} className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-blue-300 transition-colors duration-200">
              <Label htmlFor={p.key} className="flex items-center cursor-pointer">
                <Checkbox
                  id={p.key}
                  checked={selected[p.key] !== undefined}
                  onCheckedChange={(checked) => handleCheck(p.key, checked === true)}
                />
                <span className="ml-3 text-sm font-medium">{p.label}</span>
              </Label>
              {selected[p.key] !== undefined && (
                <div className="mt-3 ml-7">
                  <Select
                    value={selected[p.key]}
                    onValueChange={(value) => handleSelect(p.key, value)}
                  >
                    <SelectTrigger className="w-full px-4 py-2 text-sm text-gray-900 dark:text-white bg-white border dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                      <SelectValue placeholder="Select reach" />
                    </SelectTrigger>
                    <SelectContent>
                      {p.options.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
          <InputError message={errors.socialPlatforms} />
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
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}