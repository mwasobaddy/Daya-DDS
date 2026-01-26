import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
}

const genderOptions = ['Male', 'Female', 'Other'];
const countryOptions = [
  { label: 'Kenya', value: 'kenya' },
  { label: 'Nigeria', value: 'nigeria' },
];

export default function AccountSetupStep({ value, onChange, onNext }: Props) {
  const [referralCode, setReferralCode] = useState(String(value.referralCode ?? ''));
  const [fullName, setFullName] = useState(String(value.fullName ?? ''));
  const [nationalId, setNationalId] = useState(String(value.nationalId ?? ''));
  const [dob, setDob] = useState(String(value.dob ?? ''));
  const [gender, setGender] = useState(String(value.gender ?? ''));
  const [email, setEmail] = useState(String(value.email ?? ''));
  const [phone, setPhone] = useState(String(value.phone ?? ''));
  const [address, setAddress] = useState(String(value.address ?? ''));
  const [country, setCountry] = useState(String(value.country ?? ''));
  const [county, setCounty] = useState(String(value.county ?? ''));
  const [subcounty, setSubcounty] = useState(String(value.subcounty ?? ''));
  const [ward, setWard] = useState(String(value.ward ?? ''));
  const [state, setState] = useState(String(value.state ?? ''));
  const [lga, setLga] = useState(String(value.lga ?? ''));
  const [nigeriaWard, setNigeriaWard] = useState(String(value.nigeriaWard ?? ''));

  const [errors, setErrors] = useState<Record<string, string>>({});

  // TODO: Fetch counties, subcounties, wards, states, lgas, nigeriaWards from API

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = 'Invalid email address.';
    if (!phone) newErrors.phone = 'Phone number is required.';
    if (!address) newErrors.address = 'Address is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* Referral Code */}
        <div className="grid gap-2">
          <Label htmlFor="referralCode">
            Referral Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="referralCode"
            type="text"
            // className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
            placeholder="Enter referral code"
          />
        </div>

        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="John Doe"
          />
          <InputError message={errors.fullName} />
        </div>

        {/* Grid Layout for National ID and DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nationalId">
              National ID Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nationalId"
              type="text"
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={nationalId}
              onChange={e => setNationalId(e.target.value)}
              placeholder="ID number"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
            //   className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="grid gap-2">
          <Label htmlFor="gender">
            Gender <span className="text-red-500">*</span>
          </Label>
          <Select value={gender} onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {genderOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+254 700 000 000"
            />
            <InputError message={errors.phone} />
          </div>
        </div>

        {/* Address */}
        <div className="grid gap-2">
          <Label htmlFor="address">
            Home Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Main Street"
          />
          <InputError message={errors.address} />
        </div>

        {/* Country Selection */}
        <div className="grid gap-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select value={country} onValueChange={(value) => setCountry(value)}>
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kenya Specific Fields */}
        {country === 'kenya' && (
          <Card className="shadow-xl col-span-7 md:col-span-3 px-8 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
            <h3 className="text-sm font-semibold">Kenya Location Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="county">
                County <span className="text-red-500">*</span>
              </Label>
              <Input
                id="county"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={county}
                onChange={e => setCounty(e.target.value)}
                placeholder="Enter county"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcounty">
                Subcounty <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subcounty"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={subcounty}
                onChange={e => setSubcounty(e.target.value)}
                placeholder="Enter subcounty"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ward">
                Ward <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ward"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={ward}
                onChange={e => setWard(e.target.value)}
                placeholder="Enter ward"
              />
            </div>
          </Card>
        )}

        {/* Nigeria Specific Fields */}
        {country === 'nigeria' && (
          <Card className="shadow-xl col-span-7 md:col-span-3 px-8 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
            <h3 className="text-sm font-semibold">Nigeria Location Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="state">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="Enter state"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lga">
                Local Government <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lga"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={lga}
                onChange={e => setLga(e.target.value)}
                placeholder="Enter local government"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nigeriaWard">
                Ward <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nigeriaWard"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={nigeriaWard}
                onChange={e => setNigeriaWard(e.target.value)}
                placeholder="Enter ward"
              />
            </div>
          </Card>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
        >
          Continue
        </button>
      </div>
    </form>
  );
}