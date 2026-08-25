import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  MapPin,
  Star,
  X,
  Phone,
  Mail,
  Check,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Send,
  ExternalLink,
  ShieldCheck,
  Tv,
  Wifi,
  Bed,
  Building,
  Navigation,
  Maximize2,
  Utensils,
  Globe,
  Search,
  Music,
  Film,
  Headphones,
  Gamepad2,
  Radio,
  HeartPulse,
  Droplets,
  Moon,
  Smile,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Activity,
  Wind,
  Wrench,
  Scissors,
  Printer,
  Shirt,
  GraduationCap,
  Camera,
  Laptop,
  HardDrive,
  Cpu,
  ShoppingBag,
  Tag,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import {
  LocalListingItem,
  INITIAL_LOCAL_LISTINGS,
  CURATED_ENTERTAINMENT_MEDIA,
  STUDENT_HEALTH_SYMPTOMS,
  EntertainmentMediaItem,
} from '../data/hubData.ts';
import { UserProfile } from '../types.ts';

// Custom WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.186 8.186 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z" />
  </svg>
);

export type LocalCategory = 'hostel' | 'hotels' | 'services' | 'entertainment' | 'health';

interface FindLocalTikTokViewProps {
  initialCategory: LocalCategory;
  onBack: () => void;
  userUniversityName?: string;
  userName?: string;
  logoUrl: string;
  user?: UserProfile;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onOpenListerModal?: () => void;
}

