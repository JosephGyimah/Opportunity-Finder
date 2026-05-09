'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { opportunities, getOpportunityById } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Bookmark, Sparkles, TrendingUp, ArrowRight, Search, Plus, Brain, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getOpportunitySeedTags, rankOpportunitiesByTags } from '@/lib/opportunityInsights';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadSavedOpportunities = async () => {
      try {
        const savedQuery = query(
          collection(db, 'users', user.uid, 'savedOpportunities'),
          orderBy('savedAt', 'desc'),
        );
        const snapshot = await getDocs(savedQuery);
        setSavedIds(snapshot.docs.map((item) => item.data().opportunityId as string));
      } finally {
        setFetchingData(false);
      }
    };

    void loadSavedOpportunities();
  }, [user]);

  const handleSaveToggle = (id: string, saved: boolean) => {
    if (!saved) {
      setSavedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const savedOpportunities = savedIds
    .map((id) => getOpportunityById(id))
    .filter(Boolean) as typeof opportunities;

  const savedTags = useMemo(() => getOpportunitySeedTags(savedOpportunities), [savedOpportunities]);
  const recommendedMatches = useMemo(() => rankOpportunitiesByTags(savedTags), [savedTags]);
  const recommendedOpportunities = recommendedMatches
    .slice(0, 3)
    .map((match) => ({
      opportunity: opportunities.find((item) => item.id === match.opportunity_id),
      score: match.score,
      reason: match.reason,
    }))
    .filter((item) => item.opportunity);

  const tagFrequency = savedOpportunities.reduce<Record<string, number>>((acc, opportunity) => {
    opportunity.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});

  const topInterest = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];
  const profileStrength = Math.max(48, Math.min(98, 58 + savedTags.length * 4 + savedIds.length * 3));

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-on-tertiary-fixed-variant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    {
      label: 'Saved Opportunities',
      value: savedIds.length,
      icon: Bookmark,
      color: 'text-on-tertiary-fixed-variant',
      bg: 'bg-on-tertiary-fixed-variant/10',
      note: `${savedIds.length} tracked items`,
    },
    {
      label: 'Saved Tags',
      value: savedTags.length,
      icon: TrendingUp,
      color: 'text-primary-container',
      bg: 'bg-primary-container/10',
      note: `${savedTags.length} interest signals`,
    },
    {
      label: 'Profile Strength',
      value: `${profileStrength}%`,
      icon: Sparkles,
      color: 'text-secondary',
      bg: 'bg-secondary-container',
      note: 'Profile is healthy',
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-on-tertiary-fixed-variant font-semibold text-sm uppercase tracking-[0.18em]">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </div>
          <h1 className="text-[2rem] sm:text-4xl font-semibold tracking-tight text-primary mb-2">
            Welcome back, {user.email?.split('@')[0] ?? 'Alex'}
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Your career journey is progressing well. Here is your weekly overview.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl navy-shadow border border-outline-variant/15">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-sm font-semibold tracking-wide text-on-surface-variant mb-1">{stat.label}</div>
              <div className="text-3xl font-semibold text-primary">{stat.value}</div>
              <div className="mt-4 flex items-center text-xs font-semibold text-on-tertiary-fixed-variant">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {stat.note}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <div className="bg-on-tertiary-fixed-variant rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)]">
            <div className="p-8 sm:p-10 md:w-3/5 text-on-tertiary relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase">Featured Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">AI Career Copilot</h2>
              <p className="text-sm sm:text-base opacity-90 mb-6 max-w-2xl leading-relaxed">
                {topInterest
                  ? `We’ve identified strong momentum around ${topInterest}. Explore more opportunities that deepen that focus and keep your profile moving forward.`
                  : 'Save a few opportunities or upload your CV to unlock personalized career guidance and sharper match recommendations.'}
              </p>
              <Link href="/ai-match" className="inline-flex items-center gap-2 bg-surface text-on-tertiary-fixed-variant px-5 py-3 rounded-xl font-semibold text-sm hover:bg-surface-container-low transition-all">
                {topInterest ? 'Analyze gap' : 'Upload CV'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="md:w-2/5 min-h-[240px] bg-gradient-to-br from-surface-container-low via-secondary-container to-primary-container relative overflow-hidden">
              <div className="absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.25),transparent_28%)]" />
              <div className="relative h-full flex flex-col justify-center p-8 sm:p-10 text-on-primary">
                <Brain className="w-10 h-10 mb-4 text-tertiary-fixed" />
                <h3 className="text-2xl font-semibold mb-3">Chart your path with precision.</h3>
                <p className="text-sm sm:text-base opacity-85 max-w-xs">Turn saved opportunities into a stronger profile and a clearer search strategy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-[2rem] font-semibold tracking-tight text-primary">Opportunities for you</h2>
              <p className="text-sm sm:text-base text-on-surface-variant">Based on your saved interests and profile</p>
            </div>
            <button className="inline-flex items-center gap-2 text-on-tertiary-fixed-variant font-semibold hover:underline">
              <Search className="w-4 h-4" />
              View all
            </button>
          </div>

          {fetchingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 navy-shadow border border-outline-variant/10 h-72 animate-pulse" />
              ))}
            </div>
          ) : recommendedOpportunities.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-10 text-center navy-shadow border border-outline-variant/10">
              <Bookmark className="w-10 h-10 text-outline mx-auto mb-3" />
              <h3 className="text-primary font-semibold mb-2">No recommended opportunities yet</h3>
              <p className="text-on-surface-variant text-sm mb-5 max-w-md mx-auto">
                Save a few opportunities or upload a CV to surface personalized recommendations here.
              </p>
              <Link href="/ai-match" className="inline-flex items-center gap-2 bg-primary hover:bg-on-surface text-on-primary font-semibold px-4 py-2.5 rounded-xl text-sm transition-all">
                Match my CV
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedOpportunities.map(({ opportunity, score, reason }) => (
                <div key={opportunity!.id} className="bg-surface-container-lowest p-6 rounded-2xl navy-shadow border border-transparent hover:border-primary/10 hover:shadow-md transition-all group flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {opportunity!.logo ? (
                        <img src={opportunity!.logo} alt={opportunity!.organization} className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-outline-variant/60" />
                      ) : (
                        <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center font-semibold text-primary text-lg shrink-0">
                          {opportunity!.organization.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-primary leading-snug line-clamp-2 group-hover:text-on-tertiary-fixed-variant transition-colors">{opportunity!.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">{opportunity!.organization}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant border border-on-tertiary-fixed-variant/20 whitespace-nowrap">
                      {score}% match
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-4 border border-on-tertiary-fixed-variant/15">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-on-tertiary-fixed-variant" />
                      <span className="text-xs font-semibold text-on-tertiary-fixed-variant uppercase tracking-[0.18em]">AI Insight</span>
                    </div>
                    <p className="text-sm text-on-surface leading-relaxed">{reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {opportunity!.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-surface-container-high rounded-md text-xs font-semibold text-on-surface-variant">{tag}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
                    <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {opportunity!.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {opportunity!.deadline === 'Rolling' ? 'Rolling deadline' : `Due ${opportunity!.deadline}`}
                      </span>
                    </div>
                    <a href={opportunity!.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-on-surface transition-all">
                      Apply now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {savedOpportunities.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-5 h-5 text-on-tertiary-fixed-variant" />
              <h2 className="text-lg font-semibold text-primary">Saved opportunities</h2>
              <span className="bg-surface-container text-on-surface-variant text-xs px-2 py-0.5 rounded-full">{savedIds.length}</span>
            </div>

            {fetchingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 navy-shadow border border-outline-variant/10 h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} saved onSaveToggle={handleSaveToggle} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <Link href="/ai-match" className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 bg-on-tertiary-fixed-variant text-on-tertiary px-4 py-3 rounded-full shadow-[0_10px_30px_-12px_rgba(0,31,63,0.25)] hover:scale-105 transition-transform active:scale-95">
        <Plus className="w-4 h-4" />
        <span className="font-semibold text-sm pr-1">New application</span>
      </Link>
    </div>
  );
}
