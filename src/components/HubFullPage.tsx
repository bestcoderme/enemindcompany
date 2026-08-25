import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Plus,
  Download,
  MapPin,
  Star,
  GraduationCap,
  Send,
  X,
  Clock,
  Check,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_REVISION_NOTES,
  INITIAL_MY_SAVED_NOTES,
  INITIAL_ATTACHMENTS_AND_JOBS,
  INITIAL_LOCAL_LISTINGS,
  RevisionItem,
  AttachmentJobItem,
  LocalListingItem,
} from '../data/hubData.ts';

export type HubPageType =
  | 'all_notes'
  | 'my_notes'
  | 'attachments_and_jobs'
  | 'hostel'
  | 'hotels'
  | 'services'
  | 'entertainment'
  | 'health';

interface HubFullPageProps {
  pageType: HubPageType;
  onBack: () => void;
  userCourse?: string;
  userUniversityName?: string;
  userName?: string;
  logoUrl: string;
}

export const HubFullPage: React.FC<HubFullPageProps> = ({
  pageType,
  onBack,
  userCourse,
  userUniversityName,
  userName,
  logoUrl,
}) => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Persistence State
  const [revisionNotes, setRevisionNotes] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem('enemind_revision_notes');
    return saved ? JSON.parse(saved) : INITIAL_REVISION_NOTES;
  });

  const [myNotes, setMyNotes] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem('enemind_my_notes');
    return saved ? JSON.parse(saved) : INITIAL_MY_SAVED_NOTES;
  });

  const [attachmentsAndJobs, setAttachmentsAndJobs] = useState<AttachmentJobItem[]>(() => {
    const saved = localStorage.getItem('enemind_attachments_jobs');
    return saved ? JSON.parse(saved) : INITIAL_ATTACHMENTS_AND_JOBS;
  });

  const [localListings, setLocalListings] = useState<LocalListingItem[]>(() => {
    const saved = localStorage.getItem('findlocal_listings');
    return saved ? JSON.parse(saved) : INITIAL_LOCAL_LISTINGS;
  });

  // Action status states
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('enemind_applied_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [downloadedItems, setDownloadedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('enemind_downloaded_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<string | null>(null);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCourseOrCompany, setNewCourseOrCompany] = useState(userCourse || '');
  const [newType, setNewType] = useState('Note');
  const [newLocation, setNewLocation] = useState('');
  const [newStipend, setNewStipend] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('enemind_revision_notes', JSON.stringify(revisionNotes));
  }, [revisionNotes]);

  useEffect(() => {
    localStorage.setItem('enemind_my_notes', JSON.stringify(myNotes));
  }, [myNotes]);

  useEffect(() => {
    localStorage.setItem('enemind_attachments_jobs', JSON.stringify(attachmentsAndJobs));
  }, [attachmentsAndJobs]);

  useEffect(() => {
    localStorage.setItem('findlocal_listings', JSON.stringify(localListings));
  }, [localListings]);

  useEffect(() => {
    localStorage.setItem('enemind_applied_jobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem('enemind_downloaded_items', JSON.stringify(downloadedItems));
  }, [downloadedItems]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApply = (id: string, title: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs((prev) => [...prev, id]);
      showNotification(`Application submitted for "${title}". Good luck!`);
    }
  };

  const handleDownload = (id: string, title: string) => {
    if (!downloadedItems.includes(id)) {
      setDownloadedItems((prev) => [...prev, id]);
      showNotification(`"${title}" saved to your downloads.`);
    }
  };

  // Add Item Submission
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (pageType === 'all_notes' || pageType === 'my_notes') {
      const newItem: RevisionItem = {
        id: `rev-${Date.now()}`,
        title: newTitle.trim(),
        course: newCourseOrCompany.trim() || userCourse || 'General Study',
        year: '2024 Exam Series',
        type: (newType as 'Note' | 'Past Paper' | 'Summary') || 'Note',
        downloads: 1,
        author: userName || 'Gen-Z Scholar',
        size: '2.8 MB',
        image: logoUrl, // Strictly use logo as image for all notes
        description: newDescription.trim() || 'Comprehensive revision note and verified past paper resource.',
      };

      if (pageType === 'all_notes') {
        setRevisionNotes([newItem, ...revisionNotes]);
      } else {
        setMyNotes([newItem, ...myNotes]);
      }
      showNotification(`"${newItem.title}" added to notes successfully!`);
    } else if (pageType === 'attachments_and_jobs') {
      const newJob: AttachmentJobItem = {
        id: `job-${Date.now()}`,
        title: newTitle.trim(),
        company: newCourseOrCompany.trim() || 'Student Employer',
        type: (newType as 'Attachment' | 'Job' | 'Internship' | 'Part-time') || 'Attachment',
        location: newLocation.trim() || 'On-site / Campus',
        stipend: newStipend.trim() || 'Competitive Stipend',
        deadline: 'Open Intake',
        image:
          newImageUrl.trim() ||
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
        description: newDescription.trim() || 'Campus attachment and student work placement opportunity.',
      };
      setAttachmentsAndJobs([newJob, ...attachmentsAndJobs]);
      showNotification(`"${newJob.title}" posted successfully.`);
    } else {
      const newListing: LocalListingItem = {
        id: `loc-${Date.now()}`,
        name: newTitle.trim(),
        type:
          pageType === 'hostel'
            ? 'Hostel'
            : pageType === 'hotels'
            ? 'Hotel'
            : pageType === 'entertainment'
            ? 'Entertainment'
            : 'Health',
        distance: newLocation.trim() || 'Close to Campus',
        price: newStipend.trim() || 'Student Friendly',
        rating: 5.0,
        badge: newSubtitle.trim() || 'Verified by Students',
        image:
          newImageUrl.trim() ||
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
        gallery: [
          newImageUrl.trim() ||
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
        ],
        youtubeVideoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
        youtubeTitle: `${newTitle.trim()} Campus Facility Tour`,
        whatsappNumber: '254712345678',
        address: newDescription.trim() || 'Campus Environs',
        description: newDescription.trim() || 'Verified student amenity and campus accommodation.',
        amenities: ['24/7 Security', 'High-Speed Wi-Fi', 'Solar Backup', 'Study Area'],
        likesCount: 1,
        sharesCount: 0,
        reviewsCount: 1,
        contact: '+254 712 345 678',
        email: 'info@campushub.com',
      };
      setLocalListings([newListing, ...localListings]);
      showNotification(`"${newListing.name}" added to directory.`);
    }

    // Reset and close
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewLocation('');
    setNewStipend('');
    setIsAddModalOpen(false);
  };

  const getPageInfo = () => {
    switch (pageType) {
      case 'all_notes':
        return {
          badge: 'Academic Archives',
          title: 'All Revision Notes and Pastpapers',
          description: `Explore comprehensive revision notes, syllabus summaries, and solved past examination papers for ${userCourse || 'all courses'}.`,
          hubName: 'enemind hub',
          addBtnLabel: 'Add Note / Past Paper',
          filterOptions: ['all', 'Note', 'Past Paper', 'Summary'],
        };
      case 'my_notes':
        return {
          badge: 'Personal Library',
          title: 'My Revision Notes and Pastpaper',
          description: 'Your saved study summaries, bookmarks, and favorite past papers in one accessible hub.',
          hubName: 'enemind hub',
          addBtnLabel: 'Add to My Notes',
          filterOptions: ['all', 'Note', 'Past Paper', 'Summary'],
        };
      case 'attachments_and_jobs':
        return {
          badge: 'Careers & Opportunities',
          title: 'Attachments and Jobs',
          description: `Industrial attachments, student internships, campus jobs, and gig opportunities for ${userUniversityName || 'students'}.`,
          hubName: 'enemind hub',
          addBtnLabel: 'Post Attachment / Job',
          filterOptions: ['all', 'Attachment', 'Internship', 'Job', 'Part-time'],
        };
      case 'hostel':
        return {
          badge: 'Local Accommodations',
          title: 'Find Student Hostels',
          description: `Verified student hostels, halls of residence, and off-campus housing near ${userUniversityName || 'your university'}.`,
          hubName: 'findlocal',
          addBtnLabel: 'Add Hostel Listing',
          filterOptions: ['all', 'Hostel'],
        };
      case 'hotels':
        return {
          badge: 'Visitor Lodging',
          title: 'Find Hotels & Lodges',
          description: 'Comfortable hotels, guest houses, and short-stay apartments near campus for visitors and events.',
          hubName: 'findlocal',
          addBtnLabel: 'Add Hotel Listing',
          filterOptions: ['all', 'Hotel'],
        };
      case 'entertainment':
        return {
          badge: 'Campus Life & Hangouts',
          title: 'Entertainment & Fun',
          description: 'Gaming lounges, cinemas, cafes, and recreational hangout spots around campus.',
          hubName: 'findlocal',
          addBtnLabel: 'Add Spot',
          filterOptions: ['all', 'Entertainment'],
        };
      case 'health':
        return {
          badge: 'Wellness & Care',
          title: 'Health & Wellness',
          description: 'University clinics, verified student pharmacies, dental centers, and mental wellness clinics.',
          hubName: 'findlocal',
          addBtnLabel: 'Add Health Facility',
          filterOptions: ['all', 'Health'],
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center min-h-[85vh] pb-12">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 px-5 py-3 bg-neutral-900 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center gap-2.5 border border-neutral-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header / Navigation Bar */}
      <header className="w-full flex items-center justify-between py-3 px-5 bg-white rounded-3xl border border-neutral-100 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            id="back-to-dashboard-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hub</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <span className="px-2.5 py-0.5 bg-neutral-100 rounded-full font-semibold text-neutral-800">
              {pageInfo.hubName}
            </span>
            <span>/</span>
            <span className="text-neutral-700 font-medium">{pageInfo.badge}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right text-xs text-neutral-500">
            <span className="font-semibold text-neutral-900">{userUniversityName || 'Campus Hub'}</span>
            <span className="truncate max-w-[200px]">{userCourse || 'Major'}</span>
          </div>

          <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 bg-white flex items-center justify-center p-0.5 shadow-xs">
            <img
              src={logoUrl}
              alt="Hub Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content Container Card */}
      <main className="w-full bg-white rounded-3xl shadow-xl p-6 sm:p-9 relative overflow-hidden flex flex-col border border-neutral-100/90">
        
        {/* Top Spec Bar */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-full mb-2">
              {pageInfo.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">
              {pageInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              {pageInfo.description}
            </p>
          </div>

          {/* Add Action Button with Free badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
              100% Free Listing & Publishing
            </span>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              id="hub-add-item-btn"
              className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{pageInfo.addBtnLabel}</span>
            </button>
          </div>

        </div>

        {/* Search & Filter Matrix */}
        <div className="relative z-10 py-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="hub-global-search-input"
              placeholder={`Search ${(pageInfo?.title || 'hub').toLowerCase()}...`}
              className="w-full pl-11 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          {pageInfo.filterOptions.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {pageInfo.filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setActiveFilter(opt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === opt
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {opt === 'all' ? 'All' : opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: REVISION NOTES & PASTPAPERS (STRICTLY LOGO FOR ALL NOTES) */}
        {/* ========================================================================= */}
        {(pageType === 'all_notes' || pageType === 'my_notes') && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {(pageType === 'all_notes' ? revisionNotes : myNotes)
              .filter((item) => {
                if (!item) return false;
                const q = (searchTerm || '').toLowerCase();
                const matchesSearch =
                  (item.title || '').toLowerCase().includes(q) ||
                  (item.course || '').toLowerCase().includes(q) ||
                  (item.author || '').toLowerCase().includes(q) ||
                  ((item.description || '').toLowerCase().includes(q));
                const itemType = (item.type || '').toLowerCase();
                const filterVal = (activeFilter || 'all').toLowerCase();
                const matchesFilter =
                  filterVal === 'all' || itemType === filterVal;
                return matchesSearch && matchesFilter;
              })
              .map((item) => {
                const isDownloaded = downloadedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                  >
                    <div>
                      {/* Logo Image Box (Logo strictly used for all notes) */}
                      <div className="flex items-start gap-4 mb-3.5">
                        <div className="w-16 h-16 shrink-0 rounded-2xl border border-neutral-200 bg-white flex flex-col items-center justify-center p-1.5 relative shadow-xs">
                          <img
                            src={logoUrl}
                            alt="Gen-Z Hub Logo"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title, Year, Course Metadata */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-semibold text-[10px]">
                              {item.type}
                            </span>
                            <span>•</span>
                            <span>{item.year}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug group-hover:text-black line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                            <GraduationCap className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{item.course}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-neutral-600 mb-3 bg-white p-2.5 rounded-xl border border-neutral-100 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Footer & Download Trigger */}
                    <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between gap-2 text-xs">
                      <div className="text-neutral-500">
                        <span>By {item.author}</span>
                        <span className="mx-1">•</span>
                        <span>{item.downloads + (isDownloaded ? 1 : 0)} downloads</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownload(item.id, item.title)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isDownloaded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs'
                        }`}
                      >
                        {isDownloaded ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Downloaded
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ATTACHMENTS AND JOBS */}
        {/* ========================================================================= */}
        {pageType === 'attachments_and_jobs' && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {attachmentsAndJobs
              .filter((job) => {
                if (!job) return false;
                const q = (searchTerm || '').toLowerCase();
                const matchesSearch =
                  (job.title || '').toLowerCase().includes(q) ||
                  (job.company || '').toLowerCase().includes(q) ||
                  (job.location || '').toLowerCase().includes(q) ||
                  ((job.description || '').toLowerCase().includes(q));
                const jobType = (job.type || '').toLowerCase();
                const filterVal = (activeFilter || 'all').toLowerCase();
                const matchesFilter =
                  filterVal === 'all' || jobType === filterVal;
                return matchesSearch && matchesFilter;
              })
              .map((job) => {
                const hasApplied = appliedJobs.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-16 h-16 shrink-0 rounded-2xl border border-neutral-200 bg-neutral-100 overflow-hidden relative shadow-xs">
                          <img
                            src={job.image}
                            alt={job.company}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2.5 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-semibold rounded-full">
                              {job.type}
                            </span>
                            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                              {job.stipend}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-tight group-hover:text-black line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 mb-2 leading-relaxed bg-white p-2.5 rounded-xl border border-neutral-100">
                        {job.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Verified Student Opportunity
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApply(job.id, job.title)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          hasApplied
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs'
                        }`}
                      >
                        {hasApplied ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Applied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5" />
                            Apply Now
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: FINDLOCAL (HOSTELS, HOTELS, ENTERTAINMENT, HEALTH) */}
        {/* ========================================================================= */}
        {(pageType === 'hostel' ||
          pageType === 'hotels' ||
          pageType === 'entertainment' ||
          pageType === 'health') && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {localListings
              .filter((loc) => {
                if (!loc) return false;
                const targetType =
                  pageType === 'hostel'
                    ? 'Hostel'
                    : pageType === 'hotels'
                    ? 'Hotel'
                    : pageType === 'entertainment'
                    ? 'Entertainment'
                    : 'Health';
                const matchesType = (loc.type || '').toLowerCase() === targetType.toLowerCase();
                const q = (searchTerm || '').toLowerCase();
                const matchesSearch =
                  (loc.name || '').toLowerCase().includes(q) ||
                  (loc.address || '').toLowerCase().includes(q) ||
                  (loc.badge || '').toLowerCase().includes(q);
                return matchesType && matchesSearch;
              })
              .map((loc) => (
                <div
                  key={loc.id}
                  className="p-4 bg-neutral-50/70 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Visual Image */}
                    <div className="w-full h-44 rounded-xl overflow-hidden relative mb-3 bg-neutral-100">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-semibold rounded-full">
                        {loc.badge}
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-white rounded-full text-neutral-900 text-xs font-bold flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{loc.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-neutral-900 leading-snug group-hover:text-black">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{loc.distance} • {loc.address}</span>
                    </p>
                  </div>

                  {/* Price & Contact */}
                  <div className="pt-3 mt-3 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                      {loc.price}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        showNotification(`Contacting ${loc.name}: ${loc.contact || 'Campus hotline'}`)
                      }
                      className="px-3.5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact / Book</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ADD ITEM MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-neutral-900 border border-neutral-100"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-full mb-1.5">
                  {pageInfo.badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900">
                  {pageInfo.addBtnLabel}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {pageType === 'all_notes' || pageType === 'my_notes'
                    ? 'Upload revision material to share with classmates. The hub logo will identify it.'
                    : 'Publish verified student openings or local listings.'}
                </p>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Title / Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Calculus II Past Exams and Solutions"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Course / Company
                    </label>
                    <input
                      type="text"
                      value={newCourseOrCompany}
                      onChange={(e) => setNewCourseOrCompany(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                    >
                      {pageType === 'attachments_and_jobs' ? (
                        <>
                          <option value="Attachment">Attachment</option>
                          <option value="Internship">Internship</option>
                          <option value="Job">Full/Part Job</option>
                          <option value="Part-time">Part-time Gig</option>
                        </>
                      ) : (
                        <>
                          <option value="Note">Revision Note</option>
                          <option value="Past Paper">Past Paper</option>
                          <option value="Summary">Summary</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {pageType === 'attachments_and_jobs' ? 'Stipend' : 'Price / Tag'}
                    </label>
                    <input
                      type="text"
                      value={newStipend}
                      onChange={(e) => setNewStipend(e.target.value)}
                      placeholder="e.g. Free or $400/mo"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Location / Distance
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Main Campus / Remote"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                    />
                  </div>
                </div>

                {pageType !== 'all_notes' && pageType !== 'my_notes' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Description / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide overview details, syllabus covered, or instructions..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-xl shadow-md transition-colors"
                  >
                    Save & Add
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
