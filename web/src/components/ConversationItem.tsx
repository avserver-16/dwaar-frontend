import React from 'react';
import { UserAvatar } from './ui/UserAvatar';
import { OnlineIndicator } from './ui/OnlineIndicator';
import { cn } from '../utils/cn';

interface ConversationItemProps {
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  isOnline?: boolean;
  unreadCount?: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  isOnline = false,
  unreadCount = 0,
  isActive = false,
  onClick,
  className,
}) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
        isActive ? 'bg-primary-600/20 border border-primary-500/30' : 'hover:bg-dark-800',
        className
      )}
    >
      <div className="relative">
        <UserAvatar src={avatar} size="md" />
        <OnlineIndicator isOnline={isOnline} className="absolute bottom-0 right-0" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-white truncate">{name}</h4>
          {timestamp && (
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {formatTime(timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 truncate flex-1">
            {lastMessage || 'No messages yet'}
          </p>
          
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};