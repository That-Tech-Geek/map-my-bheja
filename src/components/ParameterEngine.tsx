import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Brain, 
  Layers, 
  Copy, 
  Check, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Compass, 
  GitFork, 
  Terminal, 
  ArrowRight,
  RefreshCw,
  Zap,
  Activity,
  AlertTriangle,
  Code2
} from 'lucide-react';
import { PARAMETER_METADATA } from '../data/likert500Questions';
import { FullCognitiveState, PersonalityParameterKey } from '../types';

interface ParameterEngineProps {
  state: FullCognitiveState;
  onUpdateParameter: (key: PersonalityParameterKey, value: number) => void;
  onSynthesizeNarrative: () => void;
  onNavigateToFineTuning: () => void;
  isSynthesizing: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  engineering: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  decision: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  epistemic: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  communication: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  execution: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  stress: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  agency: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
};

export const ParameterEngine: React.FC<ParameterEngineProps> = ({
  state,
  onUpdateParameter,
  onSynthesizeNarrative,
  onNavigateToFineTuning,
  isSynthesizing,
}) => {
  const [copiedDirective, setCopiedDirective] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'parameters' | 'narrative' | 'system_directive'>('parameters');

  const parameters = state.computed_parameters || {};
  const narrative = state.behavioral_narrative;

  const handleCopyDirective = () => {
    if (narrative?.system_prompt_directive) {
      navigator.clipboard.writeText(narrative.system_prompt_directive);
      setCopiedDirective(true);
      setTimeout(() => setCopiedDirective(false), 2000);
    }
  };

  const categories = ['all', 'engineering', 'decision', 'epistemic', 'communication', 'execution', 'stress', 'agency'];

  const filteredParamKeys = (Object.keys(PARAMETER_METADATA) as PersonalityParameterKey[]).filter(key => {
    const meta = PARAMETER_METADATA[key];
    if (selectedCategoryFilter === 'all') return true;
    return meta.category === selectedCategoryFilter;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Model Parameter & Behavioral Vector Engine
                  <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono font-semibold">
                    20 Active Hyper-Dimensions
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parameters mathematically calibrated from 500 psychometric items. Used to guide the LoRA fine-tuning process.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onSynthesizeNarrative}
              disabled={isSynthesizing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSynthesizing ? 'Synthesizing Narrative...' : 'Re-Synthesize Narrative'}</span>
            </button>

            <button
              onClick={onNavigateToFineTuning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Fine-Tuning Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'parameters'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>20 Parameter Vectors</span>
          </button>

          <button
            onClick={() => setActiveTab('narrative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'narrative'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Behavioral Narrative Profile</span>
            {narrative && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('system_directive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'system_directive'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Fine-Tuning System Directive</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: 20 Parameter Vectors */}
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Category filter buttons */}
              <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500 mr-1">Filter Domain:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition ${
                      selectedCategoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of 20 Parameter Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParamKeys.map(key => {
                  const meta = PARAMETER_METADATA[key];
                  const paramObj = parameters[key];
                  const value = typeof paramObj === 'object' && paramObj !== null ? paramObj.value : (paramObj ?? meta.default_baseline);
                  const catColor = CATEGORY_COLORS[meta.category] || CATEGORY_COLORS.engineering;

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:border-slate-300 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                            {meta.category}
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {value}/100
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900">
                          {meta.label}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {meta.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        {/* Poles Indicator */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="truncate max-w-[45%]" title={meta.low_pole}>0: {meta.low_pole}</span>
                          <span className="truncate max-w-[45%] text-right" title={meta.high_pole}>100: {meta.high_pole}</span>
                        </div>

                        {/* Interactive Slider */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={e => onUpdateParameter(key, Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Behavioral Narrative */}
          {activeTab === 'narrative' && (
            <div className="space-y-6">
              {!narrative ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs">
                  <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                  <h2 className="text-lg font-bold text-slate-900">Behavioral Narrative Not Yet Synthesized</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                    Click the button below to translate your 500-question responses and cognitive observations into a definitive mental operating system profile.
                  </p>
                  <button
                    onClick={onSynthesizeNarrative}
                    disabled={isSynthesizing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Behavioral Narrative Now'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Hero Archetype Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-indigo-900/50">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" /> Synthesized Cognitive Archetype
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                      {narrative.archetype_title}
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
                      {narrative.executive_summary}
                    </p>
                    <div className="mt-4 pt-4 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-300 font-mono">
                      <span>Generated: {new Date(narrative.generated_at).toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">Ready for LoRA Calibration</span>
                    </div>
                  </div>

                  {/* Cognitive DNA Section */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      Cognitive DNA & Reasoning Architecture
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {narrative.cognitive_dna_summary}
                    </p>
                  </div>

                  {/* Core Tenets & Decision Heuristics Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tenets */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <Code2 className="w-4 h-4 text-indigo-600" />
                        Core Engineering Tenets
                      </h3>
                      <div className="space-y-2.5 flex-1">
                        {narrative.core_engineering_tenets?.map((tenet, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-mono font-bold text-indigo-600 mt-0.5">{i + 1}.</span>
                            <span className="leading-relaxed">{tenet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decision Heuristics */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <GitFork className="w-4 h-4 text-emerald-600" />
                        Decision & Reversibility Heuristics
                      </h3>
                      <div className="space-y-2.5 flex-1">
                        {narrative.decision_heuristics?.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Communication & Stress Crisis Playbook */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Communication */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-rose-600" />
                        Interpersonal & Radical Candor Rules
                      </h3>
                      <div className="space-y-2.5">
                        {narrative.interpersonal_communication_rules?.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-rose-50/30 p-2.5 rounded-lg border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                            <span className="leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Crisis Playbook */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <Flame className="w-4 h-4 text-amber-600" />
                        Stress & P0 Incident Playbook
                      </h3>
                      <div className="space-y-2.5">
                        {narrative.stress_and_crisis_playbook?.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Anti-Patterns */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Unacceptable Anti-Patterns & Rejections
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {narrative.unacceptable_anti_patterns?.map((anti, i) => (
                        <div key={i} className="text-xs text-rose-900 bg-rose-50 p-3 rounded-lg border border-rose-200 leading-relaxed font-medium">
                          ✕ {anti}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: System Prompt Directive */}
          {activeTab === 'system_directive' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-indigo-600" />
                      Compiled LoRA / Model System Directive
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      This exact instruction block is injected as the conditioning prompt for Sambit's adapted model instances.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyDirective}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-slate-300"
                  >
                    {copiedDirective ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Directive</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                  {narrative?.system_prompt_directive || 
                    "You are an AI modeled on Sambit's cognitive and engineering persona. When presented with dilemmas, reason from first principles, evaluate reversibility immediately, prioritize high execution velocity, cut non-essential scope, and communicate with radical clarity, brevity, and technical rigor."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
