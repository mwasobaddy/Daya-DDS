import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

const contentTypes = [
  { id: 'music', label: 'Music', description: 'Audio content including songs, albums, and playlists' },
  { id: 'games', label: 'Games', description: 'Video games, mobile games, and interactive content' },
  { id: 'product_launch', label: 'Product Launch', description: 'New product announcements and launch campaigns' },
  { id: 'events_promotions', label: 'Events & Promotions', description: 'Event marketing, promotional campaigns, and special offers' },
  { id: 'movies', label: 'Movies', description: 'Film content including movies, documentaries, and cinematic works' },
  { id: 'mobile_apps', label: 'Mobile Apps', description: 'Mobile applications for iOS and Android platforms' },
  { id: 'surveys', label: 'Surveys', description: 'Market research, feedback collection, and data gathering tools' },
];

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

const targetAudiences = [
  'Kids Appropriate',
  'Teen Appropriate (13+)',
  'Adult Content (18+)',
  'No restriction'
];

export default function ContentPreferenceStep({ value, onChange, onNext, onBack }: Props) {
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    Array.isArray(value.selectedContentTypes) ? value.selectedContentTypes : []
  );
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>(
    Array.isArray(value.selectedMusicGenres) ? value.selectedMusicGenres : []
  );
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(
    Array.isArray(value.selectedAudiences) ? value.selectedAudiences : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

    // Clear error if user makes a selection
    if (errors.selectedMusicGenres) {
      setErrors(prev => ({ ...prev, selectedMusicGenres: '' }));
    }
  };

  const handleAudienceChange = (audience: string, checked: boolean) => {
    let newSelected = [...selectedAudiences];

    if (checked) {
      // Prevent selecting both Kids Appropriate and Adult Content (18+)
      if (audience === 'Kids Appropriate' && selectedAudiences.includes('Adult Content (18+)')) {
        return; // Don't allow this selection
      }
      if (audience === 'Adult Content (18+)' && selectedAudiences.includes('Kids Appropriate')) {
        return; // Don't allow this selection
      }
      newSelected = [...selectedAudiences, audience];
    } else {
      newSelected = selectedAudiences.filter(a => a !== audience);
    }

    setSelectedAudiences(newSelected);

    // Clear error if user makes a selection
    if (errors.selectedAudiences) {
      setErrors(prev => ({ ...prev, selectedAudiences: '' }));
    }
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (selectedContentTypes.length === 0) {
      newErrors.selectedContentTypes = 'Please select at least one content type.';
    }

    if (selectedContentTypes.includes('music') && selectedMusicGenres.length === 0) {
      newErrors.selectedMusicGenres = 'Please select at least one music genre.';
    }

    if (selectedAudiences.length === 0) {
      newErrors.selectedAudiences = 'Please select at least one target audience.';
    }

    if (selectedAudiences.includes('Kids Appropriate') && selectedAudiences.includes('Adult Content (18+)')) {
      newErrors.selectedAudiences = 'You cannot select both Kids Appropriate and Adult Content (18+) audiences.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      onChange({
        selectedContentTypes,
        selectedMusicGenres,
        selectedAudiences,
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
            <p className="text-sm text-muted-foreground mt-1">
              Select the types of digital content you plan to distribute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTypes.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-200/50 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-200">
                <Checkbox
                  id={type.id}
                  checked={selectedContentTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
                  className='border-gray-400 dark:border-gray-50/30'
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={type.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
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
              <p className="text-sm text-muted-foreground mt-1">
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
                  className='border-gray-400 dark:border-gray-50/30'
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