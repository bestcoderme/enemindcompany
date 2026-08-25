/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RecommendationItem } from '../../types/intelligence';
import { UserProfile } from '../../types/user';
import { MarketingService } from './marketingService';

export class RecommendationService {
  /**
   * Get personalized recommendations for a user.
   * STRICT PRIVACY: Only uses explicit first-party profile information and consented interests.
   */
  static getRecommendations(user?: UserProfile | null): RecommendationItem[] {
    const userId = user?.email || 'anonymous';
    const prefs = MarketingService.getPreferences(userId);

    const isPersonalized = prefs.personalizedRecommendations;
    const allowProducts = prefs.productRecommendations;

    const courseName = user?.course?.name || 'Computer Science';
    const universityName = user?.university?.shortName || user?.university?.name || 'University of Nairobi';
    const skills = user?.skills || ['Problem Solving', 'Data Structures'];

    const items: RecommendationItem[] = [];

    // 1. Recommended Opportunity
    items.push({
      id: 'rec_opp_safaricom',
      type: 'opportunity',
      title: 'Safaricom Cloud & AI Apprenticeship 2026',
      subtitle: 'Safaricom PLC · Nairobi (Hybrid)',
      badge: '98% Degree Match',
      score: 98,
      rationale: isPersonalized
        ? `Matched based on your enrollment in ${courseName} at ${universityName}.`
        : 'Top rated opportunity among Kenyan university students.',
      targetView: 'opportunities',
      actionLabel: 'View Opportunity',
      imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&auto=format&fit=crop&q=80',
    });

    // 2. Recommended Mentor
    items.push({
      id: 'rec_mentor_jane',
      type: 'mentor',
      title: 'Dr. Jane Mutua — Cloud Architect at AWS',
      subtitle: '12+ yrs experience · Microservices, GCP, AWS',
      badge: 'Top Mentor',
      score: 95,
      rationale: isPersonalized
        ? `Selected to help you master cloud and distributed architecture for ${courseName}.`
        : 'Highest rated technical career mentor on Enemind.',
      targetView: 'mentorship',
      actionLabel: 'Connect with Mentor',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    });

    // 3. Recommended Career Action
    items.push({
      id: 'rec_career_lab',
      type: 'career_action',
      title: 'Deploy High-Throughput REST API on Cloud Run',
      subtitle: 'Stage 3 Portfolio Project · Real-world Proof of Work',
      badge: 'Skill Gap Focus',
      score: 92,
      rationale: isPersonalized
        ? 'Closes the industry gap between textbook theory and containerized backend deployment.'
        : 'Essential foundational project for engineering and data science students.',
      targetView: 'career',
      actionLabel: 'Open Project Lab',
    });

    // 4. Recommended Course / Notes
    items.push({
      id: 'rec_course_dbms',
      type: 'course',
      title: 'Distributed Database Systems & SQL Optimization',
      subtitle: 'Complete verified lecture notes, past papers & solutions',
      badge: 'Academic Core',
      score: 90,
      rationale: isPersonalized
        ? `Directly aligns with ${universityName} academic curriculum for Year 3.`
        : 'Most downloaded study resource this semester.',
      targetView: 'learning',
      actionLabel: 'Study Notes',
    });

    // 5. Recommended Marketplace Automation (Only if product recommendations consented)
    if (allowProducts) {
      items.push({
        id: 'rec_prod_kra_sheet',
        type: 'marketplace_product',
        title: 'Kenya KRA PAYE & Automated Tax Calculator Sheet',
        subtitle: 'By Kenya Sheet Masters · Instant Google Sheet Clone',
        badge: 'Top Automation',
        score: 87,
        rationale: isPersonalized
          ? 'Recommended based on your interest in business workflow automations.'
          : 'Trending student-built productivity template in Nairobi.',
        targetView: 'marketplace',
        actionLabel: 'Get Template KSh 400',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80',
      });
    }

    return items;
  }
}
