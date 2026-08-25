import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface GoogleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { email: string; name: string }) => void;
}

export const GoogleEmailModal: React.FC<GoogleEmailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = googleEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid Google/Gmail or Workspace email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm({
        email: trimmed,
        name: googleName.trim() || trimmed.split('@')[0],
      });
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-neutral-900 border border-neutral-100"
        >
          <button
            id="close-google-email-modal"
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 leading-tight">
                Sign in with Google
              </h3>
              <p className="text-xs text-neutral-500">
                Use your personal Gmail or Campus Google account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="google-email-input" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Google / Gmail Email Address *
              </label>
              <div className="relative">
                <input
                  id="google-email-input"
                  type="email"
                  required
                  placeholder="yourname@gmail.com or student@campus.ac.ke"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                  autoFocus
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="google-name-input" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Your Full Name (Optional)
              </label>
              <input
                id="google-name-input"
                type="text"
                placeholder="e.g. Joy Barasa"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-500">{error}</p>
            )}

            <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your account data is private and only saved to your browser session.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-google-login-btn"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Continue to ENEMIND'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
