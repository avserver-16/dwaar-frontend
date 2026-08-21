import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNearby, useNearbyRooms } from '../hooks/useSpatial';
import { useNearbyBuildings } from '../hooks/useUsers';
import { Sidebar } from '../components/Sidebar';
import { CommunityCard } from '../components/CommunityCard';
import { BuildingCard } from '../components/BuildingCard';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Menu, MapPin, SlidersHorizontal } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import type { Location } from '../types';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [radius, setRadius] = useState(1000); // in meters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'communities' | 'rooms' | 'buildings'>('all');

  const { data: nearbyData, isLoading: nearbyLoading, error: nearbyError } = useNearby(userLocation, radius);
  const { data: nearbyRooms, isLoading: roomsLoading } = useNearbyRooms(userLocation, radius);
  const { data: nearbyBuildings, isLoading: buildingsLoading } = useNearbyBuildings(userLocation, radius);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLocationRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

const filterItems = (items: any) => {
  const arr = Array.isArray(items) ? items : [];
  if (!searchQuery) return arr;
  return arr.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const filteredCommunities = useMemo(
  () => filterItems(nearbyData?.groups),
  [nearbyData, searchQuery]
);
const filteredRooms = useMemo(
  () => filterItems(nearbyRooms),
  [nearbyRooms, searchQuery]
);
const filteredBuildings = useMemo(
  () => filterItems(nearbyBuildings),
  [nearbyBuildings, searchQuery]
);
const allItems = useMemo(() => [
  ...filteredCommunities.map(item => ({ ...item, type: 'community' })),
  ...filteredRooms.map(item => ({ ...item, type: 'room' })),
  ...filteredBuildings.map(item => ({ ...item, type: 'building' })),
], [filteredCommunities, filteredRooms, filteredBuildings]);
  const getFilteredContent = () => {
    switch (activeTab) {
      case 'communities':
        return filteredCommunities;
      case 'rooms':
        return filteredRooms;
      case 'buildings':
        return filteredBuildings;
      default:
        return allItems;
    }
  };

  const renderCard = (item: any) => {
    switch (item.type || activeTab) {
      case 'building':
        return (
          <BuildingCard
            key={item._id}
            name={item.name}
            address={item.address}
            distance={item.distance}
            roomCount={item.roomCount}
          />
        );
      default:
        return (
          <CommunityCard
            key={item._id}
            name={item.name}
            description={item.description}
            category={item.category}
            distance={item.distance}
            memberCount={item.members?.length}
            onJoin={() => navigate(`/communities/${item._id}`)}
          />
        );
    }
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
              <h1 className="text-xl font-semibold text-white">Discover</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocationRefresh}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Refresh Location
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search communities, rooms, buildings..."
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTab === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All
              </Button>
              <Button
                variant={activeTab === 'communities' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('communities')}
              >
                Communities
              </Button>
              <Button
                variant={activeTab === 'rooms' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('rooms')}
              >
                Rooms
              </Button>
              <Button
                variant={activeTab === 'buildings' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('buildings')}
              >
                Buildings
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={500}>500m</option>
                  <option value={1000}>1km</option>
                  <option value={2000}>2km</option>
                  <option value={5000}>5km</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {!userLocation ? (
            <EmptyState
              icon={MapPin}
              title="Location not available"
              description="Enable location services to discover nearby communities and rooms."
              action={{
                label: 'Enable Location',
                onClick: handleLocationRefresh,
              }}
            />
          ) : nearbyError ? (
            <ErrorState
              title="Failed to load nearby items"
              onRetry={handleLocationRefresh}
            />
          ) : nearbyLoading || roomsLoading || buildingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : getFilteredContent().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredContent().map(renderCard)}
            </div>
          ) : (
            <EmptyState
              icon={MapPin}
              title="No items found nearby"
              description="Try increasing the search radius or check your location settings."
            />
          )}
        </div>

        <MobileNav />
      </main>
    </div>
  );
};