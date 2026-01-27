import React, { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
}

interface LocationOption {
  id: number;
  name: string;
  code: string;
}

const genderOptions = ['Male', 'Female', 'Other'];

// Calculate maximum date for 18+ years old (18 years ago from today)
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const maxDateString = maxDate.toISOString().split('T')[0];

export default function AccountSetupStep({ value, onChange, onNext }: Props) {
  const [referralCode, setReferralCode] = useState(String(value.referralCode ?? ''));
  const [fullName, setFullName] = useState(String(value.fullName ?? ''));
  const [nationalId, setNationalId] = useState(String(value.nationalId ?? ''));
  const [dob, setDob] = useState(String(value.dob ?? ''));
  const [gender, setGender] = useState(String(value.gender ?? ''));
  const [email, setEmail] = useState(String(value.email ?? ''));
  const [phone, setPhone] = useState(String(value.phone ?? ''));
  const [businessAddress, setBusinessAddress] = useState(String(value.businessAddress ?? ''));

  // Location states
  const [country, setCountry] = useState(String(value.country ?? ''));
  const [county, setCounty] = useState(String(value.county ?? ''));
  const [subcounty, setSubcounty] = useState(String(value.subcounty ?? ''));
  const [ward, setWard] = useState(String(value.ward ?? ''));

  // Location options states
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [counties, setCounties] = useState<LocationOption[]>([]);
  const [subcounties, setSubcounties] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Get referral code from URL or assign random admin
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlReferralCode = urlParams.get('ref');

    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
    } else {
      // Fetch random admin referral code
      fetchRandomAdminReferralCode();
    }
  }, []);

  const fetchRandomAdminReferralCode = async () => {
    try {
      const response = await fetch('/api/admin/random-referral-code');
      if (response.ok) {
        const data = await response.json();
        setReferralCode(data.referral_code);
      }
    } catch (error) {
      console.error('Failed to fetch admin referral code:', error);
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/locations/countries');
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch counties when country changes
  useEffect(() => {
    if (!country) {
      setCounties([]);
      setCounty('');
      return;
    }

    const fetchCounties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/locations/counties?country_id=${country}`);
        if (response.ok) {
          const data = await response.json();
          setCounties(data);
        }
      } catch (error) {
        console.error('Failed to fetch counties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounties();
  }, [country]);

  // Fetch subcounties when county changes
  useEffect(() => {
    if (!county) {
      setSubcounties([]);
      setSubcounty('');
      return;
    }

    const fetchSubcounties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/locations/subcounties?county_id=${county}`);
        if (response.ok) {
          const data = await response.json();
          setSubcounties(data);
        }
      } catch (error) {
        console.error('Failed to fetch subcounties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcounties();
  }, [county]);

  // Fetch wards when subcounty changes
  useEffect(() => {
    if (!subcounty) {
      setWards([]);
      setWard('');
      return;
    }

    const fetchWards = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/locations/wards?subcounty_id=${subcounty}`);
        if (response.ok) {
          const data = await response.json();
          setWards(data);
        }
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWards();
  }, [subcounty]);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    // Referral code is now optional
    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!nationalId) newErrors.nationalId = 'National ID is required.';
    if (nationalId && !/^\d+$/.test(nationalId)) newErrors.nationalId = 'National ID must contain only numbers.';
    if (!dob) newErrors.dob = 'Date of birth is required.';
    else {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;
      
      if (adjustedAge < 18) {
        newErrors.dob = 'You must be at least 18 years old to register.';
      }
    }
    if (!gender) newErrors.gender = 'Gender is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (!phone) newErrors.phone = 'Phone number is required.';
    if (!businessAddress) newErrors.businessAddress = 'Business address is required.';
    if (!country) newErrors.country = 'Country is required.';
    if (!county) newErrors.county = 'County/State is required.';
    if (!subcounty) newErrors.subcounty = 'Subcounty/Local Government is required.';
    if (!ward) newErrors.ward = 'Ward is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onChange({
        referralCode,
        fullName,
        nationalId,
        dob,
        gender,
        email,
        phone,
        businessAddress,
        country,
        county,
        subcounty,
        ward,
      });
      onNext();
    }
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* Referral Code */}
        <div className="grid gap-2">
          <Label htmlFor="referralCode">
            Referral Code
          </Label>
          <Input
            id="referralCode"
            type="text"
            disabled={loading}
            value={referralCode}
            onChange={e => {
              setReferralCode(e.target.value);
              if (errors.referralCode) {
                setErrors(prev => ({ ...prev, referralCode: '' }));
              }
            }}
            placeholder="Enter referral code"
          />
          <InputError message={errors.referralCode} />
        </div>

        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            disabled={loading}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={fullName}
            onChange={e => {
              setFullName(e.target.value);
              if (errors.fullName) {
                setErrors(prev => ({ ...prev, fullName: '' }));
              }
            }}
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
              disabled={loading}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={nationalId}
              onChange={e => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setNationalId(numericValue);
                if (errors.nationalId) {
                  setErrors(prev => ({ ...prev, nationalId: '' }));
                }
              }}
              placeholder="ID number"
            />
            <InputError message={errors.nationalId} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              max={maxDateString}
              value={dob}
              onChange={e => {
                setDob(e.target.value);
                if (errors.dob) {
                  setErrors(prev => ({ ...prev, dob: '' }));
                }
              }}
            />
            <InputError message={errors.dob} />
          </div>
        </div>

        {/* Gender */}
        <div className="grid gap-2">
          <Label htmlFor="gender">
            Gender <span className="text-red-500">*</span>
          </Label>
          <Select value={gender} onValueChange={(value) => {
            setGender(value);
            if (errors.gender) {
              setErrors(prev => ({ ...prev, gender: '' }));
            }
          }}>
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {genderOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.gender} />
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
              disabled={loading}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
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
              disabled={loading}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              value={phone}
              onChange={e => {
                setPhone(e.target.value);
                if (errors.phone) {
                  setErrors(prev => ({ ...prev, phone: '' }));
                }
              }}
              placeholder="+254700000000"
            />
            <InputError message={errors.phone} />
          </div>
        </div>

        {/* Business Address */}
        <div className="grid gap-2">
          <Label htmlFor="businessAddress">
            Business Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessAddress"
            type="text"
            disabled={loading}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={businessAddress}
            onChange={e => {
              setBusinessAddress(e.target.value);
              if (errors.businessAddress) {
                setErrors(prev => ({ ...prev, businessAddress: '' }));
              }
            }}
            placeholder="123 Main Street, Nairobi"
          />
          <InputError message={errors.businessAddress} />
        </div>

        {/* Country Selection */}
        <div className="grid gap-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select value={country} onValueChange={(value) => {
            setCountry(value);
            setCounty('');
            setSubcounty('');
            setWard('');
            if (errors.country) {
              setErrors(prev => ({ ...prev, country: '' }));
            }
          }}>
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.map((countryOption) => (
                <SelectItem key={countryOption.id} value={String(countryOption.id)}>
                  {countryOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.country} />
        </div>

        {/* Kenya Specific Fields */}
        {country && countries.find(c => String(c.id) === country)?.name === 'Kenya' && (
          <Card className="shadow-xl col-span-7 md:col-span-3 px-8 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
            <h3 className="text-sm font-semibold">Kenya Location Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="county">
                County <span className="text-red-500">*</span>
              </Label>
              <Select value={county} onValueChange={(value) => {
                setCounty(value);
                setSubcounty('');
                setWard('');
                if (errors.county) {
                  setErrors(prev => ({ ...prev, county: '' }));
                }
              }} disabled={!country}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {counties.map((countyOption) => (
                    <SelectItem key={countyOption.id} value={String(countyOption.id)}>
                      {countyOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.county} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcounty">
                Subcounty <span className="text-red-500">*</span>
              </Label>
              <Select value={subcounty} onValueChange={(value) => {
                setSubcounty(value);
                setWard('');
                if (errors.subcounty) {
                  setErrors(prev => ({ ...prev, subcounty: '' }));
                }
              }} disabled={!county}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select subcounty" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {subcounties.map((subcountyOption) => (
                    <SelectItem key={subcountyOption.id} value={String(subcountyOption.id)}>
                      {subcountyOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.subcounty} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ward">
                Ward <span className="text-red-500">*</span>
              </Label>
              <Select value={ward} onValueChange={(value) => {
                setWard(value);
                if (errors.ward) {
                  setErrors(prev => ({ ...prev, ward: '' }));
                }
              }} disabled={!subcounty}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {wards.map((wardOption) => (
                    <SelectItem key={wardOption.id} value={String(wardOption.id)}>
                      {wardOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.ward} />
            </div>
          </Card>
        )}

        {/* Nigeria Specific Fields */}
        {country && countries.find(c => String(c.id) === country)?.name === 'Nigeria' && (
          <Card className="shadow-xl col-span-7 md:col-span-3 px-8 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
            <h3 className="text-sm font-semibold">Nigeria Location Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="county">
                State <span className="text-red-500">*</span>
              </Label>
              <Select value={county} onValueChange={(value) => {
                setCounty(value);
                setSubcounty('');
                setWard('');
                if (errors.county) {
                  setErrors(prev => ({ ...prev, county: '' }));
                }
              }} disabled={!country}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {counties.map((countyOption) => (
                    <SelectItem key={countyOption.id} value={String(countyOption.id)}>
                      {countyOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.county} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcounty">
                Local Government <span className="text-red-500">*</span>
              </Label>
              <Select value={subcounty} onValueChange={(value) => {
                setSubcounty(value);
                setWard('');
                if (errors.subcounty) {
                  setErrors(prev => ({ ...prev, subcounty: '' }));
                }
              }} disabled={!county}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select local government" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {subcounties.map((subcountyOption) => (
                    <SelectItem key={subcountyOption.id} value={String(subcountyOption.id)}>
                      {subcountyOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.subcounty} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ward">
                Ward <span className="text-red-500">*</span>
              </Label>
              <Select value={ward} onValueChange={(value) => {
                setWard(value);
                if (errors.ward) {
                  setErrors(prev => ({ ...prev, ward: '' }));
                }
              }} disabled={!subcounty}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {wards.map((wardOption) => (
                    <SelectItem key={wardOption.id} value={String(wardOption.id)}>
                      {wardOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.ward} />
            </div>
          </Card>
        )}
      </div>

      <div className="flex justify-end pt-4">
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
            'Continue'
          )}
        </Button>
      </div>
    </form>
  );
}