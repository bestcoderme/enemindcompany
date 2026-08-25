import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AuthMode, UserProfile } from '../types';

interface AuthCardProps {
  onSuccess: (user: UserProfile) => void;
  logoUrl: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onSuccess,
  logoUrl,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        avatarUrl: logoUrl,
        provider: 'email',
      });
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsGoogleLoading(false);
      onSuccess({
        name: 'Gen-Z Scholar',
        email: 'scholar@genzhub.com',
        avatarUrl: logoUrl,
        provider: 'google',
      });
    }, 1200);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pb-8">
        {/* Header with Circular Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg mb-3 bg-white flex items-center justify-center p-1">
            <img
              src={logoUrl}
              alt="ENEMIND Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-heading">
            ENEMIND
          </h1>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-1">
            Global Student & Career Ecosystem
          </p>
        </motion.div>

        {/* Auth Card (Classic Rounded Styling) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-full max-w-[440px] rounded-[36px] shadow-xl p-7 sm:p-9 flex flex-col border border-neutral-100/80 relative"
        >
          {/* Subtitle */}
          <h2 className="text-center text-sm font-medium text-neutral-500 mb-6">
            {mode === 'login'
              ? 'Sign in to access your notes, past papers, and student hub'
              : 'Create your student account to join your campus'}
          </h2>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl mb-6">
            <button
              type="button"
              id="tab-login"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              id="tab-signup"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Authentication Button */}
          <GoogleButton
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            text={mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-neutral-200" />
            <span className="px-3 text-xs text-neutral-400 font-medium uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-grow h-px bg-neutral-200" />
          </div>

          {/* Error Notice */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Optional Handle/Name in Sign Up mode */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <label
                    htmlFor="signup-name"
                    className="text-xs font-semibold text-neutral-700 mb-1.5"
                  >
                    Your Name or Handle
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="flex flex-col">
              <label
                htmlFor="auth-email"
                className="text-xs font-semibold text-neutral-700 mb-1.5"
              >
                Campus or Student Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@campus.edu"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label
                htmlFor="auth-password"
                className="text-xs font-semibold text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator (Sign Up Mode) */}
            {mode === 'signup' && password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs text-neutral-500">
                  <span>Strength: {strengthLabels[passwordStrength - 1] || 'Too short'}</span>
                  <span>{password.length}/6+ chars</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-full rounded-full transition-all duration-300 ${
                        index < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : 'bg-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-neutral-600 font-medium">
                  {mode === 'login' ? 'Remember this browser' : 'I agree to Terms & Guidelines'}
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <motion.button
              type="submit"
              id="auth-submit-btn"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-neutral-900 text-white py-3.5 mt-4 rounded-2xl hover:bg-neutral-800 transition-all duration-200 cursor-pointer font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </motion.button>
          </form>

          {/* Footer Action Links */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  id="switch-to-signup"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-neutral-900 font-semibold cursor-pointer hover:underline"
                >
                  Create new account
                </button>
              </>
            ) : (
              <>
                <span className="text-neutral-500">Already registered?</span>
                <button
                  type="button"
                  id="switch-to-login"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-neutral-900 font-semibold cursor-pointer hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </>
  );
};
