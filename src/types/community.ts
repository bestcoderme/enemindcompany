export interface GroupPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface DiscussionPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorUniversity: string;
  content: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  attachments?: { name: string; url: string; type: string }[];
  poll?: {
    question: string;
    options: GroupPollOption[];
    userVotedOptionId?: string;
  };
}

export interface StudentGroup {
  id: string;
  name: string;
  category: 'Engineering' | 'Computing & IT' | 'Business & Finance' | 'Health & Med' | 'Campus Life' | 'Entrepreneurs';
  description: string;
  membersCount: number;
  coverImage: string;
  isPrivate: boolean;
  university?: string;
  tags: string[];
  recentPosts: DiscussionPost[];
}
