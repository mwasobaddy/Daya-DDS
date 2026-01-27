import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

const musicGenres = ['Afrobeat','Afrobeats','Afro-rave','African hip-hop','Afro fusion','Alté','Amapiano','Benga','Bongo Flava','Blues','Classical','Country','Dancehall','Electronic','Folk','Funk','Gengetone','Gospel','Hip Hop','House','Jazz','Kapuka','Kwaito','Lingala','Ohangla','Pop','R&B','Rap','Reggae','Rock','Rumba','Soul','Taarab','Traditional','Trap'];

interface Props {
  value: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CampaignDetailsStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!value.campaignTitle) e.campaignTitle = 'Campaign title is required.';
    if (!value.accountType) e.accountType = 'Account type is required.';
    if (!value.digitalProductLink) e.digitalProductLink = 'Digital product link is required.';
    if (!value.campaignObjective) e.campaignObjective = 'Campaign objective is required.';
    if (!value.budget) e.budget = 'Budget is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const toggleGenre = (g: string, checked: boolean) => {
    const genres = Array.isArray(value.musicalGenres) ? [...value.musicalGenres] : [];
    if (checked) {
      if (!genres.includes(g)) genres.push(g);
    } else {
      const idx = genres.indexOf(g);
      if (idx >= 0) genres.splice(idx, 1);
    }
    onChange({ musicalGenres: genres });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Campaign Title</Label>
          <Input value={value.campaignTitle || ''} onChange={(e) => onChange({ campaignTitle: e.target.value })} />
          {errors.campaignTitle && <InputError>{errors.campaignTitle}</InputError>}
        </div>

        <div>
          <Label>Account type</Label>
          <Select onValueChange={(val) => onChange({ accountType: val })} value={value.accountType || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="Artist">Artist</SelectItem>
              <SelectItem value="Label">Label</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Agency">Agency</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountType && <InputError>{errors.accountType}</InputError>}
        </div>

        {(value.accountType === 'Artist' || value.accountType === 'Label') && (
          <div>
            <Label>Genres (select multiple)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto border p-2 rounded">
              {musicGenres.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={Array.isArray(value.musicalGenres) && value.musicalGenres.includes(g)} onCheckedChange={(c) => toggleGenre(g, Boolean(c))} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Digital Product Link</Label>
          <Input value={value.digitalProductLink || ''} onChange={(e) => onChange({ digitalProductLink: e.target.value })} />
          {errors.digitalProductLink && <InputError>{errors.digitalProductLink}</InputError>}
        </div>

        <div>
          <Label>Explainer Video URL (optional)</Label>
          <Input value={value.explainerVideo || ''} onChange={(e) => onChange({ explainerVideo: e.target.value })} />
        </div>

        <div>
          <Label>Campaign Objective</Label>
          <Select onValueChange={(val) => onChange({ campaignObjective: val })} value={value.campaignObjective || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select objective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Music Promotion">Music Promotion</SelectItem>
              <SelectItem value="App downloads">App downloads</SelectItem>
              <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
              <SelectItem value="Product Launch">Product Launch</SelectItem>
              <SelectItem value="Event Promotion">Event Promotion</SelectItem>
              <SelectItem value="Survey">Survey</SelectItem>
            </SelectContent>
          </Select>
          {errors.campaignObjective && <InputError>{errors.campaignObjective}</InputError>}
        </div>

        <div>
          <Label>Budget</Label>
          <Input value={value.budget || ''} onChange={(e) => onChange({ budget: e.target.value })} />
          {errors.budget && <InputError>{errors.budget}</InputError>}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}
