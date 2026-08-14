import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignup, useCheckPhone } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Building2, Check, X } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const signup = useSignup();
  const checkPhone = useCheckPhone();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const handlePhoneCheck = async (value: string) => {
    if (value.length < 10) {
      setPhoneStatus('idle');
      return;
    }

    setPhoneStatus('checking');
    try {
      const result = await checkPhone.mutateAsync(value);
      setPhoneStatus(result.exists ? 'taken' : 'available');
    } catch {
      setPhoneStatus('idle');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    handlePhoneCheck(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShowToast(true);
      return;
    }

    if (phoneStatus === 'taken') {
      setError('Phone number already registered');
      setShowToast(true);
      return;
    }

    try {
      await signup.mutateAsync({ name: username, phone, password, email });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-400">Join Dwaar to discover nearby communities</p>
        </div>

        <div className="glass rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
              {phoneStatus !== 'idle' && (
                <div className="absolute right-3 top-9">
                  {phoneStatus === 'checking' && (
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {phoneStatus === 'available' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {phoneStatus === 'taken' && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={signup.isPending}
              disabled={phoneStatus === 'taken'}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showToast && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};