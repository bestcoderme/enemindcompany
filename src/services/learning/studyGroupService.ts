/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningStudyGroup, StudyGroupMember, StudyGroupResource } from '../../types/learning';
import { INITIAL_STUDY_GROUPS } from './learningData';
import { calendarService } from '../google/calendarService';

const STORAGE_KEY_GROUPS = 'enemind_learning_study_groups';

class StudyGroupService {
  private groups: LearningStudyGroup[] = [];

  constructor() {
    this.loadGroups();
  }

  private loadGroups() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GROUPS);
      this.groups = stored ? JSON.parse(stored) : INITIAL_STUDY_GROUPS;
    } catch {
      this.groups = INITIAL_STUDY_GROUPS;
    }
  }

  private saveGroups() {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(this.groups));
    } catch (e) {
      console.warn('Failed to save study groups to storage:', e);
    }
  }

  public getGroups(userId?: string): LearningStudyGroup[] {
    if (!userId) return this.groups;
    return this.groups.filter((g) => g.members.some((m) => m.id === userId) || !g.isPrivate);
  }

  public getGroupById(id: string): LearningStudyGroup | undefined {
    return this.groups.find((g) => g.id === id);
  }

  public createGroup(params: {
    name: string;
    description: string;
    courseId?: string;
    courseTitle?: string;
    subject?: string;
    creator: { id: string; name: string; avatar?: string };
    isPrivate?: boolean;
    googleDriveFolderName?: string;
  }): LearningStudyGroup {
    const groupId = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const groupNameSlug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newGroup: LearningStudyGroup = {
      id: groupId,
      name: params.name.trim(),
      description: params.description.trim(),
      courseId: params.courseId,
      courseTitle: params.courseTitle,
      subject: params.subject,
      members: [
        {
          id: params.creator.id,
          name: params.creator.name,
          role: 'ADMIN',
          avatar: params.creator.avatar,
          joinedAt: new Date().toISOString(),
        },
      ],
      googleChatSpaceId: `spaces/${groupNameSlug}`,
      googleDriveFolderId: `drive_folder_${groupId}`,
      googleMeetUrl: `https://meet.google.com/enemind-${groupNameSlug.substring(0, 10)}`,
      resources: [],
      announcements: [
        {
          id: `ann_${Date.now()}`,
          author: params.creator.name,
          content: `Welcome to ${params.name}! Use this study circle to share past papers, collaborate on Google Docs, and coordinate Meet sessions.`,
          date: new Date().toISOString().split('T')[0],
        },
      ],
      isPrivate: params.isPrivate || false,
      createdAt: new Date().toISOString(),
    };

    this.groups.unshift(newGroup);
    this.saveGroups();
    return newGroup;
  }

  public joinGroup(groupId: string, user: { id: string; name: string; avatar?: string }): boolean {
    const group = this.getGroupById(groupId);
    if (!group) return false;

    if (group.members.some((m) => m.id === user.id)) return true;

    const newMember: StudyGroupMember = {
      id: user.id,
      name: user.name,
      role: 'MEMBER',
      avatar: user.avatar,
      joinedAt: new Date().toISOString(),
    };

    group.members.push(newMember);
    this.saveGroups();
    return true;
  }

  public addAnnouncement(groupId: string, authorName: string, content: string): boolean {
    const group = this.getGroupById(groupId);
    if (!group || !content.trim()) return false;

    group.announcements.unshift({
      id: `ann_${Date.now()}`,
      author: authorName,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
    });

    this.saveGroups();
    return true;
  }

  public addResource(
    groupId: string,
    resourceData: {
      title: string;
      type: 'doc' | 'sheet' | 'slides' | 'drive' | 'link' | 'note';
      url: string;
      addedBy: string;
    }
  ): StudyGroupResource | null {
    const group = this.getGroupById(groupId);
    if (!group) return null;

    const res: StudyGroupResource = {
      id: `res_${Date.now()}`,
      title: resourceData.title.trim(),
      type: resourceData.type,
      url: resourceData.url.trim(),
      addedBy: resourceData.addedBy,
      date: new Date().toISOString().split('T')[0],
    };

    group.resources.unshift(res);
    this.saveGroups();
    return res;
  }

  public async scheduleMeetSession(
    groupId: string,
    params: {
      topic: string;
      startTime: string;
      endTime: string;
      userEmail?: string;
    }
  ): Promise<string> {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    const meetUrl = group.googleMeetUrl || `https://meet.google.com/enemind-${groupId.substring(0, 8)}`;

    await calendarService.createEvent({
      summary: `${group.name}: ${params.topic}`,
      description: `Study Session for ${group.name}.\nJoin Google Meet: ${meetUrl}`,
      startTime: params.startTime,
      endTime: params.endTime,
      createMeetLink: true,
      attendeeEmails: [params.userEmail || 'student@enemind.org'],
      eventType: 'class',
    });

    this.addAnnouncement(groupId, 'System', `Scheduled Study Session: "${params.topic}" for ${new Date(params.startTime).toLocaleString()}. Google Meet: ${meetUrl}`);
    return meetUrl;
  }
}

export const studyGroupService = new StudyGroupService();
