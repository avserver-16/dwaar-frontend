import React from 'react';
import { Building, MapPin, Users } from 'lucide-react';
import { cn } from '../utils/cn';

interface BuildingCardProps {
  name: string;
  address?: string;
  distance?: number;
  roomCount?: number;
  onClick?: () => void;
  className?: string;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  name,
  address,
  distance,
  roomCount,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-xl p-5 hover:border-primary-500/50 transition-all duration-200 cursor-pointer',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-500/20 rounded-lg">
          <Building className="w-6 h-6 text-primary-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
          
          {address && (
            <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            {distance !== undefined && (
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{distance.toFixed(1)} km</span>
              </div>
            )}
            
            {roomCount !== undefined && (
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{roomCount} rooms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};