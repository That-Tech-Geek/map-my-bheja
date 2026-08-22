import React, { useState } from 'react';
import { 
  BarChart3, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Database, 
  ShieldCheck, 
  GitFork, 
  BookOpen, 
  Layers,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { FullCognitiveState } from '../types';
import { SentimentHeatmap } from './SentimentHeatmap';

interface ProgressDashboardProps {
  state: FullCognitiveState;
  onNavigateToCompiler: () => void;
  onNavigateToInspector: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  state,
  onNavigateToCompiler,
  onNavigateToInspector,
}) => {
  const [dashboardTab, setDashboardTab] = useState<'sentiment' | 'dataset_metrics'>('sentiment');

  const totalObservations = state.observations.length;
  const supportedObservations = state.observations.filter(o => o.status === 'supported');
  const hypotheses = state.observations.filter(o => o.status === 'hypothesis');
  const highConfidencePatterns = state.observations.filter(o => o.confidence >= 0.75);
  const totalExperiences = state.experiences.length;
  const totalContradictions = state.contradictions.length;
  const resolvedContradictions = state.contradictions.filter(c => c.status === 'resolved');
  const acceptedExamples = state.training_examples.filter(e => e.user_curation_status === 'accepted' || (e.user_curation_status !== 'rejected' && e.is_suitable_for_training));
  
  const avgQuality = acceptedExamples.length > 0
    ? Math.round(acceptedExamples.reduce((sum, e) => sum + e.quality_score, 0) / acceptedExamples.length)
    : 0;

  // Domain breakdown
  const domains: Record<string, number> = {};
  state.observations.forEach(o => {
    domains[o.category] = (domains[o.category] || 0) + 1;
  });

  const domainLabels: Record<string, string> = {
    engineering_judgment: 'Engineering Judgment',
    decision_making: 'Decision Making & Thresholds',
    risk_reward: 'Risk / Reward Policies',
    uncertainty_and_ambiguity: 'Uncertainty & Ambiguity',
    prioritization_and_tradeoffs: 'Tradeoffs & Priorities',
    debugging_and_problem_solving: 'Debugging & Solving Instincts',
    tool_selection: 'Tool Selection Instincts',
    curiosity_and_research: 'Curiosity & Research Triggers',
    belief_updating_and_evidence: 'Belief Updating & Evidence',
    optionality_and_speed: 'Reversibility & Speed vs Quality',
    quality_thresholds: 'Good Enough Thresholds',
    communication_style: 'Communication Style',
    failure_and_resilience: 'Failure & Resilience',
  };

  // Types breakdown
  const typeCounts: Record<string, number> = {};
  acceptedExamples.forEach(e => {
    typeCounts[e.example_type] = (typeCounts[e.example_type] || 0) + 1;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Cognitive Progress Dashboard & Sentiment Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empirical telemetry tracking emotional response intensity over time alongside cognitive policies and dataset composition for {state.user_name || 'Sambit'}.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 self-start md:self-auto text-xs font-medium">
          <button
            onClick={() => setDashboardTab('sentiment')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              dashboardTab === 'sentiment'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Sentiment Heatmap</span>
          </button>
          <button
            onClick={() => setDashboardTab('dataset_metrics')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              dashboardTab === 'dataset_metrics'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <span>Dataset & Policy Metrics</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {dashboardTab === 'sentiment' ? (
        <div className="space-y-6">
          <SentimentHeatmap 
            sessions={state.sentiment_sessions}
            userName={state.user_name || 'Sambit'}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <span>Total Patterns</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">{totalObservations}</div>
              <div className="text-[10px] text-slate-400 mt-1">{supportedObservations.length} supported</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>High Confidence</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-mono">{highConfidencePatterns.length}</div>
              <div className="text-[10px] text-slate-400 mt-1">≥75% empirical confidence</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Hypotheses</span>
              </div>
              <div className="text-2xl font-bold text-amber-700 font-mono">{hypotheses.length}</div>
              <div className="text-[10px] text-slate-400 mt-1">Under active testing</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <GitFork className="w-3.5 h-3.5 text-cyan-600" />
                <span>Contradictions</span>
              </div>
              <div className="text-2xl font-bold text-cyan-700 font-mono">{totalContradictions}</div>
              <div className="text-[10px] text-slate-400 mt-1">{resolvedContradictions.length} resolved policies</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Real Experiences</span>
              </div>
              <div className="text-2xl font-bold text-purple-700 font-mono">{totalExperiences}</div>
              <div className="text-[10px] text-slate-400 mt-1">Structured situation logs</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Training Examples</span>
              </div>
              <div className="text-2xl font-bold text-indigo-700 font-mono">{acceptedExamples.length}</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Quality: {avgQuality}/100</div>
            </div>

          </div>

          {/* Two-Column Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Domain Distribution Bars */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Cognitive Domain Distribution</span>
                </h2>
                <button
                  onClick={onNavigateToInspector}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-mono font-semibold"
                >
                  Inspect Patterns →
                </button>
              </div>

              <div className="space-y-3.5">
                {Object.keys(domainLabels).map(domainKey => {
                  const count = domains[domainKey] || 0;
                  const maxCount = Math.max(...Object.values(domains), 4);
                  const percentage = Math.round((count / maxCount) * 100);

                  return (
                    <div key={domainKey} className="text-xs">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <span className="font-medium">{domainLabels[domainKey]}</span>
                        <span className="font-mono text-slate-400">{count} {count === 1 ? 'pattern' : 'patterns'}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Training Examples by Format & Anti-Caricature Audit */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Training Formats Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Dataset Composition</span>
                  </h2>
                  <button
                    onClick={onNavigateToCompiler}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-mono font-semibold"
                  >
                    Open Compiler →
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'behavioral_sft', label: 'Behavioral SFT Dialogue' },
                    { key: 'decision', label: 'Decision & Tradeoff Logs' },
                    { key: 'preference', label: 'Preference (DPO Pairs)' },
                    { key: 'tool_selection', label: 'Tool Selection Instincts' },
                    { key: 'curiosity', label: 'Curiosity & Research Probes' },
                    { key: 'belief_update', label: 'Belief Updates & Revisions' },
                    { key: 'correction', label: 'Corrections & Nuances' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {typeCounts[item.key] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-Caricature Audit */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h2 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Anti-Caricature & Realism Guard</span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Ensures the model does not flatten the human into a 1-dimensional caricature. Captures nuance, contextual reversibility, explicit corrections, and admissions of uncertainty.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-medium">USER CORRECTIONS</span>
                    <span className="text-sm font-bold text-indigo-700">{state.corrections.length} recorded</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-medium">DECISION BOUNDARIES</span>
                    <span className="text-sm font-bold text-cyan-700">{state.boundaries.length} calibrated</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

