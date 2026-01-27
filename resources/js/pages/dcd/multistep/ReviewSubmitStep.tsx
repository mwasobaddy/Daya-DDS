import { CheckCircle, Edit, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  formData: Record<string, unknown>;
  onSubmit: () => void;
  onPrevious: () => void;
  onEditStep: (stepIndex: number) => void;
}

const contentTypeLabels: Record<string, string> = {
  music: 'Music',
  video: 'Video',
  books: 'Books',
  podcasts: 'Podcasts',
  games: 'Games',
  software: 'Software',
  courses: 'Courses',
  artwork: 'Artwork'
};

const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  youtube: 'YouTube',
  netflix: 'Netflix',
  amazon_music: 'Amazon Music',
  deezer: 'Deezer',
  tidal: 'Tidal',
  pandora: 'Pandora',
  soundcloud: 'SoundCloud',
  amazon_kindle: 'Amazon Kindle',
  google_play: 'Google Play',
  apple_app_store: 'Apple App Store',
  steam: 'Steam',
  playstation_store: 'PlayStation Store',
  xbox_store: 'Xbox Store',
  udemy: 'Udemy',
  coursera: 'Coursera',
  other: 'Other Platforms'
};

export default function ReviewSubmitStep({ formData, onSubmit, onPrevious, onEditStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Here you would typically make an API call to submit the form
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // If successful, call onSubmit
      onSubmit();
    } catch (error) {
      console.error('Registration submission failed:', error);
      setSubmitError('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLocation = () => {
    const country = formData.country;
    const county = formData.county;
    const subcounty = formData.subcounty;
    const ward = formData.ward;

    if (!country || !county || !subcounty || !ward) return 'Not specified';

    return `${ward}, ${subcounty}, ${county}, ${country}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Review Your Information</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please review all the information below before submitting your registration.
        </p>
      </div>

      {/* Step Summary Cards */}
      <div className="grid gap-4">
        {/* Account Setup */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Account Setup</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(0)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Full Name:</span>
              <p className="text-gray-900">{String(formData.fullName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">National ID:</span>
              <p className="text-gray-900">{String(formData.nationalId || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <p className="text-gray-900">{String(formData.dob || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span>
              <p className="text-gray-900">{String(formData.gender || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">{String(formData.email || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900">{String(formData.phone || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Business Address:</span>
              <p className="text-gray-900">{String(formData.businessAddress || 'Not provided')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Location:</span>
              <p className="text-gray-900">{formatLocation()}</p>
            </div>
          </div>
        </Card>

        {/* Business Information */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(1)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Business Name:</span>
              <p className="text-gray-900">{String(formData.businessName || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Business Category:</span>
              <p className="text-gray-900">{String(formData.businessCategory || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Business Type:</span>
              <p className="text-gray-900">{String(formData.businessType || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Registration Number:</span>
              <p className="text-gray-900">{String(formData.registrationNumber || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tax ID:</span>
              <p className="text-gray-900">{String(formData.taxId || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Years in Operation:</span>
              <p className="text-gray-900">{String(formData.yearsInOperation || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Number of Employees:</span>
              <p className="text-gray-900">{String(formData.numberOfEmployees || 'Not provided')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Operating Hours:</span>
              <p className="text-gray-900">{String(formData.operatingHours || 'Not provided')}</p>
            </div>
            {Boolean(formData.customOperatingHours) && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Custom Hours:</span>
                <p className="text-gray-900">{String(formData.customOperatingHours)}</p>
              </div>
            )}
            {Boolean(formData.website) && (
              <div>
                <span className="font-medium text-gray-700">Website:</span>
                <p className="text-gray-900">{String(formData.website)}</p>
              </div>
            )}
            {Boolean(formData.socialMedia) && (
              <div>
                <span className="font-medium text-gray-700">Social Media:</span>
                <p className="text-gray-900 whitespace-pre-line">{String(formData.socialMedia)}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Business Description:</span>
              <p className="text-gray-900 mt-1">{String(formData.businessDescription || 'Not provided')}</p>
            </div>
          </div>
        </Card>

        {/* Content Preferences */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Content Preferences</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(2)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Content Types:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedContentTypes as string[])?.map((type) => (
                  <Badge key={type} variant="secondary">
                    {contentTypeLabels[type] || type}
                  </Badge>
                )) || <span className="text-gray-500">None selected</span>}
              </div>
            </div>

            {(formData.selectedContentTypes as string[])?.includes('music') && (
              <div>
                <span className="font-medium text-gray-700">Music Genres:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(formData.selectedMusicGenres as string[])?.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  )) || <span className="text-gray-500">None selected</span>}
                </div>
              </div>
            )}

            <div>
              <span className="font-medium text-gray-700">Distribution Platforms:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedPlatforms as string[])?.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platformLabels[platform] || platform}
                  </Badge>
                )) || <span className="text-gray-500">None selected</span>}
              </div>
            </div>

            {Boolean(formData.otherPlatforms) && (
              <div>
                <span className="font-medium text-gray-700">Other Platforms:</span>
                <p className="text-gray-900 mt-1">{String(formData.otherPlatforms)}</p>
              </div>
            )}

            <div>
              <span className="font-medium text-gray-700">Target Audience:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedAudiences as string[])?.map((audience) => (
                  <Badge key={audience} variant="outline">
                    {audience}
                  </Badge>
                )) || <span className="text-gray-500">None selected</span>}
              </div>
            </div>

            <div>
              <span className="font-medium text-gray-700">Content Goals:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(formData.selectedGoals as string[])?.map((goal) => (
                  <Badge key={goal} variant="outline">
                    {goal}
                  </Badge>
                )) || <span className="text-gray-500">None selected</span>}
              </div>
            </div>

            <div>
              <span className="font-medium text-gray-700">Monthly Content Volume:</span>
              <p className="text-gray-900">{String(formData.monthlyContentVolume || 'Not specified')}</p>
            </div>

            <div>
              <span className="font-medium text-gray-700">Content Strategy:</span>
              <p className="text-gray-900 mt-1">{String(formData.contentStrategy || 'Not provided')}</p>
            </div>
          </div>
        </Card>

        {/* Wallet Setup */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Wallet Setup</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(3)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">4-digit PIN has been set</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Terms of Service accepted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Privacy Policy accepted</span>
            </div>
            {Boolean(formData.agreeToMarketing) && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">Marketing communications enabled</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Your registration will be reviewed within 24-48 hours</li>
              <li>• You'll receive an email confirmation once approved</li>
              <li>• Keep your PIN secure for all future transactions</li>
              <li>• You can update your information in your account settings</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Submit Error */}
      {submitError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );
}