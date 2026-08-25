/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnemindGroupConfig, EnemindGroupType } from '../../types/google';
import { googleAuditService } from './googleAuditService';
import { googleAuthService } from './googleAuthService';

export const SAMPLE_GROUPS: EnemindGroupConfig[] = [
  {
    id: 'grp_01',
    title: 'Distributed Systems & Cloud Study Group',
    description: 'Peer study circle for CSC 311 covering consensus algorithms, Kubernetes labs, and exam revision.',
    groupType: 'COURSE',
    googleIntegrationType: 'CLASSROOM',
    googleClassroomId: 'cls_course_01',
    membersCount: 42,
    isPrivate: false,
  },
  {
    id: 'grp_02',
    title: 'Kenya Tech Innovators Capstone Project',
    description: 'Collaborative development team building open-source educational software with shared Drive workspace and weekly Meet standups.',
    groupType: 'PROJECT',
    googleIntegrationType: 'DRIVE_WORKSPACE',
    googleDriveFolderId: 'fld_project_02',
    membersCount: 8,
    isPrivate: true,
  },
  {
    id: 'grp_03',
    title: 'University Engineering Student Association',
    description: 'Campus-wide student union for engineering and computer science undergraduates.',
    groupType: 'COMMUNITY',
    googleIntegrationType: 'GOOGLE_GROUP',
    googleGroupEmail: 'engineering-students@enemind.org',
    membersCount: 310,
    isPrivate: false,
  },
  {
    id: 'grp_04',
    title: 'Late Night Algorithm & LeetCode Discussions',
    description: 'Daily interview prep, time complexity reviews, and live coding sessions.',
    groupType: 'DISCUSSION',
    googleIntegrationType: 'CHAT_SPACE',
    googleChatSpaceId: 'space_algorithms',
    membersCount: 95,
    isPrivate: false,
  },
];

class GroupsService {
  private groups: EnemindGroupConfig[] = [...SAMPLE_GROUPS];

  public getGroups(type?: EnemindGroupType): EnemindGroupConfig[] {
    if (type) {
      return this.groups.filter((g) => g.groupType === type);
    }
    return this.groups;
  }

  public createGroup(
    title: string,
    description: string,
    groupType: EnemindGroupType,
    isPrivate: boolean = false
  ): EnemindGroupConfig {
    const account = googleAuthService.getAccountInfo();

    let integrationType: EnemindGroupConfig['googleIntegrationType'] = 'ENEMIND_INTERNAL';
    if (groupType === 'COURSE') integrationType = 'CLASSROOM';
    if (groupType === 'PROJECT') integrationType = 'DRIVE_WORKSPACE';
    if (groupType === 'DISCUSSION') integrationType = 'CHAT_SPACE';
    if (groupType === 'COMMUNITY') integrationType = 'GOOGLE_GROUP';

    const newGroup: EnemindGroupConfig = {
      id: `grp_${Date.now()}`,
      title,
      description,
      groupType,
      googleIntegrationType: integrationType,
      membersCount: 1,
      isPrivate,
    };

    this.groups.unshift(newGroup);

    googleAuditService.log(
      'groups',
      'CREATE_GROUP_SPACE',
      account.email || 'user@enemind.org',
      `Configured ${groupType} group: "${title}"`,
      'SUCCESS',
      `Integration: ${integrationType}`
    );

    return newGroup;
  }
}

export const groupsService = new GroupsService();
