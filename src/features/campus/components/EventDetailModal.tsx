/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  Sparkles,
  Share2,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { CampusEvent } from '../../../types/business';
import { businessService } from '../../../services/campus/businessService';
import { calendarService } from '../../../services/google/calendarService';
import { UserProfile } from '../../../types/user';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CampusEvent;
  user: UserProfile | null;
  onEventUpdated?: (updated: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  user,
  onEventUpdated,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCalendarSynced, setIsCalendarSynced] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const updated = businessService.registerForEvent(event.id);
      if (updated && onEventUpdated) onEventUpdated(updated);

      // Add to Google Calendar
      try {
        await calendarService.createEvent({
          summary: `Campus Event: ${event.title}`,
          description: `${event.description}\nVenue: ${event.venue}\nOrganizer: ${event.organizerName}`,
          location: event.venue,
          startTime: event.startDate,
          endTime: event.endDate || event.startDate,
          createMeetLink: false,
          attendeeEmails: [user?.email || 'student@enemind.org'],
          eventType: 'general',
        });
        setIsCalendarSynced(true);
      } catch (e) {
        console.warn('Calendar sync error:', e);
      }

      setIsRegistered(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegistering(false);
    }
  };

  const progress = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Cover */}
        <div className="relative h-48 bg-neutral-900 shrink-0">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500 text-neutral-950">
                {event.category}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs">
                {event.campus}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading leading-tight">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-500 block">Date & Time</span>
                <span className="font-bold text-neutral-900">
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-500 block">Campus Venue</span>
                <span className="font-bold text-neutral-900 truncate block max-w-[160px]">
                  {event.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-500 block">Organizer</span>
                <span className="font-bold text-neutral-900 truncate block max-w-[160px]">
                  {event.organizerName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-500 block">Ticket Price</span>
                <span className="font-black text-neutral-900">
                  {event.isFree ? 'Free Admission' : `KSh ${event.price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-600 font-medium">Attendee Registration</span>
              <span className="font-bold text-neutral-900">
                {event.registeredCount} / {event.capacity} Registered ({progress}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-neutral-900 font-heading mb-1.5">About This Campus Event</h4>
            <p className="text-neutral-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {isRegistered && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are registered for this event!</span>
              </div>
              <p className="text-xs text-emerald-800">
                {isCalendarSynced && '✓ Event automatically synced to your Google Calendar.'} Present your Enemind student profile or name at the entrance.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs">
            <span className="text-neutral-500 block">Admission Fee:</span>
            <span className="text-base font-black text-neutral-900">
              {event.isFree ? 'FREE' : `KSh ${event.price}`}
            </span>
          </div>

          <button
            onClick={handleRegister}
            disabled={isRegistering || isRegistered}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Ticket className="w-4 h-4" />
            <span>
              {isRegistered
                ? 'Registered'
                : isRegistering
                ? 'Registering...'
                : event.isFree
                ? 'Register Free & Sync Calendar'
                : `Pay KSh ${event.price} & Register`}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
