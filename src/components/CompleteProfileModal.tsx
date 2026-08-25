import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Phone,
  User,
  Mail,
  Check,
  Sparkles,
  Link,
  ShieldCheck,
  GraduationCap,
  Calendar,
  IdCard,
  MessageSquare,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '../types.ts';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onSave?: (updatedUser: UserProfile) => void;
  onSaveProfile?: (updatedUser: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
];

const COUNTRY_CODES = [
  { code: '+254', country: 'Kenya 🇰🇪' },
  { code: '+1', country: 'USA/Canada 🇺🇸' },
  { code: '+44', country: 'UK 🇬🇧' },
  { code: '+234', country: 'Nigeria 🇳🇬' },
  { code: '+27', country: 'South Africa 🇿🇦' },
  { code: '+256', country: 'Uganda 🇺🇬' },
  { code: '+255', country: 'Tanzania 🇹🇿' },
  { code: '+250', country: 'Rwanda 🇷🇼' },
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+49', country: 'Germany 🇩🇪' },
  { code: '+33', country: 'France 🇫🇷' },
  { code: '+61', country: 'Australia 🇦🇺' },
];

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [phoneCountryCode, setPhoneCountryCode] = useState(() => {
    const phone = user?.phoneNumber;
    if (phone) {
      const match = COUNTRY_CODES.find((c) => phone.startsWith(c.code));
      return match ? match.code : '+254';
    }
    return '+254';
  });
  const [phoneNumberInput, setPhoneNumberInput] = useState(() => {
    const phone = user?.phoneNumber;
    if (!phone) return '';
    const match = COUNTRY_CODES.find((c) => phone.startsWith(c.code));
    if (match) {
      return phone.replace(match.code, '').trim();
    }
    return phone;
  });
  const [bio, setBio] = useState(user?.bio || '');
  const [studentIdNumber, setStudentIdNumber] = useState(user?.studentIdNumber || '');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || 'Year 2');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Calculate profile completeness %
  const calculateCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 20;
    if (user.email) score += 20;
    if (avatarUrl && !avatarUrl.includes('placeholder') && !avatarUrl.includes('dicebear') || avatarUrl.length > 30) score += 25;
    if (phoneNumberInput.trim().length >= 6) score += 25;
    if (user.university && user.course) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setShowUrlInput(false);
    setCustomUrlInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    let fullPhoneNumber = '';
    if (phoneNumberInput.trim()) {
      const cleanNum = phoneNumberInput.trim().replace(/^0+/, '');
      fullPhoneNumber = `${phoneCountryCode} ${cleanNum}`;
    }

    const baseUser = user || {
      name: name.trim(),
      email: 'student@enemind.com',
      roles: ['STUDENT' as const],
      provider: 'email' as const,
      isProfileComplete: true,
    };

    const updatedUser: UserProfile = {
      ...baseUser,
      name: name.trim(),
      avatarUrl: avatarUrl || baseUser.avatarUrl,
      phoneNumber: fullPhoneNumber || undefined,
      whatsappNumber: whatsappEnabled && fullPhoneNumber ? fullPhoneNumber : undefined,
      bio: bio.trim() || undefined,
      studentIdNumber: studentIdNumber.trim() || undefined,
      yearOfStudy: yearOfStudy || undefined,
      isProfileComplete: true,
    };

    if (onSave) onSave(updatedUser);
    if (onSaveProfile) onSaveProfile(updatedUser);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-neutral-900">
                Complete Student Profile
              </h2>
              <p className="text-xs text-neutral-500">
                Add your profile photo & phone number for verified campus access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            id="close-profile-modal-btn"
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Completeness Meter */}
        <div className="px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900">
              Profile Completeness:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 sm:w-36 h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-emerald-800 font-mono">
              {completeness}%
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Profile Image Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Profile Picture / Avatar
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              {/* Avatar Preview */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-md bg-white flex items-center justify-center">
                  <img
                    src={avatarUrl || user.avatarUrl}
                    alt="User Avatar Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-md border-2 border-white cursor-pointer transition-transform group-hover:scale-110"
                  title="Upload from device"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload & Option Buttons */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Link className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Paste Image Link</span>
                  </button>
                </div>

                {/* Preset Avatar Selection */}
                <div>
                  <span className="text-[11px] text-neutral-500 font-medium">Or pick an avatar:</span>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(preset);
                          setErrorMsg(null);
                        }}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                          avatarUrl === preset ? 'border-emerald-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <img
                          src={preset}
                          alt={`Preset ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom URL Input dropdown */}
            <AnimatePresence>
              {showUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 pt-1"
                >
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Phone Number Section */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Phone Number / WhatsApp Contact
            </label>
            <div className="flex gap-2">
              <select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="w-36 px-2.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-medium text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.country} ({item.code})
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  id="profile-phone-input"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  placeholder="712 345 678"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-600 font-medium">
                Allow campus hostel caretakers & study groups to contact me via WhatsApp
              </span>
            </label>
          </div>

          {/* 3. Full Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="profile-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chemweno"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-semibold text-neutral-900 outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-100 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* 4. Academic Year & Student ID Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-medium text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
              >
                <option value="Year 1 (Freshman)">Year 1 (Freshman)</option>
                <option value="Year 2 (Sophomore)">Year 2 (Sophomore)</option>
                <option value="Year 3 (Junior)">Year 3 (Junior)</option>
                <option value="Year 4 (Senior)">Year 4 (Senior)</option>
                <option value="Postgraduate / Masters">Postgraduate / Masters</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Student ID / Reg No. (Optional)
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  placeholder="e.g. STU-2024-8891"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* 5. Short Bio / Academic Interests */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
              Short Bio or Interests
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Computer Science student passionate about software engineering, AI, and campus basketball..."
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs text-neutral-800 outline-none focus:border-neutral-900 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="save-profile-btn"
              disabled={isSaved}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
