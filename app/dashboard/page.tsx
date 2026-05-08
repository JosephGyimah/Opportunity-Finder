'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { opportunities, getOpportunityById } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Bookmark, Sparkles, TrendingUp, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
          orderBy('savedAt', 'desc')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    {
      label: 'Saved Opportunities',
      value: savedIds.length,
      icon: Bookmark,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      label: 'Total Available',
      value: opportunities.length,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Match Rate',
      value: savedIds.length > 0 ? `${Math.round((savedIds.length / opportunities.length) * 100)}%` : '0%',
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-teal-400" />
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Welcome back, <span className="text-white font-medium">{user.email}</span>
            </p>
          </div>
          <Link
            href="/ai-match"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            AI Match My CV
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Your Profile</h2>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-3">
              Upload your CV to get personalized AI-powered opportunity matches tailored to your skills and experience.
            </p>
            <Link
              href="/ai-match"
              className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
            >
              Go to AI Matcher <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Saved opportunities */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Bookmark className="w-5 h-5 text-teal-400" />
            <h2 className="text-white font-semibold text-lg">Saved Opportunities</h2>
            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{savedIds.length}</span>
          </div>

          {fetchingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-64 animate-pulse" />
              ))}
            </div>
          ) : savedOpportunities.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <Bookmark className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No saved opportunities yet</h3>
              <p className="text-slate-400 text-sm mb-5">
                Browse opportunities and click the bookmark icon to save them here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                Browse Opportunities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  saved
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
