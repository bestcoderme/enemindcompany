/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import { Conversation, Message, ConversationType, MessageType } from '../../types/chat';
import { ChatService } from '../../services/chat/chatService';
import { AnalyticsService } from '../../services/analytics/analyticsService';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Check,
  Plus,
  ArrowLeft,
  Circle,
  FolderLock,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface ChatViewProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
  initialConversationId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  user,
  onNavigate,
  initialConversationId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);

  // New conversation form states
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientRole, setNewRecipientRole] = useState<UserRole>('MENTOR');
  const [newConvType, setNewConvType] = useState<ConversationType>('mentorship');
  const [newConvTitle, setNewConvTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    const list = ChatService.getConversationsForUser(user.email);
    setConversations(list);
    if (list.length > 0) {
      const defaultId = initialConversationId || list[0].id;
      setSelectedConversationId(defaultId);
    }
  }, [user, initialConversationId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    try {
      ChatService.markConversationAsRead(user.email, selectedConversationId);
      const msgs = ChatService.getMessages(user.email, selectedConversationId);
      setMessages(msgs);

      // Refresh conversations list to update unread badge
      const updatedList = ChatService.getConversationsForUser(user.email);
      setConversations(updatedList);
    } catch (e: any) {
      console.error(e.message);
    }
  }, [selectedConversationId, user]);

  // Scroll to bottom of message thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversationId) return;

    try {
      const sent = ChatService.sendMessage(
        user,
        selectedConversationId,
        inputMessage.trim(),
        'text'
      );
      setMessages((prev) => [...prev, sent]);
      setInputMessage('');
      AnalyticsService.track('MESSAGE_SENT', { conversationId: selectedConversationId }, user);

      // Update sidebar preview
      const updatedList = ChatService.getConversationsForUser(user.email);
      setConversations(updatedList);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim()) return;

    const newConv = ChatService.createConversation(
      user,
      {
        id: `user_${Date.now()}`,
        name: newRecipientName.trim(),
        email: `${newRecipientName.toLowerCase().replace(/\s+/g, '.')}@enemind.org`,
        role: newRecipientRole,
      },
      newConvType,
      newConvTitle || `${newRecipientName} (${newConvType})`,
      newConvType === 'mentorship' ? 'mentorship_session' : 'general',
      `ref_${Date.now()}`,
      `Channel with ${newRecipientName}`
    );

    setIsNewConvModalOpen(false);
    setConversations(ChatService.getConversationsForUser(user.email));
    setSelectedConversationId(newConv.id);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchPreview = c.lastMessagePreview?.toLowerCase().includes(q);
      return matchTitle || matchPreview;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-heading text-white">Enemind Messenger & Channels</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                End-to-End Isolated
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Direct discussions with verified mentors, course circles, creators, and support
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewConvModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
          {/* Search Bar */}
          <div className="p-3 border-b border-neutral-200">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-neutral-200 focus:border-emerald-500 focus:outline-hidden transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'mentorship', label: 'Mentors' },
                { id: 'course', label: 'Courses' },
                { id: 'order', label: 'Orders' },
                { id: 'support', label: 'Support' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConversationId;
                const unreadCount = conv.unreadCounts[user.email] || 0;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border border-emerald-500 shadow-sm'
                        : 'bg-white/60 hover:bg-white border border-neutral-100 hover:border-neutral-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs relative">
                      {conv.title.charAt(0)}
                      {conv.type === 'mentorship' && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-purple-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {conv.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-500 truncate leading-snug">
                        {conv.lastMessagePreview || 'New discussion'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {conv.type}
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white ml-auto">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white/80 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                    {activeConversation.title.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900 font-heading">
                        {activeConversation.title}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
                    </div>
                    {activeConversation.relatedEntityTitle && (
                      <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Context: {activeConversation.relatedEntityTitle}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">
                    {activeConversation.type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/30">
                {/* Security notice */}
                <div className="text-center my-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Private Channel · Participant Isolated · No Third-Party Ads</span>
                  </div>
                </div>

                {messages.map((msg) => {
                  const isMine =
                    msg.senderId === user.email ||
                    msg.senderId === 'student_current' ||
                    msg.senderName === 'You';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-neutral-600">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                          isMine
                            ? 'bg-neutral-900 text-white rounded-tr-xs shadow-sm'
                            : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Attachments preview */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-neutral-700/50 space-y-1">
                            {msg.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="flex items-center gap-2 p-2 bg-black/20 rounded-lg text-[11px]"
                              >
                                <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold truncate">{att.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400 px-1">
                        {isMine && (
                          <span className="flex items-center gap-0.5">
                            <CheckCheck className="w-3 h-3 text-emerald-600" />
                            <span>Delivered</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => alert('Attachment upload dialog ready.')}
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  title="Attach Project or Notes"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Reply in ${activeConversation.title}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-neutral-100 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-hidden transition-all placeholder:text-neutral-400"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className={`p-2.5 rounded-xl font-bold transition-all ${
                    inputMessage.trim()
                      ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-sm cursor-pointer'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <MessageSquare className="w-12 h-12 text-neutral-300 mb-3" />
              <h3 className="text-sm font-bold text-neutral-700">Select a Conversation</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                Choose a mentorship, course circle, or customer order thread from the left menu to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {isNewConvModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">
              Start a New Discussion
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Connect with classmates, industry mentors, lecturers, or sellers
            </p>

            <form onSubmit={handleCreateNewConversation} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Recipient Name / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Mutua or Nairobi Cloud Study Circle"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Channel Type
                  </label>
                  <select
                    value={newConvType}
                    onChange={(e) => setNewConvType(e.target.value as ConversationType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="mentorship">Mentorship</option>
                    <option value="course">Course Group</option>
                    <option value="direct">Direct Message</option>
                    <option value="order">Marketplace Order</option>
                    <option value="support">Helpdesk</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Role
                  </label>
                  <select
                    value={newRecipientRole}
                    onChange={(e) => setNewRecipientRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="MENTOR">Mentor</option>
                    <option value="TEACHER">Teacher / Lecturer</option>
                    <option value="STUDENT">Student</option>
                    <option value="SELLER">Seller / Creator</option>
                    <option value="ENEMIND_ADMIN">Support Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Topic / Context Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Architecture Discussion or CS301 Study"
                  value={newConvTitle}
                  onChange={(e) => setNewConvTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsNewConvModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 shadow-sm"
                >
                  Create Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
