import React from 'react';
import { cn } from '../../utils/cn';

interface OnlineIndicatorProps {
  isOnline: boolean;
  className?: string;
}

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  isOnline,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        isOnline ? 'bg-green-500' : 'bg-gray-500',
        className
      )}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
};