'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { opportunities } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import { Input } from '@/components/ui/input';
import { Sparkles, Search } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const filtered = opportunities.filter((opp) =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOpportunities(filtered);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Discover Opportunities</h1>
        <p className="text-slate-400 text-lg">Find scholarships, internships, and jobs that match your skills</p>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <Input
          type="search"
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 pl-10 h-12 rounded-lg"
        />
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No opportunities found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}
