import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useUsers';
import { useUserGroups } from '../hooks/useGroups';
import { useJoinedRooms } from '../hooks/useUsers';
import { useUserLocation } from '../hooks/useUsers';
import { Sidebar } from '../components/Sidebar';
import { LocationCard } from '../components/LocationCard';
import { CommunityCard } from '../components/CommunityCard';
import { Button } from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import {
  MapPin,
  Users,
  MessageSquare,
  Building2,
  ArrowRight,
  Menu,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MobileNav } from '../components/MobileNav';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useUserGroups();
  const { data: rooms } = useJoinedRooms();
  const { data: location, isLoading: locationLoading } = useUserLocation();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const stats = [
    { label: 'Communities', value: groups?.length || 0, icon: Users, color: 'text-primary-400' },
    { label: 'Rooms', value: rooms?.length || 0, icon: Building2, color: 'text-green-400' },
    { label: 'Messages', value: 0, icon: MessageSquare, color: 'text-blue-400' },
  ];

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
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-dark-800 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.username || 'User'}!
            </h2>
            <p className="text-gray-400">Here's what's happening in your communities today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-dark-800 rounded-lg">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Location Card */}
          <div className="mb-8">
            {locationLoading ? (
              <CardSkeleton />
            ) : location ? (
              <LocationCard
                address={
                  location.address ||
                  `${location.latitude}, ${location.longitude}`
                }
              />
            ) : (
              <LocationCard onGetLocation={handleGetLocation} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/discover')}
                className="h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Discover Nearby</p>
                    <p className="text-sm opacity-80">Find communities around you</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </div>
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/communities')}
                className="h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">My Communities</p>
                    <p className="text-sm opacity-80">View your groups</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </div>
              </Button>
            </div>
          </div>

          {/* Recent Communities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Communities</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/communities')}
              >
                View All
              </Button>
            </div>

            {groupsError ? (
              <ErrorState
                title="Failed to load communities"
                onRetry={() => window.location.reload()}
              />
            ) : groupsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : groups && groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.slice(0, 4).map((group) => (
                  <CommunityCard
                    key={group._id}
                    name={group.name}
                    description={group.description}
                    category={group.category}
                    memberCount={group.members.length}
                    onClick={() => navigate(`/communities/${group._id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No communities yet"
                description="Join or create communities to start connecting with people nearby."
                action={{
                  label: 'Discover Communities',
                  onClick: () => navigate('/discover'),
                }}
              />
            )}
          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
};