export const FindLocalTikTokView: React.FC<FindLocalTikTokViewProps> = ({
  initialCategory,
  onBack,
  userUniversityName,
  userName,
  logoUrl,
  user,
  onUpdateUser,
  onOpenListerModal,
}) => {

  const [activeCategory, setActiveCategory] = useState<LocalCategory>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [isRoomOptionsModalOpen, setIsRoomOptionsModalOpen] = useState(false);

  // Persistence State for Listings
  const [listings, setListings] = useState<LocalListingItem[]>(() => {
    const saved = localStorage.getItem('findlocal_listings_rich');
    return saved ? JSON.parse(saved) : INITIAL_LOCAL_LISTINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Booking inquiry form inside View All
  const [inquiryName, setInquiryName] = useState(userName || '');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryRoomType, setInquiryRoomType] = useState('Standard Room');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // -------------------------------------------------------------
  // SERVICES FILTER STATE
  // -------------------------------------------------------------
  const [serviceSubCategory, setServiceSubCategory] = useState<string>('all');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');

  // -------------------------------------------------------------
  // ENTERTAINMENT YOUTUBE HUB STATE
  // -------------------------------------------------------------
  const [ytSearchQuery, setYtSearchQuery] = useState('');
  const [activeYtFilter, setActiveYtFilter] = useState<'all' | 'music' | 'movie' | 'study' | 'gaming' | 'podcast'>('all');
  const [activeYtVideo, setActiveYtVideo] = useState<EntertainmentMediaItem>(CURATED_ENTERTAINMENT_MEDIA[0]);
  const [customYtEmbedUrl, setCustomYtEmbedUrl] = useState<string | null>(null);

  // -------------------------------------------------------------
  // USER-FOCUSED HEALTH STATE
  // -------------------------------------------------------------
  const [waterCups, setWaterCups] = useState(4);
  const [sleepHours, setSleepHours] = useState(7);
  const [userMood, setUserMood] = useState<'calm' | 'focused' | 'stressed' | 'exhausted'>('focused');
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  
  // Health Appointment Booking State
  const [healthApptDoctor, setHealthApptDoctor] = useState('General Campus Physician');
  const [healthApptDate, setHealthApptDate] = useState('Tomorrow 10:00 AM');
  const [healthApptReason, setHealthApptReason] = useState('');
  const [healthApptSent, setHealthApptSent] = useState(false);

  // Filter listings by active category
  const filteredListings = listings.filter((item) => {
    if (!item) return false;
    const mapType: Record<LocalCategory, string> = {
      hostel: 'Hostel',
      hotels: 'Hotel',
      services: 'Service',
      entertainment: 'Entertainment',
      health: 'Health',
    };
    const itemType = (item.type || '').toLowerCase();
    const targetType = (mapType[activeCategory] || '').toLowerCase();
    if (itemType !== targetType) {
      return false;
    }
    if (activeCategory === 'services') {
      if (serviceSubCategory !== 'all' && item.serviceCategory !== serviceSubCategory) {
        return false;
      }
      if (serviceSearchQuery.trim()) {
        const q = serviceSearchQuery.toLowerCase();
        const matchName = (item.name || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchCat = (item.serviceCategory || '').toLowerCase().includes(q);
        const matchSrv = item.services?.some(
          (s) => (s?.title || '').toLowerCase().includes(q) || (s?.description || '').toLowerCase().includes(q)
        );
        if (!matchName && !matchDesc && !matchCat && !matchSrv) return false;
      }
    }
    return true;
  });

  const currentItem: LocalListingItem | undefined = filteredListings[currentIndex] || filteredListings[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('findlocal_listings_rich', JSON.stringify(listings));
  }, [listings]);

  // Reset index when changing category
  useEffect(() => {
    setCurrentIndex(0);
    setIsViewAllOpen(false);
  }, [activeCategory]);

  // Breathing circle timer
  useEffect(() => {
    if (!isBreathingActive) return;
    let timer: NodeJS.Timeout;
    const runCycle = () => {
      setBreathingPhase('Inhale (4s)');
      timer = setTimeout(() => {
        setBreathingPhase('Hold (7s)');
        timer = setTimeout(() => {
          setBreathingPhase('Exhale (8s)');
          timer = setTimeout(runCycle, 8000);
        }, 7000);
      }, 4000);
    };
    runCycle();
    return () => clearTimeout(timer);
  }, [isBreathingActive]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNext = () => {
    if (filteredListings.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredListings.length);
  };

  const handlePrev = () => {
    if (filteredListings.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredListings.length) % filteredListings.length);
  };

  const handleShare = (item: LocalListingItem) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Link for "${item.name}" copied to clipboard!`);
  };

  const handleWhatsAppChat = (item: LocalListingItem, customMessage?: string) => {
    const rawNumber = item.whatsappNumber || '254712345678';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const defaultText = customMessage || `Hi! I found ${encodeURIComponent(item.name)} (${item.type}) on Gen-Z Hub and would like to inquire.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    showToast(`Inquiry sent to ${currentItem?.name || 'management'}!`);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryMessage('');
    }, 4000);
  };

  // YouTube Search / URL Resolver for Entertainment
  const handleYouTubeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytSearchQuery.trim()) return;

    const query = ytSearchQuery.trim();
    // Check if user entered a full YouTube URL
    const ytMatch = query.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      setCustomYtEmbedUrl(`https://www.youtube.com/embed/${ytMatch[1]}`);
      showToast('Loaded YouTube video from URL!');
    } else {
      // Create a search/embed or play closest match
      const q = query.toLowerCase();
      const matched = CURATED_ENTERTAINMENT_MEDIA.find((m) =>
        (m?.title || '').toLowerCase().includes(q) ||
        (m?.artistOrDirector || '').toLowerCase().includes(q)
      );
      if (matched) {
        setActiveYtVideo(matched);
        setCustomYtEmbedUrl(null);
        showToast(`Playing "${matched.title}"!`);
      } else {
        // Fallback embed with search query
        setCustomYtEmbedUrl(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`);
        showToast(`Searching YouTube for "${query}"...`);
      }
    }
  };

  const handleBookHealthAppt = (e: React.FormEvent) => {
    e.preventDefault();
    setHealthApptSent(true);
    showToast(`Appointment confirmed for ${userName || 'Student'}! Medical slip generated.`);
    setTimeout(() => {
      setHealthApptSent(false);
      setHealthApptReason('');
    }, 4000);
  };

  // Keyboard navigation for TikTok swipe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isViewAllOpen) return;
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowRight') setIsViewAllOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredListings, isViewAllOpen]);

  const categoryTitles: Record<LocalCategory, { label: string; desc: string; icon: string }> = {
    hostel: {
      label: 'Student Hostels',
      desc: 'Verified off-campus accommodations & residency halls',
      icon: '🏠',
    },
    hotels: {
      label: 'Hotels & Lodges',
      desc: 'Menus, services & official websites for visitors & parents',
      icon: '🏨',
    },
    services: {
      label: 'Find a Service',
      desc: 'Laptop repairs, barber & salon, printing, laundry & tutoring',
      icon: '🛠️',
    },
    entertainment: {
      label: 'Entertainment & YouTube',
      desc: 'Discover music, movies, trailers & gaming on YouTube',
      icon: '🎮',
    },
    health: {
      label: 'Student Health & Wellness',
      desc: 'Personal health profile, symptom triage & campus clinic',
      icon: '🩺',
    },
  };

  const filteredYtMedia = activeYtFilter === 'all'
    ? CURATED_ENTERTAINMENT_MEDIA
    : CURATED_ENTERTAINMENT_MEDIA.filter((m) => m.category === activeYtFilter);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center min-h-[85vh] pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 z-50 px-5 py-3 bg-neutral-900 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center gap-2.5 border border-neutral-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar & Category Bar */}
      <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-5 bg-white rounded-3xl border border-neutral-100 shadow-sm mb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onBack}
            id="findlocal-back-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hub</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">
              findlocal
            </span>
            <span className="text-neutral-400">/</span>
            <span className="font-semibold text-neutral-800 hidden md:inline">
              {userUniversityName || 'Campus Discovery'}
            </span>
          </div>
        </div>

        {/* Category Tabs Switcher & Lister Sheet Button */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl overflow-x-auto max-w-full">
            {(['hostel', 'hotels', 'services', 'entertainment', 'health'] as LocalCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setServiceSubCategory('all');
                  setServiceSearchQuery('');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                <span>{categoryTitles[cat].icon}</span>
                <span>{categoryTitles[cat].label}</span>
              </button>
            ))}
          </div>

          {onOpenListerModal && (
            <button
              type="button"
              onClick={onOpenListerModal}
              id="findlocal-lister-sheet-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              title="Post listings to your personal Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>
                {user?.subscription?.hasFindLocalGoogleSheet ? 'My Google Sheet' : 'List / Sell (KSh 100)'}
              </span>
            </button>
          )}
        </div>
      </header>


      {/* ========================================================================= */}
      {/* 1. DEDICATED HEALTH VIEW (FOCUS ON USER) */}
      {/* ========================================================================= */}
      {activeCategory === 'health' ? (
        <div className="w-full space-y-6">
          {/* User Personalized Health ID Card Banner */}
          <div className="w-full bg-gradient-to-r from-emerald-900 via-teal-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Personal Student Health Portal</span>
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-neutral-200 text-xs font-semibold rounded-full">
                    Active Insurance: #HC-9921
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  Welcome to Your Health Hub, {userName || 'Scholar'}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                  Manage your personal wellness, log daily hydration and sleep, check symptoms, and book campus clinic appointments with zero hassle.
                </p>
              </div>

              {/* Student Vitals Badge */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-lg">
                  O+
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-white">{userName || 'Alex Chemweno'}</p>
                  <p className="text-emerald-300">Blood Group: O Positive</p>
                  <p className="text-neutral-300">Campus ID: STU-2024-8891</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Wellness Tracker & Stress Relief Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Water & Hydration Tracker */}
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Hydration Tracker</h3>
                    <p className="text-[11px] text-neutral-400">Target: 8 cups / day</p>
                  </div>
                </div>
                <span className="font-black text-lg text-blue-600">{waterCups} / 8</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterCups / 8) * 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWaterCups((prev) => Math.min(12, prev + 1));
                    showToast('+1 Cup Logged! Keep hydrating.');
                  }}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  + Add Glass (250ml)
                </button>
                <button
                  type="button"
                  onClick={() => setWaterCups(0)}
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* 2. Sleep Hours Tracker */}
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Sleep Duration</h3>
                    <p className="text-[11px] text-neutral-400">Recommended: 7 - 9 hours</p>
                  </div>
                </div>
                <span className="font-black text-lg text-indigo-600">{sleepHours} hrs</span>
              </div>

              <p className="text-xs text-neutral-600 mb-3">
                {sleepHours >= 7
                  ? 'Great rest! Optimal for memory consolidation during exam season.'
                  : 'Sleep debt detected. Consider a 20-min power nap after lunch.'}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSleepHours((prev) => Math.max(3, prev - 1))}
                  className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 font-bold rounded-xl text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs text-neutral-800">
                  {sleepHours} Hours Last Night
                </span>
                <button
                  type="button"
                  onClick={() => setSleepHours((prev) => Math.min(12, prev + 1))}
                  className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 font-bold rounded-xl text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* 3. Mood & Guided 4-7-8 Breathing */}
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Exam Stress Decompressor</h3>
                    <p className="text-[11px] text-neutral-400">4-7-8 Breathing Circle</p>
                  </div>
                </div>
              </div>

              {isBreathingActive ? (
                <div className="py-2 flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: breathingPhase.startsWith('Inhale') ? 1.25 : breathingPhase.startsWith('Hold') ? 1.25 : 0.85,
                    }}
                    transition={{ duration: breathingPhase.startsWith('Inhale') ? 4 : breathingPhase.startsWith('Hold') ? 0.1 : 8 }}
                    className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-[10px] text-center shadow-lg"
                  >
                    {breathingPhase}
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => setIsBreathingActive(false)}
                    className="mt-2 text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Stop Exercise
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500">
                    Feeling anxious before classes or exams? Take 1 minute to lower cortisol.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsBreathingActive(true)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Wind className="w-4 h-4" />
                    <span>Start 4-7-8 Breathing</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Student Symptom Checker & Quick Triage */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-neutral-900">
                  Student Symptom Checker & Self-Care Advice
                </h3>
                <p className="text-xs text-neutral-500">
                  Select what you are feeling to see immediate guidance or medical recommendations
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                AI Health Triage
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-4">
              {STUDENT_HEALTH_SYMPTOMS.map((sym) => (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => setSelectedSymptom(selectedSymptom === sym.id ? null : sym.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedSymptom === sym.id
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <span className="text-xs font-bold line-clamp-1">{sym.name}</span>
                  <span className={`text-[10px] mt-1 font-semibold ${
                    selectedSymptom === sym.id ? 'text-emerald-300' : 'text-neutral-500'
                  }`}>
                    {sym.category}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Symptom Detailed Advice */}
            <AnimatePresence>
              {selectedSymptom && (() => {
                const sym = STUDENT_HEALTH_SYMPTOMS.find((s) => s.id === selectedSymptom);
                if (!sym) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-900">{sym.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sym.urgent ? 'bg-rose-100 text-rose-700' : 'bg-emerald-200 text-emerald-800'
                        }`}>
                          Severity: {sym.severity}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800">{sym.advice}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppChat({
                        id: 'health-urgent',
                        name: 'Campus Health Center',
                        type: 'Health',
                        distance: 'Sector 3',
                        price: 'Free',
                        rating: 5,
                        image: '',
                        gallery: [],
                        youtubeVideoUrl: '',
                        whatsappNumber: '254799000111',
                        badge: 'Verified',
                        address: 'Medical Wing',
                        description: '',
                        amenities: [],
                        likesCount: 0,
                        sharesCount: 0,
                        reviewsCount: 0
                      }, `Hello Campus Clinic, I am experiencing "${sym.name}" and would like to request advice.`)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                    >
                      Consult Nurse on WhatsApp
                    </button>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Book Campus Clinic Appointment & Emergency Hotline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Appointment Booking Form */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-bold font-heading text-neutral-900 mb-1">
                Book Campus Doctor or Therapy Appointment
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Confidential appointments for {userName || 'Student'} covered under your campus medical card.
              </p>

              <form onSubmit={handleBookHealthAppt} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Department / Specialty
                    </label>
                    <select
                      value={healthApptDoctor}
                      onChange={(e) => setHealthApptDoctor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-neutral-900"
                    >
                      <option>General Campus Outpatient Physician</option>
                      <option>MindCare Mental Health Counselor / Psychologist</option>
                      <option>Dental Checkup & Cleaning</option>
                      <option>Optical & Vision Screening</option>
                      <option>Student Pharmacy Prescription Refill</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Preferred Date & Slot
                    </label>
                    <select
                      value={healthApptDate}
                      onChange={(e) => setHealthApptDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-neutral-900"
                    >
                      <option>Today (Walk-in Slot 2:30 PM)</option>
                      <option>Tomorrow 10:00 AM</option>
                      <option>Tomorrow 3:00 PM</option>
                      <option>Thursday 11:30 AM</option>
                      <option>Friday 9:00 AM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Chief Complaint or Notes for Doctor (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={healthApptReason}
                    onChange={(e) => setHealthApptReason(e.target.value)}
                    placeholder="Briefly state symptoms, duration, or refill details..."
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={healthApptSent}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {healthApptSent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Appointment Booked! Slip Sent to Student Email</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm Appointment Booking</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Col: Emergency Hotline & Campus Clinics */}
            <div className="space-y-4">
              <div className="bg-rose-900 text-white p-6 rounded-3xl shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    24/7 Campus Emergency
                  </span>
                </div>
                <h4 className="text-xl font-black font-heading text-white">
                  Ambulance & Paramedic Dispatch
                </h4>
                <p className="text-xs text-rose-200">
                  Immediate response for acute injuries, breathing distress, or fainting on campus grounds.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = 'tel:+254799000111';
                  }}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Emergency (+254 799 000 111)</span>
                </button>
              </div>

              {/* Campus Medical Facilities Quick Links */}
              <div className="bg-white p-5 rounded-3xl border border-neutral-200 space-y-3">
                <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">
                  Campus Health Centers
                </h4>
                {filteredListings.map((facility) => (
                  <div
                    key={facility.id}
                    className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-neutral-900 truncate">
                        {facility.name}
                      </h5>
                      <p className="text-[11px] text-neutral-500 truncate">{facility.distance}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppChat(facility)}
                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl font-bold text-[11px] hover:bg-emerald-600 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeCategory === 'entertainment' ? (
        /* ========================================================================= */
        /* 2. DEDICATED ENTERTAINMENT VIEW (YOUTUBE DISCOVERY FOR MUSIC & MOVIES) */
        /* ========================================================================= */
        <div className="w-full space-y-6">
          {/* Top YouTube Entertainment Hero Header */}
          <div className="w-full bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-neutral-800">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5" />
                    <span>YouTube Campus Cinema & Music Hub</span>
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-neutral-300 text-xs font-semibold rounded-full">
                    HD & 4K Streams
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  Watch Any Song, Movie Trailer or Stream on YouTube
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Search any song, artist, blockbuster movie trailer, lo-fi study stream, or gaming esports highlight right here on Gen-Z Hub!
                </p>
              </div>

              {/* Quick Genre Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'music', 'movie', 'study', 'gaming', 'podcast'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveYtFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      activeYtFilter === filter
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {filter === 'all' ? '✨ All Media' : filter === 'music' ? '🎵 Music' : filter === 'movie' ? '🍿 Movies' : filter === 'study' ? '🎧 Lo-Fi Study' : filter === 'gaming' ? '🎮 Gaming' : '🎙️ Comedy'}
                  </button>
                ))}
              </div>
            </div>

            {/* YouTube Search Bar */}
            <form onSubmit={handleYouTubeSearch} className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ytSearchQuery}
                  onChange={(e) => setYtSearchQuery(e.target.value)}
                  placeholder="Search any YouTube song, artist (e.g. Burna Boy, Interstellar trailer, Lofi Girl), or paste URL..."
                  className="w-full pl-11 pr-4 py-3 bg-neutral-800/90 border border-neutral-700 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-400 outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Search & Play</span>
              </button>
            </form>
          </div>

          {/* Main YouTube Interactive Player */}
          <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <Play className="w-4 h-4 fill-rose-600" />
                </span>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900">
                  {customYtEmbedUrl ? `Custom YouTube Stream: ${ytSearchQuery}` : activeYtVideo.title}
                </h3>
              </div>
              <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-full">
                {customYtEmbedUrl ? 'Live Stream' : activeYtVideo.duration}
              </span>
            </div>

            {/* 16:9 Responsive Embed */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-neutral-800">
              <iframe
                src={customYtEmbedUrl || `https://www.youtube.com/embed/${activeYtVideo.youtubeId}?autoplay=0`}
                title={activeYtVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <p className="text-xs sm:text-sm text-neutral-600">
              {activeYtVideo.description || 'Watch full songs, movie trailers, comedy specials, and campus live events directly.'}
            </p>
          </div>

          {/* Curated YouTube Video Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-neutral-900">
                Trending Campus YouTube Playlist ({filteredYtMedia.length})
              </h3>
              <span className="text-xs text-neutral-500">Click any media to play instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredYtMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => {
                    setActiveYtVideo(media);
                    setCustomYtEmbedUrl(null);
                    showToast(`Playing "${media.title}"`);
                  }}
                  className={`group rounded-3xl overflow-hidden border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md flex flex-col ${
                    activeYtVideo.id === media.id && !customYtEmbedUrl
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="relative h-36 bg-neutral-900 overflow-hidden">
                    <img
                      src={media.thumbnail}
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                      {media.duration}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        {media.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 mt-0.5">
                        {media.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        By {media.artistOrDirector}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. STANDARD / HOSTEL / HOTEL TIKTOK & VIEW ALL PRESENTATION */
        /* ========================================================================= */
        !isViewAllOpen ? (
          <div className="w-full flex flex-col items-center">
            {/* Services Search & Category Filter Bar */}
            {activeCategory === 'services' && (
              <div className="w-full max-w-2xl mb-4 space-y-2.5">
                {/* Search input */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    placeholder="Search laptop repairs, fades, thesis binding, laundry, tutors..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 shadow-xs"
                  />
                  {serviceSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setServiceSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Subcategory Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {[
                    { id: 'all', label: 'All Services', icon: '🛠️' },
                    { id: 'Tech & Laptop Repairs', label: '💻 Tech & Laptop', icon: '💻' },
                    { id: 'Grooming & Salon', label: '💈 Barber & Salon', icon: '💈' },
                    { id: 'Printing & Thesis', label: '🖨️ Thesis & Print', icon: '🖨️' },
                    { id: 'Laundry & Dry Clean', label: '🧺 Laundry', icon: '🧺' },
                    { id: 'Tutoring & Coaching', label: '🎓 Peer Tutors', icon: '🎓' },
                    { id: 'Photography & Media', label: '📸 Studio & Photo', icon: '📸' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setServiceSubCategory(sub.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        serviceSubCategory === sub.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subheading & Quick Hint */}
            <div className="w-full max-w-md flex items-center justify-between mb-2.5 px-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">
                {categoryTitles[activeCategory].label} ({filteredListings.length})
              </span>
              <span className="text-[11px] text-neutral-400">
                Swipe up/down • Click "View All" for rate card & booking
              </span>
            </div>

            {filteredListings.length === 0 ? (
              <div className={`w-full max-w-md h-[560px] bg-white ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-3xl'} border border-neutral-200 flex flex-col items-center justify-center p-8 text-center`}>
                <Building className="w-12 h-12 text-neutral-300 mb-3" />
                <h3 className="font-bold text-neutral-800">No listings found in this category</h3>
                <p className="text-xs text-neutral-500 mt-1">Be the first student to add a spot!</p>
              </div>
            ) : currentItem ? (
              <div className={`relative w-full max-w-[420px] h-[640px] sm:h-[680px] bg-black ${activeCategory === 'hostel' ? 'rounded-none border-0' : 'rounded-[32px] border border-neutral-800'} overflow-hidden shadow-2xl select-none`}>
                {/* Background Image */}
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0.7, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Dark Gradient Overlays for readable TikTok text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                </motion.div>

                {/* Top Bar inside Card */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} border border-white/20 flex items-center gap-1.5 shadow-lg`}>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentItem.badge}</span>
                    </span>
                    <span className={`px-2.5 py-1 bg-amber-400 text-neutral-900 text-[11px] font-extrabold ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} flex items-center gap-1 shadow-md`}>
                      <Star className="w-3 h-3 fill-neutral-900 text-neutral-900" />
                      <span>{currentItem.rating}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-white/80 text-[11px] font-semibold bg-black/50 px-2.5 py-1 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} backdrop-blur-xs`}>
                      {currentIndex + 1} / {filteredListings.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSoundMuted(!isSoundMuted)}
                      className={`p-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/20 transition-colors cursor-pointer`}
                    >
                      {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Up & Down Navigation Floating Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 left-3 z-20 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    id="tiktok-prev-listing"
                    aria-label="Previous listing"
                    className={`p-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-black/60 backdrop-blur-md text-white hover:bg-black/90 border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    id="tiktok-next-listing"
                    aria-label="Next listing"
                    className={`p-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-black/60 backdrop-blur-md text-white hover:bg-black/90 border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* ========================================================================= */}
                {/* RIGHT SIDE TIKTOK FLOATING ACTION STACK */}
                {/* ========================================================================= */}
                <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-3.5">
                  {/* 1. WHATSAPP CHAT BUTTON (Direct Action) */}
                  <div className="flex flex-col items-center">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleWhatsAppChat(currentItem)}
                      id="tiktok-whatsapp-chat-btn"
                      title="Direct WhatsApp Chat"
                      className={`w-12 h-12 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full ring-4 ring-emerald-500/30'} bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-2 border-white cursor-pointer animate-pulse transition-all`}
                    >
                      <WhatsAppIcon className="w-6 h-6" />
                    </motion.button>
                    <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md tracking-tight">
                      WhatsApp
                    </span>
                  </div>

                  {/* 2. CALL WARDEN / CARETAKER (For Hostels & Hotels) */}
                  {currentItem.contact && (
                    <div className="flex flex-col items-center">
                      <a
                        href={`tel:${currentItem.contact.replace(/\s+/g, '')}`}
                        className={`w-11 h-11 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90`}
                        title={`Call ${currentItem.caretakerName || 'Management'}`}
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow-md">
                        {activeCategory === 'hostel' ? 'Warden' : 'Call'}
                      </span>
                    </div>
                  )}

                  {/* 3. ROOM OPTIONS PREVIEW SHEET (For Hostels) */}
                  {activeCategory === 'hostel' && currentItem.roomOptions && currentItem.roomOptions.length > 0 && (
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setIsRoomOptionsModalOpen(true)}
                        className="w-11 h-11 rounded-none bg-amber-500 hover:bg-amber-600 text-neutral-950 flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90 cursor-pointer"
                        title="View Room Types & Pricing"
                      >
                        <Bed className="w-5 h-5" />
                      </button>
                      <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow-md">
                        Rooms
                      </span>
                    </div>
                  )}

                  {/* 4. OFFICIAL WEBSITE LINK (If Available for Hotels) */}
                  {currentItem.websiteUrl && (
                    <div className="flex flex-col items-center">
                      <a
                        href={currentItem.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90`}
                        title="Visit Official Website"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                      <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow-md">
                        Website
                      </span>
                    </div>
                  )}

                  {/* 5. SHARE BUTTON */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleShare(currentItem)}
                      className={`w-11 h-11 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90 cursor-pointer`}
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-[10px] font-bold text-white mt-0.5 drop-shadow-md">
                      Share
                    </span>
                  </div>

                  {/* Spinning Track Disc */}
                  <div className={`w-9 h-9 ${activeCategory === 'hostel' ? 'rounded-none border-2' : 'rounded-full border-2'} bg-neutral-900 border-white/50 flex items-center justify-center overflow-hidden animate-spin [animation-duration:6s] shadow-lg`}>
                    <img
                      src={logoUrl}
                      alt="Track cover"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* BOTTOM LEFT OVERLAY: TIKTOK METADATA ON VIDEO */}
                {/* ========================================================================= */}
                <div className="absolute bottom-4 left-4 right-20 z-20 text-white flex flex-col gap-2">
                  {/* Creator / Campus Handle */}
                  {activeCategory === 'hostel' && currentItem && (
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold drop-shadow">
                      <span>@{String(currentItem.name || 'hostel').toLowerCase().replace(/[^a-z0-9]/g, '')}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wide">
                        Verified
                      </span>
                    </div>
                  )}

                  {/* Price & Location Tag */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 bg-emerald-500 text-white font-extrabold text-xs ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-xl'} shadow-md`}>
                      {currentItem.price}
                    </span>
                    <span className={`px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-medium ${activeCategory === 'hostel' ? 'rounded-none border border-white/10' : 'rounded-xl'} flex items-center gap-1`}>
                      <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
                      <span className="truncate max-w-[170px]">{currentItem.distance}</span>
                    </span>
                  </div>

                  {/* Listing Title / Name */}
                  <h2 className="text-xl sm:text-2xl font-black font-heading leading-tight drop-shadow-lg line-clamp-2">
                    {currentItem.name}
                  </h2>

                  {/* Full Address */}
                  <p className="text-[11px] text-neutral-300 drop-shadow-md flex items-center gap-1 line-clamp-1">
                    <Navigation className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>{currentItem.address}</span>
                  </p>

                  {/* Hostel Quick Room Tags or Amenities */}
                  {activeCategory === 'hostel' && currentItem.roomOptions && currentItem.roomOptions.length > 0 ? (
                    <div className="flex items-center gap-1.5 flex-wrap my-0.5">
                      {currentItem.roomOptions.map((ro, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-none border border-white/15 text-emerald-300"
                        >
                          {ro.name} ({ro.price})
                        </span>
                      ))}
                    </div>
                  ) : (
                    currentItem.amenities && currentItem.amenities.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap my-0.5">
                        {currentItem.amenities.slice(0, 3).map((am, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 ${activeCategory === 'hostel' ? 'rounded-none border border-white/10' : 'rounded-md border border-white/10'} text-neutral-200`}
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    )
                  )}

                  {/* Description Snippet */}
                  <p className="text-xs text-neutral-200 line-clamp-2 drop-shadow leading-relaxed">
                    {currentItem.description}
                  </p>

                  {/* Sound Audio Marquee for TikTok Feel */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 pt-0.5">
                    <Music className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Campus Life Sound • {currentItem.name} Original Showcase</span>
                  </div>

                  {/* VIEW ALL / SCROLL RIGHT BUTTON */}
                  <div className="pt-1.5">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsViewAllOpen(true)}
                      id="tiktok-view-all-btn"
                      className={`w-full py-3 px-4 bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs sm:text-sm ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-2xl'} shadow-xl flex items-center justify-between group cursor-pointer transition-colors`}
                    >
                      <span className="flex items-center gap-2">
                        {currentItem.type === 'Service' ? (
                          <Wrench className="w-4 h-4 text-emerald-600" />
                        ) : activeCategory === 'hostel' ? (
                          <Building className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Tv className="w-4 h-4 text-rose-600" />
                        )}
                        <span>
                          {currentItem.type === 'Service'
                            ? 'View Service Menu & Rate Card'
                            : currentItem.type === 'Hotel'
                            ? 'View Profile, Menus & Services'
                            : 'View All (Video Tour & Full Profile)'}
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-800 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* ========================================================================= */
          /* DETAILED "VIEW ALL" PROFILE PAGE (WITH MENUS, SERVICES, WEBSITE) */
          /* ========================================================================= */
          currentItem && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.35 }}
              className={`w-full bg-white ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-300' : 'rounded-3xl border border-neutral-100/90'} shadow-xl p-6 sm:p-9 relative overflow-hidden flex flex-col text-neutral-900 space-y-8`}
            >
              {/* Top Navigation Bar inside Detailed View */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsViewAllOpen(false)}
                  id="viewall-back-to-feed-btn"
                  className={`inline-flex items-center gap-2 px-4 py-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition-colors cursor-pointer`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to TikTok Feed</span>
                </button>

                <div className="flex items-center gap-2">
                  {/* Website Button if available */}
                  {currentItem.websiteUrl && (
                    <a
                      href={currentItem.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Official Website</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleWhatsAppChat(currentItem)}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors cursor-pointer`}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp Desk</span>
                  </button>
                </div>
              </div>

              {/* YouTube Video Tour Embed */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 bg-rose-100 text-rose-600 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-lg'}`}>
                      <Play className="w-4 h-4 fill-rose-600" />
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                      {currentItem.youtubeTitle || `${currentItem.name} Full Tour`}
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                    Official Showcase
                  </span>
                </div>

                <div className={`relative w-full aspect-video ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-900' : 'rounded-3xl border border-neutral-200'} overflow-hidden shadow-2xl bg-neutral-900`}>
                  <iframe
                    src={currentItem.youtubeVideoUrl}
                    title={currentItem.name}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Main Profile Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-neutral-100">
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-3 py-1 bg-neutral-900 text-white text-xs font-bold ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'}`}>
                        {currentItem.type}
                      </span>
                      <span className={`px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} border border-emerald-200`}>
                        {currentItem.badge}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'}`}>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{currentItem.rating}</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black font-heading text-neutral-900 tracking-tight">
                      {currentItem.name}
                    </h1>

                    <p className="text-xs sm:text-sm text-neutral-500 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{currentItem.distance}</span>
                      <span>•</span>
                      <span>{currentItem.address}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <div className={`bg-neutral-50 p-5 ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-200' : 'rounded-2xl border border-neutral-100'}`}>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      About This Facility
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {currentItem.description}
                    </p>
                  </div>

                  {/* Hostel Room Options Breakdown */}
                  {activeCategory === 'hostel' && currentItem.roomOptions && currentItem.roomOptions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Available Room Types & Rates
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {currentItem.roomOptions.map((ro, i) => (
                          <div
                            key={i}
                            className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-none flex flex-col justify-between space-y-2 shadow-2xs"
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                Option {i + 1}
                              </span>
                              <h5 className="font-extrabold text-sm text-neutral-900 mt-0.5">
                                {ro.name}
                              </h5>
                              <p className="text-xs text-neutral-600 mt-1 leading-normal">
                                {ro.description}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                              <span className="font-black text-emerald-700 text-sm">{ro.price}</span>
                              <button
                                type="button"
                                onClick={() => handleWhatsAppChat(currentItem, `Hi, I want to book the "${ro.name}" (${ro.price}) at ${currentItem.name}.`)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-none cursor-pointer transition-colors"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
                      Key Amenities & Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentItem.amenities.map((am, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2.5 p-3 ${activeCategory === 'hostel' ? 'rounded-none border border-neutral-300' : 'rounded-xl border border-neutral-200'} bg-white text-xs font-semibold text-neutral-800 shadow-2xs`}
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Price, Website & Inquiry Form */}
                <div className="space-y-4">
                  <div className={`bg-neutral-900 text-white p-6 ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-800' : 'rounded-3xl'} shadow-xl flex flex-col gap-4`}>
                    <div>
                      <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold">
                        Price / Rent
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400 mt-1">
                        {currentItem.price}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {currentItem.operatingHours || 'Flexible student terms'}
                      </p>
                    </div>

                    {/* Official Website Banner Card */}
                    {currentItem.websiteUrl && (
                      <div className={`p-3 bg-white/10 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-2xl'} border border-white/20 space-y-1`}>
                        <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider">
                          Official Web Portal
                        </span>
                        <a
                          href={currentItem.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 truncate"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{currentItem.websiteUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-800 text-xs space-y-2 text-neutral-300">
                      {currentItem.caretakerName && (
                        <p className="font-semibold text-white">
                          Contact / Concierge: {currentItem.caretakerName}
                        </p>
                      )}
                      {currentItem.contact && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{currentItem.contact}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppChat(currentItem)}
                      className={`w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-2xl'} shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors`}
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      <span>Chat on WhatsApp Directly</span>
                    </button>
                  </div>

                  {/* Inquiry Form */}
                  <div className={`bg-neutral-50 p-5 ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-200' : 'rounded-3xl border border-neutral-200'}`}>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Send Direct Inquiry
                    </h4>
                    <form onSubmit={handleSendInquiry} className="space-y-2.5 text-xs">
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your full name"
                        className={`w-full px-3.5 py-2 bg-white border border-neutral-200 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-xl'} outline-none`}
                      />
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Phone / WhatsApp number"
                        className={`w-full px-3.5 py-2 bg-white border border-neutral-200 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-xl'} outline-none`}
                      />
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Inquire dates, dining, or room reservation..."
                        className={`w-full px-3.5 py-2 bg-white border border-neutral-200 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-xl'} outline-none resize-none`}
                      />
                      <button
                        type="submit"
                        disabled={inquirySent}
                        className={`w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-xl'} transition-colors cursor-pointer flex items-center justify-center gap-1.5`}
                      >
                        {inquirySent ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Inquiry Submitted!</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* HOTEL MENUS SECTION */}
              {/* ========================================================================= */}
              {currentItem.menus && currentItem.menus.length > 0 && (
                <div className="space-y-4 pb-8 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-heading text-neutral-900">
                          Restaurant & Dining Menus
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Fresh breakfast, chef specials, drinks and room service pricing
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentItem.menus.map((menuCat, i) => (
                      <div
                        key={i}
                        className="bg-neutral-50 p-5 rounded-3xl border border-neutral-200/80 space-y-3"
                      >
                        <h4 className="font-bold text-sm text-neutral-900 border-b border-neutral-200 pb-2">
                          {menuCat.category}
                        </h4>
                        <div className="space-y-3">
                          {menuCat.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-3 p-3 bg-white rounded-2xl border border-neutral-100 hover:border-neutral-300 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-xs sm:text-sm text-neutral-900">
                                    {item.name}
                                  </h5>
                                  {item.tag && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                                      {item.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-extrabold text-sm text-neutral-900 block">
                                  {item.price}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppChat(currentItem, `Hi, I would like to order "${item.name}" (${item.price}) from the menu.`)}
                                  className="mt-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  Order Dish
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SERVICES & AMENITIES SECTION (FOR SERVICES & HOTELS) */}
              {/* ========================================================================= */}
              {currentItem.services && currentItem.services.length > 0 && (
                <div className="space-y-4 pb-8 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      {currentItem.type === 'Service' ? (
                        <Wrench className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-heading text-neutral-900">
                        {currentItem.type === 'Service'
                          ? 'Service Catalog, Rates & Turnaround'
                          : 'Hotel Services & Guest Amenities'}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {currentItem.type === 'Service'
                          ? 'Student discount rates with warranty and direct WhatsApp scheduling'
                          : 'Shuttles, laundry, meeting halls, and room concierge'}
                      </p>
                    </div>
                  </div>

                  {currentItem.type === 'Service' && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">
                          <strong>Campus Quality Guarantee:</strong> Free diagnostic & 90-day student service warranty.
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full shrink-0">
                        Verified Pro
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentItem.services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-2 hover:border-neutral-400 transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-bold text-xs sm:text-sm text-neutral-900">
                              {srv.title}
                            </h5>
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0">
                              {srv.priceOrStatus}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsAppChat(
                              currentItem,
                              `Hi, I would like to book/inquire about "${srv.title}" (${srv.priceOrStatus}) from your service listing.`
                            )
                          }
                          className="pt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{currentItem.type === 'Service' ? 'Book via WhatsApp' : 'Request Service'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-heading text-neutral-900">
                    Facility Photos & Gallery
                  </h3>
                  <span className="text-xs text-neutral-400 font-semibold">
                    {currentItem.gallery.length} verified photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {currentItem.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveLightboxImg(imgUrl)}
                      className={`relative h-40 sm:h-52 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-2xl'} overflow-hidden bg-neutral-100 border border-neutral-200 group cursor-pointer shadow-2xs hover:shadow-md transition-all`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${currentItem.name} gallery ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className={`p-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-white/80 backdrop-blur-xs text-neutral-900`}>
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        )
      )}

      {/* Hostel Quick Room Options Modal (No Border Radius) */}
      <AnimatePresence>
        {isRoomOptionsModalOpen && currentItem && currentItem.roomOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRoomOptionsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-950 text-white rounded-none border-2 border-neutral-700 shadow-2xl p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-500 text-white rounded-none">
                    <Bed className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black font-heading text-white">
                      {currentItem.name} Room Options
                    </h3>
                    <p className="text-[11px] text-neutral-400">Direct booking & student pricing</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRoomOptionsModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {currentItem.roomOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-none flex items-start justify-between gap-3 hover:border-emerald-500 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-white">{opt.name}</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-emerald-400 block">{opt.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRoomOptionsModalOpen(false);
                          handleWhatsAppChat(currentItem, `Hi, I want to book "${opt.name}" (${opt.price}) at ${currentItem.name}.`);
                        }}
                        className="mt-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-none cursor-pointer transition-colors"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800">
                <span>Free student booking through campus desk</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRoomOptionsModalOpen(false);
                    setIsViewAllOpen(true);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                >
                  Full Video Tour & Amenities
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxImg(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative max-w-4xl max-h-[90vh] z-10 ${activeCategory === 'hostel' ? 'rounded-none border-2 border-neutral-700' : 'rounded-2xl'} overflow-hidden shadow-2xl`}
            >
              <button
                type="button"
                onClick={() => setActiveLightboxImg(null)}
                className={`absolute top-4 right-4 p-2 ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-full'} bg-black/60 text-white hover:bg-black cursor-pointer z-20`}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={activeLightboxImg}
                alt="Full size view"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain max-h-[85vh] ${activeCategory === 'hostel' ? 'rounded-none' : 'rounded-2xl'}`}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
