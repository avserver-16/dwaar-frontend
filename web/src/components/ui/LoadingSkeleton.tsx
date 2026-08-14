import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  const variants = {
    text: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-24 w-full rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-dark-700',
        variants[variant],
        className
      )}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
      <LoadingSkeleton variant="circular" className="h-16 w-16 mb-4" />
      <LoadingSkeleton variant="text" className="mb-2" />
      <LoadingSkeleton variant="text" className="w-2/3 mb-4" />
      <LoadingSkeleton variant="rectangular" className="h-16" />
    </div>
  );
};

export const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex gap-3 p-4">
      <LoadingSkeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="text" className="w-1/4" />
        <LoadingSkeleton variant="text" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-1/2" />
      </div>
    </div>
  );
};