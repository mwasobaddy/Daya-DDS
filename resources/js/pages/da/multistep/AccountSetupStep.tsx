import React, { useEffect, useState } from 'react';

interface Props {
  value: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

const genderOptions = ['Male', 'Female', 'Other'];
const countryOptions = [
  { label: 'Kenya', value: 'kenya' },
  { label: 'Nigeria', value: 'nigeria' },
];

export default function AccountSetupStep({ value, onChange, onNext }: Props) {
  const [referralCode, setReferralCode] = useState(value.referralCode || '');
  const [fullName, setFullName] = useState(value.fullName || '');
  const [nationalId, setNationalId] = useState(value.nationalId || '');
  const [dob, setDob] = useState(value.dob || '');
  const [gender, setGender] = useState(value.gender || '');
  const [email, setEmail] = useState(value.email || '');
  const [phone, setPhone] = useState(value.phone || '');
  const [address, setAddress] = useState(value.address || '');
  const [country, setCountry] = useState(value.country || '');
  const [county, setCounty] = useState(value.county || '');
  const [subcounty, setSubcounty] = useState(value.subcounty || '');
  const [ward, setWard] = useState(value.ward || '');
  const [state, setState] = useState(value.state || '');
  const [lga, setLga] = useState(value.lga || '');
  const [nigeriaWard, setNigeriaWard] = useState(value.nigeriaWard || '');

  // TODO: Fetch counties, subcounties, wards, states, lgas, nigeriaWards from API

  const handleNext = () => {
    onChange({
      referralCode,
      fullName,
      nationalId,
      dob,
      gender,
      email,
      phone,
      address,
      country,
      county,
      subcounty,
      ward,
      state,
      lga,
      nigeriaWard,
    });
    onNext();
  };

  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div>
        <label className="block font-medium">Referral Code *</label>
        <input className="input" value={referralCode} onChange={e => setReferralCode(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Full Name *</label>
        <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">National ID Number *</label>
        <input className="input" value={nationalId} onChange={e => setNationalId(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Date of Birth *</label>
        <input type="date" className="input" value={dob} onChange={e => setDob(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Gender *</label>
        <select className="input" value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="">Select</option>
          {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Email Address *</label>
        <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Phone Number *</label>
        <input className="input" value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Home Address *</label>
        <input className="input" value={address} onChange={e => setAddress(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Location *</label>
        <select className="input" value={country} onChange={e => setCountry(e.target.value)} required>
          <option value="">Select Country</option>
          {countryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {country === 'kenya' && (
        <div className="space-y-2">
          <div>
            <label className="block font-medium">County *</label>
            <input className="input" value={county} onChange={e => setCounty(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium">Subcounty *</label>
            <input className="input" value={subcounty} onChange={e => setSubcounty(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium">Ward *</label>
            <input className="input" value={ward} onChange={e => setWard(e.target.value)} required />
          </div>
        </div>
      )}
      {country === 'nigeria' && (
        <div className="space-y-2">
          <div>
            <label className="block font-medium">State *</label>
            <input className="input" value={state} onChange={e => setState(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium">Local Government *</label>
            <input className="input" value={lga} onChange={e => setLga(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium">Ward *</label>
            <input className="input" value={nigeriaWard} onChange={e => setNigeriaWard(e.target.value)} required />
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
}
