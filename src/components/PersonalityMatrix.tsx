import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Search, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Download,
  Check,
  Flame,
  Sliders
} from 'lucide-react';
import { 
  LIKERT_500_QUESTIONS, 
  computeParametersFromLikert 
} from '../data/likert500Questions';
import { LikertDomain, FullCognitiveState } from '../types';
import { FineTuningExportModal } from './FineTuningExportModal';

interface PersonalityMatrixProps {
  state: FullCognitiveState;
  onUpdateResponses: (responses: Record<string, number>) => void;
  onNavigateToParameters: () => void;
}

const DOMAIN_LABELS: Record<LikertDomain, { name: string; short: string; desc: string }> = {
  engineering_philosophy: { name: 'Engineering Philosophy', short: '1. Philosophy', desc: 'Simplicity, abstractions, tech debt, and architecture.' },
  decision_and_tradeoffs: { name: 'Decisions & Trade-offs', short: '2. Decisions', desc: 'Reversibility, speed vs certainty, and consensus.' },
  problem_solving_heuristics: { name: 'Problem Solving', short: '3. Problem Solving', desc: 'First principles, root cause debugging, and bisection.' },
  risk_and_uncertainty: { name: 'Risk & Uncertainty', short: '4. Risk', desc: 'Ambiguity tolerance, blast radius, and composure.' },
  epistemic_updating: { name: 'Epistemic Updating', short: '5. Epistemic', desc: 'Bayesian updating, intellectual humility, and skepticism.' },
  interpersonal_and_candor: { name: 'Interpersonal & Candor', short: '6. Candor', desc: 'Radical candor, direct feedback, and debate posture.' },
  curiosity_and_depth: { name: 'Curiosity & Depth', short: '7. Curiosity', desc: 'Inquisitiveness, synthesis, and toy prototypes.' },
  stress_and_resilience: { name: 'Stress & Resilience', short: '8. Resilience', desc: 'Incident equanimity, deadline crunch, and ownership.' },
  execution_and_velocity: { name: 'Execution & Velocity', short: '9. Velocity', desc: 'Bias for action, MVP shipping cadence, and flow.' },
  autonomy_and_work_ethic: { name: 'Autonomy & Agency', short: '10. Autonomy', desc: 'Self-direction, craft pride, and extreme agency.' },
};

/**
 * 16Personalities 7-Point Likert Rating Definitions
 * 7: Strongly Agree (Large Teal)
 * 6: Agree (Medium Teal)
 * 5: Slightly Agree (Small Teal)
 * 4: Neutral (Tiny Slate)
 * 3: Slightly Disagree (Small Purple)
 * 2: Disagree (Medium Purple)
 * 1: Strongly Disagree (Large Purple)
 */
