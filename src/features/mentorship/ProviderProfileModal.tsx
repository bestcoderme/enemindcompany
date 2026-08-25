/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MentorProfile, TeacherProfile, SessionOffering, SessionReview, ProviderType } from '../../types/mentorship';
import { Badge } from '../../components/common/Badge';
import { SessionOfferingService } from '../../services/mentorship/sessionOfferingService';
import { ReviewService } from '../../services/mentorship/reviewService';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Globe,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Users,
  Video,
} from 'lucide-react';

interface ProviderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: (MentorProfile | TeacherProfile) & { providerType: ProviderType };
  onSelectOfferingForBooking: (offering: SessionOffering) => void;
  onStartChat: (provider: any) => void;
}

export const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  isOpen,
  onClose,
  provider,
  onSelectOfferingForBooking,
  onStartChat,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'about' | 'reviews'>('sessions');

  if (!isOpen || !provider) return null;

  const offerings = SessionOfferingService.getOfferingsByProvider(provider.id);
  const reviews = ReviewService.getReviewsForProvider(provider.id);
  const isMentor = provider.providerType === 'MENTOR';
  const mentor = isMentor ? (provider as MentorProfile) : null;
  const teacher = !isMentor ? (provider as TeacherProfile) : null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95">
        {/* Header with Photo, Verified Badge, Rating */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={provider.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={provider.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shadow-xs"
              />
              {provider.verificationStatus === 'VERIFIED' && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white shadow-xs"
                  title="Verified Professional Credential"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 font-heading">{provider.name}</h2>
                <Badge variant={isMentor ? 'emerald' : 'blue'} size="sm">
                  {isMentor ? 'Industry Mentor' : 'Skill Teacher'}
                </Badge>
                {provider.verificationStatus === 'VERIFIED' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-600">
                    Pending Verification
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-700 font-medium mt-1 max-w-xl">{provider.headline}</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-500">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-neutral-900">{provider.rating}</span>
                  <span className="text-neutral-400 font-normal">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{provider.completedSessions} sessions completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{provider.availability?.timezone || 'Africa/Nairobi'}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-100 my-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Available Sessions ({offerings.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Background & Credentials
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Student Reviews ({reviews.length})
          </button>

          <div className="ml-auto">
            <button
              onClick={() => onStartChat(provider)}
              className="py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Chat</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Available Session Offerings */}
        {activeTab === 'sessions' && (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {offerings.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200">
                <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-medium">
                  No active session offerings posted yet. Message this provider directly for custom slots.
                </p>
              </div>
            ) : (
              offerings.map((offering) => (
                <div
                  key={offering.id}
                  className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {offering.format.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-neutral-400">· {offering.durationMinutes} mins</span>
                      {offering.format === 'GROUP' && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-700">
                          {offering.maxParticipants - (offering.bookedSeats || 0)} seats remaining
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900">{offering.title}</h3>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                      {offering.description}
                    </p>

                    {offering.materials?.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-700 font-semibold">
                        <BookOpen className="w-3 h-3" />
                        <span>Includes {offering.materials.length} learning resource(s)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-2 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-neutral-400 block font-medium">Session Price</span>
                      <span className="text-sm font-black text-neutral-900">
                        {offering.price === 0 ? 'Free / Volunteer' : `${offering.currency} ${offering.price}`}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectOfferingForBooking(offering)}
                      className="py-2 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: About & Verified Credentials */}
        {activeTab === 'about' && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 text-xs">
            <div>
              <h4 className="font-bold text-neutral-900 mb-1.5 font-heading">Biography & Mentorship Philosophy</h4>
              <p className="text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                {provider.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Education & Academic Background</span>
                </h4>
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-700">
                  <p className="font-semibold">{provider.education}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Verified Certifications</span>
                </h4>
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-700 space-y-1">
                  {provider.certifications?.length ? (
                    provider.certifications.map((cert, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-neutral-400">No public certificates listed.</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 mb-2">Technical Skills & Expertise Areas</h4>
              <div className="flex flex-wrap gap-1.5">
                {provider.skills?.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {provider.verificationNotes || 'Credentials reviewed and approved under ENEMIND Quality Standards.'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                No written student reviews yet. Be the first to book and share your feedback!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.studentName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">{rev.studentName}</span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(rev.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

                  {rev.providerResponse && (
                    <div className="mt-2 ml-4 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        Response from {provider.name}:
                      </span>
                      <p className="text-neutral-600">{rev.providerResponse}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
