import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroup, useGroupMessages } from '../hooks/useGroups';
import { useSocket } from '../socket/SocketProvider';
import { Sidebar } from '../components/Sidebar';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { Button } from '../components/ui/Button';
import { MessageSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Menu, ArrowLeft, Users, Info } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import type { Message } from '../types';

export const GroupChatPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { socket, isConnected } = useSocket();
  const { data: group, isLoading: groupLoading, error: groupError } = useGroup(groupId || '');
  const { 
    data: initialMessages, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useGroupMessages(groupId || '');

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket || !groupId) return;

    // Join the group room
    socket.emit('join_group', groupId);

    // Listen for new messages
    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('receive_group_message', handleMessage);

    // Listen for typing indicators
    const handleTyping = (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.userName)) {
            return [...prev, data.userName];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((user) => user !== data.userName));
      }
    };

    socket.on('group_typing', handleTyping);

    return () => {
      socket.off('receive_group_message', handleMessage);
      socket.off('group_typing', handleTyping);
      socket.emit('leave_group', groupId);
    };
  }, [socket, groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!socket || !groupId) return;

    const message: Partial<Message> = {
      content,
      type,
      groupId,
      senderId: 'current-user', // This should come from auth context
      createdAt: new Date().toISOString(),
    };

    socket.emit('send_group_message', {
      groupId,
      content,
      type,
    });

    // Optimistic update
    setMessages((prev) => [...prev, message as Message]);
  };

  const handleTypingStart = () => {
    if (!socket || !groupId) return;

    // setIsTyping(true);
    socket.emit('group_typing', { groupId, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // setIsTyping(false);
      if (socket) {
        socket.emit('group_typing', { groupId, isTyping: false });
      }
    }, 3000);
  };

  const handleUpload = async (file: File) => {
    // TODO: Implement file upload
    console.log('Upload file:', file);
  };

  if (groupLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="h-full flex items-center justify-center">
            <MessageSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (groupError || messagesError) {
    return (
      <div className="min-h-screen bg-dark-950 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="h-full flex items-center justify-center p-4">
            <ErrorState
              title="Failed to load chat"
              onRetry={() => window.location.reload()}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-dark-800 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-400" />
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/communities')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">{group?.name}</h1>
                  <p className="text-xs text-gray-400">
                    {group?.members.length} members • {isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {messages.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No messages yet"
              description="Be the first to start the conversation!"
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  content={message.content}
                  senderName={message.senderName}
                  senderAvatar={message.senderAvatar}
                  timestamp={message.createdAt}
                  isOwn={message.senderId === 'current-user'}
                  type={message.type}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 pb-2">
            <TypingIndicator users={typingUsers} />
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 sm:p-6 lg:p-8 border-t border-dark-800">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              onUpload={handleUpload}
              disabled={!isConnected}
              // onTypingStart={handleTypingStart}
            />
          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
};