import React, { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

const campaignTypes = ['Startup', 'Artist', 'Label', 'NGO', 'Agency', 'Business'];
const musicGenres = [
  'Afrobeat',
  'Afrobeats',
  'Afro-rave',
  'African hip-hop',
  'Afro fusion',
  'Alté',
  'Amapiano',
  'Benga',
  'Bongo Flava',
  'Blues',
  'Classical',
  'Country',
  'Dancehall',
  'Electronic',
  'Folk',
  'Funk',
  'Gengetone',
  'Gospel',
  'Hip Hop',
  'House',
  'Jazz',
  'Kapuka',
  'Kwaito',
  'Lingala',
  'Ohangla',
  'Pop',
  'R&B',
  'Rap',
  'Reggae',
  'Rock',
  'Rumba',
  'Soul',
  'Taarab',
  'Traditional',
  'Trap'
];
const campaignObjectives = [
  { id: 'music_promotion', label: 'Music Promotion', description: 'Promoting audio content including songs, albums, and playlists' },
  { id: 'movies', label: 'Movies', description: 'Film content including movies, documentaries, and cinematic works' },
  { id: 'games', label: 'Games', description: 'Video games, mobile games, and interactive content' },
  { id: 'surveys', label: 'Surveys', description: 'Market research, feedback collection, and data gathering tools' },
  { id: 'product_promotion', label: 'Product Promotion', description: 'Promoting products, goods, and merchandise through targeted campaigns' },
  { id: 'events_promotions', label: 'Events & Promotions', description: 'Event marketing, promotional campaigns, and special offers' },
  { id: 'apartment_listing', label: 'Apartment Listing', description: 'Promoting real estate listings, property rentals, and housing opportunities' },
  { id: 'app_downloads', label: 'App Downloads', description: 'Promoting apps such as mobile, IOS and PC applications, games, and software' },
  { id: 'product_launch', label: 'Product Launch', description: 'Promoting a new product announcements and launch campaigns' },
  { id: 'education_learning', label: 'Education & Learning', description: 'Educational content, courses, tutorials, and learning materials' },
  { id: 'civic_political', label: 'Civic & Political', description: 'Community engagement, political campaigns, and civic initiatives' },
];

export default function CampaignDetailsStep({ value, onChange, onNext, onBack }: Props) {
  const [accountType, setAccountType] = useState(String(value.accountType ?? ''));
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>(
    Array.isArray(value.selectedMusicGenres) ? value.selectedMusicGenres : []
  );
  const [campaignObjective, setCampaignObjective] = useState(String(value.campaignObjective ?? ''));
  const [campaignName, setCampaignName] = useState(String(value.campaignName ?? ''));
  const [campaignDescription, setCampaignDescription] = useState(String(value.campaignDescription ?? ''));
  const [campaignDuration, setCampaignDuration] = useState(String(value.campaignDuration ?? ''));
  const [startDate, setStartDate] = useState(String(value.startDate ?? ''));
  const [endDate, setEndDate] = useState(String(value.endDate ?? ''));
  const [targetAudience, setTargetAudience] = useState(String(value.targetAudience ?? ''));
  const [digitalProductLink, setDigitalProductLink] = useState(String(value.digitalProductLink ?? ''));
  const [explainerVideoLink, setExplainerVideoLink] = useState(String(value.explainerVideoLink ?? ''));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Auto-calculate campaign duration when start or end dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCampaignDuration(diffDays.toString());
    } else {
      setCampaignDuration('');
    }
  }, [startDate, endDate]);

  const handleMusicGenreChange = (genre: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedMusicGenres, genre]
      : selectedMusicGenres.filter(g => g !== genre);

    setSelectedMusicGenres(newSelected);

    if (errors.selectedMusicGenres) {
      setErrors(prev => ({ ...prev, selectedMusicGenres: '' }));
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!accountType) newErrors.accountType = 'Campaign type is required.';
    if ((accountType === 'Artist' || accountType === 'Label') && selectedMusicGenres.length === 0) newErrors.selectedMusicGenres = 'Please select at least one music genre for Artist and Label campaigns.';
    if (!campaignObjective) newErrors.campaignObjective = 'Campaign objective is required.';
    if (!campaignName) newErrors.campaignName = 'Campaign name is required.';
    if (!campaignDescription) newErrors.campaignDescription = 'Campaign description is required.';
    if (campaignDescription && campaignDescription.length < 50) newErrors.campaignDescription = 'Campaign description must be at least 50 characters.';
    if (!digitalProductLink) newErrors.digitalProductLink = 'Digital product link is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';
    if (!targetAudience) newErrors.targetAudience = 'Target audience is required.';
    if (targetAudience && targetAudience.length < 50) newErrors.targetAudience = 'Target audience description must be at least 50 characters.';

    // Validate date logic
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) newErrors.startDate = 'Start date cannot be in the past.';
      if (end <= start) newErrors.endDate = 'End date must be after start date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const data: Record<string, unknown> = {
      accountType,
      campaignObjective,
      campaignName,
      campaignDescription,
      digitalProductLink,
      explainerVideoLink,
      startDate,
      endDate,
      targetAudience,
      selectedMusicGenres: (accountType === 'Artist' || accountType === 'Label') ? selectedMusicGenres : undefined,
    };
    onChange(data);
    onNext();
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* Campaign Name */}
        <div className="grid gap-2">
          <Label htmlFor="campaignName">
            Campaign Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="campaignName"
            type="text"
            value={campaignName}
            onChange={e => {
              setCampaignName(e.target.value);
              if (errors.campaignName) {
                setErrors(prev => ({ ...prev, campaignName: '' }));
              }
            }}
            placeholder="Summer Music Festival Promotion"
          />
          <InputError message={errors.campaignName} />
        </div>

        {/* Campaign Type */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Campaign Type <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Select the type of campaign you want to create
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {campaignTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`account-type-${type}`}
                  name="accountType"
                  value={type}
                  checked={accountType === type}
                  onChange={(e) => {
                    setAccountType(e.target.value);
                    // Reset music genres when campaign type changes
                    if (e.target.value !== 'Artist' && e.target.value !== 'Label') {
                      setSelectedMusicGenres([]);
                    }
                    if (errors.accountType) {
                      setErrors(prev => ({ ...prev, accountType: '' }));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label
                  htmlFor={`account-type-${type}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
          <InputError message={errors.accountType} />
        </div>

        {/* Music Genres - Only show for Artist and Label campaigns */}
        {(accountType === 'Artist' || accountType === 'Label') && (
          <div className="grid gap-4">
            <div>
              <Label className="text-base font-semibold">
                Music Genres <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select the music genres for your campaign
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {musicGenres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedMusicGenres.includes(genre)}
                    onCheckedChange={(checked) => handleMusicGenreChange(genre, checked as boolean)}
                    className='border-gray-400 dark:border-gray-50/30'
                  />
                  <Label
                    htmlFor={`genre-${genre}`}
                    className="text-sm cursor-pointer"
                  >
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
            <InputError message={errors.selectedMusicGenres} />
          </div>
        )}

        {/* Campaign Objective */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Campaign Objective <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Select the primary objective for your campaign
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignObjectives.map((objective) => (
              <div key={objective.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-200/50 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  id={`objective-${objective.id}`}
                  name="campaignObjective"
                  value={objective.id}
                  checked={campaignObjective === objective.id}
                  onChange={(e) => {
                    setCampaignObjective(e.target.value);
                    if (errors.campaignObjective) {
                      setErrors(prev => ({ ...prev, campaignObjective: '' }));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={`objective-${objective.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {objective.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{objective.description}</p>
                </div>
              </div>
            ))}
          </div>
          <InputError message={errors.campaignObjective} />
        </div>

        {/* Campaign Description */}
        <div className="grid gap-2">
          <Label htmlFor="campaignDescription">
            Campaign Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="campaignDescription"
            value={campaignDescription}
            onChange={e => {
              setCampaignDescription(e.target.value);
              if (errors.campaignDescription) {
                setErrors(prev => ({ ...prev, campaignDescription: '' }));
              }
            }}
            placeholder="Describe your campaign goals, target audience, and what you hope to achieve..."
            rows={4}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
          />
          <div className="text-sm text-gray-500">
            {campaignDescription.length}/50 minimum characters
          </div>
          <InputError message={errors.campaignDescription} />
        </div>

        {/* Digital Product Link */}
        <div className="grid gap-2">
          <Label htmlFor="digitalProductLink">
            Digital Product Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="digitalProductLink"
            type="url"
            value={digitalProductLink}
            onChange={e => {
              setDigitalProductLink(e.target.value);
              if (errors.digitalProductLink) {
                setErrors(prev => ({ ...prev, digitalProductLink: '' }));
              }
            }}
            placeholder="https://example.com/your-product"
          />
          <InputError message={errors.digitalProductLink} />
        </div>

        {/* Explainer Video URL */}
        <div className="grid gap-2">
          <Label htmlFor="explainerVideoLink">
            Explainer Video URL
          </Label>
          <Input
            id="explainerVideoLink"
            type="url"
            value={explainerVideoLink}
            onChange={e => {
              setExplainerVideoLink(e.target.value);
              if (errors.explainerVideoLink) {
                setErrors(prev => ({ ...prev, explainerVideoLink: '' }));
              }
            }}
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="text-sm text-muted-foreground">
            Optional: Add a link to an explainer video for your campaign
          </p>
          <InputError message={errors.explainerVideoLink} />
        </div>

        {/* Campaign Duration */}
        <div className="grid gap-2">
          <Label htmlFor="campaignDuration">
            Campaign Duration (Days)
          </Label>
          <Input
            id="campaignDuration"
            type="number"
            value={campaignDuration}
            disabled
            placeholder="Auto-calculated from dates"
            className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
          />
          <p className="text-sm text-muted-foreground">
            Duration is automatically calculated from start and end dates
          </p>
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="startDate">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                if (errors.startDate) {
                  setErrors(prev => ({ ...prev, startDate: '' }));
                }
              }}
            />
            <InputError message={errors.startDate} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate">
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                if (errors.endDate) {
                  setErrors(prev => ({ ...prev, endDate: '' }));
                }
              }}
            />
            <InputError message={errors.endDate} />
          </div>
        </div>

        {/* Target Audience */}
        <div className="grid gap-2">
          <Label htmlFor="targetAudience">
            Target Audience <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="targetAudience"
            value={targetAudience}
            onChange={e => {
              setTargetAudience(e.target.value);
              if (errors.targetAudience) {
                setErrors(prev => ({ ...prev, targetAudience: '' }));
              }
            }}
            placeholder="Describe your target audience demographics, interests, behaviors, and characteristics..."
            rows={4}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
          />
          <div className="text-sm text-gray-500">
            {targetAudience.length}/50 minimum characters
          </div>
          <InputError message={errors.targetAudience} />
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