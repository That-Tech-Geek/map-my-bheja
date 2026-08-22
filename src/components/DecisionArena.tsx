import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  DecisionScenario, 
  DecisionResponse, 
  DecisionCategory 
} from '../types';
import { 
  DECISION_CATEGORIES, 
  ALL_500_DECISION_SCENARIOS 
} from '../data/decisionScenarios';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  Sliders, 
  ArrowDown, 
  ArrowUp,
  Flame,
  Shield,
  Layers,
  Zap,
  Info,
  Check,
  RotateCcw,
  ListFilter,
  Play
} from 'lucide-react';

interface DecisionArenaProps {
  responses: Record<string, DecisionResponse>;
  onSaveResponse: (response: DecisionResponse) => void;
  onNavigateToCompiler?: () => void;
}

export const DecisionArena: React.FC<DecisionArenaProps> = ({
  responses,
  onSaveResponse,
  onNavigateToCompiler,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'reels' | 'list'>('reels');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Draft inputs for current active card in reels mode
  const [draftReasoning, setDraftReasoning] = useState('');
  const [draftBoundary, setDraftBoundary] = useState('');
  const [draftConfidence, setDraftConfidence] = useState<number>(4);
  const [draftImportance, setDraftImportance] = useState<number>(4);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return ALL_500_DECISION_SCENARIOS.filter((s) => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesScenario = s.scenario.toLowerCase().includes(q);
        const matchesA = s.option_a.toLowerCase().includes(q);
        const matchesB = s.option_b.toLowerCase().includes(q);
        const matchesTags = (s.tags || []).some(t => t.toLowerCase().includes(q));
        const matchesId = s.id.toLowerCase().includes(q);
        return matchesScenario || matchesA || matchesB || matchesTags || matchesId;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredScenarios.length) {
      setCurrentIndex(Math.max(0, filteredScenarios.length - 1));
    }
  }, [filteredScenarios.length, currentIndex]);

  const currentScenario: DecisionScenario | undefined = filteredScenarios[currentIndex];
  const currentResponse = currentScenario ? responses[currentScenario.id] : undefined;

  // Sync draft fields whenever current scenario changes
  useEffect(() => {
    if (currentResponse) {
      setDraftReasoning(currentResponse.reasoning || '');
      setDraftBoundary(currentResponse.boundary_condition || '');
      setDraftConfidence(currentResponse.confidence || 4);
      setDraftImportance(currentResponse.importance || 4);
    } else {
      setDraftReasoning('');
      setDraftBoundary('');
      setDraftConfidence(4);
      setDraftImportance(4);
    }
  }, [currentScenario?.id, currentResponse]);

  // Total stats
  const totalAnsweredCount = Object.keys(responses).length;
  const filteredAnsweredCount = filteredScenarios.filter(s => !!responses[s.id]?.choice).length;
  const progressPct = Math.round((totalAnsweredCount / ALL_500_DECISION_SCENARIOS.length) * 100);

  // Handle 1-Click Choice
  const handleSelectChoice = (choice: 'A' | 'B', autoAdvance: boolean = true) => {
    if (!currentScenario) return;

    const newResponse: DecisionResponse = {
      id: currentScenario.id,
      choice,
      reasoning: draftReasoning.trim(),
      confidence: draftConfidence,
      boundary_condition: draftBoundary.trim(),
      importance: draftImportance,
      timestamp: new Date().toISOString(),
    };

    onSaveResponse(newResponse);

    if (autoAdvance && currentIndex < filteredScenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Save detailed reasoning / boundary
  const handleSaveDetails = () => {
    if (!currentScenario) return;
    const existingChoice = currentResponse?.choice || 'A';
    const updated: DecisionResponse = {
      id: currentScenario.id,
      choice: existingChoice,
      reasoning: draftReasoning.trim(),
      confidence: draftConfidence,
      boundary_condition: draftBoundary.trim(),
      importance: draftImportance,
      timestamp: new Date().toISOString(),
    };
    onSaveResponse(updated);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if user is typing in a textarea or input
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'textarea' || targetTag === 'input') {
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        handleSelectChoice('A', true);
      } else if (e.key === 'b' || e.key === 'B') {
        handleSelectChoice('B', true);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentIndex < filteredScenarios.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredScenarios.length, currentScenario, draftReasoning, draftBoundary, draftConfidence, draftImportance]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Sub-Header / Controls Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10">
        
        {/* Category Pills Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full lg:max-w-2xl">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Scenarios ({totalAnsweredCount}/500)
          </button>
          
          {Object.entries(DECISION_CATEGORIES).map(([key, cat]) => {
            const catKey = key as DecisionCategory;
            const countInCat = ALL_500_DECISION_SCENARIOS.filter(s => s.category === catKey).length;
            const answeredInCat = ALL_500_DECISION_SCENARIOS.filter(s => s.category === catKey && !!responses[s.id]?.choice).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={key}
                onClick={() => { setSelectedCategory(catKey); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-xs'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{cat.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700/60 text-slate-300'
                }`}>
                  {answeredInCat}/{countInCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Search & View Mode Switcher */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
              placeholder="Search trade-offs..."
              className="bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 pl-8 pr-3 py-1 rounded-lg focus:outline-none focus:border-teal-500 w-36 sm:w-48 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setViewMode('reels')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                viewMode === 'reels' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reels Mode
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                viewMode === 'list' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Body */}
      {viewMode === 'reels' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {currentScenario ? (
            <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col relative transition-all animate-fadeIn">
              
              {/* Top Card Meta: Index, Category, Held-Out Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded-md">
                    {currentScenario.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {DECISION_CATEGORIES[currentScenario.category]?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentScenario.is_held_out && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-700/60 text-amber-300 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Held-Out Eval Set
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">
                    {currentIndex + 1} of {filteredScenarios.length}
                  </span>
                </div>
              </div>

              {/* Dilemma Scenario Text */}
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                  {currentScenario.scenario}
                </h2>
              </div>

              {/* 1-Click Option A vs Option B Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {/* Option A */}
                <button
                  id={`btn-option-a-${currentScenario.id}`}
                  onClick={() => handleSelectChoice('A', true)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                    currentResponse?.choice === 'A'
                      ? 'bg-teal-950/70 border-teal-400 ring-2 ring-teal-400/40 shadow-lg text-slate-100'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      currentResponse?.choice === 'A' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      Option A [Press A]
                    </span>
                    {currentResponse?.choice === 'A' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium leading-snug">
                    {currentScenario.option_a}
                  </p>
                </button>

                {/* Option B */}
                <button
                  id={`btn-option-b-${currentScenario.id}`}
                  onClick={() => handleSelectChoice('B', true)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                    currentResponse?.choice === 'B'
                      ? 'bg-teal-950/70 border-teal-400 ring-2 ring-teal-400/40 shadow-lg text-slate-100'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      currentResponse?.choice === 'B' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      Option B [Press B]
                    </span>
                    {currentResponse?.choice === 'B' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium leading-snug">
                    {currentScenario.option_b}
                  </p>
                </button>
              </div>

              {/* Optional Policy Nuance & Boundary Drawer */}
              <div className="border-t border-slate-800/80 pt-4">
                <button
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-teal-400 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    {isDetailsOpen ? 'Hide Reasoning & Boundary Details' : 'Add Reasoning & Boundary Condition (Optional)'}
                    {currentResponse?.reasoning && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                    )}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isDetailsOpen ? '▲ Collapse' : '▼ Expand'}
                  </span>
                </button>

                {isDetailsOpen && (
                  <div className="mt-3.5 space-y-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    
                    {/* Raw Reasoning input */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Raw Reasoning / Trade-Off Justification:
                      </label>
                      <textarea
                        value={draftReasoning}
                        onChange={(e) => setDraftReasoning(e.target.value)}
                        onBlur={handleSaveDetails}
                        rows={2}
                        placeholder="Why this choice? What principle or risk drives your decision?"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Boundary condition input */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Decision Boundary ("I'd reconsider if..."):
                      </label>
                      <textarea
                        value={draftBoundary}
                        onChange={(e) => setDraftBoundary(e.target.value)}
                        onBlur={handleSaveDetails}
                        rows={2}
                        placeholder="What variable or threshold changes your decision? (e.g., 'If compensation exceeds ₹5Cr and lock-in is <1 year...')"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Confidence & Importance */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Confidence:</span>
                          <span className="font-bold text-teal-400 font-mono">{draftConfidence} / 5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={draftConfidence}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setDraftConfidence(val);
                          }}
                          onMouseUp={handleSaveDetails}
                          className="w-full accent-teal-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Importance:</span>
                          <span className="font-bold text-teal-400 font-mono">{draftImportance} / 5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={draftImportance}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setDraftImportance(val);
                          }}
                          onMouseUp={handleSaveDetails}
                          className="w-full accent-teal-400 cursor-pointer"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Bottom Navigation & Counter */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="hidden sm:inline">Use keyboard:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">A</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">B</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">→</kbd>
                </div>

                <button
                  onClick={() => setCurrentIndex(prev => Math.min(filteredScenarios.length - 1, prev + 1))}
                  disabled={currentIndex === filteredScenarios.length - 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No scenarios match your filter.</p>
            </div>
          )}
        </div>
      ) : (
        /* List Mode */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="max-w-4xl mx-auto space-y-3">
            {filteredScenarios.map((s, idx) => {
              const resp = responses[s.id];
              const isAnswered = !!resp?.choice;

              return (
                <div 
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAnswered
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-900/50 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-950/80 border border-teal-800/80">
                          {s.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {DECISION_CATEGORIES[s.category]?.shortName}
                        </span>
                        {s.is_held_out && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
                            Held-Out
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-200 font-medium">
                        {s.scenario}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const updated: DecisionResponse = {
                            id: s.id,
                            choice: 'A',
                            reasoning: resp?.reasoning || '',
                            confidence: resp?.confidence || 4,
                            boundary_condition: resp?.boundary_condition || '',
                            importance: resp?.importance || 4,
                            timestamp: new Date().toISOString(),
                          };
                          onSaveResponse(updated);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          resp?.choice === 'A'
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        Option A
                      </button>

                      <button
                        onClick={() => {
                          const updated: DecisionResponse = {
                            id: s.id,
                            choice: 'B',
                            reasoning: resp?.reasoning || '',
                            confidence: resp?.confidence || 4,
                            boundary_condition: resp?.boundary_condition || '',
                            importance: resp?.importance || 4,
                            timestamp: new Date().toISOString(),
                          };
                          onSaveResponse(updated);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          resp?.choice === 'B'
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        Option B
                      </button>
                    </div>
                  </div>

                  {/* Options text breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <div>
                      <span className="font-bold text-slate-300">A:</span> {s.option_a}
                    </div>
                    <div>
                      <span className="font-bold text-slate-300">B:</span> {s.option_b}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar: Progress & Fast Actions */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-44 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {totalAnsweredCount} / 500 <span className="text-teal-400">({progressPct}%)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToCompiler && totalAnsweredCount > 0 && (
            <button
              onClick={onNavigateToCompiler}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              Compile SFT & DPO
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
