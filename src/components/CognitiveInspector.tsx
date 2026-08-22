import React, { useState } from 'react';
import { 
  Brain, 
  Layers, 
  GitFork, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Sparkles, 
  Filter, 
  Search,
  Sliders,
  Edit3,
  Zap,
  ShieldAlert,
  Play,
  ArrowRight
} from 'lucide-react';
import { 
  Observation, 
  Experience, 
  Contradiction, 
  DecisionBoundary 
} from '../types';

interface CognitiveInspectorProps {
  observations: Observation[];
  experiences: Experience[];
  contradictions: Contradiction[];
  boundaries: DecisionBoundary[];
  onOpenCorrectionModal: (obs: Observation) => void;
  onOpenStressTestModal?: (obs: Observation) => void;
  onRefreshAnalysis: () => void;
  isAnalyzing: boolean;
}

type InspectorSection = 'observations' | 'disconfirmation' | 'contradictions' | 'experiences' | 'boundaries';

export const CognitiveInspector: React.FC<CognitiveInspectorProps> = ({
  observations,
  experiences,
  contradictions,
  boundaries,
  onOpenCorrectionModal,
  onOpenStressTestModal,
  onRefreshAnalysis,
  isAnalyzing,
}) => {
  const [activeSection, setActiveSection] = useState<InspectorSection>('observations');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories list
  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Domains' },
    { id: 'engineering_judgment', label: 'Engineering Judgment' },
    { id: 'decision_making', label: 'Decision Making' },
    { id: 'risk_reward', label: 'Risk / Reward' },
    { id: 'uncertainty_and_ambiguity', label: 'Uncertainty & Ambiguity' },
    { id: 'prioritization_and_tradeoffs', label: 'Prioritization & Tradeoffs' },
    { id: 'debugging_and_problem_solving', label: 'Debugging & Solving' },
    { id: 'tool_selection', label: 'Tool Selection' },
    { id: 'curiosity_and_research', label: 'Curiosity & Research' },
    { id: 'belief_updating_and_evidence', label: 'Belief Updating' },
    { id: 'optionality_and_speed', label: 'Speed vs Quality' },
    { id: 'quality_thresholds', label: 'Quality Thresholds' },
  ];

  const filteredObservations = observations.filter(obs => {
    if (selectedCategory !== 'all' && obs.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && obs.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        obs.observation.toLowerCase().includes(q) ||
        (obs.conditions && obs.conditions.toLowerCase().includes(q)) ||
        (obs.disconfirming_scenario && obs.disconfirming_scenario.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: Observation['status']) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Supported
          </span>
        );
      case 'hypothesis':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3 h-3" /> Hypothesis
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Contradicted
          </span>
        );
      case 'deprecated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-500 border border-slate-200">
            <XCircle className="w-3 h-3" /> Deprecated
          </span>
        );
    }
  };

  const getProbeBadge = (probeStatus?: Observation['probe_status']) => {
    switch (probeStatus) {
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Qualified Nuance
          </span>
        );
      case 'active_probe':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-semibold animate-pulse">
            <Zap className="w-3 h-3" /> Probing Now
          </span>
        );
      case 'falsified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-300 font-semibold">
            <XCircle className="w-3 h-3" /> Disproven
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 border border-indigo-300 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Core Invariant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3" /> Untested Probe
          </span>
        );
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
      
      {/* Top Banner & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span>Cognitive Model & Pattern Inspector</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparent view of inferred behavioral hypotheses, empirical evidence, conditional policies, and active disconfirming probes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-indigo-600' : 'text-indigo-500'}`} />
            <span>{isAnalyzing ? 'Updating Graph...' : 'Re-analyze Transcript'}</span>
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveSection('observations')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'observations'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cognitive Patterns & Hypotheses</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeSection === 'observations' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {observations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('disconfirmation')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'disconfirmation'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span>Hypothesis Stress-Testing & Falsification</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeSection === 'disconfirmation' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900'
          }`}>
            {observations.filter(o => o.disconfirming_scenario).length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('contradictions')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'contradictions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Contradiction Ledger</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeSection === 'contradictions' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {contradictions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('experiences')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'experiences'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Real Experiences Catalog</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeSection === 'experiences' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {experiences.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('boundaries')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'boundaries'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Decision Boundaries</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeSection === 'boundaries' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {boundaries.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: OBSERVATIONS & PATTERNS */}
      {activeSection === 'observations' && (
        <div>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-200 p-3 rounded-xl mb-5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Domain:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="supported">Supported</option>
                <option value="hypothesis">Hypothesis</option>
                <option value="contradicted">Contradicted</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search observations..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Observations Grid */}
          {filteredObservations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-2xs">
              <Brain className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No matching observations found</p>
              <p className="text-xs text-slate-400 mt-1">
                Continue the interview in the chat canvas to extract deeper cognitive patterns.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredObservations.map(obs => (
                <div
                  key={obs.observation_id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col justify-between transition-all shadow-xs"
                >
                  <div>
                    {/* Header: Status & Category & Confidence */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(obs.status)}
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 capitalize">
                          {obs.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="text-[11px] font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {(obs.confidence * 100).toFixed(0)}% Conf
                        </div>
                      </div>
                    </div>

                    {/* Main Observation Text */}
                    <p className="text-sm text-slate-800 font-medium leading-relaxed mb-2.5 font-sans">
                      "{obs.observation}"
                    </p>

                    {/* Conditional Policy if available */}
                    {obs.conditions && (
                      <div className="text-xs bg-slate-50 text-indigo-950 border border-slate-200 rounded-lg p-2.5 mb-3 font-mono leading-relaxed">
                        <span className="text-indigo-600 font-semibold">Conditional Policy: </span>
                        {obs.conditions}
                      </div>
                    )}

                    {/* Disconfirming Scenario Preview */}
                    {obs.disconfirming_scenario && (
                      <div className="text-xs bg-amber-50/70 text-amber-950 border border-amber-200/80 rounded-lg p-2.5 mb-3 font-sans leading-relaxed">
                        <div className="flex items-center justify-between font-mono text-[10px] text-amber-800 font-bold uppercase mb-1">
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-600" /> Disconfirming Counter-Scenario
                          </span>
                          <span>{obs.probe_status || 'untested'}</span>
                        </div>
                        <p className="text-slate-700 text-xs">{obs.disconfirming_scenario}</p>
                      </div>
                    )}

                    {/* User feedback label if corrected */}
                    {obs.user_feedback && (
                      <div className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 rounded-md px-2 py-1 mb-2 font-mono">
                        User Feedback: <span className="capitalize font-semibold">{obs.user_feedback.replace(/_/g, ' ')}</span>
                        {obs.user_correction_notes && ` — "${obs.user_correction_notes}"`}
                      </div>
                    )}
                  </div>

                  {/* Footer: Provenance & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span>Evidence: {obs.supporting_messages?.length || 0} msgs</span>
                      {obs.contradicting_messages?.length > 0 && (
                        <span className="text-amber-600 font-semibold">({obs.contradicting_messages.length} counter)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onOpenStressTestModal && (
                        <button
                          onClick={() => onOpenStressTestModal(obs)}
                          className="text-xs text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                          title="Launch active disconfirmation scenario"
                        >
                          <Zap className="w-3 h-3 text-amber-600" />
                          <span>Stress-Test</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenCorrectionModal(obs)}
                        className="text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Refine</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION: HYPOTHESIS DISCONFIRMATION ENGINE */}
      {activeSection === 'disconfirmation' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider font-mono text-amber-900 mb-1">
              <Zap className="w-4 h-4 text-amber-600 fill-current" />
              <span>Active Disconfirmation & Scientific Falsification Protocol</span>
            </div>
            <p className="leading-relaxed font-sans">
              To prevent superficial generalizations (e.g. "Sambit always acts fast"), the AI system formulates targeted counter-scenarios where following the rule would produce negative outcomes. When you respond, the system maps your exact decision boundary to extract rich, conditional policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {observations.map(obs => (
              <div
                key={obs.observation_id}
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 flex flex-col justify-between shadow-xs transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {getProbeBadge(obs.probe_status)}
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                        {obs.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {(obs.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800 font-sans mb-3">
                    "{obs.observation}"
                  </p>

                  {/* Disconfirming Scenario Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-3 space-y-2 font-sans">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block mb-0.5">
                        Crafted Disconfirming Counter-Scenario:
                      </span>
                      <p className="text-slate-700">
                        {obs.disconfirming_scenario || 'Counter-scenario generated on demand during interview turn.'}
                      </p>
                    </div>

                    {obs.falsification_criteria && (
                      <div className="pt-2 border-t border-slate-200/70">
                        <span className="text-[10px] font-mono uppercase font-bold text-indigo-800 block mb-0.5">
                          Falsification Boundary:
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          {obs.falsification_criteria}
                        </p>
                      </div>
                    )}
                  </div>

                  {obs.conditions && (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-950 mb-3 font-mono">
                      <span className="font-semibold text-emerald-900">Discovered Nuance: </span>
                      {obs.conditions}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Variable: {obs.target_boundary_variable || 'Stakes & Reversibility'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {onOpenStressTestModal && (
                      <button
                        onClick={() => onOpenStressTestModal(obs)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Stress-Test</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: CONTRADICTION LEDGER */}
      {activeSection === 'contradictions' && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-amber-900">
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-950">
              <GitFork className="w-4 h-4 text-amber-700" /> Contradiction & Conditional Boundary Engine
            </p>
            The system tracks points where stated preferences diverge from demonstrated decisions to synthesize high-value conditional policies (e.g. fast iteration on reversible prototypes vs comprehensive validation on irreversible architecture).
          </div>

          {contradictions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-2xs">
              <GitFork className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No active contradictions discovered yet</p>
              <p className="text-xs text-slate-400 mt-1">
                As you share diverse experiences across different stakes and reversibility levels, contradictions will be tracked here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contradictions.map(contra => (
                <div
                  key={contra.contradiction_id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      contra.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : contra.status === 'probing'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      Status: {contra.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Discovered: {new Date(contra.discovered_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                        Pattern A (Stated / Initial):
                      </span>
                      <p className="text-xs text-slate-700">{contra.stated_pattern_a}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block mb-1">
                        Pattern B (Observed / Demonstrated):
                      </span>
                      <p className="text-xs text-slate-700">{contra.observed_pattern_b}</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-950">
                    <span className="font-semibold text-indigo-900 block mb-1 font-mono">Synthesized Resolution Policy:</span>
                    <p className="leading-relaxed font-sans">{contra.resolution_hypothesis}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: REAL EXPERIENCES */}
      {activeSection === 'experiences' && (
        <div>
          {experiences.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-2xs">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No real experiences extracted yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Tell the interviewer about specific past projects, difficult engineering choices, or abandoned paths to populate this ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map(exp => (
                <div
                  key={exp.experience_id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{exp.situation}</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(exp.extracted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Decision Taken:</span>
                      <p className="text-slate-700">{exp.decision}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Reasoning Summary:</span>
                      <p className="text-slate-700">{exp.reasoning_summary}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-emerald-700 uppercase block mb-1">Outcome & Reflection:</span>
                      <p className="text-slate-700">{exp.outcome} {exp.reflection && `(${exp.reflection})`}</p>
                    </div>
                  </div>

                  {exp.principles_involved?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[10px] font-mono text-slate-500">Principles Involved:</span>
                      {exp.principles_involved.map((principle, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-indigo-700 border border-slate-200 px-2 py-0.5 rounded font-mono">
                          {principle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: DECISION BOUNDARIES */}
      {activeSection === 'boundaries' && (
        <div>
          {boundaries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-2xs">
              <Sliders className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No decision thresholds calibrated yet</p>
              <p className="text-xs text-slate-400 mt-1">
                The interviewer will dynamically probe probabilities and tradeoff thresholds as you discuss scenarios.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boundaries.map(bound => (
                <div
                  key={bound.boundary_id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{bound.domain}</span>
                    <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                      {(bound.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-mono mb-1">Dimension: {bound.dimension}</div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 font-mono">
                    <span className="text-indigo-600 font-semibold block mb-0.5">Inferred Policy Threshold:</span>
                    {bound.inferred_threshold}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

