import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Filter, 
  Search, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Brain, 
  Sliders, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Target
} from 'lucide-react';
import { 
  LIKERT_500_QUESTIONS, 
  computeParametersFromLikert, 
  generatePresetLikertResponses,
  PARAMETER_METADATA 
} from '../data/likert500Questions';
import { LikertDomain, FullCognitiveState, PersonalityParameterKey } from '../types';

interface PersonalityMatrixProps {
  state: FullCognitiveState;
  onUpdateResponses: (responses: Record<string, number>) => void;
  onSynthesizeNarrative: () => void;
  onNavigateToParameters: () => void;
  isSynthesizing: boolean;
}

const DOMAIN_LABELS: Record<LikertDomain, { name: string; color: string; desc: string }> = {
  engineering_philosophy: { name: 'Engineering Philosophy', color: 'indigo', desc: 'Simplicity, abstractions, tech debt, typing, and architecture.' },
  decision_and_tradeoffs: { name: 'Decisions & Trade-offs', color: 'emerald', desc: 'Reversibility, speed vs certainty, consensus, and scope.' },
  problem_solving_heuristics: { name: 'Problem Solving', color: 'blue', desc: 'First principles, root cause debugging, bisection, and mental models.' },
  risk_and_uncertainty: { name: 'Risk & Uncertainty', color: 'amber', desc: 'Ambiguity tolerance, blast radius, crisis composure, and hedging.' },
  epistemic_updating: { name: 'Epistemic Updating', color: 'purple', desc: 'Bayesian updating, intellectual humility, hype skepticism, and proof.' },
  interpersonal_and_candor: { name: 'Interpersonal & Candor', color: 'rose', desc: 'Radical candor, direct feedback, debate posture, and zero-politics.' },
  curiosity_and_depth: { name: 'Curiosity & Depth', color: 'cyan', desc: 'Rabbit-hole inquisitiveness, polymath synthesis, and toy prototypes.' },
  stress_and_resilience: { name: 'Stress & Resilience', color: 'teal', desc: 'Incident equanimity, deadline crunch, and extreme ownership.' },
  execution_and_velocity: { name: 'Execution & Velocity', color: 'orange', desc: 'Bias for action, MVP philosophy, meeting elimination, and shipping cadence.' },
  autonomy_and_work_ethic: { name: 'Autonomy & Agency', color: 'violet', desc: 'Self-direction, craft pride, deep work flow, and extreme agency.' },
};

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', short: 'SD', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 active:bg-rose-200' },
  { value: 2, label: 'Disagree', short: 'D', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 active:bg-orange-200' },
  { value: 3, label: 'Neutral', short: 'N', color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 active:bg-slate-200' },
  { value: 4, label: 'Agree', short: 'A', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 active:bg-emerald-200' },
  { value: 5, label: 'Strongly Agree', short: 'SA', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 active:bg-indigo-200' },
];

export const PersonalityMatrix: React.FC<PersonalityMatrixProps> = ({
  state,
  onUpdateResponses,
  onSynthesizeNarrative,
  onNavigateToParameters,
  isSynthesizing,
}) => {
  const responses = useMemo(() => state.likert_responses || {}, [state.likert_responses]);
  
  const [selectedDomain, setSelectedDomain] = useState<LikertDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Compute metrics
  const { parameters, domainScores, completionStats } = useMemo(() => {
    return computeParametersFromLikert(responses);
  }, [responses]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return LIKERT_500_QUESTIONS.filter(q => {
      if (selectedDomain !== 'all' && q.domain !== selectedDomain) return false;
      if (filterStatus === 'answered' && responses[q.id] === undefined) return false;
      if (filterStatus === 'unanswered' && responses[q.id] !== undefined) return false;
      if (searchQuery.trim()) {
        const qText = q.text.toLowerCase();
        const sub = q.subdomain.toLowerCase();
        const s = searchQuery.toLowerCase();
        if (!qText.includes(s) && !sub.includes(s)) return false;
      }
      return true;
    });
  }, [selectedDomain, filterStatus, searchQuery, responses]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page, pageSize]);

  const handleSelectScore = (questionId: string, score: number) => {
    const updated = { ...responses, [questionId]: score };
    onUpdateResponses(updated);
  };

  const handleLoadPreset = (preset: 'sambit_exact' | 'pragmatic_hacker' | 'rigorous_architect' | 'startup_founder' | 'academic_purist') => {
    const presetData = generatePresetLikertResponses(preset);
    onUpdateResponses(presetData);
  };

  const handleClearAll = () => {
    if (window.confirm('Reset all 500 Likert responses back to neutral default?')) {
      onUpdateResponses({});
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      {/* Top Banner & Control Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  500-Item Cognitive & Personality Matrix
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full font-mono font-semibold">
                    v2.0 Psychometric Architecture
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-resolution Likert mapping across 10 cognitive domains to generate exact model parameters and behavioral narratives.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Presets dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <button
                onClick={() => handleLoadPreset('sambit_exact')}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-xs transition"
                title="Populate with Sambit's high-velocity, first-principles cognitive profile"
              >
                Sambit (Authentic)
              </button>
              <button
                onClick={() => handleLoadPreset('pragmatic_hacker')}
                className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white rounded-md transition"
              >
                Pragmatic Hacker
              </button>
              <button
                onClick={() => handleLoadPreset('rigorous_architect')}
                className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white rounded-md transition"
              >
                Rigorous Architect
              </button>
              <button
                onClick={() => handleLoadPreset('startup_founder')}
                className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white rounded-md transition"
              >
                Founder
              </button>
            </div>

            <button
              onClick={onSynthesizeNarrative}
              disabled={isSynthesizing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Behavioral Narrative'}</span>
            </button>

            <button
              onClick={onNavigateToParameters}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>View Parameters</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <span className="font-semibold text-slate-700 whitespace-nowrap">
              Assessment Progress:
            </span>
            <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(5, completionStats.completionPercentage)}%` }}
              />
            </div>
            <span className="font-mono font-bold text-slate-900">
              {completionStats.answeredCount} / {completionStats.totalCount} ({completionStats.completionPercentage}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {completionStats.answeredCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1 transition px-2 py-0.5 rounded hover:bg-rose-50"
              >
                <RotateCcw className="w-3 h-3" /> Reset Answers
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: Domain Sidebar + Questions List */}
      <div className="flex-1 flex min-h-0 max-w-7xl w-full mx-auto p-6 gap-6 overflow-hidden">
        {/* Left Column: Domain Selectors & Radar Snapshot */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Domain Filter List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Cognitive Domains (10)</span>
              <span className="font-mono text-[10px] text-slate-400">50 items/ea</span>
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedDomain('all'); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  selectedDomain === 'all'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All 500 Questions</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">500</span>
              </button>

              {(Object.keys(DOMAIN_LABELS) as LikertDomain[]).map(d => {
                const info = DOMAIN_LABELS[d];
                const score = domainScores[d] || 0;
                const isSelected = selectedDomain === d;
                return (
                  <button
                    key={d}
                    onClick={() => { setSelectedDomain(d); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate pr-1">{info.name}</span>
                      <span className={`font-mono text-[11px] font-bold ${score >= 80 ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-4 shadow-sm text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" /> Parameter Readiness
              </span>
              <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 rounded font-mono font-bold text-[10px]">
                {completionStats.completionPercentage >= 80 ? 'HIGH FIDELITY' : 'CALIBRATING'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every answered item directly shifts the 20 model weight vectors. 500 questions yield a high-resolution representation of your behavioral boundary conditions.
            </p>
            <button
              onClick={onNavigateToParameters}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-center transition flex items-center justify-center gap-1.5"
            >
              <span>Inspect 20 Parameters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Search, Filtering, and Paginated Questions List */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* List Header / Search Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search questions or subdomains..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter status */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => { setFilterStatus('all'); setPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All ({filteredQuestions.length})
                </button>
                <button
                  onClick={() => { setFilterStatus('answered'); setPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'answered' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Answered
                </button>
                <button
                  onClick={() => { setFilterStatus('unanswered'); setPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition ${filterStatus === 'unanswered' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Unanswered
                </button>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2">{page}/{totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
            {paginatedQuestions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No questions found matching your search and filter criteria.
              </div>
            ) : (
              paginatedQuestions.map((q, idx) => {
                const currentScore = responses[q.id];
                const domainInfo = DOMAIN_LABELS[q.domain];
                const paramMeta = PARAMETER_METADATA[q.mapped_parameter];

                return (
                  <div key={q.id} className="pt-4 first:pt-0 group">
                    <div className="flex items-start justify-between gap-4 mb-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                          #{q.index}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 leading-relaxed">
                            {q.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              {domainInfo?.name || q.domain}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              • {q.subdomain}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              → Maps to: <strong className="text-slate-600">{paramMeta?.label || q.mapped_parameter}</strong>
                              {q.reversed && <span className="text-rose-500 ml-1">(Reversed Scale)</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {currentScore !== undefined && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Answered ({currentScore}/5)
                        </span>
                      )}
                    </div>

                    {/* Likert 5-point Radio Buttons */}
                    <div className="grid grid-cols-5 gap-2 mt-3 max-w-2xl">
                      {LIKERT_OPTIONS.map(opt => {
                        const isSelected = currentScore === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelectScore(q.id, opt.value)}
                            className={`py-2 px-2 rounded-lg border text-xs font-semibold transition flex flex-col items-center justify-center gap-0.5 text-center ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-400/40'
                                : opt.color
                            }`}
                          >
                            <span className="font-mono text-xs">{opt.value}</span>
                            <span className="text-[10px] leading-tight opacity-90 hidden sm:inline">{opt.label}</span>
                            <span className="text-[10px] leading-tight opacity-90 sm:hidden">{opt.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* List Footer Pagination */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white border border-slate-200 rounded-md font-semibold hover:bg-slate-100 disabled:opacity-40"
              >
                Previous Page
              </button>
              <span className="font-mono font-bold">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-white border border-slate-200 rounded-md font-semibold hover:bg-slate-100 disabled:opacity-40"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
