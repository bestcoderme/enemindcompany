/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import {
  MentorProfile,
  TeacherProfile,
  SessionOffering,
  Booking,
  SessionFormat,
  ProviderType,
} from '../../types/mentorship';
import { MentorService } from '../../services/mentorship/mentorService';
import { TeacherService } from '../../services/mentorship/teacherService';
import { SessionOfferingService } from '../../services/mentorship/sessionOfferingService';
import { BookingService } from '../../services/mentorship/bookingService';
import { ChatService } from '../../services/chat/chatService';

// Modals & Sub-Views
import { BecomeMentorTeacherModal } from './BecomeMentorTeacherModal';
import { ProviderProfileModal } from './ProviderProfileModal';
import { BookingFlowModal } from './BookingFlowModal';
import { SessionRoomModal } from './SessionRoomModal';
import { ProviderStudioView } from './ProviderStudioView';
import { AdminMentorshipPanel } from './AdminMentorshipPanel';
import { ReportDisputeModal } from './ReportDisputeModal';

import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Award,
  Video,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
  BookOpen,
  DollarSign,
  Plus,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface MentorshipViewProps {
  user?: UserProfile;
  onNavigate?: (viewId: string) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({ user: propUser, onNavigate }) => {
  // Active user fallback
  const currentUser: UserProfile = propUser || {
    name: 'Student Scholar',
    email: 'student@enemindcompany.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    roles: ['STUDENT', 'MENTOR'],
    university: { id: 'uon', name: 'University of Nairobi' },
    course: { id: 'cs', name: 'B.Sc. Computer Science', code: 'CS101' },
    careerPreferences: {
      primaryCareerGoal: 'Cloud Solutions Architect',
      currentSkills: ['Python', 'SQL', 'AWS', 'Docker'],
      interests: ['Distributed Systems', 'Cloud Security'],
    },
  };

  // Main Hub Active Tab
  const [activeTab, setActiveTab] = useState<'mentors' | 'teachers' | 'group_classes' | 'my_sessions' | 'studio' | 'admin'>('mentors');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals state
  const [showBecomeModal, setShowBecomeModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<((MentorProfile | TeacherProfile) & { providerType: ProviderType }) | null>(null);
  const [selectedOfferingForBooking, setSelectedOfferingForBooking] = useState<SessionOffering | null>(null);
  const [activeSessionRoomBooking, setActiveSessionRoomBooking] = useState<Booking | null>(null);
  const [disputeBooking, setDisputeBooking] = useState<Booking | undefined>(undefined);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Data
  const mentors = MentorService.getAllMentors();
  const teachers = TeacherService.getAllTeachers();
  const offerings = SessionOfferingService.getAllOfferings();
  const studentBookings = BookingService.getStudentBookings(currentUser.email || 'student_current');

  // Career Engine AI Recommendations
  const recommendedMentors = useMemo(() => {
    return MentorService.getRecommendedMentors(
      currentUser.careerPreferences?.primaryCareerGoal || 'Cloud Engineering',
      currentUser.careerPreferences?.currentSkills || ['Python', 'AWS']
    );
  }, [currentUser]);

  // Filtered Mentors
  const filteredMentors = useMemo(() => {
    return MentorService.searchMentors(searchQuery, {
      skill: selectedSkill !== 'ALL' ? selectedSkill : undefined,
      isFree: priceFilter === 'FREE' ? true : undefined,
      verificationOnly: verifiedOnly ? true : undefined,
    });
  }, [searchQuery, selectedSkill, priceFilter, verifiedOnly]);

  // Filtered Teachers
  const filteredTeachers = useMemo(() => {
    return TeacherService.searchTeachers(searchQuery, {
      skill: selectedSkill !== 'ALL' ? selectedSkill : undefined,
      isFree: priceFilter === 'FREE' ? true : undefined,
      verificationOnly: verifiedOnly ? true : undefined,
    });
  }, [searchQuery, selectedSkill, priceFilter, verifiedOnly]);

  // Filtered Group Classes
  const groupClasses = useMemo(() => {
    return offerings.filter(
      (o) =>
        (o.format === 'GROUP' || o.format === 'WORKSHOP') &&
        o.status === 'active' &&
        (searchQuery ? o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.description.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  }, [offerings, searchQuery]);

  // Direct chat trigger
  const handleStartChatWithProvider = (provider: any) => {
    const conv = ChatService.createConversation(
      currentUser,
      {
        id: provider.id,
        name: provider.name,
        email: `${provider.id}@enemind.provider`,
        avatarUrl: provider.profilePhoto,
        role: provider.providerType === 'MENTOR' ? 'MENTOR' : 'TEACHER',
      },
      'mentorship',
      `${provider.name} (${provider.headline || 'Mentorship'})`
    );

    setSelectedProvider(null);
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero / Ecosystem Announcement Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wide">
              Phase 5 Ecosystem
            </span>
            <span className="text-xs text-neutral-400 font-medium">· Verified Mentors & Skill Teachers</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight">
            Learn, Grow & Build with Real Industry Practitioners
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Book 1-on-1 career advisories, join live coding masterclasses, receive portfolio reviews, and connect via
            Google Meet with top engineering leads from AWS, Safaricom, FinTech Hubs, and universities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setShowBecomeModal(true)}
            className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply as Mentor or Teacher</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className="py-2.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Provider Studio</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('mentors')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mentors'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Industry Mentors ({mentors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'teachers'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Skill Teachers ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('group_classes')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'group_classes'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Group Masterclasses ({groupClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_sessions')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'my_sessions'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Sessions ({studentBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'studio'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Provider Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
            activeTab === 'admin'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Governance & Safety</span>
        </button>
      </div>

      {/* TAB: Mentors, Teachers & Group Classes Discovery View */}
      {(activeTab === 'mentors' || activeTab === 'teachers' || activeTab === 'group_classes') && (
        <div className="space-y-6">
          {/* Career AI Match Ribbon */}
          {recommendedMentors.length > 0 && activeTab === 'mentors' && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-emerald-950 font-heading">
                  Career Match: Recommended for your "{currentUser.careerPreferences?.primaryCareerGoal || 'Cloud'}" Goal
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedMentors.slice(0, 2).map(({ mentor, reason }) => (
                  <div
                    key={mentor.id}
                    className="p-3.5 rounded-xl bg-white border border-emerald-100 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={mentor.profilePhoto}
                        alt={mentor.name}
                        className="w-11 h-11 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-neutral-900">{mentor.name}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{mentor.headline}</p>
                        <p className="text-[11px] text-emerald-800 font-medium mt-1">
                          💡 {reason.explanation}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProvider({ ...mentor, providerType: 'MENTOR' })}
                      className="py-1.5 px-3 rounded-lg bg-neutral-900 text-white font-bold text-[11px] hover:bg-neutral-800 shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search mentors or teachers by name, skill (e.g. AWS, Python, Figma), or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-hidden font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold text-neutral-700"
              >
                <option value="ALL">All Skills</option>
                <option value="Python">Python</option>
                <option value="AWS">AWS Cloud</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="SQL">SQL & Databases</option>
                <option value="Figma">Figma UX</option>
                <option value="Flutter">Flutter Mobile</option>
                <option value="PLC">Industrial PLC</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold text-neutral-700"
              >
                <option value="ALL">All Prices</option>
                <option value="FREE">Volunteer / Free</option>
                <option value="PAID">Paid Only</option>
              </select>

              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`p-2 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  verifiedOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Only</span>
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: MENTORS GRID */}
          {activeTab === 'mentors' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={mentor.profilePhoto}
                        alt={mentor.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-bold text-neutral-900 truncate">{mentor.name}</h3>
                          {mentor.verificationStatus === 'VERIFIED' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-1">{mentor.headline}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{mentor.rating}</span>
                          </div>
                          <span>· {mentor.completedSessions} sessions</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">{mentor.bio}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {mentor.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-medium">Session Rate</span>
                      <span className="text-xs font-black text-neutral-900">
                        {mentor.pricing.model === 'FREE'
                          ? 'Free'
                          : `${mentor.pricing.currency} ${mentor.pricing.amount}`}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProvider({ ...mentor, providerType: 'MENTOR' })}
                      className="py-1.5 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-transform active:scale-95 shadow-2xs cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW 2: TEACHERS GRID */}
          {activeTab === 'teachers' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={teacher.profilePhoto}
                        alt={teacher.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-bold text-neutral-900 truncate">{teacher.name}</h3>
                          {teacher.verificationStatus === 'VERIFIED' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-1">{teacher.headline}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{teacher.rating}</span>
                          </div>
                          <span>· {teacher.completedSessions} taught</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">{teacher.bio}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {teacher.subjects.slice(0, 3).map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-medium">Class Rate</span>
                      <span className="text-xs font-black text-neutral-900">
                        {teacher.pricing.model === 'FREE'
                          ? 'Free'
                          : `${teacher.pricing.currency} ${teacher.pricing.amount}`}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProvider({ ...teacher, providerType: 'TEACHER' })}
                      className="py-1.5 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-transform active:scale-95 shadow-2xs cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW 3: GROUP MASTERCLASSES */}
          {activeTab === 'group_classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupClasses.map((offering) => (
                <div
                  key={offering.id}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Live Group Workshop
                      </span>
                      <span className="text-xs font-black text-neutral-900">
                        {offering.price === 0 ? 'Free' : `${offering.currency} ${offering.price}`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 mb-1">{offering.title}</h3>
                    <p className="text-xs text-neutral-600 line-clamp-2 mb-3">{offering.description}</p>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>
                          {offering.maxParticipants - (offering.bookedSeats || 0)} of {offering.maxParticipants} seats remaining
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{offering.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">Host: {offering.providerName}</span>
                    <button
                      onClick={() => setSelectedOfferingForBooking(offering)}
                      className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-transform active:scale-95 shadow-xs cursor-pointer"
                    >
                      Enroll in Masterclass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: My Bookings & Live Sessions */}
      {activeTab === 'my_sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Your Scheduled Sessions & Live Classrooms</h3>
            <span className="text-xs text-neutral-400">{studentBookings.length} booking(s)</span>
          </div>

          {studentBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 text-xs text-neutral-500 space-y-2">
              <Calendar className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="font-semibold text-neutral-800">No active bookings yet.</p>
              <p>Explore our verified mentors and skill teachers to schedule your first session.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        {new Date(booking.scheduledStart).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(booking.scheduledStart).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900">{booking.sessionTitle}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Host: <span className="font-semibold text-neutral-800">{booking.providerName}</span> (
                      {booking.providerType})
                    </p>

                    {booking.mpesaReceiptNumber && (
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        M-PESA Receipt: {booking.mpesaReceiptNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setActiveSessionRoomBooking(booking)}
                      className="py-2 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Launch Room</span>
                    </button>

                    {booking.conversationId && (
                      <button
                        onClick={() => {
                          if (onNavigate) onNavigate('chat');
                        }}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        title="Session Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Provider Studio Workspace */}
      {activeTab === 'studio' && (
        <ProviderStudioView
          user={currentUser}
          onOpenSessionRoom={(b) => setActiveSessionRoomBooking(b)}
          onOpenChat={(convId) => {
            if (onNavigate) onNavigate('chat');
          }}
        />
      )}

      {/* TAB: Governance & Safety Admin View */}
      {activeTab === 'admin' && <AdminMentorshipPanel />}

      {/* MODALS */}
      {showBecomeModal && (
        <BecomeMentorTeacherModal
          isOpen={showBecomeModal}
          onClose={() => setShowBecomeModal(false)}
          user={currentUser}
          onProfileSubmitted={(role) => {
            setActiveTab('studio');
          }}
        />
      )}

      {selectedProvider && (
        <ProviderProfileModal
          isOpen={Boolean(selectedProvider)}
          onClose={() => setSelectedProvider(null)}
          provider={selectedProvider}
          onSelectOfferingForBooking={(offering) => {
            setSelectedProvider(null);
            setSelectedOfferingForBooking(offering);
          }}
          onStartChat={(provider) => handleStartChatWithProvider(provider)}
        />
      )}

      {selectedOfferingForBooking && (
        <BookingFlowModal
          isOpen={Boolean(selectedOfferingForBooking)}
          onClose={() => setSelectedOfferingForBooking(null)}
          user={currentUser}
          offering={selectedOfferingForBooking}
          onBookingConfirmed={(booking) => {
            setActiveTab('my_sessions');
          }}
          onOpenSessionRoom={(booking) => {
            setSelectedOfferingForBooking(null);
            setActiveSessionRoomBooking(booking);
          }}
          onOpenChat={(convId) => {
            setSelectedOfferingForBooking(null);
            if (onNavigate) onNavigate('chat');
          }}
        />
      )}

      {activeSessionRoomBooking && (
        <SessionRoomModal
          isOpen={Boolean(activeSessionRoomBooking)}
          onClose={() => setActiveSessionRoomBooking(null)}
          booking={activeSessionRoomBooking}
          user={currentUser}
          onOpenChat={(convId) => {
            setActiveSessionRoomBooking(null);
            if (onNavigate) onNavigate('chat');
          }}
          onReportIssue={(booking) => {
            setDisputeBooking(booking);
            setShowDisputeModal(true);
          }}
          onBookingUpdated={(updated) => {
            setActiveSessionRoomBooking(updated);
          }}
        />
      )}

      {showDisputeModal && (
        <ReportDisputeModal
          isOpen={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          user={currentUser}
          booking={disputeBooking}
        />
      )}
    </div>
  );
};
