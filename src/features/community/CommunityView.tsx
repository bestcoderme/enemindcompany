import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { MessageSquare, Users, ThumbsUp, Send, CheckCircle2, Plus } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('swe-group');
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Amina Yusuf',
      university: 'UoN Chiromo',
      time: '2 hours ago',
      content: 'Anyone preparing for the upcoming AWS Cloud Foundations certification exam? Looking to form a weekend study circle on Google Meet.',
      likes: 14,
      comments: 6,
    },
    {
      id: 'p2',
      author: 'David Kibet',
      university: 'JKUAT Main Campus',
      time: '5 hours ago',
      content: 'Sharing solved past papers for Database Systems (CSC 311) — covers relational normalization, B-Trees and indexing questions from 2022 to 2025.',
      likes: 38,
      comments: 12,
    },
  ]);
  const [newPostText, setNewPostText] = useState('');

  const GROUPS = [
    { id: 'swe-group', name: 'Software & Cloud Developers', members: 1420, category: 'Computing & IT' },
    { id: 'automation-group', name: 'PLC & Automation Engineers', members: 890, category: 'Engineering' },
    { id: 'entrepreneurs-group', name: 'Campus Student Founders & Sellers', members: 1150, category: 'Business' },
    { id: 'uon-life', name: 'University Campus Life & Housing', members: 2300, category: 'Campus' },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: `p-${Date.now()}`,
      author: 'You (Student)',
      university: 'Enemind Network',
      time: 'Just now',
      content: newPostText,
      likes: 1,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
          Campus & Career Communities
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Join study groups, collaborate on final year projects, and discuss opportunities with peers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Groups List */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Active Groups
          </span>
          {GROUPS.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`w-full text-left p-3 rounded-2xl border transition-all ${
                selectedGroup === group.id
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <h4 className="text-xs font-bold font-heading">{group.name}</h4>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className={selectedGroup === group.id ? 'text-neutral-300' : 'text-neutral-500'}>
                  {group.category}
                </span>
                <span className="font-semibold text-emerald-400">{group.members} members</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Discussion Feed */}
        <div className="space-y-4 lg:col-span-3">
          {/* Create Post Box */}
          <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Ask a question, share notes, or start a study discussion..."
              className="w-full p-3 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
              <span className="text-[11px] text-neutral-400">Posting to community</span>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="py-1.5 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{post.author}</h4>
                    <span className="text-[10px] text-neutral-400">{post.university} · {post.time}</span>
                  </div>
                  <Badge variant="neutral">Discussion</Badge>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed my-3">{post.content}</p>

                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                  <button className="flex items-center gap-1 hover:text-emerald-600 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-neutral-900 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments} replies</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
