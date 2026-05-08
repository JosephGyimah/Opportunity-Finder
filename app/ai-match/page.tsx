'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { opportunities } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import {
  Sparkles,
  Upload,
  FileText,
  X,
  AlertCircle,
  ChevronDown,
  Brain,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface MatchResult {
  opportunity_id: string;
  score: number;
  reason: string;
}

type UploadMode = 'file' | 'text';

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'from', 'this', 'your', 'you', 'are', 'was', 'were', 'have', 'has',
  'into', 'about', 'will', 'their', 'they', 'them', 'our', 'out', 'not', 'can', 'who', 'all', 'any', 'but',
  'more', 'than', 'use', 'used', 'using', 'experience', 'skills', 'skill', 'work', 'working', 'project',
  'projects', 'team', 'teams', 'years', 'year', 'role', 'roles', 'student', 'students', 'degree', 'high',
  'college', 'university', 'based', 'resume', 'cv', 'responsible', 'responsibilities', 'focused'
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .match(/[a-z0-9+.#-]+/g)
    ?.filter((token) => token.length > 2 && !stopWords.has(token)) ?? [];
}

function scoreOpportunity(cvText: string, opportunity: (typeof opportunities)[number]) {
  const cvTokens = new Set(tokenize(cvText));
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
  const reason = matchTerms.length
    ? `Your CV mentions ${matchTerms.join(', ')}, which aligns with this opportunity.`
    : 'This opportunity matches your background across the job description and eligibility criteria.';

  return { opportunity_id: opportunity.id, score, reason };
}

export default function AIMatchPage() {
  const { user } = useAuth();
  const [uploadMode, setUploadMode] = useState<UploadMode>('text');
  const [cvText, setCvText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
      setFile(f);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const extractTextFromFile = async (f: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsText(f);
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setError('');
    setLoading(true);
    setDone(false);
    setMatches([]);

    let cv = cvText.trim();
    if (uploadMode === 'file' && file) {
      cv = await extractTextFromFile(file);
    }

    if (!cv || cv.length < 50) {
      setError('Please provide a more detailed CV (at least 50 characters).');
      setLoading(false);
      return;
    }

    try {
      const results = opportunities
        .map((opportunity) => scoreOpportunity(cv, opportunity))
        .sort((a, b) => b.score - a.score);

      setMatches(results);
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const matchedOpportunities = matches
    .sort((a, b) => b.score - a.score)
    .map((m) => ({
      opportunity: opportunities.find((o) => o.id === m.opportunity_id),
      score: m.score,
      reason: m.reason,
    }))
    .filter((m) => m.opportunity);

  const steps = [
    { num: 1, label: 'Paste or upload your CV' },
    { num: 2, label: 'AI analyzes your profile' },
    { num: 3, label: 'Get personalized matches' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-4">
            <Brain className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300 text-sm font-medium">Smart local matching</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            AI Opportunity Matcher
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Upload or paste your CV and the app will score opportunities against your skills, experience, and interests.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-10">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  (done && step.num === 3) || (loading && step.num === 2) || (!loading && !done && step.num === 1)
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {done && step.num <= 3 ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-slate-400 text-xs hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronDown className="w-3 h-3 text-slate-700 rotate-[-90deg] shrink-0" />
              )}
            </div>
          ))}
        </div>

        {!done ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            {!user && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 text-sm font-medium">Sign in required</p>
                  <p className="text-slate-400 text-xs mt-1">
                    <Link href="/auth" className="text-teal-400 hover:underline">Sign in</Link> to save your matched opportunities to your dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Input mode toggle */}
            <div className="flex bg-slate-800 rounded-xl p-1 mb-6 w-fit">
              <button
                onClick={() => setUploadMode('text')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  uploadMode === 'text'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
              <button
                onClick={() => setUploadMode('file')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  uploadMode === 'file'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {uploadMode === 'text' ? (
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Paste your CV / Resume
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV here... Include your education, work experience, skills, projects, and any other relevant information."
                  className="w-full h-56 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
                <p className="text-slate-500 text-xs mt-1.5 text-right">{cvText.length} characters</p>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Upload CV File
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    file
                      ? 'border-teal-500/50 bg-teal-500/5'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-6 h-6 text-teal-400" />
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-slate-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="ml-2 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm font-medium">Drop your CV here or click to browse</p>
                      <p className="text-slate-500 text-xs mt-1">PDF or TXT files supported</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || (uploadMode === 'text' ? cvText.length < 50 : !file)}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing your CV...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Find My Best Matches
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">Analysis Complete!</h3>
                <p className="text-slate-400 text-sm">
                  Found <span className="text-teal-400 font-semibold">{matchedOpportunities.length} matching opportunities</span> based on your profile.
                </p>
              </div>
              <button
                onClick={() => { setDone(false); setMatches([]); setCvText(''); setFile(null); }}
                className="text-slate-400 hover:text-white text-sm flex items-center gap-1 shrink-0"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:block">Start over</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedOpportunities.map(({ opportunity, score, reason }) => (
                <OpportunityCard
                  key={opportunity!.id}
                  opportunity={opportunity!}
                  matchScore={score}
                  matchReason={reason}
                />
              ))}
            </div>

            {matchedOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No strong matches found. Try updating your CV with more details.</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium text-sm"
              >
                View your saved opportunities in Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