const SIXTEEN_P_CIRCLES = [
  {
    value: 7,
    label: 'Strongly Agree',
    sizeClass: 'w-11 h-11 sm:w-12 sm:h-12 border-[3px] border-teal-500',
    selectedBg: 'bg-teal-600 border-teal-600 shadow-md shadow-teal-500/30 ring-4 ring-teal-200',
    hoverBg: 'hover:bg-teal-50 hover:border-teal-600',
  },
  {
    value: 6,
    label: 'Agree',
    sizeClass: 'w-9 h-9 sm:w-10 sm:h-10 border-[2.5px] border-teal-500',
    selectedBg: 'bg-teal-600 border-teal-600 shadow-xs ring-4 ring-teal-200',
    hoverBg: 'hover:bg-teal-50 hover:border-teal-600',
  },
  {
    value: 5,
    label: 'Slightly Agree',
    sizeClass: 'w-7 h-7 sm:w-8 sm:h-8 border-2 border-teal-500',
    selectedBg: 'bg-teal-600 border-teal-600 ring-4 ring-teal-200',
    hoverBg: 'hover:bg-teal-50 hover:border-teal-600',
  },
  {
    value: 4,
    label: 'Neutral',
    sizeClass: 'w-6 h-6 sm:w-6.5 sm:h-6.5 border-2 border-slate-300',
    selectedBg: 'bg-slate-500 border-slate-500 ring-4 ring-slate-200',
    hoverBg: 'hover:bg-slate-100 hover:border-slate-400',
  },
  {
    value: 3,
    label: 'Slightly Disagree',
    sizeClass: 'w-7 h-7 sm:w-8 sm:h-8 border-2 border-purple-500',
    selectedBg: 'bg-purple-600 border-purple-600 ring-4 ring-purple-200',
    hoverBg: 'hover:bg-purple-50 hover:border-purple-600',
  },
  {
    value: 2,
    label: 'Disagree',
    sizeClass: 'w-9 h-9 sm:w-10 sm:h-10 border-[2.5px] border-purple-500',
    selectedBg: 'bg-purple-600 border-purple-600 shadow-xs ring-4 ring-purple-200',
    hoverBg: 'hover:bg-purple-50 hover:border-purple-600',
  },
  {
    value: 1,
    label: 'Strongly Disagree',
    sizeClass: 'w-11 h-11 sm:w-12 sm:h-12 border-[3px] border-purple-600',
    selectedBg: 'bg-purple-600 border-purple-600 shadow-md shadow-purple-500/30 ring-4 ring-purple-200',
    hoverBg: 'hover:bg-purple-50 hover:border-purple-700',
  },
];

