import React from 'react';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface CommunityCardProps {
  name: string;
  description?: string;
  category?: string;
  distance?: number;
  memberCount?: number;
  onJoin?: () => void;
  onClick?: () => void;
  isJoined?: boolean;
  className?: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  name,
  description,
  category,
  distance,
  memberCount,
  onJoin,
  onClick,
  isJoined = false,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-xl p-5 hover:border-primary-500/50 transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
          {category && <Badge variant="info">{category}</Badge>}
        </div>
        {distance !== undefined && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{distance.toFixed(1)} km</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
      )}

      <div className="flex items-center justify-between">
        {memberCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{memberCount} members</span>
          </div>
        )}

        {onJoin && (
          <Button
            size="sm"
            variant={isJoined ? 'secondary' : 'primary'}
            onClick={onJoin}
          >
            {isJoined ? 'Joined' : (
              <>
                Join
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};