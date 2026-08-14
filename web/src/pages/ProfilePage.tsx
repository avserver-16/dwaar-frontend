import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useUpdateUser, useAddLocation } from '../hooks/useUsers';
import { useUpload } from '../hooks/useUpload';
import { Sidebar } from '../components/Sidebar';
import { UserAvatar } from '../components/ui/UserAvatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/FileUpload';
import { LocationCard } from '../components/LocationCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Menu, Camera, MapPin, Save, LogOut } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';
import { useLogout } from '../hooks/useAuth';


export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    bio: '',
  });

  const { data: currentUser, isLoading, error } = useCurrentUser();
  const updateUser = useUpdateUser();
  const addLocation = useAddLocation();
  const upload = useUpload();

  const handleSave = async () => {
    try {
      await updateUser.mutateAsync({
        id: user?._id || '',
        data: formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await upload.mutateAsync({ file });
      await updateUser.mutateAsync({
        id: user?._id || '',
        data: { avatar: result.url },
      });
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          };
          try {
            await addLocation.mutateAsync(location);
          } catch (err) {
            console.error('Failed to add location:', err);
          }
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="h-full flex items-center justify-center">
            <CardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="h-full flex items-center justify-center p-4">
            <ErrorState
              title="Failed to load profile"
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
              <h1 className="text-xl font-semibold text-white">Profile</h1>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    isLoading={updateUser.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="relative">
                <UserAvatar
                  src={currentUser?.avatar}
                  size="xl"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentUser?.username}
                </h2>
                <p className="text-gray-400">{currentUser?.phone}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Username"
                value={isEditing ? formData.username : currentUser?.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />

              <Input
                label="Phone"
                value={isEditing ? formData.phone : currentUser?.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={isEditing ? formData.bio : ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="mb-6">
            <LocationCard
              address={currentUser?.location?.address}
              onGetLocation={handleGetLocation}
              isLocating={addLocation.isPending}
            />
          </div>

          {/* Account Actions */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                isLoading={logout.isPending}
                className="w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
};