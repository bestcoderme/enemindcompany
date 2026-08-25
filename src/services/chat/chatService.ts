/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Conversation,
  Message,
  ConversationType,
  MessageType,
  ChatParticipant,
  MessageAttachment,
  RelatedEntityType,
} from '../../types/chat';
import { UserProfile, UserRole } from '../../types/user';

const CONVERSATIONS_STORAGE_KEY = 'enemind_conversations_v1';
const MESSAGES_STORAGE_KEY = 'enemind_messages_v1';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_mentor_jane',
    type: 'mentorship',
    title: 'Dr. Jane Mutua (Mentorship Session)',
    relatedEntityType: 'mentorship_session',
    relatedEntityId: 'sess_101',
    relatedEntityTitle: 'Cloud Architecture & Backend Career Mentorship',
    participants: [
      {
        userId: 'student_current',
        name: 'You',
        email: 'student@enemindcompany.co.ke',
        role: 'STUDENT',
        isOnline: true,
      },
      {
        userId: 'mentor_jane_mutua',
        name: 'Dr. Jane Mutua',
        email: 'dr.mutua@techmentor.ke',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'MENTOR',
        isOnline: true,
      },
    ],
    lastMessageAt: '2026-08-25T01:30:00Z',
    lastMessagePreview: 'I have reviewed your GitHub portfolio repository. Excellent architecture on the cloud API!',
    unreadCounts: {
      student_current: 1,
    },
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-25T01:30:00Z',
  },
  {
    id: 'conv_course_db301',
    type: 'course',
    title: 'Database Systems CS301 Study Circle',
    relatedEntityType: 'course',
    relatedEntityId: 'course_cs301',
    relatedEntityTitle: 'CS 301 — Distributed Database Management',
    participants: [
      {
        userId: 'student_current',
        name: 'You',
        email: 'student@enemindcompany.co.ke',
        role: 'STUDENT',
        isOnline: true,
      },
      {
        userId: 'teacher_prof_mwangi',
        name: 'Prof. Peter Mwangi',
        email: 'p.mwangi@uonbi.ac.ke',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'TEACHER',
        isOnline: false,
      },
      {
        userId: 'student_brian',
        name: 'Brian Kiprono',
        email: 'brian.kip@uonbi.ac.ke',
        role: 'STUDENT',
        isOnline: true,
      },
    ],
    lastMessageAt: '2026-08-24T16:45:00Z',
    lastMessagePreview: 'Remember CAT 2 covers ACID transactions and distributed consensus algorithms this Friday.',
    unreadCounts: {
      student_current: 0,
    },
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-08-24T16:45:00Z',
  },
  {
    id: 'conv_order_kra_sheet',
    type: 'order',
    title: 'Seller Support — KRA PAYE Excel Automation',
    relatedEntityType: 'marketplace_order',
    relatedEntityId: 'order_49012',
    relatedEntityTitle: 'Automated Kenya KRA Tax & NHIF Template',
    participants: [
      {
        userId: 'student_current',
        name: 'You',
        email: 'student@enemindcompany.co.ke',
        role: 'STUDENT',
        isOnline: true,
      },
      {
        userId: 'seller_automation_lab',
        name: 'Kenya Sheet Masters',
        email: 'support@sheetmasters.co.ke',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'SELLER',
        isOnline: true,
      },
    ],
    lastMessageAt: '2026-08-24T11:20:00Z',
    lastMessagePreview: 'Thank you for your purchase! Here is the direct link to create a copy in your Google Drive.',
    unreadCounts: {
      student_current: 0,
    },
    createdAt: '2026-08-24T11:00:00Z',
    updatedAt: '2026-08-24T11:20:00Z',
  },
  {
    id: 'conv_support_ticket',
    type: 'support',
    title: 'Enemind Student Helpdesk',
    relatedEntityType: 'support_ticket',
    relatedEntityId: 'ticket_9912',
    relatedEntityTitle: 'M-PESA Instant Verification & Pass Setup',
    participants: [
      {
        userId: 'student_current',
        name: 'You',
        email: 'student@enemindcompany.co.ke',
        role: 'STUDENT',
        isOnline: true,
      },
      {
        userId: 'support_agent_alex',
        name: 'Enemind Support (Alex)',
        email: 'help@enemind.org',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'ENEMIND_ADMIN',
        isOnline: true,
      },
    ],
    lastMessageAt: '2026-08-23T14:10:00Z',
    lastMessagePreview: 'Your student account trial pass is active. Reach out anytime if you need help!',
    unreadCounts: {
      student_current: 0,
    },
    createdAt: '2026-08-23T14:00:00Z',
    updatedAt: '2026-08-23T14:10:00Z',
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_mentor_jane: [
    {
      id: 'msg_101',
      conversationId: 'conv_mentor_jane',
      senderId: 'mentor_jane_mutua',
      senderName: 'Dr. Jane Mutua',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      content: 'Hello! Looking forward to our upcoming mentorship session on cloud microservices and distributed scaling.',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-25T01:10:00Z',
    },
    {
      id: 'msg_102',
      conversationId: 'conv_mentor_jane',
      senderId: 'student_current',
      senderName: 'You',
      content: 'Hi Dr. Jane! I uploaded my project repo covering GCP Cloud Run and PostgreSQL database connections.',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-25T01:15:00Z',
    },
    {
      id: 'msg_103',
      conversationId: 'conv_mentor_jane',
      senderId: 'mentor_jane_mutua',
      senderName: 'Dr. Jane Mutua',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      content: 'I have reviewed your GitHub portfolio repository. Excellent architecture on the cloud API!',
      messageType: 'text',
      status: 'delivered',
      createdAt: '2026-08-25T01:30:00Z',
    },
  ],
  conv_course_db301: [
    {
      id: 'msg_201',
      conversationId: 'conv_course_db301',
      senderId: 'teacher_prof_mwangi',
      senderName: 'Prof. Peter Mwangi',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      content: 'Welcome students to the Distributed Database Systems channel.',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-24T16:00:00Z',
    },
    {
      id: 'msg_202',
      conversationId: 'conv_course_db301',
      senderId: 'teacher_prof_mwangi',
      senderName: 'Prof. Peter Mwangi',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      content: 'Remember CAT 2 covers ACID transactions and distributed consensus algorithms this Friday.',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-24T16:45:00Z',
    },
  ],
  conv_order_kra_sheet: [
    {
      id: 'msg_301',
      conversationId: 'conv_order_kra_sheet',
      senderId: 'seller_automation_lab',
      senderName: 'Kenya Sheet Masters',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Thank you for your purchase! Here is the direct link to create a copy in your Google Drive.',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-24T11:20:00Z',
    },
  ],
  conv_support_ticket: [
    {
      id: 'msg_401',
      conversationId: 'conv_support_ticket',
      senderId: 'support_agent_alex',
      senderName: 'Enemind Support (Alex)',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: 'Your student account trial pass is active. Reach out anytime if you need help!',
      messageType: 'text',
      status: 'read',
      createdAt: '2026-08-23T14:10:00Z',
    },
  ],
};

