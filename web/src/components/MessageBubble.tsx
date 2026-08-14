import React from 'react';
import { UserAvatar } from './ui/UserAvatar';
import { cn } from '../utils/cn';

interface MessageBubbleProps {
  content: string;
  senderName?: string;
  senderAvatar?: string;
  timestamp: string;
  isOwn?: boolean;
  type?: 'text' | 'image' | 'file';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  senderName,
  senderAvatar,
  timestamp,
  isOwn = false,
  type = 'text',
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <UserAvatar src={senderAvatar} size="sm" />
      
      <div className={cn('flex-1', isOwn ? 'flex flex-col items-end' : '')}>
        {!isOwn && senderName && (
          <p className="text-xs text-gray-400 mb-1">{senderName}</p>
        )}
        
        <div
          className={cn(
            'max-w-[70%] rounded-2xl px-4 py-2',
            isOwn
              ? 'bg-primary-600 text-white rounded-br-md'
              : 'bg-dark-800 text-gray-100 rounded-bl-md'
          )}
        >
          {type === 'image' ? (
            <img src={content} alt="Attachment" className="rounded-lg max-w-full" />
          ) : type === 'file' ? (
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:underline"
            >
              📎 {content.split('/').pop()}
            </a>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
};