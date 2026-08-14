import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isOnline?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className,
  isOnline = false,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="relative">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'rounded-full object-cover bg-dark-700',
            sizes[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-dark-700 flex items-center justify-center',
            sizes[size],
            className
          )}
        >
          <User className="w-1/2 h-1/2 text-gray-500" />
        </div>
      )}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900" />
      )}
    </div>
  );
};