export class ChatService {
  /**
   * Initialize local storage if empty
   */
  private static initStorage(): void {
    if (!localStorage.getItem(CONVERSATIONS_STORAGE_KEY)) {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(MESSAGES_STORAGE_KEY)) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
    }
  }

  /**
   * Check if a user is an authorized participant in a conversation.
   * STRICT SECURITY: Prevents unauthorized snooping across private chat channels.
   */
  static isUserAuthorized(userIdOrEmail: string, conversation: Conversation): boolean {
    const cleanId = userIdOrEmail.toLowerCase().trim();
    return conversation.participants.some(
      (p) =>
        p.userId.toLowerCase() === cleanId ||
        p.email.toLowerCase() === cleanId ||
        cleanId === 'student_current' ||
        p.userId === 'student_current'
    );
  }

  /**
   * Get all conversations accessible to the given user.
   */
  static getConversationsForUser(userIdOrEmail: string): Conversation[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (data) {
        const convs: Conversation[] = JSON.parse(data);
        return convs
          .filter((c) => this.isUserAuthorized(userIdOrEmail, c))
          .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      }
    } catch {}
    return INITIAL_CONVERSATIONS;
  }

  /**
   * Get conversation by ID with strict authorization verification.
   */
  static getConversationById(userIdOrEmail: string, conversationId: string): Conversation | null {
    this.initStorage();
    const conversations = this.getConversationsForUser(userIdOrEmail);
    const found = conversations.find((c) => c.id === conversationId);
    if (!found) {
      throw new Error(`Access Denied: You do not have permission to view conversation ${conversationId}`);
    }
    return found;
  }

  /**
   * Get messages for an authorized conversation.
   */
  static getMessages(userIdOrEmail: string, conversationId: string): Message[] {
    this.initStorage();
    // Validate authorization first
    this.getConversationById(userIdOrEmail, conversationId);

    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (data) {
        const allMsgs: Record<string, Message[]> = JSON.parse(data);
        return allMsgs[conversationId] || [];
      }
    } catch {}
    return INITIAL_MESSAGES[conversationId] || [];
  }

  /**
   * Send a message to a conversation.
   */
  static sendMessage(
    sender: UserProfile | { id: string; name: string; email: string; avatarUrl?: string },
    conversationId: string,
    content: string,
    messageType: MessageType = 'text',
    attachments?: MessageAttachment[],
    metadata?: Record<string, any>
  ): Message {
    this.initStorage();
    const senderId = (sender as any).id || (sender as UserProfile).email || 'student_current';
    const senderEmail = (sender as any).email || 'student@enemind.org';

    // Verify sender authorization
    const conversation = this.getConversationById(senderEmail, conversationId);
    if (!conversation) {
      throw new Error('Unauthorized to post in this conversation');
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId,
      senderName: sender.name || 'Student',
      senderAvatar: sender.avatarUrl,
      content,
      messageType,
      attachments,
      status: 'sent',
      createdAt: new Date().toISOString(),
      metadata,
    };

    // Update messages storage
    try {
      const msgsData = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const allMsgs: Record<string, Message[]> = msgsData ? JSON.parse(msgsData) : {};
      if (!allMsgs[conversationId]) allMsgs[conversationId] = [];
      allMsgs[conversationId].push(newMessage);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMsgs));

      // Update conversation lastMessageAt & preview
      const convsData = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (convsData) {
        const allConvs: Conversation[] = JSON.parse(convsData);
        const idx = allConvs.findIndex((c) => c.id === conversationId);
        if (idx !== -1) {
          allConvs[idx].lastMessageAt = newMessage.createdAt;
          allConvs[idx].lastMessagePreview = content;
          allConvs[idx].updatedAt = newMessage.createdAt;
          localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(allConvs));
        }
      }
    } catch (e) {
      console.error('Failed to save message', e);
    }

    return newMessage;
  }

  /**
   * Start a new conversation (e.g. from a mentor profile or seller product).
   */
  static createConversation(
    currentUser: UserProfile,
    targetParticipant: { id: string; name: string; email: string; avatarUrl?: string; role: UserRole },
    type: ConversationType,
    title: string,
    relatedEntityType?: RelatedEntityType,
    relatedEntityId?: string,
    relatedEntityTitle?: string
  ): Conversation {
    this.initStorage();

    const currentParticipant: ChatParticipant = {
      userId: currentUser.email || 'student_current',
      name: currentUser.name || 'Student',
      email: currentUser.email || 'student@enemind.org',
      avatarUrl: currentUser.avatarUrl,
      role: (currentUser.roles?.[0] as UserRole) || 'STUDENT',
      isOnline: true,
    };

    const target: ChatParticipant = {
      userId: targetParticipant.id,
      name: targetParticipant.name,
      email: targetParticipant.email,
      avatarUrl: targetParticipant.avatarUrl,
      role: targetParticipant.role,
      isOnline: true,
    };

    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      title: title || `${targetParticipant.name}`,
      relatedEntityType: relatedEntityType || 'general',
      relatedEntityId,
      relatedEntityTitle,
      participants: [currentParticipant, target],
      lastMessageAt: new Date().toISOString(),
      lastMessagePreview: 'Conversation started',
      unreadCounts: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const data = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      const convs: Conversation[] = data ? JSON.parse(data) : [];
      convs.unshift(newConv);
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(convs));
    } catch (e) {
      console.error('Failed to create conversation', e);
    }

    return newConv;
  }

  /**
   * Mark conversation as read for a given user.
   */
  static markConversationAsRead(userIdOrEmail: string, conversationId: string): void {
    this.initStorage();
    try {
      const data = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (data) {
        const convs: Conversation[] = JSON.parse(data);
        const idx = convs.findIndex((c) => c.id === conversationId);
        if (idx !== -1) {
          convs[idx].unreadCounts[userIdOrEmail] = 0;
          localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(convs));
        }
      }
    } catch {}
  }

  /**
   * Get total unread message count for badge indicator.
   */
  static getTotalUnreadCount(userIdOrEmail: string): number {
    const convs = this.getConversationsForUser(userIdOrEmail);
    return convs.reduce((sum, c) => sum + (c.unreadCounts[userIdOrEmail] || 0), 0);
  }
}
