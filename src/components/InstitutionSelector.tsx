import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Check, Building2, MapPin, X, ArrowRight } from 'lucide-react';
import { University } from '../types.ts';
import { INITIAL_UNIVERSITIES } from '../data/institutions.ts';

interface InstitutionSelectorProps {
  onSelectUniversity: (uni: University) => void;
  initialSelectedId?: string;
  userName: string;
}

export const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  onSelectUniversity,
  initialSelectedId,
  userName,
}) => {
  const [universities, setUniversities] = useState<University[]>(() => {
    try {
      const saved = localStorage.getItem('genz_custom_universities');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_UNIVERSITIES, ...parsed];
      }
    } catch {
      // fallback
    }
    return INITIAL_UNIVERSITIES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(() => {
    if (initialSelectedId) {
      return universities.find((u) => u.id === initialSelectedId) || null;
    }
    return null;
  });

  // Add custom university modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUniName, setNewUniName] = useState('');
  const [newUniShort, setNewUniShort] = useState('');
  const [newUniLocation, setNewUniLocation] = useState('');
  const [newUniCategory, setNewUniCategory] = useState<'University' | 'College' | 'Polytechnic' | 'Other'>('University');
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    return universities.filter((u) => {
      if (!u) return false;
      const matchesSearch =
        (u.name || '').toLowerCase().includes(q) ||
        (u.shortName || '').toLowerCase().includes(q) ||
        (u.location || '').toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q);
      const matchesCat = activeCategory === 'All' || u.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [universities, searchQuery, activeCategory]);

  const handleAddCustomUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniName.trim()) return;

    const customId = `custom-uni-${Date.now()}`;
    const newUni: University = {
      id: customId,
      name: newUniName.trim(),
      shortName: newUniShort.trim() || newUniName.trim().slice(0, 4).toUpperCase(),
      location: newUniLocation.trim() || 'Global Campus',
      category: newUniCategory,
      logoUrl:
        customLogoUrl.trim() ||
        `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80`,
    };

    const updated = [newUni, ...universities];
    setUniversities(updated);
    try {
      const customList = updated.filter((u) => u.id.startsWith('custom-uni-'));
      localStorage.setItem('genz_custom_universities', JSON.stringify(customList));
    } catch {
      // ignore
    }

    setSelectedUniversity(newUni);
    setIsAddModalOpen(false);
    setNewUniName('');
    setNewUniShort('');
    setNewUniLocation('');
    setCustomLogoUrl('');
  };

  const handleContinue = () => {
    if (selectedUniversity) {
      onSelectUniversity(selectedUniversity);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center pb-8">
      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="inline-block px-3 py-1 bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full mb-2">
          Step 1 of 2 • Campus Discovery
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-heading">
          Select Your Institution
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
          Welcome <span className="font-semibold text-neutral-800">{userName}</span>! Choose your campus to unlock past papers, lecture notes, and student communities.
        </p>
      </motion.div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col border border-neutral-100/80"
      >
        {/* Search Bar and Add Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="university-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, acronym, or city..."
              className="w-full pl-11 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add University Button */}
          <button
            type="button"
            id="open-add-uni-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-2xl transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campus</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {['All', 'University', 'College', 'Polytechnic', 'Other'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Universities */}
        <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2.5">
          {filteredUniversities.length === 0 ? (
            <div className="text-center py-10 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <Building2 className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-neutral-700">No institution found</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-4">
                Couldn&apos;t find &ldquo;{searchQuery}&rdquo;. Add it to the hub to get started.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewUniName(searchQuery);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add &ldquo;{searchQuery}&rdquo;</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredUniversities.map((uni) => {
                const isSelected = selectedUniversity?.id === uni.id;
                return (
                  <div
                    key={uni.id}
                    id={`uni-card-${uni.id}`}
                    onClick={() => setSelectedUniversity(uni)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900'
                        : 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200/80 text-neutral-800'
                    }`}
                  >
                    {/* Logo/Icon */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-white overflow-hidden shadow-xs border border-neutral-200 flex items-center justify-center">
                        <img
                          src={uni.logoUrl}
                          alt={uni.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Uni Details */}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">
                        {uni.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                        <MapPin className={`w-3 h-3 shrink-0 ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`} />
                        <span className={`truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {uni.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Selection Summary & Continue Button */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 text-center sm:text-left">
            {selectedUniversity ? (
              <span className="text-neutral-800 font-medium">
                Selected: <strong className="text-neutral-900">{selectedUniversity.name}</strong>
              </span>
            ) : (
              <span>Please select your campus to proceed</span>
            )}
          </div>

          <button
            type="button"
            id="continue-to-course-btn"
            onClick={handleContinue}
            disabled={!selectedUniversity}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedUniversity
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Next: Select Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Modal: Add Custom University */}
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
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-neutral-900"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <h3 className="text-xl font-bold font-heading text-neutral-900">Add Your Institution</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Can&apos;t find your campus? Add it now and be the pioneer for your university hub.
                </p>
              </div>

              <form onSubmit={handleAddCustomUniversity} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUniName}
                    onChange={(e) => setNewUniName(e.target.value)}
                    placeholder="e.g. Technical University of Munich"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Short Name / Acronym
                    </label>
                    <input
                      type="text"
                      value={newUniShort}
                      onChange={(e) => setNewUniShort(e.target.value)}
                      placeholder="e.g. TUM"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newUniCategory}
                      onChange={(e) =>
                        setNewUniCategory(
                          e.target.value as 'University' | 'College' | 'Polytechnic' | 'Other'
                        )
                      }
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                    >
                      <option value="University">University</option>
                      <option value="College">College</option>
                      <option value="Polytechnic">Polytechnic</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={newUniLocation}
                    onChange={(e) => setNewUniLocation(e.target.value)}
                    placeholder="e.g. Munich, Germany"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Save & Select
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
