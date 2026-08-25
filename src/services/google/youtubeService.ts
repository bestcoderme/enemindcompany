/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface YouTubeEducationalVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration: string;
  category: 'Distributed Systems' | 'Algorithms' | 'Web Development' | 'Career & CV' | 'Mathematics';
  youtubeUrl: string;
}

export const CURATED_EDUCATIONAL_VIDEOS: YouTubeEducationalVideo[] = [
  {
    id: 'vid_01',
    title: 'MIT 6.824: Distributed Systems - Lecture 1 Introduction to Raft',
    channelTitle: 'MIT OpenCourseWare',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=80',
    duration: '1h 18m',
    category: 'Distributed Systems',
    youtubeUrl: 'https://www.youtube.com/watch?v=cQP8WApzIQQ',
  },
  {
    id: 'vid_02',
    title: 'Graph Algorithms in 60 Minutes (BFS, DFS, Dijkstra, Prim)',
    channelTitle: 'freeCodeCamp.org',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=480&auto=format&fit=crop&q=80',
    duration: '1h 02m',
    category: 'Algorithms',
    youtubeUrl: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU',
  },
  {
    id: 'vid_03',
    title: 'How to Build an ATS-Proof Software Engineer Resume in 2026',
    channelTitle: 'Tech Lead Insights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=480&auto=format&fit=crop&q=80',
    duration: '22m',
    category: 'Career & CV',
    youtubeUrl: 'https://www.youtube.com/watch?v=a1b2c3d4e5',
  },
  {
    id: 'vid_04',
    title: 'Full Stack React 19, TypeScript, and Google Cloud Architecture',
    channelTitle: 'Google for Developers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&auto=format&fit=crop&q=80',
    duration: '45m',
    category: 'Web Development',
    youtubeUrl: 'https://www.youtube.com/watch?v=f9e8d7c6b5',
  },
];

class YouTubeService {
  public getCuratedVideos(category?: string): YouTubeEducationalVideo[] {
    if (category && category !== 'All') {
      return CURATED_EDUCATIONAL_VIDEOS.filter((v) => v.category === category);
    }
    return CURATED_EDUCATIONAL_VIDEOS;
  }
}

export const youtubeService = new YouTubeService();
