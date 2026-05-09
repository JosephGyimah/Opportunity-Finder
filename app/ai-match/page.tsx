'use client';

import { useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { opportunities } from '@/lib/opportunities';
import OpportunityCard from '@/components/OpportunityCard';
import { deriveCareerPaths, extractSkills, rankOpportunitiesByText, type MatchResult } from '@/lib/opportunityInsights';
import { Sparkles, Upload, FileText, X, AlertCircle, ChevronDown, Brain, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

type UploadMode = 'file' | 'text';

export default function AIMatchPage() {
  const { user } = useAuth();
  const [uploadMode, setUploadMode] = useState<UploadMode>('text');
  const [cvText, setCvText] = useState('');
  const [analysisText, setAnalysisText] = useState('');
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
      const response = await fetch('/api/ai-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvText: cv }),
      });

      if (!response.ok) {
        throw new Error('Gemini matching is temporarily unavailable.');
      }

      const data = (await response.json()) as { matches?: MatchResult[] };
      const results = Array.isArray(data.matches) && data.matches.length > 0 ? data.matches : rankOpportunitiesByText(cv);

      setAnalysisText(cv);
      setMatches(results);
      setDone(true);
    } catch (err: any) {
      const results = rankOpportunitiesByText(cv);
      setAnalysisText(cv);
      setMatches(results);
      setDone(true);

      if (results.length === 0) {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const matchedOpportunities = matches
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((m) => ({
      opportunity: opportunities.find((o) => o.id === m.opportunity_id),
      score: m.score,
      reason: m.reason,
    }))
    .filter((m) => m.opportunity);

  const detectedSkills = useMemo(() => (analysisText ? extractSkills(analysisText) : []), [analysisText]);
  const careerPaths = useMemo(() => (analysisText ? deriveCareerPaths(analysisText) : ['Upload a CV to discover your best-fit path']), [analysisText]);

  const steps = [
    { num: 1, label: 'Paste or upload your CV' },
    { num: 2, label: 'AI analyzes your profile' },
    { num: 3, label: 'Get personalized matches' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-on-tertiary-fixed-variant/10 border border-on-tertiary-fixed-variant/20 rounded-full px-4 py-2 mb-4">
            <Brain className="w-4 h-4 text-on-tertiary-fixed-variant" />
            <span className="text-on-tertiary-fixed-variant text-sm font-semibold">Navigator AI matching</span>
          </div>
          <h1 className="text-[2rem] sm:text-4xl font-semibold tracking-tight text-primary mb-3">Upload your CV</h1>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Paste your CV or upload a file, then let Gemini rank the most relevant opportunities and explain why they fit.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-8 sm:mb-10 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border ${
                  (done && step.num <= 3) || (!done && step.num === 1)
                    ? 'bg-primary text-on-primary border-primary'
                    : loading && step.num === 2
                    ? 'bg-on-tertiary-fixed-variant text-on-tertiary border-on-tertiary-fixed-variant'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant'
                }`}>
                  {done && step.num <= 3 ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-on-surface-variant text-xs sm:text-sm hidden sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && <ChevronDown className="w-3.5 h-3.5 text-outline rotate-[-90deg] shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-4 flex flex-col gap-6">
            {!user && (
              <div className="bg-secondary-container/50 border border-outline-variant rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-on-tertiary-fixed-variant shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-semibold text-sm">Sign in required</p>
                  <p className="text-on-surface-variant text-xs mt-1">
                    <Link href="/auth" className="text-on-tertiary-fixed-variant font-semibold hover:underline">Sign in</Link> to save your matched opportunities to your dashboard.
                  </p>
                </div>
              </div>
            )}

            <div className="tactile-card rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-headline-md text-2xl font-semibold text-primary">Upload your CV</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Paste text or upload a plain text file.</p>
                </div>
                <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[24px]">upload_file</span>
              </div>

              <div className="flex bg-surface-container rounded-full p-1 mb-6 border border-outline-variant/70 w-fit">
                <button
                  onClick={() => setUploadMode('text')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    uploadMode === 'text'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Paste text
                </button>
                <button
                  onClick={() => setUploadMode('file')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    uploadMode === 'file'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload file
                </button>
              </div>

              {uploadMode === 'text' ? (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-primary mb-2">Paste your CV / Resume</label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste your CV here. Include your education, experience, skills, and projects."
                    className="w-full h-56 bg-surface border border-outline-variant rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-on-tertiary-fixed-variant/20 focus:border-on-tertiary-fixed-variant transition-colors resize-none"
                  />
                  <p className="text-outline text-xs mt-2 text-right">{cvText.length} characters</p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-primary mb-2">Upload CV File</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      file
                        ? 'border-on-tertiary-fixed-variant bg-on-tertiary-fixed-variant/5'
                        : 'border-outline-variant hover:border-on-tertiary-fixed-variant/60 hover:bg-surface-container-low'
                    }`}
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-6 h-6 text-on-tertiary-fixed-variant" />
                        <div className="text-left">
                          <p className="text-primary text-sm font-semibold">{file.name}</p>
                          <p className="text-on-surface-variant text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="ml-2 text-on-surface-variant hover:text-primary"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-outline mx-auto mb-2" />
                        <p className="text-primary text-sm font-semibold">Drop your CV here or click to browse</p>
                        <p className="text-outline text-xs mt-1">TXT files supported</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".txt,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {error && (
                <div className="mb-4 bg-error-container border border-error/20 rounded-2xl px-4 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || (uploadMode === 'text' ? cvText.length < 50 : !file)}
                className="w-full py-3.5 bg-primary hover:bg-on-surface disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-semibold rounded-2xl text-sm shadow-lg shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)] transition-all flex items-center justify-center gap-2"
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
                    Find my best matches
                  </>
                )}
              </button>
            </div>

            <div className="tactile-card rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-primary">Extracted skills</h3>
                <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[22px]">auto_awesome</span>
              </div>

              {analysisText ? (
                <div className="flex flex-wrap gap-2">
                  {detectedSkills.map((skill) => (
                    <span key={skill} className="bg-primary-container/10 text-primary-container px-3 py-1.5 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant text-sm">
                  Submit a CV to surface likely skills and career directions.
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-outline-variant">
                <p className="text-xs uppercase tracking-[0.22em] text-outline mb-3 font-semibold">Identified career paths</p>
                <div className="space-y-2">
                  {careerPaths.map((path) => (
                    <div key={path} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-on-tertiary-fixed-variant" />
                      <span className="text-sm text-primary">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[1.75rem] sm:text-[2rem] font-semibold tracking-tight text-primary">Recommended Opportunities</h2>
                <p className="text-sm sm:text-base text-on-surface-variant">Based on your CV and recent market trends</p>
              </div>
              <button
                onClick={() => {
                  setDone(false);
                  setMatches([]);
                  setCvText('');
                  setAnalysisText('');
                  setFile(null);
                  setError('');
                }}
                className="inline-flex items-center gap-2 text-on-tertiary-fixed-variant font-semibold hover:underline"
              >
                <Search className="w-4 h-4" />
                Refine matches
              </button>
            </div>

            {done ? (
              <div className="space-y-6">
                <div className="bg-on-tertiary-fixed-variant/10 border border-on-tertiary-fixed-variant/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-on-tertiary-fixed-variant rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-on-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-primary font-semibold">Analysis complete</h3>
                    <p className="text-on-surface-variant text-sm">
                      Found <span className="text-on-tertiary-fixed-variant font-semibold">{matchedOpportunities.length} matching opportunities</span> based on your profile.
                    </p>
                  </div>
                </div>

                {matchedOpportunities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {matchedOpportunities.map(({ opportunity, score, reason }) => (
                      <OpportunityCard
                        key={opportunity!.id}
                        opportunity={opportunity!}
                        matchScore={score}
                        matchReason={reason}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="tactile-card rounded-2xl p-10 text-center">
                    <p className="text-on-surface-variant">No strong matches found. Try updating your CV with more detail.</p>
                  </div>
                )}

                <div className="text-center">
                  <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-tertiary-fixed-variant hover:text-primary font-semibold text-sm">
                    View your saved opportunities in Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="tactile-card rounded-2xl p-10 min-h-[32rem] flex items-center justify-center text-center">
                <div className="max-w-md">
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">Your match results will appear here</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Once you submit your CV, Gemini will rank the best-fit opportunities and explain why each one matters.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
