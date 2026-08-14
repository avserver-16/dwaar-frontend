import React from 'react';
import { cn } from '../utils/cn';

interface TypingIndicatorProps {
  users?: string[];
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users = [],
  className,
}) => {
  if (users.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-400', className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>
        {users.length === 1
          ? `${users[0]} is typing...`
          : `${users.length} people are typing...`}
      </span>
    </div>
  );
};