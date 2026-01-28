import { ShoppingBag, Wrench, Utensils, DollarSign, Car, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface LocationOption {
  id: number;
  name: string;
  code: string;
}

const safetyPreferences = ['Kids Appropriate', 'Teen Appropriate (13+)', 'Adult Content (18+)', 'No restrictions'];

const businessTypeGroups = [
  {
    label: 'Retail',
    icon: ShoppingBag,
    types: ['kiosk_duka', 'mini_supermarket', 'wholesale_shop', 'hardware_store', 'agrovet', 'butchery', 'boutique', 'electronics', 'stationery', 'general_store'],
  },
  {
    label: 'Services',
    icon: Wrench,
    types: ['salon', 'barber_shop', 'beauty_parlour', 'tailor', 'uber', 'shoe_repair', 'photography_studio', 'printing_cyber', 'laundry'],
  },
  {
    label: 'Food',
    icon: Utensils,
    types: ['cafe', 'restaurant', 'fast_food', 'mama_mboga', 'milk_atm', 'bakery'],
  },
  {
    label: 'Financial',
    icon: DollarSign,
    types: ['mobile_money', 'bank_agent', 'bill_payment', 'betting_shop'],
  },
  {
    label: 'Transport',
    icon: Car,
    types: ['boda_boda', 'matatu_sacco', 'fuel_station', 'car_wash'],
  },
  {
    label: 'Community',
    icon: Users,
    types: ['church', 'school_canteen', 'bar_lounge', 'pharmacy', 'clinic', 'other'],
  },
];

export default function TargetingBudgetStep({ value, onChange, onNext, onBack }: Props) {
  const [selectedSafetyPreferences, setSelectedSafetyPreferences] = useState<string[]>(Array.isArray(value.selectedSafetyPreferences) ? value.selectedSafetyPreferences as string[] : []);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(Array.isArray(value.selectedBusinessTypes) ? value.selectedBusinessTypes as string[] : []);
  const [otherBusinessType, setOtherBusinessType] = useState(String(value.otherBusinessType ?? ''));
  const [totalBudget, setTotalBudget] = useState(String(value.totalBudget ?? ''));

  // User's country from account setup
  const [userCountry, setUserCountry] = useState(String(value.country ?? ''));
  const [currencySymbol, setCurrencySymbol] = useState('KES'); // Default to KES

  // Location targeting states
  const [targetCountry, setTargetCountry] = useState(String(value.targetCountry ?? ''));
  const [targetCounty, setTargetCounty] = useState(String(value.targetCounty ?? ''));
  const [targetSubcounty, setTargetSubcounty] = useState(String(value.targetSubcounty ?? ''));
  const [targetWard, setTargetWard] = useState(String(value.targetWard ?? ''));

  // Location options states
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [counties, setCounties] = useState<LocationOption[]>([]);
  const [subcounties, setSubcounties] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/locations/countries');
        if (response.ok) {
          const data = await response.json();
          setCountries(data);

          // Set currency symbol based on user's country from account setup
          if (userCountry) {
            const userCountryData = data.find((country: any) => String(country.id) === userCountry);
            if (userCountryData) {
              setCurrencySymbol(userCountryData.currency_symbol || userCountryData.currency_code || 'KES');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, [userCountry]);

  // Fetch counties when target country changes
  useEffect(() => {
    if (!targetCountry) {
      setCounties([]);
      setTargetCounty('');
      return;
    }

    const fetchCounties = async () => {
      try {
        const response = await fetch(`/api/locations/counties?country_id=${targetCountry}`);
        if (response.ok) {
          const data = await response.json();
          setCounties(data);
        }
      } catch (error) {
        console.error('Failed to fetch counties:', error);
      }
    };
    fetchCounties();
  }, [targetCountry]);

  // Fetch subcounties when target county changes
  useEffect(() => {
    if (!targetCounty) {
      setSubcounties([]);
      setTargetSubcounty('');
      return;
    }

    const fetchSubcounties = async () => {
      try {
        const response = await fetch(`/api/locations/subcounties?county_id=${targetCounty}`);
        if (response.ok) {
          const data = await response.json();
          setSubcounties(data);
        }
      } catch (error) {
        console.error('Failed to fetch subcounties:', error);
      }
    };
    fetchSubcounties();
  }, [targetCounty]);

  // Fetch wards when target subcounty changes
  useEffect(() => {
    if (!targetSubcounty) {
      setWards([]);
      setTargetWard('');
      return;
    }

    const fetchWards = async () => {
      try {
        const response = await fetch(`/api/locations/wards?subcounty_id=${targetSubcounty}`);
        if (response.ok) {
          const data = await response.json();
          setWards(data);
        }
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };
    fetchWards();
  }, [targetSubcounty]);

  const handleBusinessTypeChange = (businessType: string, checked: boolean) => {
    if (checked) {
      setSelectedBusinessTypes(prev => [...prev, businessType]);
    } else {
      setSelectedBusinessTypes(prev => prev.filter(type => type !== businessType));
    }
  };

  const allBusinessTypes = businessTypeGroups.flatMap(group => group.types);

  const handleSelectAllBusinessTypes = () => {
    if (selectedBusinessTypes.length === allBusinessTypes.length) {
      setSelectedBusinessTypes([]);
    } else {
      setSelectedBusinessTypes(allBusinessTypes);
    }
    if (errors.businessTypes) {
      setErrors(prev => ({ ...prev, businessTypes: '' }));
    }
  };

  const handleSafetyPreferenceChange = (safetyPref: string, checked: boolean) => {
    if (checked) {
      if (safetyPref === 'No restrictions') {
        // When "No restrictions" is selected, unselect all others
        setSelectedSafetyPreferences(['No restrictions']);
      } else {
        // When any other option is selected, remove "No restrictions" if it was selected
        setSelectedSafetyPreferences(prev => {
          const newPrefs = prev.filter(pref => pref !== 'No restrictions');
          return [...newPrefs, safetyPref];
        });
      }
    } else {
      // When unchecking, just remove the preference
      setSelectedSafetyPreferences(prev => prev.filter(pref => pref !== safetyPref));
    }

    if (errors.safetyPreferences) {
      setErrors(prev => ({ ...prev, safetyPreferences: '' }));
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (selectedSafetyPreferences.length === 0) newErrors.safetyPreferences = 'At least one safety preference must be selected.';
    if (selectedBusinessTypes.length === 0) newErrors.businessTypes = 'At least one business type must be selected.';
    if (selectedBusinessTypes.includes('other') && !otherBusinessType.trim()) {
      newErrors.businessTypes = 'Please specify your business type when selecting "other".';
    }
    if (!totalBudget) newErrors.totalBudget = 'Total budget is required.';
    if (parseFloat(totalBudget) <= 0) newErrors.totalBudget = 'Total budget must be greater than 0.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    onChange({
      selectedSafetyPreferences,
      selectedBusinessTypes,
      otherBusinessType: selectedBusinessTypes.includes('other') ? otherBusinessType.trim() : '',
      totalBudget: parseFloat(totalBudget),
      targetCountry,
      targetCountryName: countries.find(c => String(c.id) === targetCountry)?.name || targetCountry,
      targetCounty,
      targetCountyName: counties.find(c => String(c.id) === targetCounty)?.name || targetCounty,
      targetSubcounty,
      targetSubcountyName: subcounties.find(s => String(s.id) === targetSubcounty)?.name || targetSubcounty,
      targetWard,
      targetWardName: wards.find(w => String(w.id) === targetWard)?.name || targetWard,
    });
    onNext();
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* Safety Preferences */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Safety Preferences <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Select the safety preferences for your campaign
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safetyPreferences.map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`safety-${pref}`}
                  checked={selectedSafetyPreferences.includes(pref)}
                  onCheckedChange={(checked) => handleSafetyPreferenceChange(pref, checked as boolean)}
                  className='border-gray-400 dark:border-gray-50/30'
                />
                <Label
                  htmlFor={`safety-${pref}`}
                  className="text-sm cursor-pointer"
                >
                  {pref}
                </Label>
              </div>
            ))}
          </div>
          <InputError message={errors.safetyPreferences} />
        </div>

        {/* Location Targeting */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Location Targeting (Optional)</Label>

          <div className="grid gap-2">
            <Label htmlFor="targetCountry">Country</Label>
            <Select value={targetCountry} onValueChange={setTargetCountry}>
              <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                <SelectValue placeholder="Select target country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((countryOpt) => (
                  <SelectItem key={countryOpt.id} value={String(countryOpt.id)}>
                    {countryOpt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {targetCountry && (
            <div className="grid gap-2">
              <Label htmlFor="targetCounty">
                {countries.find(c => String(c.id) === targetCountry)?.name === 'Kenya' ? 'County' : 'State'}
              </Label>
              <Select value={targetCounty} onValueChange={setTargetCounty} disabled={!targetCountry}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder={`Select ${countries.find(c => String(c.id) === targetCountry)?.name === 'Kenya' ? 'county' : 'state'}`} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {counties.map((countyOpt) => (
                    <SelectItem key={countyOpt.id} value={String(countyOpt.id)}>
                      {countyOpt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetCounty && (
            <div className="grid gap-2">
              <Label htmlFor="targetSubcounty">
                {countries.find(c => String(c.id) === targetCountry)?.name === 'Kenya' ? 'Subcounty' : 'Local Government'}
              </Label>
              <Select value={targetSubcounty} onValueChange={setTargetSubcounty} disabled={!targetCounty}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder={`Select ${countries.find(c => String(c.id) === targetCountry)?.name === 'Kenya' ? 'subcounty' : 'local government'}`} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {subcounties.map((subcountyOpt) => (
                    <SelectItem key={subcountyOpt.id} value={String(subcountyOpt.id)}>
                      {subcountyOpt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetSubcounty && (
            <div className="grid gap-2">
              <Label htmlFor="targetWard">Ward</Label>
              <Select value={targetWard} onValueChange={setTargetWard} disabled={!targetSubcounty}>
                <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {wards.map((wardOpt) => (
                    <SelectItem key={wardOpt.id} value={String(wardOpt.id)}>
                      {wardOpt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Business Type Targeting */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              Business Type Targeting <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-50"
              onClick={handleSelectAllBusinessTypes}
            >
              {selectedBusinessTypes.length === allBusinessTypes.length ? 'Clear All' : 'Select All'}
            </Button>
          </div>
          <Card className="shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-green-700 border rounded-xl h-80 overflow-y-auto">
            {businessTypeGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-500 font-semibold text-base mb-1">
                  <group.icon className="w-5 h-5" />
                  {group.label}
                </div>
                <div className="flex flex-col gap-1">
                  {group.types.map((type) => (
                    <Label key={type} className="flex items-center gap-2 text-base cursor-pointer">
                      <Checkbox
                        id={type}
                        checked={selectedBusinessTypes.includes(type)}
                        onCheckedChange={(checked) => handleBusinessTypeChange(type, checked as boolean)}
                        className="border-gray-400 dark:border-gray-50/30"
                      />
                      <span>{type}</span>
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </Card>
          <InputError message={errors.businessTypes} />
          {selectedBusinessTypes.includes('other') && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="otherBusinessType">
                Please specify your business type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="otherBusinessType"
                type="text"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={otherBusinessType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setOtherBusinessType(e.target.value);
                  if (errors.businessTypes) {
                    setErrors(prev => ({ ...prev, businessTypes: '' }));
                  }
                }}
                placeholder="e.g., Car dealership, Gym, etc."
              />
            </div>
          )}
        </div>

        {/* Budget */}
        <div className="grid gap-2">
          <Label htmlFor="totalBudget">
            Total Budget ({currencySymbol}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="totalBudget"
            type="number"
            min="0"
            step="0.01"
            value={totalBudget}
            onChange={e => {
              setTotalBudget(e.target.value);
              if (errors.totalBudget) {
                setErrors(prev => ({ ...prev, totalBudget: '' }));
              }
            }}
            placeholder="5000.00"
          />
          <InputError message={errors.totalBudget} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={onBack}
          disabled={loading}
          variant="outline"
          className="px-6 py-2.5 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Back
        </Button>
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