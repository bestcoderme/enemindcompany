/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './user';

export type ConversationType =
  | 'direct'
  | 'group'
  | 'support'
  | 'mentorship'
  | 'course'
  | 'order';

export type MessageType =
  | 'text'
  | 'image'
  | 'file'
  | 'system'
  | 'booking'
  | 'payment';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type RelatedEntityType =
  | 'mentorship_session'
  | 'course'
  | 'marketplace_order'
  | 'group'
  | 'support_ticket'
  | 'career_roadmap'
  | 'general';

export interface ChatParticipant {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  sizeBytes: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  messageType: MessageType;
  attachments?: MessageAttachment[];
  status: MessageStatus;
  createdAt: string; // ISO string
  editedAt?: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  participants: ChatParticipant[];
  relatedEntityType?: RelatedEntityType;
  relatedEntityId?: string;
  relatedEntityTitle?: string;
  lastMessageAt: string; // ISO string
  lastMessagePreview?: string;
  unreadCounts: Record<string, number>; // key is userId, value is unread count
  createdAt: string;
  updatedAt: string;
}
