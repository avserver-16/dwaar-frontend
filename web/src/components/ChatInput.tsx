import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface ChatInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
  onUpload?: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onUpload,
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className={cn('flex items-end gap-2', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};