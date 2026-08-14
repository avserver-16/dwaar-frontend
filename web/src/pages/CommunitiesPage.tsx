import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserGroups } from '../hooks/useGroups';
import { useJoinedRooms } from '../hooks/useUsers';
import { Sidebar } from '../components/Sidebar';
import { CommunityCard } from '../components/CommunityCard';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Menu, Plus, Users, DoorOpen } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';

export const CommunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'rooms'>('groups');

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useUserGroups();
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useJoinedRooms();

  const filterItems = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredGroups = filterItems(groups || []);
  const filteredRooms = filterItems(rooms || []);

  const handleCreateGroup = () => {
    // TODO: Implement create group modal
    console.log('Create group');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
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
              <h1 className="text-xl font-semibold text-white">My Communities</h1>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateGroup}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Search and Tabs */}
          <div className="mb-6 space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your communities..."
            />

            <div className="flex gap-2">
              <Button
                variant={activeTab === 'groups' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('groups')}
              >
                <Users className="w-4 h-4 mr-2" />
                Groups
              </Button>
              <Button
                variant={activeTab === 'rooms' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('rooms')}
              >
                <DoorOpen className="w-4 h-4 mr-2" />
                Rooms
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'groups' ? (
            groupsError ? (
              <ErrorState
                title="Failed to load groups"
                onRetry={() => window.location.reload()}
              />
            ) : groupsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <CommunityCard
                    key={group._id}
                    name={group.name}
                    description={group.description}
                    category={group.category}
                    memberCount={group.members.length}
                    isJoined={true}
                    onClick={() => navigate(`/communities/${group._id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No groups yet"
                description="Join or create groups to start connecting with people."
                action={{
                  label: 'Discover Groups',
                  onClick: () => navigate('/discover'),
                }}
              />
            )
          ) : (
            roomsError ? (
              <ErrorState
                title="Failed to load rooms"
                onRetry={() => window.location.reload()}
              />
            ) : roomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => (
                  <CommunityCard
                    key={room._id}
                    name={room.name}
                    description={room.description}
                    memberCount={room.members?.length}
                    isJoined={true}
                    onClick={() => navigate(`/rooms/${room._id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={DoorOpen}
                title="No rooms yet"
                description="Join rooms to connect with people in specific locations."
                action={{
                  label: 'Discover Rooms',
                  onClick: () => navigate('/discover'),
                }}
              />
            )
          )}
        </div>

        <MobileNav />
      </main>
    </div>
  );
};