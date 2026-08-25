/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import {
  MentorProfile,
  TeacherProfile,
  SessionOffering,
  ProviderEarnings,
  SessionReview,
  Booking,
} from '../../types/mentorship';
import { MentorService } from '../../services/mentorship/mentorService';
import { TeacherService } from '../../services/mentorship/teacherService';
import { SessionOfferingService } from '../../services/mentorship/sessionOfferingService';
import { BookingService } from '../../services/mentorship/bookingService';
import { PayoutService } from '../../services/mentorship/payoutService';
import { ReviewService } from '../../services/mentorship/reviewService';
import { GoogleCalendarMeetService } from '../../services/mentorship/googleCalendarMeetService';
import {
  Calendar,
  Clock,
  Plus,
  DollarSign,
  Star,
  Users,
  Video,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  BookOpen,
  MessageSquare,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface ProviderStudioViewProps {
  user: UserProfile;
  onOpenSessionRoom: (booking: Booking) => void;
  onOpenChat: (conversationId: string) => void;
}

export const ProviderStudioView: React.FC<ProviderStudioViewProps> = ({
  user,
  onOpenSessionRoom,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'offerings' | 'schedule' | 'earnings' | 'reviews' | 'availability'>('offerings');

  // Identify provider profile (Mentor, Teacher, or both)
  const allMentors = MentorService.getAllMentors();
  const allTeachers = TeacherService.getAllTeachers();

  const currentMentor = allMentors.find((m) => m.userId === user.email || m.id === 'mentor_dr_jane');
  const currentTeacher = allTeachers.find((t) => t.userId === user.email);

  const providerId = currentMentor?.id || currentTeacher?.id || 'mentor_dr_jane';
  const providerName = currentMentor?.name || currentTeacher?.name || user.name;
  const isVerified = currentMentor?.verificationStatus === 'VERIFIED' || currentTeacher?.verificationStatus === 'VERIFIED';

  // State
  const offerings = SessionOfferingService.getOfferingsByProvider(providerId);
  const bookings = BookingService.getProviderBookings(providerId);
  const earnings = PayoutService.calculateProviderEarnings(providerId, 'KES');
  const reviews = ReviewService.getReviewsForProvider(providerId);
  const authStatus = GoogleCalendarMeetService.getAuthStatus();

  // Create Offering Modal / Form state
  const [showCreateOffering, setShowCreateOffering] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Software Engineering');
  const [newDuration, setNewDuration] = useState('45');
  const [newPrice, setNewPrice] = useState('0');
  const [newFormat, setNewFormat] = useState<'ONE_ON_ONE' | 'GROUP' | 'CV_REVIEW' | 'SKILL_LESSON'>('ONE_ON_ONE');
  const [newMaxSeats, setNewMaxSeats] = useState('1');

  // Payout request modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(earnings.netEarnings.toString());
  const [payoutPhone, setPayoutPhone] = useState(user.phoneNumber || '0712345678');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  // Review reply state
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Handle new offering
  const handleSaveOffering = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      SessionOfferingService.createOffering({
        providerId,
        providerType: currentMentor ? 'MENTOR' : 'TEACHER',
        providerName,
        providerAvatar: user.avatarUrl,
        title: newTitle,
        description: newDesc,
        category: newCategory,
        durationMinutes: parseInt(newDuration) || 45,
        price: parseFloat(newPrice) || 0,
        currency: 'KES',
        maxParticipants: parseInt(newMaxSeats) || 1,
        format: newFormat as any,
        meetingProvider: 'google_meet',
        status: 'active',
        materials: [],
      });
      setShowCreateOffering(false);
      setNewTitle('');
      setNewDesc('');
    } catch (err: any) {
      alert(err?.message || 'Error saving offering');
    }
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    try {
      PayoutService.requestPayout({
        providerId,
        providerName,
        amount: parseFloat(payoutAmount) || 0,
        currency: 'KES',
        destination: payoutPhone,
        paymentProvider: 'mpesa',
      });
      setPayoutSuccess(true);
      setTimeout(() => {
        setShowPayoutModal(false);
        setPayoutSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPayoutError(err?.message || 'Payout request failed');
    }
  };

  const handleReplyReview = (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      ReviewService.replyToReview(reviewId, replyText, providerId);
      setReplyReviewId(null);
      setReplyText('');
    } catch (err: any) {
      alert(err?.message || 'Failed to reply');
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Stats Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wide">
              Provider Studio Pro
            </span>
            {isVerified ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Provider
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 font-bold">
                Pending Verification
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-heading">{providerName}'s Teaching & Mentorship Hub</h2>
          <p className="text-xs text-neutral-400">
            Manage your session offerings, upcoming appointments, client payouts, and student reviews.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateOffering(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session Offering</span>
          </button>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Request M-PESA Payout</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block mb-1">Available to Withdraw</span>
          <div className="text-xl font-black text-neutral-900 font-heading">
            KES {earnings.netEarnings.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Net after 10% platform fee</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block mb-1">Gross Sessions Revenue</span>
          <div className="text-xl font-black text-neutral-900 font-heading">
            KES {earnings.grossEarnings.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Lifetime volume</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block mb-1">Total Bookings</span>
          <div className="text-xl font-black text-neutral-900 font-heading">{bookings.length}</div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            {bookings.filter((b) => b.status === 'CONFIRMED').length} upcoming
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block mb-1">Average Student Rating</span>
          <div className="text-xl font-black text-neutral-900 font-heading flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{currentMentor?.rating || 5.0}</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">from {reviews.length} verified reviews</span>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('offerings')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'offerings'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Session Offerings ({offerings.length})
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Upcoming Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'earnings'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Payouts & Statements
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Reviews & Feedback ({reviews.length})
        </button>
      </div>

      {/* TAB 1: Session Offerings List */}
      {activeTab === 'offerings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Your Active Session Offerings</h3>
            <button
              onClick={() => setShowCreateOffering(true)}
              className="py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Offering</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerings.map((offering) => (
              <div
                key={offering.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      {offering.format.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-black text-neutral-900">
                      {offering.price === 0 ? 'Free' : `${offering.currency} ${offering.price}`}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 mb-1">{offering.title}</h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">{offering.description}</p>
                </div>

                <div className="border-t border-neutral-100 pt-3 mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{offering.durationMinutes} mins</span>
                  </div>
                  {offering.format === 'GROUP' && (
                    <span>
                      {offering.bookedSeats}/{offering.maxParticipants} seats filled
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Archive this session offering?')) {
                        SessionOfferingService.deleteOffering(offering.id, providerId);
                      }
                    }}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bookings & Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-neutral-200 text-neutral-500 text-xs">
              No appointments scheduled yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
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
                  <p className="text-xs text-neutral-500">Student: {booking.studentName} ({booking.studentEmail})</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSessionRoom(booking)}
                    className="py-2 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Room</span>
                  </button>

                  {booking.conversationId && (
                    <button
                      onClick={() => onOpenChat(booking.conversationId!)}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                      title="Chat with Student"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Earnings & Payouts */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <h4 className="font-bold text-neutral-900">Platform Commission & Settlement Policy</h4>
            <p className="text-neutral-600 leading-relaxed">
              ENEMIND retains a transparent 10% platform commission on paid sessions to maintain high-definition Google
              Meet infrastructure, calendar sync, M-PESA escrow security, and continuous student acquisition. Net provider
              earnings are deposited instantly to your registered M-PESA number upon request.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 font-bold text-xs text-neutral-900">
              Recent Transactions & Escrow Settlement
            </div>
            {earnings.transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">No paid session transactions recorded yet.</div>
            ) : (
              <div className="divide-y divide-neutral-100 text-xs">
                {earnings.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900 block">{tx.sessionTitle}</span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(tx.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 block">
                        + {tx.currency} {tx.netAmount}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Gross: {tx.grossAmount} (Fee: {tx.platformFee})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Reviews & Replies */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-neutral-200 text-neutral-500 text-xs">
              No student reviews received yet.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900">{rev.studentName}</span>
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

                <p className="text-xs text-neutral-700">"{rev.comment}"</p>

                {rev.providerResponse ? (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase">Your Reply:</span>
                    <p className="text-neutral-700">{rev.providerResponse}</p>
                  </div>
                ) : (
                  <div>
                    {replyReviewId === rev.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          placeholder="Write a professional reply to the student..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReplyReview(rev.id)}
                            className="py-1 px-3 rounded-lg bg-neutral-900 text-white font-bold text-xs"
                          >
                            Submit Reply
                          </button>
                          <button
                            onClick={() => setReplyReviewId(null)}
                            className="py-1 px-3 text-neutral-500 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyReviewId(rev.id)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Reply to Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE OFFERING MODAL */}
      {showCreateOffering && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 animate-in fade-in">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Create Session Offering</h3>
            <form onSubmit={handleSaveOffering} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Session Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Distributed System Architecture Mock Interview"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Session Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="What will you cover in this session..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Session Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
                  >
                    <option value="ONE_ON_ONE">1-on-1 Mentorship</option>
                    <option value="GROUP">Group Masterclass</option>
                    <option value="CV_REVIEW">CV & Portfolio Review</option>
                    <option value="SKILL_LESSON">Skill Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Price (KES - 0 for Free)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
                  />
                </div>

                {newFormat === 'GROUP' && (
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Max Group Seats</label>
                    <input
                      type="number"
                      value={newMaxSeats}
                      onChange={(e) => setNewMaxSeats(e.target.value)}
                      className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateOffering(false)}
                  className="px-4 py-2 text-neutral-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold"
                >
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 animate-in fade-in">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Request M-PESA Payout</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Withdraw funds from completed sessions directly to your M-PESA phone number.
            </p>

            {payoutSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-neutral-900">Payout Request Queued</p>
                <p className="text-xs text-neutral-500">M-PESA funds will reflect in your account shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Amount to Withdraw (KES)</label>
                  <input
                    type="number"
                    required
                    max={earnings.netEarnings}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-bold text-neutral-900"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Available: KES {earnings.netEarnings.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">M-PESA Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={payoutPhone}
                    onChange={(e) => setPayoutPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-bold"
                  />
                </div>

                {payoutError && <p className="text-xs text-rose-600">{payoutError}</p>}

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 text-neutral-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                  >
                    Submit Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
