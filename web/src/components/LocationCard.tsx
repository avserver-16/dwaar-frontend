import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface LocationCardProps {
  address?: string;
  onGetLocation?: () => void;
  isLocating?: boolean;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  address,
  onGetLocation,
  isLocating = false,
  className,
}) => {
  return (
    <div className={cn('glass rounded-xl p-5', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <MapPin className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Your Location</h3>
          <p className="text-sm text-gray-400">
            {address || 'Location not set'}
          </p>
        </div>
      </div>

      {!address && onGetLocation && (
        <Button
          variant="primary"
          size="sm"
          onClick={onGetLocation}
          isLoading={isLocating}
          className="w-full"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Current Location
        </Button>
      )}
    </div>
  );
};