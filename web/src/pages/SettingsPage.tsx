import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Menu, Bell, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    privacy: 'public',
    theme: 'dark',
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
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
              <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Notifications Section */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-400">Receive notifications on your device</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-primary-600' : 'bg-dark-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive email updates</p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors bg-dark-700`}
                >
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Privacy</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={settings.privacy}
                  onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Show Online Status</p>
                  <p className="text-sm text-gray-400">Let others see when you're online</p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors bg-primary-600`}
                >
                  <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Button variant="primary" size="sm">
                Update Password
              </Button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Eye className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
};