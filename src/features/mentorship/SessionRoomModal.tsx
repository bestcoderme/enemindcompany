/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Booking, SessionReview } from '../../types/mentorship';
import { UserProfile } from '../../types/user';
import { BookingService } from '../../services/mentorship/bookingService';
import { ReviewService } from '../../services/mentorship/reviewService';
import { GoogleCalendarMeetService } from '../../services/mentorship/googleCalendarMeetService';
import {
  X,
  Video,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Star,
  Download,
  BookOpen,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface SessionRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  user: UserProfile;
  onOpenChat: (conversationId: string) => void;
  onReportIssue: (booking: Booking) => void;
  onBookingUpdated: (booking: Booking) => void;
}

export const SessionRoomModal: React.FC<SessionRoomModalProps> = ({
  isOpen,
  onClose,
  booking,
  user,
  onOpenChat,
  onReportIssue,
  onBookingUpdated,
}) => {
  const [currentBooking, setCurrentBooking] = useState<Booking>(booking);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Existing review
  const existingReview = ReviewService.getReviewsForBooking(currentBooking.id);

  // Time calculations
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [isLiveNow, setIsLiveNow] = useState(false);

  useEffect(() => {
    setCurrentBooking(booking);
  }, [booking]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const start = new Date(currentBooking.scheduledStart).getTime();
      const end = new Date(currentBooking.scheduledEnd).getTime();

      if (now >= start && now <= end) {
        setIsLiveNow(true);
        const minsLeft = Math.max(0, Math.floor((end - now) / (1000 * 60)));
        setTimeLeftStr(`Session is Live! (${minsLeft} mins remaining)`);
      } else if (now < start) {
        setIsLiveNow(false);
        const diffMs = start - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHours > 24) {
          const days = Math.floor(diffHours / 24);
          setTimeLeftStr(`Starts in ${days} day(s) ${diffHours % 24}h`);
        } else {
          setTimeLeftStr(`Starts in ${diffHours}h ${diffMins}m`);
        }
      } else {
        setIsLiveNow(false);
        setTimeLeftStr('Scheduled session time has passed');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [currentBooking]);

  if (!isOpen || !currentBooking) return null;

  const handleMarkComplete = () => {
    try {
      const updated = BookingService.completeBooking(currentBooking.id);
      setCurrentBooking(updated);
      onBookingUpdated(updated);
    } catch (err: any) {
      alert(err?.message || 'Could not update session status');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setIsSubmittingReview(true);

    try {
      ReviewService.submitReview({
        bookingId: currentBooking.id,
        studentId: user.email || 'student_current',
        studentName: user.name || 'Student',
        studentAvatar: user.avatarUrl,
        providerId: currentBooking.providerId,
        providerType: currentBooking.providerType,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to post review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isLiveNow
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : currentBooking.status === 'COMPLETED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {isLiveNow ? '● Live Session Active' : `Status: ${currentBooking.status}`}
              </span>
              <span className="text-xs text-neutral-400 font-medium">{timeLeftStr}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 font-heading">
              {currentBooking.sessionTitle}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Host: <span className="font-semibold text-neutral-800">{currentBooking.providerName}</span> (
              {currentBooking.providerType})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Call Room Banner */}
        <div className="p-5 rounded-3xl bg-neutral-900 text-white space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Google Meet Room</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Connect directly with audio/video, screen sharing, and interactive coding discussions.
              </p>
            </div>

            {currentBooking.meetingUrl ? (
              <a
                href={currentBooking.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                <span>Launch Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium">
                Google Meet link will appear once connected.
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>
                {new Date(currentBooking.scheduledStart).toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>
                {new Date(currentBooking.scheduledStart).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(currentBooking.scheduledEnd).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div>
              <span>Duration: {currentBooking.durationMinutes} mins</span>
            </div>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
          <button
            onClick={() => {
              if (currentBooking.conversationId) {
                onClose();
                onOpenChat(currentBooking.conversationId);
              }
            }}
            className="p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-neutral-600" />
            <span>Session Chat</span>
          </button>

          {currentBooking.status !== 'COMPLETED' ? (
            <button
              onClick={handleMarkComplete}
              className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mark Completed</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Completed</span>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              onReportIssue(currentBooking);
            }}
            className="p-2.5 rounded-2xl bg-rose-50/50 hover:bg-rose-100/50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer col-span-2 sm:col-span-1"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Report Dispute</span>
          </button>
        </div>

        {/* Session Materials */}
        {currentBooking.materials && currentBooking.materials.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 mb-4 space-y-2">
            <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shared Session Learning Materials</span>
            </h4>
            <div className="space-y-1.5">
              {currentBooking.materials.map((mat) => (
                <a
                  key={mat.id}
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs text-neutral-800 font-medium transition-colors"
                >
                  <span className="truncate">{mat.title}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Post-Session Review Section (When completed) */}
        {currentBooking.status === 'COMPLETED' && (
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Session Review & Student Feedback</span>
              </h4>
              {existingReview && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Review Submitted
                </span>
              )}
            </div>

            {existingReview || reviewSubmitted ? (
              <div className="p-3 rounded-xl bg-white border border-amber-100 text-xs text-neutral-700 space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (existingReview?.rating || reviewRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="italic">"{existingReview?.comment || reviewComment}"</p>
                {existingReview?.providerResponse && (
                  <div className="mt-2 p-2 rounded-lg bg-neutral-50 text-[11px]">
                    <span className="font-bold text-emerald-800 block">Provider Response:</span>
                    <span>{existingReview.providerResponse}</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600 font-semibold">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="What was most helpful about this session? Share feedback to help other students."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />

                {reviewError && <p className="text-xs text-rose-600">{reviewError}</p>}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="py-2 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
