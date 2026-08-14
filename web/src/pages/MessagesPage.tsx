import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversations, usePrivateMessages } from '../hooks/useMessages';
import { useSocket } from '../socket/SocketProvider';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { ConversationItem } from '../components/ConversationItem';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { MessageSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Menu, MessageSquare, UserPlus, User } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import type { Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { socket, isConnected } = useSocket();
  const { 
    data: conversations, 
    isLoading: conversationsLoading, 
    error: conversationsError 
  } = useConversations(user?._id || '');
  const { 
    data: privateMessages, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = usePrivateMessages(userId || '');

  useEffect(() => {
    if (privateMessages) {
      setMessages(privateMessages);
    }
  }, [privateMessages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new private messages
    const handleMessage = (message: Message) => {
      if (userId && (message.toUserId === userId || message.senderId === userId)) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receive_private_message', handleMessage);

    // Listen for typing indicators
    const handleTyping = (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (userId && data.userId === userId) {
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
      }
    };

    socket.on('private_typing', handleTyping);

    return () => {
      socket.off('receive_private_message', handleMessage);
      socket.off('private_typing', handleTyping);
    };
  }, [socket, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!socket || !userId) return;

    socket.emit('send_private_message', {
      toUserId: userId,
      content,
      type,
    });

    // Optimistic update
    const message: Partial<Message> = {
      content,
      type,
      toUserId: userId,
      senderId: user?._id,
      senderName: user?.username,
      senderAvatar: user?.avatar,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message as Message]);
  };

  const handleTypingStart = () => {
    if (!socket || !userId) return;

    // setIsTyping(true);
    socket.emit('private_typing', { toUserId: userId, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // setIsTyping(false);
      if (socket) {
        socket.emit('private_typing', { toUserId: userId, isTyping: false });
      }
    }, 3000);
  };

  const handleUpload = async (file: File) => {
    // TODO: Implement file upload
    console.log('Upload file:', file);
  };

  const filterConversations = (convs: any[]) => {
    if (!searchQuery) return convs;
    return convs.filter(conv =>
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex h-screen">
        {/* Conversations Sidebar */}
        {!userId && (
          <div className="w-full lg:w-80 border-r border-dark-800 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-dark-800 rounded-lg"
                  >
                    <Menu className="w-6 h-6 text-gray-400" />
                  </button>
                  <h1 className="text-xl font-semibold text-white">Messages</h1>
                </div>

                <Button variant="ghost" size="sm">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search conversations..."
              />
            </header>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4">
              {conversationsError ? (
                <ErrorState
                  title="Failed to load conversations"
                  onRetry={() => window.location.reload()}
                />
              ) : conversationsLoading ? (
                <div className="space-y-2">
                  <MessageSkeleton />
                  <MessageSkeleton />
                  <MessageSkeleton />
                </div>
              ) : filterConversations(conversations || []).length > 0 ? (
                <div className="space-y-2">
                  {filterConversations(conversations || []).map((conv) => (
                    <ConversationItem
                      key={conv._id}
                      name={conv.name || 'Unknown'}
                      lastMessage={conv.lastMessage?.content}
                      timestamp={conv.lastMessage?.createdAt}
                      unreadCount={conv.unreadCount || 0}
                      onClick={() => navigate(`/messages/${conv.participants.find((p: string) => p !== user?._id)}`)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No conversations yet"
                  description="Start a conversation with someone nearby."
                />
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        {userId && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
              <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-white">User</h1>
                      <p className="text-xs text-gray-400">
                        {isConnected ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {messagesError ? (
                <ErrorState
                  title="Failed to load messages"
                  onRetry={() => window.location.reload()}
                />
              ) : messagesLoading ? (
                <div className="space-y-4">
                  <MessageSkeleton />
                  <MessageSkeleton />
                  <MessageSkeleton />
                </div>
              ) : messages.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start the conversation!"
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
                      isOwn={message.senderId === user?._id}
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
          </div>
        )}

        <MobileNav />
      </main>
    </div>
  );
};