"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { opportunities, type Opportunity } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, ArrowRight, Bookmark, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { rankOpportunitiesByTags } from '@/lib/opportunityInsights';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const recommendedTags = useMemo(() => {
    const tags = searchParams.get('tags');
    if (!tags) return [];
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [searchParams]);

  const recommendedOpportunities = useMemo(() => {
    if (recommendedTags.length === 0) return [];

    return rankOpportunitiesByTags(recommendedTags)
      .map((match) => ({
        opportunity: opportunities.find((opp) => opp.id === match.opportunity_id),
        score: match.score,
        reason: match.reason,
      }))
      .filter((item): item is { opportunity: Opportunity; score: number; reason: string } => Boolean(item.opportunity));
  }, [recommendedTags]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const isRecommendationView = recommendedOpportunities.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-on-tertiary-fixed-variant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          <div className="lg:col-span-8 tactile-card rounded-2xl p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 bg-on-tertiary-fixed-variant/10 border border-on-tertiary-fixed-variant/20 rounded-full px-4 py-2 mb-5">
              <Sparkles className="w-4 h-4 text-on-tertiary-fixed-variant" />
              <span className="text-on-tertiary-fixed-variant text-sm font-semibold">Opportunity Finder discovery feed</span>
            </div>
            <h1 className="text-[2rem] sm:text-5xl font-semibold tracking-tight text-primary mb-4 leading-tight">
              Discover opportunities with precision.
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
              Search scholarships, internships, and jobs that align with your interests, then save the ones worth chasing.
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <Input
                type="search"
                placeholder="Search opportunities, tags, organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 rounded-2xl pl-12 bg-surface border-outline-variant text-primary placeholder:text-outline focus-visible:ring-on-tertiary-fixed-variant/20 focus-visible:border-on-tertiary-fixed-variant"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Internships', 'Scholarships', 'Remote', 'Africa'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSearchTerm(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-primary transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-on-tertiary-fixed-variant text-on-tertiary rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)] flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">Saved focus</span>
              </div>
              <div className="text-3xl font-semibold mb-2">{filteredOpportunities.length}</div>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                Opportunities currently matching your search and profile keywords.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-surface text-on-tertiary-fixed-variant px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-all">
                Go to dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 navy-shadow border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3 text-on-tertiary-fixed-variant font-semibold text-sm uppercase tracking-[0.18em]">
                <TrendingUp className="w-4 h-4" />
                Trending now
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Use AI Match to rank opportunities from a CV, then save the strongest ones to your dashboard.
              </p>
            </div>
          </div>
        </section>

        {recommendedTags.length > 0 && (
          <div className="tactile-card rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-on-tertiary-fixed-variant mb-1">CV analysis view</p>
              <h2 className="text-lg font-semibold text-primary">Recommended opportunities based on your CV</h2>
              <p className="text-sm text-on-surface-variant mt-1">Showing opportunities ranked from the tags passed from your CV analysis.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedTags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {isRecommendationView ? (
          recommendedOpportunities.length === 0 ? (
            <div className="tactile-card rounded-2xl p-12 text-center">
              <p className="text-on-surface-variant text-lg">No strong recommended opportunities were found for this CV analysis.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedOpportunities.map(({ opportunity, score, reason }) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  matchScore={score}
                  matchReason={reason}
                />
              ))}
            </div>
          )
        ) : filteredOpportunities.length === 0 ? (
          <div className="tactile-card rounded-2xl p-12 text-center">
            <p className="text-on-surface-variant text-lg">No opportunities found matching “{searchTerm}”</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
