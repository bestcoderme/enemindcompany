import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  FileText,
  Download,
  CheckCircle,
  ExternalLink,
  MapPin,
  Star,
  Building,
  Briefcase,
  Paperclip,
  GraduationCap,
  Calendar,
  Send,
} from 'lucide-react';
import {
  SAMPLE_REVISION_NOTES,
  MY_SAVED_NOTES,
  ATTACHMENTS_AND_JOBS,
  LOCAL_LISTINGS,
  RevisionItem,
  AttachmentJobItem,
  LocalListingItem,
} from '../data/hubData.ts';

export type HubViewType =
  | 'all_notes'
  | 'my_notes'
  | 'attachments'
  | 'jobs'
  | 'hostel'
  | 'hotels'
  | 'entertainment'
  | 'health';

interface HubDetailModalProps {
  viewType: HubViewType | null;
  onClose: () => void;
  userCourse?: string;
  userUniversityName?: string;
}

export const HubDetailModal: React.FC<HubDetailModalProps> = ({
  viewType,
  onClose,
  userCourse,
  userUniversityName,
}) => {
  const [search, setSearch] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [downloadedItems, setDownloadedItems] = useState<string[]>([]);

  if (!viewType) return null;

  const handleApply = (id: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  const handleDownload = (id: string) => {
    if (!downloadedItems.includes(id)) {
      setDownloadedItems([...downloadedItems, id]);
    }
  };

  const getTitleAndSubtitle = () => {
    switch (viewType) {
      case 'all_notes':
        return {
          title: 'All Revision Notes & Pastpapers',
          subtitle: `Verified study guides, summary notes, and past examination papers for ${userCourse || 'all departments'}.`,
          hub: 'enemind hub',
        };
      case 'my_notes':
        return {
          title: 'My Revision Notes & Pastpapers',
          subtitle: 'Your personal collection of uploaded notes, bookmarked past papers, and study annotations.',
          hub: 'enemind hub',
        };
      case 'attachments':
        return {
          title: 'Student Attachments & SIWES',
          subtitle: `Industrial attachment slots, student traineeships, and practical internship credits near ${userUniversityName || 'campus'}.`,
          hub: 'enemind hub',
        };
      case 'jobs':
        return {
          title: 'Campus Gigs & Graduate Jobs',
          subtitle: 'Verified student jobs, part-time shifts, campus ambassador gigs, and entry-level positions.',
          hub: 'enemind hub',
        };
      case 'hostel':
        return {
          title: 'Find Student Hostels',
          subtitle: `Verified off-campus residences, self-contained rooms, and shared apartments near ${userUniversityName || 'your institution'}.`,
          hub: 'findlocal',
        };
      case 'hotels':
        return {
          title: 'Find Hotels & Guest Lodges',
          subtitle: 'Comfortable hotels, guest suites, and lodges for visiting parents, convocations, and weekend stays.',
          hub: 'findlocal',
        };
      case 'entertainment':
        return {
          title: 'Entertainment & Student Hangouts',
          subtitle: 'Top-rated gaming lounges, cinema nights, sports hubs, cafes, and recreation centers around campus.',
          hub: 'findlocal',
        };
      case 'health':
        return {
          title: 'Health, Clinics & Wellness',
          subtitle: '24/7 campus health centers, nearby certified pharmacies, wellness support, and student counseling.',
          hub: 'findlocal',
        };
    }
  };

  const { title, subtitle, hub } = getTitleAndSubtitle();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 text-gray-900 flex flex-col max-h-[85vh]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>{hub}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg">
              {subtitle}
            </p>
          </div>

          {/* Search bar within modal */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, keyword, or course..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Dynamic Content List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {/* 1. All Revision Notes or My Revision Notes */}
            {(viewType === 'all_notes' || viewType === 'my_notes') && (
              <>
                {(viewType === 'all_notes' ? SAMPLE_REVISION_NOTES : MY_SAVED_NOTES)
                  .filter((item) => {
                    if (!item) return false;
                    const q = (search || '').toLowerCase();
                    return (
                      (item.title || '').toLowerCase().includes(q) ||
                      (item.course || '').toLowerCase().includes(q)
                    );
                  })
                  .map((item) => {
                    const isDownloaded = downloadedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 shrink-0 mt-0.5 shadow-2xs">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-gray-200/80 text-gray-700 text-[10px] font-bold">
                                {item.type}
                              </span>
                              <span className="text-[11px] text-gray-400 font-medium">{item.year}</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 mt-0.5 truncate">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.course} • {item.author} • {item.size}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(item.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                            isDownloaded
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-black text-white hover:opacity-90'
                          }`}
                        >
                          {isDownloaded ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Downloaded</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </>
            )}

            {/* 2. Attachments & Jobs */}
            {(viewType === 'attachments' || viewType === 'jobs') && (
              <>
                {ATTACHMENTS_AND_JOBS.filter((job) => {
                  if (!job) return false;
                  const matchesType =
                    viewType === 'attachments'
                      ? job.type === 'Attachment' || job.type === 'Internship'
                      : job.type === 'Job' || job.type === 'Part-time';
                  const q = (search || '').toLowerCase();
                  const matchesSearch =
                    (job.title || '').toLowerCase().includes(q) ||
                    (job.company || '').toLowerCase().includes(q) ||
                    (job.location || '').toLowerCase().includes(q);
                  return matchesType && matchesSearch;
                }).map((job) => {
                  const hasApplied = appliedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 shrink-0 mt-0.5 shadow-2xs">
                          {job.type === 'Attachment' ? (
                            <Paperclip className="w-5 h-5" />
                          ) : (
                            <Briefcase className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold">
                              {job.type}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-bold">{job.stipend}</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 mt-0.5 truncate">{job.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {job.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(job.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                          hasApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-black text-white hover:opacity-90'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Quick Apply</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {/* 3. Find Local (Hostels, Hotels, Entertainment, Health) */}
            {(viewType === 'hostel' ||
              viewType === 'hotels' ||
              viewType === 'entertainment' ||
              viewType === 'health') && (
              <>
                {LOCAL_LISTINGS.filter((loc) => {
                  if (!loc) return false;
                  const targetType =
                    viewType === 'hostel'
                      ? 'Hostel'
                      : viewType === 'hotels'
                      ? 'Hotel'
                      : viewType === 'entertainment'
                      ? 'Entertainment'
                      : 'Health';
                  const matchesType = loc.type === targetType;
                  const q = (search || '').toLowerCase();
                  const matchesSearch =
                    (loc.name || '').toLowerCase().includes(q) ||
                    (loc.address || '').toLowerCase().includes(q) ||
                    (loc.badge || '').toLowerCase().includes(q);
                  return matchesType && matchesSearch;
                }).map((loc) => (
                  <div
                    key={loc.id}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                        <img
                          src={loc.image}
                          alt={loc.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-800 text-[10px] font-bold">
                            {loc.badge}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {loc.rating}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mt-0.5 truncate">{loc.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{loc.distance} • {loc.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                      <span className="text-xs font-bold text-gray-900">{loc.price}</span>
                      <button
                        type="button"
                        onClick={() => alert(`Connecting to ${loc.name}...`)}
                        className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
