import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

const businessTargets = {
  Retail: ['kiosk_duka','mini_supermarket','wholesale_shop','hardware_store','agrovet','butchery','boutique','electronics','stationery','general_store'],
  Services: ['salon','barber_shop','beauty_parlour','tailor','uber','shoe_repair','photography_studio','printing_cyber','laundry'],
  Food: ['cafe','restaurant','fast_food','mama_mboga','milk_atm','bakery'],
  Financial: ['mobile_money','bank_agent','bill_payment','betting_shop'],
  Transport: ['boda_boda','matatu_sacco','fuel_station','car_wash'],
  Community: ['church','school_canteen','bar_lounge','pharmacy','clinic','other'],
};

interface Props {
  value: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TargetingBudgetStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!value.contentSafety || !Array.isArray(value.contentSafety) || value.contentSafety.length === 0) e.contentSafety = 'Please select at least one content safety preference.';
    if (!value.targetCountry) e.targetCountry = 'Please select a target country.';
    if (!value.businessTypeTargeting || !Array.isArray(value.businessTypeTargeting) || value.businessTypeTargeting.length === 0) e.businessTypeTargeting = 'Please select at least one business type target.';
    if (!value.campaignStart) e.campaignStart = 'Please select a start date.';
    if (!value.campaignEnd) e.campaignEnd = 'Please select an end date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleBusinessType = (type: string, checked: boolean) => {
    const selected = Array.isArray(value.businessTypeTargeting) ? [...value.businessTypeTargeting] : [];
    if (checked) {
      if (!selected.includes(type)) selected.push(type);
    } else {
      const idx = selected.indexOf(type);
      if (idx >= 0) selected.splice(idx, 1);
    }
    onChange({ businessTypeTargeting: selected });
  };

  const toggleSafety = (s: string, checked: boolean) => {
    const arr = Array.isArray(value.contentSafety) ? [...value.contentSafety] : [];
    if (checked) {
      if (!arr.includes(s)) arr.push(s);
    } else {
      const idx = arr.indexOf(s);
      if (idx >= 0) arr.splice(idx, 1);
    }
    onChange({ contentSafety: arr });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Targeting & Budget</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Content Safety preference</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Kids Appropriate','Teen Appropriate (13+)','Adult Content (18+)','No restriction'].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <Checkbox checked={Array.isArray(value.contentSafety) && value.contentSafety.includes(s)} onCheckedChange={(c) => toggleSafety(s, Boolean(c))} />
                <span>{s}</span>
              </label>
            ))}
          </div>
          {errors.contentSafety && <InputError>{errors.contentSafety}</InputError>}
        </div>

        <div>
          <Label>Target Country</Label>
          <Select onValueChange={(val) => onChange({ targetCountry: val })} value={value.targetCountry || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
            </SelectContent>
          </Select>
          {errors.targetCountry && <InputError>{errors.targetCountry}</InputError>}
        </div>

        {value.targetCountry === 'Kenya' && (
          <>
            <div>
              <Label>County</Label>
              <Input value={value.county || ''} onChange={(e) => onChange({ county: e.target.value })} />
            </div>
            <div>
              <Label>Subcounty</Label>
              <Input value={value.subcounty || ''} onChange={(e) => onChange({ subcounty: e.target.value })} />
            </div>
            <div>
              <Label>Ward</Label>
              <Input value={value.ward || ''} onChange={(e) => onChange({ ward: e.target.value })} />
            </div>
          </>
        )}

        {value.targetCountry === 'Nigeria' && (
          <>
            <div>
              <Label>State</Label>
              <Input value={value.state || ''} onChange={(e) => onChange({ state: e.target.value })} />
            </div>
            <div>
              <Label>Local Government</Label>
              <Input value={value.lga || ''} onChange={(e) => onChange({ lga: e.target.value })} />
            </div>
            <div>
              <Label>Ward</Label>
              <Input value={value.ward || ''} onChange={(e) => onChange({ ward: e.target.value })} />
            </div>
          </>
        )}

        <div>
          <Label>Business Type Targeting</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(businessTargets).map(([section, types]) => (
              <div key={section}>
                <div className="font-semibold">{section}</div>
                <div className="grid grid-cols-1 gap-1 mt-2">
                  {types.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={Array.isArray(value.businessTypeTargeting) && value.businessTypeTargeting.includes(t)} onCheckedChange={(c) => toggleBusinessType(t, Boolean(c))} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.businessTypeTargeting && <InputError>{errors.businessTypeTargeting}</InputError>}
        </div>

        <div>
          <Label>Campaign duration</Label>
          <div className="flex gap-2">
            <Input type="date" value={value.campaignStart || ''} onChange={(e) => onChange({ campaignStart: e.target.value })} />
            <Input type="date" value={value.campaignEnd || ''} onChange={(e) => onChange({ campaignEnd: e.target.value })} />
          </div>
          {errors.campaignStart && <InputError>{errors.campaignStart}</InputError>}
          {errors.campaignEnd && <InputError>{errors.campaignEnd}</InputError>}
        </div>

        <div>
          <Label>Target Audience (optional)</Label>
          <Input value={value.targetAudience || ''} onChange={(e) => onChange({ targetAudience: e.target.value })} />
        </div>

        <div>
          <Label>Key Objectives (optional)</Label>
          <Input value={value.keyObjectives || ''} onChange={(e) => onChange({ keyObjectives: e.target.value })} />
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button onClick={() => { if (Object.keys(errors).length === 0) onNext(); else { if (validate()) onNext(); } }}>Next</Button>
        </div>
      </div>
    </div>
  );
}
