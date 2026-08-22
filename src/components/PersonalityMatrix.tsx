import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Download,
  Check,
  Flame,
  Sliders,
  Play,
  Layers,
  Zap,
  ArrowRight,
  ArrowDown,
  Compass,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  engineering_philosophy: { name: 'Life Values & Authenticity', short: 'Values', desc: 'Simplicity, staying true to yourself, peace of mind, and personal ethics.' },
  decision_and_tradeoffs: { name: 'Everyday Decisions & Choices', short: 'Decisions', desc: 'How you make choices, trusting your gut, planning vs spontaneity.' },
  problem_solving_heuristics: { name: 'Practical Resourcefulness', short: 'Resourcefulness', desc: 'Everyday dilemmas, fixing things at home, simple common-sense solutions.' },
  risk_and_uncertainty: { name: 'Comfort Zone & Adventure', short: 'Adventure', desc: 'Trying new things, taking personal leaps, and handling the unexpected.' },
  epistemic_updating: { name: 'Open-Mindedness & Growth', short: 'Open-Mindedness', desc: 'Changing your mind, admitting mistakes, and listening to other views.' },
  interpersonal_and_candor: { name: 'Relationships & Honesty', short: 'Relationships', desc: 'Direct honesty, handling conflict with loved ones, and setting boundaries.' },
  curiosity_and_depth: { name: 'Curiosity & Passions', short: 'Curiosity', desc: 'Hobbies, late-night rabbit holes, creative projects, and learning for fun.' },
  stress_and_resilience: { name: 'Patience & Emotional Calm', short: 'Resilience', desc: 'Staying level-headed during disruptions, delays, and unexpected chaos.' },
  execution_and_velocity: { name: 'Daily Habits & Action', short: 'Daily Habits', desc: 'Beating procrastination, keeping promises to yourself, and daily routines.' },
  autonomy_and_work_ethic: { name: 'Independence & Freedom', short: 'Independence', desc: 'Living on your own terms, saying no without guilt, and self-reliance.' },
};

const ANSWER_OPTIONS = [
  {
    value: 7,
    label: 'Strongly Agree',
    shortLabel: 'Strongly Agree',
    circleClass: 'w-10 h-10 sm:w-11 sm:h-11 border-[3px] border-teal-500',
    activeClass: 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-500/30 ring-4 ring-teal-200',
    hoverClass: 'hover:bg-teal-50 hover:border-teal-500 text-teal-800',
    colorKey: 'teal',
  },
  {
    value: 6,
    label: 'Agree',
    shortLabel: 'Agree',
    circleClass: 'w-9 h-9 sm:w-10 sm:h-10 border-[2.5px] border-teal-500',
    activeClass: 'bg-teal-600 border-teal-600 text-white shadow-xs ring-4 ring-teal-200',
    hoverClass: 'hover:bg-teal-50 hover:border-teal-500 text-teal-800',
    colorKey: 'teal',
  },
  {
    value: 5,
    label: 'Slightly Agree',
    shortLabel: 'Slightly Agree',
    circleClass: 'w-8 h-8 sm:w-8.5 sm:h-8.5 border-2 border-teal-500',
    activeClass: 'bg-teal-600 border-teal-600 text-white ring-4 ring-teal-200',
    hoverClass: 'hover:bg-teal-50 hover:border-teal-500 text-teal-800',
    colorKey: 'teal',
  },
  {
    value: 4,
    label: 'Neutral / In Between',
    shortLabel: 'Neutral',
    circleClass: 'w-7 h-7 sm:w-7.5 sm:h-7.5 border-2 border-slate-300',
    activeClass: 'bg-slate-600 border-slate-600 text-white ring-4 ring-slate-200',
    hoverClass: 'hover:bg-slate-100 hover:border-slate-400 text-slate-700',
    colorKey: 'slate',
  },
  {
    value: 3,
    label: 'Slightly Disagree',
    shortLabel: 'Slightly Disagree',
    circleClass: 'w-8 h-8 sm:w-8.5 sm:h-8.5 border-2 border-purple-500',
    activeClass: 'bg-purple-600 border-purple-600 text-white ring-4 ring-purple-200',
    hoverClass: 'hover:bg-purple-50 hover:border-purple-500 text-purple-800',
    colorKey: 'purple',
  },
  {
    value: 2,
    label: 'Disagree',
    shortLabel: 'Disagree',
    circleClass: 'w-9 h-9 sm:w-10 sm:h-10 border-[2.5px] border-purple-500',
    activeClass: 'bg-purple-600 border-purple-600 text-white shadow-xs ring-4 ring-purple-200',
    hoverClass: 'hover:bg-purple-50 hover:border-purple-500 text-purple-800',
    colorKey: 'purple',
  },
  {
    value: 1,
    label: 'Strongly Disagree',
    shortLabel: 'Strongly Disagree',
    circleClass: 'w-10 h-10 sm:w-11 sm:h-11 border-[3px] border-purple-600',
    activeClass: 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30 ring-4 ring-purple-200',
    hoverClass: 'hover:bg-purple-50 hover:border-purple-600 text-purple-800',
    colorKey: 'purple',
  },
];

