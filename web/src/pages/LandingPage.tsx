import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Building2, MapPin, MessageSquare, Users, Shield, Zap, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="border-b border-dark-800 bg-dark-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Building2 className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xl font-bold text-white">Dwaar</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-dark-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover the communities
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                around you
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Connect with people in your vicinity, join local conversations, and build meaningful relationships — all while maintaining your privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How Dwaar Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A hyperlocal platform that brings communities together based on physical proximity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Location-Based Discovery"
              description="Find communities, rooms, and people near you using smart location technology. Connect with your neighbors effortlessly."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Community Building"
              description="Create and join communities based on shared interests, locations, or activities. Build your local network."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="Real-Time Conversations"
              description="Engage in group chats and private messaging with instant delivery. Stay connected with your community in real-time."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Privacy First"
              description="Maintain pseudonymous identities while interacting. Share what you want, when you want, with full control."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Connections"
              description="No lengthy setup or complex profiles. Get started in seconds and discover your community immediately."
            />
            <FeatureCard
              icon={<Building2 className="w-8 h-8" />}
              title="Building & Room Based"
              description="Organize by physical spaces — buildings, floors, rooms. Find exactly who's around you right now."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to discover your community?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of users already connecting with their neighbors and building local relationships.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2024 Dwaar. Building local connections.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="glass rounded-xl p-6 hover:border-primary-500/50 transition-all duration-200">
      <div className="p-3 bg-primary-500/20 rounded-lg w-fit mb-4">
        <div className="text-primary-400">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};