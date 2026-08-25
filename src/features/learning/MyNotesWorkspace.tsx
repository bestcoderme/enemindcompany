/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Star,
  Archive,
  Trash2,
  ExternalLink,
  Edit3,
  Tag,
  BookOpen,
  FolderLock,
  Lock,
  Sparkles,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import { LearningNote, NoteType } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { notesService } from '../../services/learning/notesService';

interface MyNotesWorkspaceProps {
  user: UserProfile | null;
  initialCourseId?: string;
  initialLessonId?: string;
  initialLessonTitle?: string;
  initialCourseTitle?: string;
  onOpenCloudSettings: () => void;
}

const NOTE_TYPES: NoteType[] = [
  'STUDY',
  'LECTURE',
  'REVISION',
  'RESEARCH',
  'PROJECT',
  'CAREER',
  'MEETING',
  'MENTORSHIP',
  'TEXT',
];

export const MyNotesWorkspace: React.FC<MyNotesWorkspaceProps> = ({
  user,
  initialCourseId,
  initialLessonId,
  initialLessonTitle,
  initialCourseTitle,
  onOpenCloudSettings,
}) => {
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<LearningNote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState<NoteType>('STUDY');
  const [formSubject, setFormSubject] = useState('');
  const [formTags, setFormTags] = useState('');
  const [createAsGoogleDoc, setCreateAsGoogleDoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [selectedType, selectedSubject, onlyFavorites]);

  useEffect(() => {
    if (initialLessonTitle || initialCourseTitle) {
      setFormTitle(`${initialCourseTitle || 'Course'} - ${initialLessonTitle || 'Lesson Notes'}`);
      setFormType('LECTURE');
      setIsCreatingModalOpen(true);
    }
  }, [initialLessonTitle, initialCourseTitle]);

  const loadNotes = () => {
    const list = notesService.getNotes(user?.id || 'usr_default', {
      noteType: selectedType === 'ALL' ? undefined : (selectedType as NoteType),
      subject: selectedSubject === 'All' ? undefined : selectedSubject,
      onlyFavorites: onlyFavorites || undefined,
    });
    setNotes(list);
    if (!selectedNote && list.length > 0) {
      setSelectedNote(list[0]);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await notesService.createNote({
        ownerId: user?.id || 'usr_default',
        title: formTitle.trim(),
        content: formContent,
        noteType: formType,
        subject: formSubject.trim() || undefined,
        courseId: initialCourseId,
        courseTitle: initialCourseTitle,
        lessonId: initialLessonId,
        lessonTitle: initialLessonTitle,
        tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
        createAsGoogleDoc,
      });

      setIsCreatingModalOpen(false);
      setFormTitle('');
      setFormContent('');
      setFormTags('');
      setFormSubject('');
      setCreateAsGoogleDoc(false);
      loadNotes();
      setSelectedNote(created);

      if (created.googleDocUrl) {
        window.open(created.googleDocUrl, '_blank');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    const updated = notesService.updateNote(selectedNote.id, {
      title: formTitle,
      content: formContent,
      noteType: formType,
      subject: formSubject || undefined,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setSelectedNote(updated);
    setIsEditing(false);
    loadNotes();
  };

  const handleToggleFavorite = (noteId: string) => {
    notesService.toggleFavorite(noteId);
    loadNotes();
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, isFavorite: !selectedNote.isFavorite });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Delete this note?')) {
      notesService.deleteNote(noteId);
      loadNotes();
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.subject && n.subject.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const subjects = notesService.getAllSubjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Personal Study & Lecture Notes
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Google Docs Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Organize revision summaries, lecture markdown notes, and collaborative Google Docs in your Drive locker.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormTitle('');
              setFormContent('');
              setFormTags('');
              setFormSubject('');
              setIsCreatingModalOpen(true);
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes by keyword, topic, formula, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Note Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-white rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 focus:outline-hidden"
        >
          <option value="ALL">All Note Types</option>
          {NOTE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t} Notes
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-white rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 focus:outline-hidden"
          >
            <option value="All">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            onlyFavorites
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Starred</span>
        </button>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Column: Notes List (5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-3 space-y-2 max-h-[680px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p>No notes found matching your filter.</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {note.noteType}
                      </span>

                      <div className="flex items-center gap-1">
                        {note.googleDocUrl && (
                          <span
                            className={`p-1 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                              isSelected ? 'text-blue-300' : 'text-blue-600'
                            }`}
                            title="Google Doc Connected"
                          >
                            <FileText className="w-3 h-3" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(note.id);
                          }}
                          className={`p-1 rounded cursor-pointer ${
                            note.isFavorite
                              ? 'text-amber-400'
                              : isSelected
                              ? 'text-neutral-500 hover:text-white'
                              : 'text-neutral-400 hover:text-amber-500'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-1">
                      {note.title}
                    </h3>

                    <p
                      className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {note.content.replace(/[#*`$]/g, '')}
                    </p>
                  </div>

                  <div
                    className={`pt-2 border-t text-[10px] flex items-center justify-between ${
                      isSelected ? 'border-white/10 text-neutral-400' : 'border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <span>{note.subject || 'General'}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Note Detail / Editor (7 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col justify-between">
          {selectedNote ? (
            isEditing ? (
              /* Edit Mode */
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-900">Edit Note</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Note Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as NoteType)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden bg-white"
                    >
                      {NOTE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Content (Markdown Supported)</label>
                  <textarea
                    rows={12}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full p-3.5 text-xs font-mono rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500 flex-1 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Note Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                        {selectedNote.noteType}
                      </span>
                      {selectedNote.subject && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                          {selectedNote.subject}
                        </span>
                      )}
                      {selectedNote.courseTitle && (
                        <span className="text-xs text-neutral-400 font-medium">
                          From {selectedNote.courseTitle}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
                      {selectedNote.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedNote.googleDocUrl && (
                      <a
                        href={selectedNote.googleDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open in Docs</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setFormTitle(selectedNote.title);
                        setFormContent(selectedNote.content);
                        setFormType(selectedNote.noteType);
                        setFormSubject(selectedNote.subject || '');
                        setFormTags(selectedNote.tags.join(', '));
                        setIsEditing(true);
                      }}
                      className="p-2 text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 bg-neutral-100 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNote.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Markdown Note Text Content */}
                <div className="bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200 text-xs text-neutral-800 font-sans leading-relaxed whitespace-pre-wrap flex-1 max-h-[500px] overflow-y-auto">
                  {selectedNote.content}
                </div>

                <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Created {new Date(selectedNote.createdAt).toLocaleString()}</span>
                  <span>Last modified {new Date(selectedNote.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-24 text-neutral-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-bold text-neutral-700">No Note Selected</p>
              <p className="text-xs text-neutral-500 mt-1">
                Choose a note from the left sidebar or click "+ New Note" to create one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">
              Create New Academic Note
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Write local revision notes or create an authorized Google Doc in your Drive locker.
            </p>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Exam Summary"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Note Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as NoteType)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden bg-white"
                  >
                    {NOTE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Subject / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 311"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Math, FinalExam, Raft, CheatSheet"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Note Content</label>
                <textarea
                  rows={6}
                  placeholder="Type your notes, formulas, or draft here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 text-xs font-mono rounded-xl border border-neutral-300 focus:outline-hidden"
                />
              </div>

              {/* Google Doc Option */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-950">Create as Google Doc</p>
                    <p className="text-[11px] text-blue-800">Auto-saved to your Drive /Enemind/Notes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={createAsGoogleDoc}
                  onChange={(e) => setCreateAsGoogleDoc(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
