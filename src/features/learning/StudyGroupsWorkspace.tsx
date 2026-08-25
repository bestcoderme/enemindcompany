/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Video,
  Calendar,
  FolderLock,
  ExternalLink,
  MessageSquare,
  FileText,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
} from 'lucide-react';
import { LearningStudyGroup, StudyGroupResource } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { studyGroupService } from '../../services/learning/studyGroupService';

interface StudyGroupsWorkspaceProps {
  user: UserProfile | null;
}

export const StudyGroupsWorkspace: React.FC<StudyGroupsWorkspaceProps> = ({ user }) => {
  const [groups, setGroups] = useState<LearningStudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LearningStudyGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isSchedulingMeet, setIsSchedulingMeet] = useState(false);

  // New Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupSubject, setGroupSubject] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // New Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'doc' | 'sheet' | 'slides' | 'drive' | 'link'>('doc');
  const [resUrl, setResUrl] = useState('');

  // Schedule Meet Form
  const [meetTopic, setMeetTopic] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('19:00');

  // Announcement Form
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    const list = studyGroupService.getGroups(user?.id || 'usr_default');
    setGroups(list);
    if (!selectedGroup && list.length > 0) {
      setSelectedGroup(list[0]);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const created = studyGroupService.createGroup({
      name: groupName,
      description: groupDesc,
      subject: groupSubject || undefined,
      creator: {
        id: user?.id || 'usr_default',
        name: user?.name || 'Alex Muli',
        avatar: user?.avatar,
      },
      isPrivate,
    });

    setIsCreatingGroup(false);
    setGroupName('');
    setGroupDesc('');
    setGroupSubject('');
    loadGroups();
    setSelectedGroup(created);
  };

  const handleJoinGroup = (group: LearningStudyGroup) => {
    if (!user) return;
    studyGroupService.joinGroup(group.id, {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    });
    loadGroups();
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !announcementText.trim() || !user) return;

    studyGroupService.addAnnouncement(selectedGroup.id, user.name, announcementText);
    setAnnouncementText('');
    loadGroups();
    const updated = studyGroupService.getGroupById(selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !resTitle.trim() || !resUrl.trim() || !user) return;

    studyGroupService.addResource(selectedGroup.id, {
      title: resTitle,
      type: resType,
      url: resUrl,
      addedBy: user.name,
    });

    setIsAddingResource(false);
    setResTitle('');
    setResUrl('');
    loadGroups();
    const updated = studyGroupService.getGroupById(selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const handleScheduleMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !meetTopic.trim() || !meetDate || !user) return;

    const startDateTime = `${meetDate}T${meetTime}:00Z`;
    const endDateTime = `${meetDate}T20:30:00Z`;

    await studyGroupService.scheduleMeetSession(selectedGroup.id, {
      topic: meetTopic,
      startTime: startDateTime,
      endTime: endDateTime,
      userEmail: user.email,
    });

    alert('Google Meet study session scheduled and synced to your Google Calendar!');
    setIsSchedulingMeet(false);
    setMeetTopic('');
    loadGroups();
    const updated = studyGroupService.getGroupById(selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const isMember = (group: LearningStudyGroup) => {
    return group.members.some((m) => m.id === (user?.id || 'usr_default'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Study Circles & Peer Learning Workspaces
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Google Meet & Drive Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Form exam revision squads, share Google Drive lab folders, and host group Google Meet study sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingGroup(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Create Study Group</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Column: Group List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-3 space-y-2 max-h-[680px] overflow-y-auto">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
            Active Study Circles ({groups.length})
          </h3>

          {groups.map((group) => {
            const isSelected = selectedGroup?.id === group.id;
            const memberOf = isMember(group);

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {group.subject || 'General'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Users className={`w-3 h-3 ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`} />
                    <span className={isSelected ? 'text-neutral-300' : 'text-neutral-500'}>
                      {group.members.length} members
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold leading-snug line-clamp-1 mb-1">{group.name}</h4>
                <p
                  className={`text-[11px] line-clamp-2 leading-relaxed mb-3 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {group.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/40 text-[10px]">
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold'}>
                    {memberOf ? 'Joined Member' : 'Open Group'}
                  </span>
                  {group.googleMeetUrl && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <Video className="w-3 h-3" />
                      <span>Meet Room</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Group Workspace & Discussion (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col justify-between space-y-6">
          {selectedGroup ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Group Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                      {selectedGroup.subject || 'All Subjects'}
                    </span>
                    {selectedGroup.courseTitle && (
                      <span className="text-xs text-neutral-500 font-medium">
                        Linked: {selectedGroup.courseTitle}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1">{selectedGroup.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isMember(selectedGroup) ? (
                    <button
                      type="button"
                      onClick={() => handleJoinGroup(selectedGroup)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Join Group
                    </button>
                  ) : (
                    <>
                      {selectedGroup.googleMeetUrl && (
                        <a
                          href={selectedGroup.googleMeetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Join Meet Room</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsSchedulingMeet(true)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Schedule Meet</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Shared Google Resources Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Shared Google Drive & Study Resources ({selectedGroup.resources.length})</span>
                  </h4>
                  {isMember(selectedGroup) && (
                    <button
                      type="button"
                      onClick={() => setIsAddingResource(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Resource</span>
                    </button>
                  )}
                </div>

                {selectedGroup.resources.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-400">
                    No resources added yet. Click "+ Add Resource" to share a Google Doc, Sheet, or Drive folder.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedGroup.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          {res.type === 'sheet' ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : res.type === 'slides' ? (
                            <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 line-clamp-1">
                              {res.title}
                            </p>
                            <p className="text-[10px] text-neutral-400">Added by {res.addedBy} · {res.date}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Announcements / Discussion Stream */}
              <div className="flex-1 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Group Bulletin & Announcements</span>
                </h4>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto mb-4">
                  {selectedGroup.announcements.map((ann) => (
                    <div key={ann.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-neutral-900">{ann.author}</span>
                        <span className="text-neutral-400">{ann.date}</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>

                {isMember(selectedGroup) && (
                  <form onSubmit={handleAddAnnouncement} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Post an update or revision question to the group..."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="flex-1 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-neutral-400">
              <Users className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-bold text-neutral-700">No Study Group Selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">Create Study Circle</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Collaborate with classmates on revision, lab exercises, and past papers.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAT 220 Linear Algebra Exam Squad"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description & Goals</label>
                <textarea
                  rows={3}
                  placeholder="Describe your study objectives, meeting frequency, or target units..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Subject / Unit (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science / Distributed Systems"
                  value={groupSubject}
                  onChange={(e) => setGroupSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddingResource && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">Add Shared Resource</h3>
            <p className="text-xs text-neutral-500 mb-4">Share a Google Doc, Google Sheet, Slides or Drive folder.</p>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 Past Exam Solutions Doc"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Type</label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden bg-white"
                >
                  <option value="doc">Google Doc</option>
                  <option value="sheet">Google Sheet</option>
                  <option value="slides">Google Slides</option>
                  <option value="drive">Google Drive Folder</option>
                  <option value="link">Web Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/..."
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddingResource(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Meet Modal */}
      {isSchedulingMeet && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">Schedule Google Meet Session</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Creates a Google Calendar event with an authorized Google Meet room.
            </p>

            <form onSubmit={handleScheduleMeet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Session Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Distributed Consensus Review"
                  value={meetTopic}
                  onChange={(e) => setMeetTopic(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={meetDate}
                    onChange={(e) => setMeetDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={meetTime}
                    onChange={(e) => setMeetTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsSchedulingMeet(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Confirm & Sync Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