export const PersonalityMatrix: React.FC<PersonalityMatrixProps> = ({
  state,
  onUpdateResponses,
  onNavigateToParameters,
}) => {
  const responses = useMemo(() => state.likert_responses || {}, [state.likert_responses]);
  
  const [selectedDomain, setSelectedDomain] = useState<LikertDomain | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [viewMode, setViewMode] = useState<'reels' | 'list'>('reels');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Wheel / Touch debounce ref for reel scroll
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  // Compute live metrics
  const { completionStats } = useMemo(() => {
    return computeParametersFromLikert(responses);
  }, [responses]);

  // Filtered questions without any technical IDs
  const filteredQuestions = useMemo(() => {
    return LIKERT_500_QUESTIONS.filter(q => {
      if (selectedDomain !== 'all' && q.domain !== selectedDomain) return false;
      if (filterStatus === 'answered' && responses[q.id] === undefined) return false;
      if (filterStatus === 'unanswered' && responses[q.id] !== undefined) return false;
      return true;
    });
  }, [selectedDomain, filterStatus, responses]);

  // Ensure current index is within bounds
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentScore = currentQuestion ? responses[currentQuestion.id] : undefined;
  const isCurrentAnswered = currentScore !== undefined;

  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setDirection('next');
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, filteredQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleSelectScore = (questionId: string, score: number) => {
    const updated = { ...responses, [questionId]: score };
    onUpdateResponses(updated);

    // If auto-advance is enabled, seamlessly transition to next question on single click
    if (autoAdvance) {
      setTimeout(() => {
        if (currentIndex < filteredQuestions.length - 1) {
          setDirection('next');
          setCurrentIndex(prev => prev + 1);
        }
      }, 240);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Reset all answers? All questions will be cleared for fresh answering.')) {
      onUpdateResponses({});
      setCurrentIndex(0);
    }
  };

  const handleJumpToFirstUnanswered = () => {
    const firstUnansweredIndex = filteredQuestions.findIndex(q => responses[q.id] === undefined);
    if (firstUnansweredIndex !== -1) {
      setDirection(firstUnansweredIndex > currentIndex ? 'next' : 'prev');
      setCurrentIndex(firstUnansweredIndex);
    }
  };

  // Keyboard navigation for fast casual answering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'reels') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key) && currentQuestion) {
        // Map 1-7 keys (1 = Strongly Disagree ... 7 = Strongly Agree)
        const score = parseInt(e.key, 10);
        handleSelectScore(currentQuestion.id, score);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentQuestion, handleNext, handlePrev, currentIndex, filteredQuestions.length]);

  // Reels mouse wheel snap scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'reels') return;
    if (isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 30) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    }
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== 'reels') return;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (viewMode !== 'reels' || touchStartYRef.current === null) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartYRef.current = null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 text-slate-100 overflow-hidden select-none">
      
      {/* Top Stories-Style Reel Progress Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-2.5 z-20 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          
          <div className="flex items-center justify-between gap-3 text-xs">
            {/* Reel Status & Progress */}
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-teal-500/10 text-teal-400 font-bold flex items-center gap-1.5 text-xs">
                <Flame className="w-3.5 h-3.5 text-teal-400" />
                <span>Life Questionnaire</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-300 font-medium hidden sm:inline">
                {completionStats.answeredCount} of 500 completed ({completionStats.completionPercentage}%)
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {completionStats.answeredCount < 500 && (
                <button
                  onClick={handleJumpToFirstUnanswered}
                  className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  <span>Next Unanswered</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="bg-slate-800 rounded-lg p-0.5 border border-slate-700 flex items-center">
                <button
                  onClick={() => setViewMode('reels')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                    viewMode === 'reels' 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current rotate-90" />
                  <span>Reels Mode</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                    viewMode === 'list' 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>All Cards</span>
                </button>
              </div>

              <button
                onClick={onNavigateToParameters}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-semibold transition flex items-center gap-1 text-xs"
              >
                <Sliders className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">Traits</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1 text-xs shadow-xs"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Glowing Top Progress Fill */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 transition-all duration-300 rounded-full shadow-sm"
              style={{ width: `${Math.max(1, completionStats.completionPercentage)}%` }}
            />
          </div>

          {/* Life Themes Horizontal Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs pt-1">
            <button
              onClick={() => { setSelectedDomain('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap text-[11px] ${
                selectedDomain === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              All Topics
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
                  onClick={() => { setSelectedDomain(d); setCurrentIndex(0); }}
                  className={`px-2.5 py-0.5 rounded-full transition flex items-center gap-1 whitespace-nowrap text-[11px] ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                      : isComplete
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{info.short}</span>
                  <span className={`text-[9px] font-mono px-1 rounded-full ${
                    isSelected 
                      ? 'bg-teal-900 text-teal-100' 
                      : isComplete 
                      ? 'bg-emerald-900/80 text-emerald-200' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {domainAnswered}/50
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Reels Container */}
      {viewMode === 'reels' ? (
        <div 
          className="flex-1 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-10 text-center max-w-md mx-auto shadow-2xl backdrop-blur-xl">
              <CheckCircle2 className="w-14 h-14 text-teal-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">All questions in this topic are answered!</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                You've completed all items here. Pick another topic or view your trait parameters.
              </p>
              <button
                onClick={() => { setSelectedDomain('all'); setFilterStatus('all'); setCurrentIndex(0); }}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
              >
                Browse All Questions
              </button>
            </div>
          ) : currentQuestion ? (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center z-10">
              
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  initial={{ opacity: 0, y: direction === 'next' ? 40 : -40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: direction === 'next' ? -40 : 40, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="w-full bg-slate-800/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between min-h-[440px] sm:min-h-[480px]"
                >
                  
                  {/* Card Top: Topic & Completion Pill */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-teal-300 bg-teal-950/70 border border-teal-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        <span>{DOMAIN_LABELS[currentQuestion.domain]?.name || currentQuestion.domain}</span>
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        • {currentQuestion.subdomain}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrentAnswered ? (
                        <span className="text-xs font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-700/60 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                          <span>Saved</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Tap an answer to continue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statement Prompt (Large, Clear, Conversational) */}
                  <div className="my-auto py-4 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-relaxed tracking-tight max-w-xl mx-auto">
                      "{currentQuestion.text}"
                    </h2>
                  </div>

                  {/* 1-Click Answer Strip: 7 Casual Touch-Friendly Buttons */}
                  <div className="mt-6 space-y-4">
                    
                    {/* Desktop/Tablet 16Personalities Graduated Circles */}
                    <div className="hidden sm:flex items-center justify-between max-w-lg mx-auto relative px-3 py-2">
                      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700 z-0" />
                      
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider z-10 select-none">
                        Agree
                      </span>

                      <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 z-10">
                        {ANSWER_OPTIONS.map((opt) => {
                          const isSelected = currentScore === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectScore(currentQuestion.id, opt.value)}
                              className={`rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer select-none relative group bg-slate-900 ${opt.circleClass} ${
                                isSelected ? opt.activeClass : opt.hoverClass
                              } hover:scale-115 active:scale-95`}
                              title={opt.label}
                            >
                              {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50 duration-150" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-white/40 transition" />
                              )}

                              <span className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] font-semibold bg-slate-950 text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-30 border border-slate-700">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider z-10 select-none">
                        Disagree
                      </span>
                    </div>

                    {/* Mobile-Friendly Vertical / Grid Casual Choice Buttons */}
                    <div className="grid grid-cols-3 sm:hidden gap-1.5">
                      <button
                        onClick={() => handleSelectScore(currentQuestion.id, 6)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition text-center border ${
                          currentScore && currentScore >= 5
                            ? 'bg-teal-600 border-teal-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-700 text-teal-300 hover:bg-slate-900'
                        }`}
                      >
                        Agree
                      </button>
                      <button
                        onClick={() => handleSelectScore(currentQuestion.id, 4)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition text-center border ${
                          currentScore === 4
                            ? 'bg-slate-600 border-slate-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        Neutral
                      </button>
                      <button
                        onClick={() => handleSelectScore(currentQuestion.id, 2)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition text-center border ${
                          currentScore && currentScore <= 3
                            ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-700 text-purple-300 hover:bg-slate-900'
                        }`}
                      >
                        Disagree
                      </button>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                          <input
                            type="checkbox"
                            checked={autoAdvance}
                            onChange={(e) => setAutoAdvance(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-0"
                          />
                          <span>Auto-scroll on click</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 hidden sm:inline text-[11px]">
                          Use ↑ / ↓ keys or mouse wheel to scroll
                        </span>
                        <button
                          onClick={handleNext}
                          className="px-3 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <span>Skip / Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          ) : null}

          {/* Floating Reels Vertical Controls (TikTok / Reels Style Right Bar) */}
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30">
            <button
              disabled={currentIndex <= 0}
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition shadow-lg disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95"
              title="Previous Question (↑)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="text-center font-mono text-[11px] font-bold text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
              {currentIndex + 1} / {filteredQuestions.length}
            </div>

            <button
              disabled={currentIndex >= filteredQuestions.length - 1}
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition shadow-lg disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 font-bold"
              title="Next Question (↓ or Space)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

        </div>
      ) : (
        /* List View (for users who prefer scanning multiple questions) */
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredQuestions.map((q, idx) => {
              const score = responses[q.id];
              const isAnswered = score !== undefined;

              return (
                <div
                  key={q.id}
                  className={`bg-slate-900 rounded-2xl border p-5 sm:p-6 transition shadow-sm ${
                    isAnswered ? 'border-slate-800' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/60">
                      {DOMAIN_LABELS[q.domain]?.name}
                    </span>
                    {isAnswered && (
                      <span className="text-xs text-teal-400 flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Answered</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-medium text-white mb-5">
                    {q.text}
                  </h3>

                  {/* Options */}
                  <div className="flex items-center justify-between max-w-lg mx-auto relative px-2">
                    <span className="text-xs font-bold text-teal-400">Agree</span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {ANSWER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectScore(q.id, opt.value)}
                          className={`rounded-full transition flex items-center justify-center bg-slate-950 ${opt.circleClass} ${
                            score === opt.value ? opt.activeClass : opt.hoverClass
                          }`}
                          title={opt.label}
                        >
                          {score === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-purple-400">Disagree</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Modal */}
      <FineTuningExportModal
        state={state}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
