import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const contentTypes = [
  { id: 'music', label: 'Music', description: 'Audio content including songs, albums, and playlists' },
  { id: 'video', label: 'Video', description: 'Video content including movies, TV shows, and documentaries' },
  { id: 'books', label: 'Books', description: 'E-books, audiobooks, and digital publications' },
  { id: 'podcasts', label: 'Podcasts', description: 'Audio and video podcast episodes and series' },
  { id: 'games', label: 'Games', description: 'Video games, mobile games, and interactive content' },
  { id: 'software', label: 'Software', description: 'Applications, tools, and digital products' },
  { id: 'courses', label: 'Courses', description: 'Online courses, tutorials, and educational content' },
  { id: 'artwork', label: 'Artwork', description: 'Digital art, illustrations, and creative content' },
];

const musicGenres = [
  'Afrobeat',
  'Afropop',
  'Benga',
  'Blues',
  'Classical',
  'Country',
  'Electronic',
  'Folk',
  'Funk',
  'Gospel',
  'Hip Hop/Rap',
  'Jazz',
  'Kwaito',
  'Pop',
  'R&B/Soul',
  'Reggae',
  'Rock',
  'Traditional/Folk',
  'World Music',
  'Other'
];

const distributionPlatforms = [
  { id: 'spotify', label: 'Spotify', description: 'Music streaming platform' },
  { id: 'apple_music', label: 'Apple Music', description: 'Apple\'s music streaming service' },
  { id: 'youtube', label: 'YouTube', description: 'Video sharing and streaming platform' },
  { id: 'netflix', label: 'Netflix', description: 'Video streaming service' },
  { id: 'amazon_music', label: 'Amazon Music', description: 'Amazon\'s music streaming service' },
  { id: 'deezer', label: 'Deezer', description: 'European music streaming platform' },
  { id: 'tidal', label: 'Tidal', description: 'High-fidelity music streaming' },
  { id: 'pandora', label: 'Pandora', description: 'Music discovery platform' },
  { id: 'soundcloud', label: 'SoundCloud', description: 'Audio distribution and discovery' },
  { id: 'amazon_kindle', label: 'Amazon Kindle', description: 'E-book distribution' },
  { id: 'google_play', label: 'Google Play', description: 'Android apps and digital content' },
  { id: 'apple_app_store', label: 'Apple App Store', description: 'iOS apps and digital content' },
  { id: 'steam', label: 'Steam', description: 'PC gaming platform' },
  { id: 'playstation_store', label: 'PlayStation Store', description: 'Sony gaming platform' },
  { id: 'xbox_store', label: 'Xbox Store', description: 'Microsoft gaming platform' },
  { id: 'udemy', label: 'Udemy', description: 'Online learning platform' },
  { id: 'coursera', label: 'Coursera', description: 'Online education platform' },
  { id: 'other', label: 'Other Platforms', description: 'Specify other platforms' },
];

const targetAudiences = [
  'Children (Under 12)',
  'Teenagers (13-19)',
  'Young Adults (20-35)',
  'Adults (36-55)',
  'Seniors (55+)',
  'Families',
  'Professionals',
  'Students',
  'Music Enthusiasts',
  'Gamers',
  'Educators',
  'Entrepreneurs',
  'General Public'
];

const contentGoals = [
  'Entertainment',
  'Education',
  'Information',
  'Inspiration',
  'Community Building',
  'Monetization',
  'Brand Awareness',
  'Lead Generation',
  'Customer Engagement',
  'Social Impact'
];