export const PersonalityMatrix: React.FC<PersonalityMatrixProps> = ({
  state,
  onUpdateResponses,
  onNavigateToParameters,
}) => {
  const responses = useMemo(() => state.likert_responses || {}, [state.likert_responses]);
  
  const [selectedDomain, setSelectedDomain] = useState<LikertDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const pageSize = 6; // 6 questions per page

  // Compute live metrics
  const { completionStats } = useMemo(() => {
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

  // Check if current page is completely answered
  const isCurrentPageAnswered = useMemo(() => {
    if (paginatedQuestions.length === 0) return false;
    return paginatedQuestions.every(q => responses[q.id] !== undefined);
  }, [paginatedQuestions, responses]);

  const handleSelectScore = (questionId: string, score: number) => {
    const updated = { ...responses, [questionId]: score };
    onUpdateResponses(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Reset all answers? All 500 questions will be cleared for manual answering.')) {
      onUpdateResponses({});
    }
  };

  const handleJumpToFirstUnanswered = () => {
    const firstUnansweredIndex = filteredQuestions.findIndex(q => responses[q.id] === undefined);
    if (firstUnansweredIndex !== -1) {
      const targetPage = Math.floor(firstUnansweredIndex / pageSize) + 1;
      setPage(targetPage);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-y-auto">
      
      {/* Top Sticky Progress & Category Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Progress Bar & Stats */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-teal-600" />
                  <span>16Personalities Cognitive Scale</span>
                  <span className="text-slate-400 font-normal hidden md:inline">• 500 Items</span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {completionStats.answeredCount} / 500 ({completionStats.completionPercentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(1, completionStats.completionPercentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Shortcuts */}
          <div className="flex items-center gap-2 flex-shrink-0 text-xs">
            {completionStats.answeredCount < 500 && (
              <button
                onClick={handleJumpToFirstUnanswered}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-100 transition"
              >
                Jump to Next Unanswered →
              </button>
            )}

            {completionStats.answeredCount > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-lg transition font-medium border border-slate-200 flex items-center gap-1"
                title="Reset all questions back to blank"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onNavigateToParameters}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold transition flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Traits</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dataset</span>
            </button>
          </div>

        </div>

        {/* Domain Category Chips (Horizontal Filter) */}
        <div className="max-w-4xl mx-auto mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => { setSelectedDomain('all'); setPage(1); }}
            className={`px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              selectedDomain === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All 500 Questions
          </button>

          {(Object.keys(DOMAIN_LABELS) as LikertDomain[]).map((d) => {
            const info = DOMAIN_LABELS[d];
            const isSelected = selectedDomain === d;
            const domainQuestions = LIKERT_500_QUESTIONS.filter(q => q.domain === d);
            const domainAnswered = domainQuestions.filter(q => responses[q.id] !== undefined).length;
            const isComplete = domainAnswered === domainQuestions.length;

            return (
              <button
                key={d}
                onClick={() => { setSelectedDomain(d); setPage(1); }}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 whitespace-nowrap text-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : isComplete
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <span>{info.short}</span>
                <span className={`text-[10px] font-mono px-1 py-0.1 rounded-full ${
                  isSelected 
                    ? 'bg-indigo-700 text-indigo-100' 
                    : isComplete 
                    ? 'bg-emerald-200 text-emerald-900 font-bold' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {domainAnswered}/50
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Questionnaire Flow Container */}
      <div className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Questions List */}
          {paginatedQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">All questions in this domain are completed!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Continue to the next domain or view your calibrated 20-dimensional parameters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all'); setSelectedDomain('all'); setPage(1); }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Show All 500 Questions
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedQuestions.map((q) => {
                const currentScore = responses[q.id];
                const domainInfo = DOMAIN_LABELS[q.domain];
                const isAnswered = currentScore !== undefined;

                return (
                  <div 
                    key={q.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 p-6 sm:p-8 shadow-xs ${
                      isAnswered 
                        ? 'border-slate-200' 
                        : 'border-slate-200 hover:border-slate-300 ring-1 ring-slate-100'
                    }`}
                  >
                    {/* Header: Question Number & Subdomain */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                          #{q.index}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                          {domainInfo?.name || q.domain}
                        </span>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                          • {q.subdomain}
                        </span>
                      </div>

                      {isAnswered && (
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span>Answered</span>
                        </span>
                      )}
                    </div>

                    {/* Statement Prompt (Large, Prominent 16Personalities Typography) */}
                    <div className="text-center my-6 max-w-2xl mx-auto">
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 leading-relaxed tracking-tight">
                        {q.text}
                      </h2>
                    </div>

                    {/* 16Personalities Graduated 7-Circle Scale */}
                    <div className="mt-8 pt-4 pb-2">
                      <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
                        
                        {/* Connecting Background Line */}
                        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 z-0" />

                        {/* Agree Label */}
                        <div className="text-left z-10 pr-2 select-none">
                          <span className="text-xs md:text-sm font-bold text-teal-700 tracking-wider block uppercase">
                            Agree
                          </span>
                        </div>

                        {/* 7 Interactive Circles */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3.5 z-10">
                          {SIXTEEN_P_CIRCLES.map((circle) => {
                            const isSelected = currentScore === circle.value;

                            return (
                              <button
                                key={circle.value}
                                onClick={() => handleSelectScore(q.id, circle.value)}
                                className={`rounded-full transition-all duration-200 flex items-center justify-center bg-white cursor-pointer select-none relative group ${circle.sizeClass} ${
                                  isSelected ? circle.selectedBg : circle.hoverBg
                                } hover:scale-110 active:scale-95`}
                                title={circle.label}
                                aria-label={`${circle.label} for question #${q.index}`}
                              >
                                {isSelected ? (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50 duration-150" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-slate-300/60 transition" />
                                )}

                                {/* Hover tooltip label */}
                                <span className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] font-semibold bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-20">
                                  {circle.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Disagree Label */}
                        <div className="text-right z-10 pl-2 select-none">
                          <span className="text-xs md:text-sm font-bold text-purple-700 tracking-wider block uppercase">
                            Disagree
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Page {page} of {totalPages} ({filteredQuestions.length} statements)
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {isCurrentPageAnswered 
                  ? 'All statements on this page are answered! Continue to next page.' 
                  : 'Select your answers on each statement to calibrate your parameters.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                disabled={page <= 1}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {page < totalPages ? (
                <button
                  onClick={() => {
                    setPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                    isCurrentPageAnswered
                      ? 'bg-teal-600 hover:bg-teal-500 text-white ring-2 ring-teal-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Export LLM Dataset Hub</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Export & Fine-Tuning Dataset Modal */}
      <FineTuningExportModal
        state={state}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
