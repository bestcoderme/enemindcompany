/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SessionReview, ProviderType } from '../../types/mentorship';

const REVIEWS_STORAGE_KEY = 'enemind_mentorship_reviews_v1';

export const INITIAL_REVIEWS: SessionReview[] = [
  {
    id: 'rev_1',
    bookingId: 'book_initial_1',
    studentId: 'stud_alex_01',
    studentName: 'Alex Mwangi',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    providerId: 'mentor_dr_jane',
    providerType: 'MENTOR',
    rating: 5,
    comment: 'Dr. Jane did an incredible breakdown of my backend microservices architecture. She highlighted critical indexing and caching patterns that improved my project performance immensely!',
    providerResponse: 'Thank you Alex! Your project architecture is already high standard. Keep shipping clean code!',
    responseDate: '2026-08-20T14:00:00Z',
    createdAt: '2026-08-19T16:30:00Z',
  },
  {
    id: 'rev_2',
    bookingId: 'book_initial_2',
    studentId: 'stud_grace_02',
    studentName: 'Grace Wangari',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    providerId: 'mentor_faith_chebet',
    providerType: 'MENTOR',
    rating: 5,
    comment: 'Faith took me step-by-step through my UX portfolio case study. Her feedback on user flow clarity helped me ace my design internship interview.',
    createdAt: '2026-08-22T10:15:00Z',
  },
  {
    id: 'rev_3',
    bookingId: 'book_initial_3',
    studentId: 'stud_emmanuel_03',
    studentName: 'Emmanuel Kiprop',
    studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    providerId: 'teacher_prof_mwangi',
    providerType: 'TEACHER',
    rating: 5,
    comment: 'Clear explanation of SQL window functions and database indexing strategies. The practical assignments were super helpful.',
    createdAt: '2026-08-23T11:00:00Z',
  },
];

export class ReviewService {
  private static initStorage(): void {
    if (!localStorage.getItem(REVIEWS_STORAGE_KEY)) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
    }
  }

  public static getAllReviews(): SessionReview[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  public static getReviewsForProvider(providerId: string): SessionReview[] {
    const all = this.getAllReviews();
    return all.filter((r) => r.providerId === providerId);
  }

  public static getReviewsForBooking(bookingId: string): SessionReview | undefined {
    const all = this.getAllReviews();
    return all.find((r) => r.bookingId === bookingId);
  }

  public static canReviewBooking(bookingId: string, bookingStatus: string): boolean {
    if (bookingStatus !== 'COMPLETED') {
      return false;
    }
    const existing = this.getReviewsForBooking(bookingId);
    return !existing;
  }

  public static submitReview(params: {
    bookingId: string;
    studentId: string;
    studentName: string;
    studentAvatar?: string;
    providerId: string;
    providerType: ProviderType;
    rating: number;
    comment: string;
  }): SessionReview {
    this.initStorage();
    const existing = this.getReviewsForBooking(params.bookingId);
    if (existing) {
      throw new Error('A review has already been submitted for this session.');
    }

    if (params.rating < 1 || params.rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }

    if (!params.comment.trim()) {
      throw new Error('Please provide written feedback for the mentor/teacher.');
    }

    const newReview: SessionReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingId: params.bookingId,
      studentId: params.studentId,
      studentName: params.studentName,
      studentAvatar: params.studentAvatar,
      providerId: params.providerId,
      providerType: params.providerType,
      rating: Math.min(5, Math.max(1, params.rating)),
      comment: params.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const all = this.getAllReviews();
    all.unshift(newReview);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));

    return newReview;
  }

  public static replyToReview(
    reviewId: string,
    providerResponse: string,
    providerId: string
  ): SessionReview {
    this.initStorage();
    const all = this.getAllReviews();
    const idx = all.findIndex((r) => r.id === reviewId);
    if (idx === -1) {
      throw new Error('Review not found');
    }

    if (all[idx].providerId !== providerId) {
      throw new Error('Unauthorized: You can only reply to reviews on your own profile.');
    }

    all[idx].providerResponse = providerResponse.trim();
    all[idx].responseDate = new Date().toISOString();

    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  public static calculateProviderRating(providerId: string): {
    averageRating: number;
    reviewCount: number;
  } {
    const reviews = this.getReviewsForProvider(providerId);
    if (reviews.length === 0) {
      return { averageRating: 5.0, reviewCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    return {
      averageRating: avg,
      reviewCount: reviews.length,
    };
  }
}
