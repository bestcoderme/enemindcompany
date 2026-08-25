/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningNote, NoteType } from '../../types/learning';
import { INITIAL_USER_NOTES } from './learningData';
import { docsService } from '../google/docsService';
import { driveService } from '../google/driveService';

const STORAGE_KEY_NOTES = 'enemind_learning_notes';

class NotesService {
  private notes: LearningNote[] = [];

  constructor() {
    this.loadNotes();
  }

  private loadNotes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTES);
      this.notes = stored ? JSON.parse(stored) : INITIAL_USER_NOTES;
    } catch {
      this.notes = INITIAL_USER_NOTES;
    }
  }

  private saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(this.notes));
    } catch (e) {
      console.warn('Failed to save notes to storage:', e);
    }
  }

  public getNotes(
    ownerId: string = 'usr_default',
    filters?: {
      search?: string;
      noteType?: NoteType | 'ALL';
      subject?: string;
      courseId?: string;
      tag?: string;
      onlyFavorites?: boolean;
      includeArchived?: boolean;
    }
  ): LearningNote[] {
    let list = this.notes.filter((n) => n.ownerId === ownerId || n.visibility === 'PUBLIC');

    if (!filters?.includeArchived) {
      list = list.filter((n) => !n.isArchived);
    }

    if (!filters) return list;

    if (filters.onlyFavorites) {
      list = list.filter((n) => n.isFavorite);
    }

    if (filters.noteType && filters.noteType !== 'ALL') {
      list = list.filter((n) => n.noteType === filters.noteType);
    }

    if (filters.subject && filters.subject !== 'All') {
      list = list.filter((n) => n.subject?.toLowerCase() === filters.subject!.toLowerCase());
    }

    if (filters.courseId) {
      list = list.filter((n) => n.courseId === filters.courseId);
    }

    if (filters.tag) {
      const tagLower = filters.tag.toLowerCase();
      list = list.filter((n) => n.tags.some((t) => t.toLowerCase() === tagLower));
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.subject && n.subject.toLowerCase().includes(q)) ||
          (n.courseTitle && n.courseTitle.toLowerCase().includes(q)) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getNoteById(id: string): LearningNote | undefined {
    return this.notes.find((n) => n.id === id);
  }

  public async createNote(params: {
    ownerId: string;
    title: string;
    content: string;
    noteType: NoteType;
    subject?: string;
    courseId?: string;
    courseTitle?: string;
    lessonId?: string;
    lessonTitle?: string;
    tags: string[];
    createAsGoogleDoc?: boolean;
    visibility?: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  }): Promise<LearningNote> {
    let googleDocId: string | undefined;
    let googleDocUrl: string | undefined;
    let googleDriveFileId: string | undefined;

    if (params.createAsGoogleDoc) {
      try {
        const doc = await docsService.createDocument(
          params.title.trim() || 'Untitled Academic Note'
        );
        googleDocId = doc.documentId;
        googleDocUrl = doc.documentUrl;
        googleDriveFileId = doc.documentId;

        // Ensure tracked in Drive /Enemind/Notes
        await driveService.uploadDocument(
          `${params.title.trim() || 'Academic Note'}.gdoc`,
          'application/vnd.google-apps.document',
          'Notes',
          undefined,
          true
        );
      } catch (err) {
        console.warn('Google Doc creation fallback to local markdown note:', err);
      }
    }

    const newNote: LearningNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ownerId: params.ownerId,
      title: params.title.trim() || 'Untitled Note',
      content: params.content,
      noteType: params.noteType,
      subject: params.subject,
      courseId: params.courseId,
      courseTitle: params.courseTitle,
      lessonId: params.lessonId,
      lessonTitle: params.lessonTitle,
      tags: params.tags.map((t) => t.trim()).filter(Boolean),
      googleDocId,
      googleDocUrl,
      googleDriveFileId,
      visibility: params.visibility || 'PRIVATE',
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.unshift(newNote);
    this.saveNotes();
    return newNote;
  }

  public updateNote(
    noteId: string,
    updates: Partial<Omit<LearningNote, 'id' | 'ownerId' | 'createdAt'>>
  ): LearningNote {
    const note = this.getNoteById(noteId);
    if (!note) throw new Error('Note not found.');

    Object.assign(note, updates, { updatedAt: new Date().toISOString() });
    this.saveNotes();
    return note;
  }

  public deleteNote(noteId: string): boolean {
    const idx = this.notes.findIndex((n) => n.id === noteId);
    if (idx === -1) return false;
    this.notes.splice(idx, 1);
    this.saveNotes();
    return true;
  }

  public toggleFavorite(noteId: string): boolean {
    const note = this.getNoteById(noteId);
    if (!note) return false;
    note.isFavorite = !note.isFavorite;
    note.updatedAt = new Date().toISOString();
    this.saveNotes();
    return note.isFavorite;
  }

  public toggleArchive(noteId: string): boolean {
    const note = this.getNoteById(noteId);
    if (!note) return false;
    note.isArchived = !note.isArchived;
    note.updatedAt = new Date().toISOString();
    this.saveNotes();
    return note.isArchived;
  }

  public getAllTags(): string[] {
    const tagSet = new Set<string>();
    this.notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }

  public getAllSubjects(): string[] {
    const subSet = new Set<string>();
    this.notes.forEach((n) => {
      if (n.subject) subSet.add(n.subject);
    });
    return Array.from(subSet);
  }
}

export const notesService = new NotesService();
