import { ShoppingBag, Wrench, Utensils, DollarSign, Car, Users } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface BusinessInformationData {
    businessName: string;
    businessType: { types: string[]; custom?: string; };
    operationalDays: string[];
    openingTime: string;
    closingTime: string;
    footTrafficEstimate: string;
}

interface Props {
    value: Record<string, unknown>;
    onChange: (data: Partial<BusinessInformationData>) => void;
    onNext: () => void;
    onBack: () => void;
}

// Grouped business types for grid display
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

const allBusinessTypes = businessTypeGroups.flatMap(g => g.types);

const businessTypeLabels: Record<string, string> = {
  'kiosk_duka': 'Kiosk/Duka',
  'mini_supermarket': 'Mini Supermarket',
  'wholesale_shop': 'Wholesale Shop',
  'hardware_store': 'Hardware Store',
  'agrovet': 'Agrovet',
  'butchery': 'Butchery',
  'boutique': 'Boutique',
  'electronics': 'Electronics',
  'stationery': 'Stationery',
  'general_store': 'General Store',
  'salon': 'Salon',
  'barber_shop': 'Barber Shop',
  'beauty_parlour': 'Beauty Parlour',
  'tailor': 'Tailor',
  'uber': 'Uber',
  'shoe_repair': 'Shoe Repair',
  'photography_studio': 'Photography Studio',
  'printing_cyber': 'Printing/Cyber',
  'laundry': 'Laundry',
  'cafe': 'Cafe',
  'restaurant': 'Restaurant',
  'fast_food': 'Fast Food',
  'mama_mboga': 'Mama Mboga',
  'milk_atm': 'Milk ATM',
  'bakery': 'Bakery',
  'mobile_money': 'Mobile Money',
  'bank_agent': 'Bank Agent',
  'bill_payment': 'Bill Payment',
  'betting_shop': 'Betting Shop',
  'boda_boda': 'Boda Boda',
  'matatu_sacco': 'Matatu Sacco',
  'fuel_station': 'Fuel Station',
  'car_wash': 'Car Wash',
  'church': 'Church',
  'school_canteen': 'School Canteen',
  'bar_lounge': 'Bar/Lounge',
  'pharmacy': 'Pharmacy',
  'clinic': 'Clinic',
  'other': 'Other',
};

const footTrafficOptions = [
    '1-10 people',
    '11-50 people',
    '51-100 people',
    '101-500 people',
    '500+ people'
] as const;

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
] as const;

type FormErrors = Partial<Record<string, string>>;

// Type guard for foot traffic options
function isValidFootTrafficOption(value: string): value is typeof footTrafficOptions[number] {
    return footTrafficOptions.includes(value as typeof footTrafficOptions[number]);
}


