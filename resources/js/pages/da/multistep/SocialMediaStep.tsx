import React, { useState } from 'react';

interface Props {
  value: any;
  onChange: (data: any) => void;
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
  const [selected, setSelected] = useState<any>(value.socialPlatforms || {});

  const handleCheck = (key: string) => {
    setSelected((prev: any) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = '';
      }
      return next;
    });
  };

  const handleSelect = (key: string, val: string) => {
    setSelected((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    if (Object.keys(selected).length === 0) {
      alert('Select at least one platform and fill reach.');
      return;
    }
    onChange({ socialPlatforms: selected });
    onNext();
  };

  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div>
        <label className="block font-medium mb-2">Social Media Presence *</label>
        {platforms.map(p => (
          <div key={p.key} className="mb-2">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={selected[p.key] !== undefined} onChange={() => handleCheck(p.key)} />
              <span className="ml-2">{p.label}</span>
            </label>
            {selected[p.key] !== undefined && (
              <select className="ml-4 input" value={selected[p.key]} onChange={e => handleSelect(p.key, e.target.value)} required>
                <option value="">Select Reach</option>
                {p.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button type="button" className="btn" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
}
