export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}

export interface Skill {
  name: string;
  category: 'Technical' | 'Soft' | 'Domain';
  relevance: number; // 0-100
}

export interface AnalysisResult {
  candidateName: string; // Extracted or generic
  classification: {
    roleCategory: string; // e.g., "Frontend Engineer"
    experienceLevel: string; // e.g., "Senior"
    confidence: number;
  };
  skills: Skill[];
  shortlist: {
    score: number; // 0-100
    status: 'Shortlisted' | 'Waitlisted' | 'Rejected';
    reasoning: string;
    pros: string[];
    cons: string[];
  };
  culturalFit: {
    score: number;
    analysis: string;
  };
  recommendedProfile: string;
  keywordRecommendations: string[];
}