export default function ContentPreferenceStep({ value, onChange, onNext, onPrevious }: Props) {
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    Array.isArray(value.selectedContentTypes) ? value.selectedContentTypes : []
  );
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>(
    Array.isArray(value.selectedMusicGenres) ? value.selectedMusicGenres : []
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    Array.isArray(value.selectedPlatforms) ? value.selectedPlatforms : []
  );
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(
    Array.isArray(value.selectedAudiences) ? value.selectedAudiences : []
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    Array.isArray(value.selectedGoals) ? value.selectedGoals : []
  );
  const [otherPlatforms, setOtherPlatforms] = useState(String(value.otherPlatforms ?? ''));
  const [contentStrategy, setContentStrategy] = useState(String(value.contentStrategy ?? ''));
  const [monthlyContentVolume, setMonthlyContentVolume] = useState(String(value.monthlyContentVolume ?? ''));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContentTypeChange = (contentTypeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedContentTypes, contentTypeId]
      : selectedContentTypes.filter(id => id !== contentTypeId);

    setSelectedContentTypes(newSelected);

    // Clear music genres if music is deselected
    if (contentTypeId === 'music' && !checked) {
      setSelectedMusicGenres([]);
    }

    if (errors.selectedContentTypes) {
      setErrors(prev => ({ ...prev, selectedContentTypes: '' }));
    }
  };

  const handleMusicGenreChange = (genre: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedMusicGenres, genre]
      : selectedMusicGenres.filter(g => g !== genre);

    setSelectedMusicGenres(newSelected);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter(id => id !== platformId);

    setSelectedPlatforms(newSelected);
  };

  const handleAudienceChange = (audience: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedAudiences, audience]
      : selectedAudiences.filter(a => a !== audience);

    setSelectedAudiences(newSelected);
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedGoals, goal]
      : selectedGoals.filter(g => g !== goal);

    setSelectedGoals(newSelected);
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (selectedContentTypes.length === 0) {
      newErrors.selectedContentTypes = 'Please select at least one content type.';
    }

    if (selectedContentTypes.includes('music') && selectedMusicGenres.length === 0) {
      newErrors.selectedMusicGenres = 'Please select at least one music genre.';
    }

    if (selectedPlatforms.length === 0) {
      newErrors.selectedPlatforms = 'Please select at least one distribution platform.';
    }

    if (selectedAudiences.length === 0) {
      newErrors.selectedAudiences = 'Please select at least one target audience.';
    }

    if (selectedGoals.length === 0) {
      newErrors.selectedGoals = 'Please select at least one content goal.';
    }

    if (!contentStrategy) {
      newErrors.contentStrategy = 'Content strategy is required.';
    }

    if (!monthlyContentVolume) {
      newErrors.monthlyContentVolume = 'Monthly content volume is required.';
    }

    if (selectedPlatforms.includes('other') && !otherPlatforms.trim()) {
      newErrors.otherPlatforms = 'Please specify other platforms.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onChange({
        selectedContentTypes,
        selectedMusicGenres,
        selectedPlatforms,
        selectedAudiences,
        selectedGoals,
        otherPlatforms: selectedPlatforms.includes('other') ? otherPlatforms : '',
        contentStrategy,
        monthlyContentVolume,
      });
      onNext();
    }
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div className="space-y-5">
        {/* Content Types */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Content Types <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Select the types of digital content you plan to distribute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTypes.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={type.id}
                  checked={selectedContentTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={type.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type.label}
                  </Label>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
          <InputError message={errors.selectedContentTypes} />
        </div>

        {/* Music Genres (conditional) */}
        {selectedContentTypes.includes('music') && (
          <div className="grid gap-4">
            <div>
              <Label className="text-base font-semibold">
                Music Genres <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select the music genres you specialize in
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {musicGenres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedMusicGenres.includes(genre)}
                    onCheckedChange={(checked) => handleMusicGenreChange(genre, checked as boolean)}
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

        {/* Distribution Platforms */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Distribution Platforms <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Select the platforms where you plan to distribute content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distributionPlatforms.map((platform) => (
              <div key={platform.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={platform.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {platform.label}
                  </Label>
                  <p className="text-xs text-gray-600">{platform.description}</p>
                </div>
              </div>
            ))}
          </div>
          <InputError message={errors.selectedPlatforms} />

          {/* Other Platforms Textarea */}
          {selectedPlatforms.includes('other') && (
            <div className="grid gap-2">
              <Label htmlFor="otherPlatforms">
                Other Platforms <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="otherPlatforms"
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={otherPlatforms}
                onChange={e => {
                  setOtherPlatforms(e.target.value);
                  if (errors.otherPlatforms) {
                    setErrors(prev => ({ ...prev, otherPlatforms: '' }));
                  }
                }}
                placeholder="Please specify other platforms you plan to use..."
                rows={3}
              />
              <InputError message={errors.otherPlatforms} />
            </div>
          )}
        </div>

        {/* Target Audience */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Target Audience <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Select your primary target audiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {targetAudiences.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={`audience-${audience}`}
                  checked={selectedAudiences.includes(audience)}
                  onCheckedChange={(checked) => handleAudienceChange(audience, checked as boolean)}
                />
                <Label
                  htmlFor={`audience-${audience}`}
                  className="text-sm cursor-pointer"
                >
                  {audience}
                </Label>
              </div>
            ))}
          </div>
          <InputError message={errors.selectedAudiences} />
        </div>

        {/* Content Goals */}
        <div className="grid gap-4">
          <div>
            <Label className="text-base font-semibold">
              Content Goals <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              What are your main objectives for content distribution?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {contentGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                />
                <Label
                  htmlFor={`goal-${goal}`}
                  className="text-sm cursor-pointer"
                >
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          <InputError message={errors.selectedGoals} />
        </div>

        {/* Content Strategy */}
        <div className="grid gap-2">
          <Label htmlFor="contentStrategy">
            Content Strategy <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="contentStrategy"
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            value={contentStrategy}
            onChange={e => {
              setContentStrategy(e.target.value);
              if (errors.contentStrategy) {
                setErrors(prev => ({ ...prev, contentStrategy: '' }));
              }
            }}
            placeholder="Describe your content distribution strategy, marketing approach, and how you plan to grow your audience..."
            rows={4}
          />
          <InputError message={errors.contentStrategy} />
        </div>

        {/* Monthly Content Volume */}
        <div className="grid gap-2">
          <Label htmlFor="monthlyContentVolume">
            Monthly Content Volume <span className="text-red-500">*</span>
          </Label>
          <Select value={monthlyContentVolume} onValueChange={(value) => {
            setMonthlyContentVolume(value);
            if (errors.monthlyContentVolume) {
              setErrors(prev => ({ ...prev, monthlyContentVolume: '' }));
            }
          }}>
            <SelectTrigger className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none">
              <SelectValue placeholder="Select monthly volume" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="1-5">1-5 pieces of content</SelectItem>
              <SelectItem value="6-15">6-15 pieces of content</SelectItem>
              <SelectItem value="16-30">16-30 pieces of content</SelectItem>
              <SelectItem value="31-50">31-50 pieces of content</SelectItem>
              <SelectItem value="50+">50+ pieces of content</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.monthlyContentVolume} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Previous
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