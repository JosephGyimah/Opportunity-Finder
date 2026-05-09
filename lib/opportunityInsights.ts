import { opportunities, type Opportunity } from '@/lib/opportunities';

export interface MatchResult {
  opportunity_id: string;
  score: number;
  reason: string;
}

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'from', 'this', 'your', 'you', 'are', 'was', 'were', 'have', 'has',
  'into', 'about', 'will', 'their', 'they', 'them', 'our', 'out', 'not', 'can', 'who', 'all', 'any', 'but',
  'more', 'than', 'use', 'used', 'using', 'experience', 'skills', 'skill', 'work', 'working', 'project',
  'projects', 'team', 'teams', 'years', 'year', 'role', 'roles', 'student', 'students', 'degree', 'high',
  'college', 'university', 'based', 'resume', 'cv', 'responsible', 'responsibilities', 'focused', 'around',
]);

const skillPatterns = [
  'figma',
  'ux',
  'ui',
  'product design',
  'design systems',
  'prototype',
  'research',
  'python',
  'javascript',
  'typescript',
  'react',
  'next.js',
  'sql',
  'tableau',
  'data analysis',
  'machine learning',
  'cloud computing',
  'open source',
  'leadership',
  'finance',
  'economics',
  'product management',
  'full stack',
  'android',
  'ios',
  'communication',
  'presentation',
  'business strategy',
  'startup',
];

const careerPathMap: Array<{ terms: string[]; label: string }> = [
  { terms: ['figma', 'ux', 'ui', 'product design', 'design systems'], label: 'Product Designer' },
  { terms: ['python', 'sql', 'tableau', 'data analysis', 'machine learning'], label: 'Data Analyst' },
  { terms: ['react', 'typescript', 'next.js', 'javascript', 'full stack'], label: 'Software Engineer' },
  { terms: ['leadership', 'startup', 'business strategy', 'product management'], label: 'Product Manager' },
  { terms: ['finance', 'economics', 'business strategy'], label: 'Business Analyst' },
];

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .match(/[a-z0-9+.#-]+/g)
    ?.filter((token) => token.length > 2 && !stopWords.has(token)) ?? [];
}

export function extractSkills(text: string, limit = 6) {
  const normalized = text.toLowerCase();
  const found = skillPatterns.filter((pattern) => normalized.includes(pattern));

  if (found.length > 0) {
    return Array.from(new Set(found.map((skill) => skill.replace(/\b\w/g, (char) => char.toUpperCase())))).slice(0, limit);
  }

  return Array.from(new Set(tokenize(text))).slice(0, limit).map((token) => token.replace(/\b\w/g, (char) => char.toUpperCase()));
}

export function deriveCareerPaths(text: string, limit = 2) {
  const normalized = text.toLowerCase();
  const paths = careerPathMap
    .filter(({ terms }) => terms.some((term) => normalized.includes(term)))
    .map(({ label }) => label);

  if (paths.length > 0) {
    return paths.slice(0, limit);
  }

  return ['Generalist Opportunity Track'];
}

export function rankOpportunitiesByText(cvText: string, pool: Opportunity[] = opportunities): MatchResult[] {
  const cvTokens = new Set(tokenize(cvText));

  return pool
    .map((opportunity) => {
      const opportunityText = [
        opportunity.title,
        opportunity.organization,
        opportunity.description,
        opportunity.location,
        opportunity.eligibility,
        ...opportunity.tags,
      ].join(' ');

      const opportunityTokens = tokenize(opportunityText);
      const matches = opportunityTokens.filter((token) => cvTokens.has(token));
      const uniqueMatches = Array.from(new Set(matches));
      const tagMatches = opportunity.tags.filter((tag) => cvText.toLowerCase().includes(tag.toLowerCase()));
      const rawScore = Math.min(96, uniqueMatches.length * 10 + tagMatches.length * 12 + Math.min(cvTokens.size, 20));
      const score = Math.max(20, Math.round(rawScore));
      const matchTerms = [...tagMatches, ...uniqueMatches].slice(0, 3);

      return {
        opportunity_id: opportunity.id,
        score,
        reason: matchTerms.length
          ? `Your CV mentions ${matchTerms.join(', ')}, which aligns with this opportunity.`
          : 'This opportunity matches your background across the job description and eligibility criteria.',
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankOpportunitiesByTags(seedTags: string[], pool: Opportunity[] = opportunities): MatchResult[] {
  const normalizedSeedTags = seedTags.map((tag) => tag.toLowerCase());

  return pool
    .map((opportunity) => {
      const overlap = opportunity.tags.filter((tag) =>
        normalizedSeedTags.some((seedTag) => seedTag.includes(tag.toLowerCase()) || tag.toLowerCase().includes(seedTag)),
      );

      const score = Math.max(20, Math.min(96, overlap.length * 20 + opportunity.tags.length * 2));
      return {
        opportunity_id: opportunity.id,
        score,
        reason: overlap.length
          ? `Matches your saved interests in ${overlap.slice(0, 3).join(', ')}.`
          : 'A relevant opportunity based on your profile and saved activity.',
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getOpportunitySeedTags(savedOpportunities: Opportunity[]) {
  return Array.from(
    new Set(savedOpportunities.flatMap((opportunity) => opportunity.tags).map((tag) => tag.trim()).filter(Boolean)),
  );
}