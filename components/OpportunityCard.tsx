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
    <div className="group bg-surface-container-lowest border border-transparent rounded-2xl p-5 sm:p-6 navy-shadow hover:border-primary/10 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {opportunity.logo && (
            <img
              src={opportunity.logo}
              alt={opportunity.organization}
              className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-outline-variant/60"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-primary text-sm leading-snug line-clamp-2 group-hover:text-on-tertiary-fixed-variant transition-colors">
              {opportunity.title}
            </h3>
            <p className="text-on-surface-variant text-xs mt-0.5">{opportunity.organization}</p>
          </div>
        </div>
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className={`shrink-0 p-2 rounded-xl transition-all ${
            isSaved
              ? 'bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant hover:bg-on-tertiary-fixed-variant/20'
              : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
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
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[opportunity.type]} border border-transparent`}>
          {typeLabels[opportunity.type]}
        </span>
        {matchScore !== undefined && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant border border-on-tertiary-fixed-variant/20">
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">
        {opportunity.description}
      </p>

      {/* Match reason */}
      {matchReason && (
        <div className="bg-surface-container-low rounded-xl p-3 border border-on-tertiary-fixed-variant/15">
          <p className="text-on-surface text-xs leading-relaxed">
            <span className="font-semibold">Why it matches: </span>{matchReason}
          </p>
        </div>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {opportunity.deadline === 'Rolling' ? 'Rolling deadline' : `Due ${opportunity.deadline}`}
        </span>
        {opportunity.stipend && (
          <span className="flex items-center gap-1 text-secondary">
            <DollarSign className="w-3.5 h-3.5" />
            {opportunity.stipend}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {opportunity.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
        {opportunity.tags.length > 3 && (
          <span className="text-xs bg-surface-container text-outline px-2 py-0.5 rounded-md">
            +{opportunity.tags.length - 3}
          </span>
        )}
      </div>

      {/* Apply button */}
      <a
        href={opportunity.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2.5 bg-primary hover:bg-on-surface text-on-primary rounded-xl text-xs font-semibold transition-all group/btn"
        onClick={(e) => e.stopPropagation()}
      >
        View Opportunity
        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
}