export default function BusinessInformationStep({ value, onChange, onNext, onBack }: Props) {
    // Type-safe state initialization with proper defaults
    const [businessName, setBusinessName] = useState<string>(() => String(value.businessName ?? ''));
    const [businessTypesSelected, setBusinessTypesSelected] = useState<string[]>(() => {
        const initial = value.businessType;
        if (initial && typeof initial === 'object' && 'types' in initial && Array.isArray(initial.types)) {
            return initial.types.filter((t) => allBusinessTypes.includes(t));
        } else if (Array.isArray(initial)) {
            return initial.filter((t) => allBusinessTypes.includes(t));
        }
        return [];
    });
    const [otherBusinessType, setOtherBusinessType] = useState<string>(() => {
        const initial = value.businessType;
        if (initial && typeof initial === 'object' && 'custom' in initial) {
            return String(initial.custom ?? '');
        }
        return '';
    });
    const [operationalDays, setOperationalDays] = useState<string[]>(() => {
        const initial = value.operationalDays;
        if (Array.isArray(initial)) {
            return initial.filter((d) => daysOfWeek.includes(d));
        }
        return [];
    });
    const [openingTime, setOpeningTime] = useState<string>(() => String(value.openingTime ?? ''));
    const [closingTime, setClosingTime] = useState<string>(() => String(value.closingTime ?? ''));
    const [footTrafficEstimate, setFootTrafficEstimate] = useState<string>(() => {
        const initial = String(value.footTrafficEstimate ?? '');
        return isValidFootTrafficOption(initial) ? initial : '';
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const handleNext = (): void => {
        const newErrors: FormErrors = {};

        // Type-safe validation with proper error key typing
        if (!businessName.trim()) newErrors.businessName = 'Business name is required.';
        if (businessTypesSelected.length === 0) newErrors.businessType = 'Please select at least one business type.';
        if (businessTypesSelected.includes('other') && !otherBusinessType.trim()) {
            newErrors.businessType = 'Please specify your business type when selecting "other".';
        }

        if (operationalDays.length === 0) newErrors.operationalDays = 'Please select at least one operational day.';
        if (!openingTime) newErrors.openingTime = 'Opening time is required.';
        if (!closingTime) newErrors.closingTime = 'Closing time is required.';
        if (!footTrafficEstimate) newErrors.footTrafficEstimate = 'Foot traffic estimate is required.';

        setErrors(newErrors);

        // Only proceed if no validation errors
        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const businessTypeData = {
                types: businessTypesSelected,
                ...(businessTypesSelected.includes('other') && otherBusinessType.trim() ? { custom: otherBusinessType.trim() } : {}),
            };

            const formData: BusinessInformationData = {
                businessName: businessName.trim(),
                businessType: businessTypeData,
                operationalDays,
                openingTime,
                closingTime,
                footTrafficEstimate,
            };

            onChange(formData);
            onNext();
        }
    };

    return (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <div className="grid gap-10">
                {/* Business Name */}
                <div className="grid gap-2">
                    <Label htmlFor="businessName">
                        Business Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="businessName"
                        type="text"
                        className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                        value={businessName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setBusinessName(e.target.value);
                            if (errors.businessName) {
                                setErrors((prev) => ({ ...prev, businessName: undefined }));
                            }
                        }}
                        placeholder="ABC Enterprises Ltd"
                    />
                    <InputError message={errors.businessName} />
                </div>


                {/* Business Type Targeting */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Business Type Targeting <span className="text-red-500">*</span>
                        </Label>
                        <button
                            type="button"
                            className="border border-green-500 text-green-500 px-4 py-1 rounded-md text-sm hover:bg-green-50 transition"
                            onClick={() => {
                                if (businessTypesSelected.length === allBusinessTypes.length) {
                                    setBusinessTypesSelected([]);
                                } else {
                                    setBusinessTypesSelected(allBusinessTypes);
                                }
                                if (errors.businessType) {
                                    setErrors((prev) => ({ ...prev, businessType: undefined }));
                                }
                            }}
                        >
                            {businessTypesSelected.length === allBusinessTypes.length ? 'Clear All' : 'Select All'}
                        </button>
                    </div>
                    <Card className="shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-green-700 border rounded-xl h-80 overflow-y-auto">
                        {businessTypeGroups.map((group) => (
                            <div key={group.label} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-green-500 font-semibold text-base mb-1">
                                    {group.icon && <group.icon className="w-5 h-5" />}
                                    {group.label}
                                </div>
                                <div className="flex flex-col gap-1">
                                    {group.types.map((type) => (
                                        <Label key={type} className="flex items-center gap-2 text-base cursor-pointer">
                                            <Checkbox
                                                id={type}
                                                checked={businessTypesSelected.includes(type)}
                                                onCheckedChange={(checked) => {
                                                    setBusinessTypesSelected((prev) =>
                                                        checked
                                                            ? [...prev, type]
                                                            : prev.filter((t) => t !== type)
                                                    );
                                                    if (errors.businessType) {
                                                        setErrors((prev) => ({ ...prev, businessType: undefined }));
                                                    }
                                                }}
                                                className='border-gray-400 dark:border-gray-50/30'
                                            />
                                            <span>{businessTypeLabels[type] || type}</span>
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Card>
                    {businessTypesSelected.includes('other') && (
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
                                }}
                                placeholder="e.g., Car dealership, Gym, etc."
                            />
                        </div>
                    )}
                    <InputError message={errors.businessType} />
                </div>

                {/* Operational Days */}
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Operational Days <span className="text-red-500">*</span>
                        </Label>
                        <button
                            type="button"
                            className="border border-green-500 text-green-500 px-4 py-1 rounded-md text-sm hover:bg-green-50 transition"
                            onClick={() => {
                                if (operationalDays.length === daysOfWeek.length) {
                                    setOperationalDays([]);
                                } else {
                                    setOperationalDays([...daysOfWeek]);
                                }
                                if (errors.operationalDays) {
                                    setErrors((prev) => ({ ...prev, operationalDays: undefined }));
                                }
                            }}
                        >
                            {operationalDays.length === daysOfWeek.length ? 'Clear All' : 'Select All'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {daysOfWeek.map((day) => (
                            <Label key={day} className="flex items-center gap-2 text-base cursor-pointer">
                                <Checkbox
                                    id={day}
                                    checked={operationalDays.includes(day)}
                                    onCheckedChange={(checked) => {
                                        setOperationalDays((prev) =>
                                            checked ? [...prev, day] : prev.filter((d) => d !== day)
                                        );
                                        if (errors.operationalDays) {
                                            setErrors((prev) => ({ ...prev, operationalDays: undefined }));
                                        }
                                    }}
                                    className='border-gray-400 dark:border-gray-50/30'
                                />
                                <span>{day}</span>
                            </Label>
                        ))}
                    </div>
                    <InputError message={errors.operationalDays} />
                </div>

                {/* Business Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="openingTime">
                            Opening Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="openingTime"
                            type="time"
                            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                            value={openingTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setOpeningTime(e.target.value);
                                if (errors.openingTime) {
                                    setErrors((prev) => ({ ...prev, openingTime: undefined }));
                                }
                            }}
                        />
                        <InputError message={errors.openingTime} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="closingTime">
                            Closing Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="closingTime"
                            type="time"
                            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                            value={closingTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setClosingTime(e.target.value);
                                if (errors.closingTime) {
                                    setErrors((prev) => ({ ...prev, closingTime: undefined }));
                                }
                            }}
                        />
                        <InputError message={errors.closingTime} />
                    </div>
                </div>

                {/* Daily Foot Traffic */}
                <div className="grid gap-2">
                    <Label htmlFor="footTrafficEstimate">
                        Daily Foot Traffic Estimate <span className="text-red-500">*</span>
                    </Label>
                    <Select value={footTrafficEstimate} onValueChange={(value: string) => {
                        setFootTrafficEstimate(value);
                        if (errors.footTrafficEstimate) {
                            setErrors((prev) => ({ ...prev, footTrafficEstimate: undefined }));
                        }
                    }}>
                        <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
                            <SelectValue placeholder="Select foot traffic estimate" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {footTrafficOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.footTrafficEstimate} />
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