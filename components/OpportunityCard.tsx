'use client';

import { useState } from 'react';
import { Opportunity, typeColors, typeLabels } from '@/lib/opportunities';
import { MapPin, Calendar, Bookmark, BookmarkCheck, ExternalLink, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface OpportunityCardProps {
  opportunity: Opportunity;
  saved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
  matchScore?: number;
  matchReason?: string;
}

export default function OpportunityCard({
  opportunity,
  saved = false,
  onSaveToggle,
  matchScore,
  matchReason,
}: OpportunityCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/auth');
      return;
    }

    setSaving(true);
    try {
      const savedRef = doc(db, 'users', user.uid, 'savedOpportunities', opportunity.id);
      if (isSaved) {
        await deleteDoc(savedRef);
        setIsSaved(false);
        onSaveToggle?.(opportunity.id, false);
      } else {
        await setDoc(savedRef, {
          opportunityId: opportunity.id,
          savedAt: serverTimestamp(),
        });
        setIsSaved(true);
        onSaveToggle?.(opportunity.id, true);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {opportunity.logo && (
            <img
              src={opportunity.logo}
              alt={opportunity.organization}
              className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-teal-300 transition-colors">
              {opportunity.title}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{opportunity.organization}</p>
          </div>
        </div>
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className={`shrink-0 p-2 rounded-xl transition-all ${
            isSaved
              ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'
              : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save opportunity'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Type badge + match score */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[opportunity.type]}`}>
          {typeLabels[opportunity.type]}
        </span>
        {matchScore !== undefined && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
        {opportunity.description}
      </p>

      {/* Match reason */}
      {matchReason && (
        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3">
          <p className="text-teal-300 text-xs leading-relaxed">
            <span className="font-semibold">Why it matches: </span>{matchReason}
          </p>
        </div>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {opportunity.deadline === 'Rolling' ? 'Rolling deadline' : `Due ${opportunity.deadline}`}
        </span>
        {opportunity.stipend && (
          <span className="flex items-center gap-1 text-emerald-500">
            <DollarSign className="w-3.5 h-3.5" />
            {opportunity.stipend}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {opportunity.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
        {opportunity.tags.length > 3 && (
          <span className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
            +{opportunity.tags.length - 3}
          </span>
        )}
      </div>

      {/* Apply button */}
      <a
        href={opportunity.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all group/btn"
        onClick={(e) => e.stopPropagation()}
      >
        View Opportunity
        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
}
