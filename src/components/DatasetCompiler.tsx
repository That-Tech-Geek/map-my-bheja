import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  Check, 
  X, 
  Code, 
  Filter, 
  Download,
  FileCheck,
  Brain,
  Layers,
  GitCompare,
  Edit3,
  ShieldAlert,
  Cpu,
  Target,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Award,
} from 'lucide-react';
import { 
  TrainingExampleItem, 
  TrainingExamplePayload, 
  Policy, 
  SambitPrediction, 
  DatasetManifest,
  FullCognitiveState,
  GeneralizationDomain
} from '../types';
import { ExampleEditModal } from './ExampleEditModal';

interface DatasetCompilerProps {
  examples: TrainingExampleItem[];
  policies: Policy[];
  predictions: SambitPrediction[];
  manifest?: DatasetManifest;
  state: FullCognitiveState;
  onCompile: () => void;
  onClusterPolicies: () => void;
  onUpdateExampleStatus: (id: string, status: 'accepted' | 'rejected' | 'pending') => void;
  onBatchAcceptHighQuality: (minScore: number) => void;
  onSaveExample: (example: TrainingExampleItem) => void;
  onRunPredictionTest?: (situation: string) => Promise<void>;
  onNavigateToExport: () => void;
  isCompiling: boolean;
  isClusteringPolicies: boolean;
}

export const DatasetCompiler: React.FC<DatasetCompilerProps> = ({
  examples,
  policies = [],
  predictions = [],
  manifest,
  state,
  onCompile,
  onClusterPolicies,
  onUpdateExampleStatus,
  onBatchAcceptHighQuality,
  onSaveExample,
  onRunPredictionTest,
  onNavigateToExport,
  isCompiling,
  isClusteringPolicies,
}) => {
  // Subview tabs
  const [activeSubTab, setActiveSubTab] = useState<'sft_review' | 'policies' | 'predictions' | 'manifest'>('sft_review');

  // Filters for review tab
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCuration, setSelectedCuration] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [minQualityFilter, setMinQualityFilter] = useState<number>(65);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit modal state
  const [editingExample, setEditingExample] = useState<TrainingExampleItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Live test prediction prompt state
  const [testSituation, setTestSituation] = useState('');
  const [isTestingPrediction, setIsTestingPrediction] = useState(false);

  const typeLabels: Record<TrainingExamplePayload['type'], { label: string; color: string; desc: string }> = {
    behavioral_sft: { 
      label: 'Behavioral SFT', 
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'Multi-turn conversational dialogue applying Sambit\'s underlying policy'
    },
    decision: { 
      label: 'Decision & Tradeoff', 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Structured context, situation, decision taken, and explicit reasoning'
    },
    preference: { 
      label: 'Preference (DPO Pair)', 
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      desc: 'Prompt with Chosen vs Rejected response pair and grounded rationale'
    },
    tool_selection: { 
      label: 'Tool Selection Instinct', 
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      desc: 'Task, chosen tool, discarded alternatives, and architectural justification'
    },
    curiosity: { 
      label: 'Curiosity & Research Path', 
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      desc: 'Discovery, why interesting, next research direction and probing instinct'
    },
    belief_update: { 
      label: 'Belief Update & Revision', 
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      desc: 'Previous assumption, incoming evidence, and updated cognitive model'
    },
    correction: { 
      label: 'Correction & Nuance', 
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      desc: 'Initial reasoning, correction, and why previous intuition was incomplete'
    },
  };

  const filteredExamples = examples.filter(ex => {
    if (selectedType !== 'all' && ex.example_type !== selectedType) return false;
    if (selectedCuration !== 'all' && ex.user_curation_status !== selectedCuration) return false;
    if (selectedDomain !== 'all' && ex.domain !== selectedDomain) return false;
    if (ex.quality_score < minQualityFilter) return false;
    return true;
  });

  const acceptedCount = examples.filter(e => e.user_curation_status === 'accepted').length;
  const sftCount = examples.filter(e => e.example_type === 'behavioral_sft').length;
  const dpoCount = examples.filter(e => e.example_type === 'preference').length;

  const handleOpenEdit = (ex: TrainingExampleItem) => {
    setEditingExample(ex);
    setIsEditModalOpen(true);
  };

  const handleTestPredictionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSituation.trim() || !onRunPredictionTest) return;
    setIsTestingPrediction(true);
    try {
      await onRunPredictionTest(testSituation);
      setTestSituation('');
    } finally {
      setIsTestingPrediction(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Cognitive Training Compiler & Dataset Review</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cluster observations into conditional policies, generate high-fidelity SFT/DPO datasets, and verify model predictions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onClusterPolicies}
            disabled={isClusteringPolicies}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-2xs disabled:opacity-50"
            title="Cluster 96+ observations into conditional policies"
          >
            <Brain className={`w-4 h-4 text-purple-600 ${isClusteringPolicies ? 'animate-spin' : ''}`} />
            <span>{isClusteringPolicies ? 'Clustering Policies...' : `Cluster Policies (${policies.length})`}</span>
          </button>

          <button
            onClick={onCompile}
            disabled={isCompiling}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Synthesizing SFT & DPO...' : 'Compile Multi-Domain SFT & DPO'}</span>
          </button>

          <button
            onClick={onNavigateToExport}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>Export 8-JSONL ZIP ({acceptedCount || examples.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveSubTab('sft_review')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'sft_review'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Training Examples & Review ({examples.length})</span>
          {acceptedCount > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {acceptedCount} accepted
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('policies')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'policies'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-600" />
          <span>Cognitive Policies ({policies.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('predictions')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'predictions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-rose-600" />
          <span>Behavioral Predictions ({predictions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manifest')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'manifest'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dataset Manifest & Provenance</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: TRAINING EXAMPLES & REVIEW INTERFACE                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'sft_review' && (
        <div>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Total Compiled</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900 font-mono">{examples.length}</span>
                <span className="text-[10px] text-slate-400">spec items</span>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-xl p-3 shadow-2xs bg-emerald-50/20">
              <span className="text-[11px] text-emerald-700 block font-medium">Accepted for Fine-Tuning</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-800 font-mono">{acceptedCount}</span>
                <span className="text-[10px] text-emerald-600">({Math.round((acceptedCount / (examples.length || 1)) * 100)}%)</span>
              </div>
            </div>

            <div className="bg-white border border-indigo-200 rounded-xl p-3 shadow-2xs bg-indigo-50/20">
              <span className="text-[11px] text-indigo-700 block font-medium">Conversational SFT Examples</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-indigo-900 font-mono">{sftCount}</span>
                <span className="text-[10px] text-indigo-600">multi-domain</span>
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-3 shadow-2xs bg-amber-50/20">
              <span className="text-[11px] text-amber-800 block font-medium">DPO Preference Pairs</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-amber-900 font-mono">{dpoCount}</span>
                <span className="text-[10px] text-amber-700">strict pairs</span>
              </div>
            </div>
          </div>

          {/* Control & Filter Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Filter options */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Type:</span>
                </div>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All 7 Types ({examples.length})</option>
                  {Object.keys(typeLabels).map(typeKey => (
                    <option key={typeKey} value={typeKey}>
                      {typeLabels[typeKey as keyof typeof typeLabels].label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCuration}
                  onChange={e => setSelectedCuration(e.target.value)}
                  className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Curation States</option>
                  <option value="accepted">Accepted Only ({acceptedCount})</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={selectedDomain}
                  onChange={e => setSelectedDomain(e.target.value)}
                  className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                >
                  <option value="all">All Domains</option>
                  <option value="coding">Coding</option>
                  <option value="business">Business</option>
                  <option value="research">Research</option>
                  <option value="product">Product</option>
                  <option value="strategy">Strategy</option>
                  <option value="finance">Finance</option>
                  <option value="academic_work">Academic Work</option>
                  <option value="tool_selection">Tool Selection</option>
                </select>

                {/* Quality Score Slider */}
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500">Min Quality:</span>
                  <input
                    type="range"
                    min={0}
                    max={95}
                    step={5}
                    value={minQualityFilter}
                    onChange={e => setMinQualityFilter(Number(e.target.value))}
                    className="w-16 accent-indigo-600 cursor-pointer"
                  />
                  <span className="font-mono text-indigo-700 font-bold">{minQualityFilter}</span>
                </div>
              </div>

              {/* Quick Batch Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onBatchAcceptHighQuality(75)}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-semibold shadow-2xs"
                  title="Accept all examples with quality score >= 75"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Accept High Quality (≥75)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Examples List */}
          {filteredExamples.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400 shadow-2xs">
              <Database className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-semibold text-slate-700">No training examples match the current filter</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "Compile Multi-Domain SFT & DPO" to synthesize high-grade conversational examples tested across diverse real domains.
              </p>
              <button
                onClick={onCompile}
                disabled={isCompiling}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Compile Dataset Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExamples.map(ex => {
                const isExpanded = expandedId === ex.example_id;
                const typeInfo = typeLabels[ex.example_type] || { 
                  label: ex.example_type, 
                  color: 'bg-slate-100 text-slate-700 border-slate-200',
                  desc: ''
                };

                return (
                  <div
                    key={ex.example_id}
                    className={`bg-white border rounded-xl p-4 transition-all shadow-xs ${
                      ex.user_curation_status === 'accepted'
                        ? 'border-emerald-300 ring-1 ring-emerald-100'
                        : ex.user_curation_status === 'rejected'
                        ? 'border-red-200 opacity-60'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Item Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md border uppercase font-semibold ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>

                        {/* Provenance Badges */}
                        {ex.underlying_policy_id && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-purple-50 text-purple-700 border-purple-200 font-semibold" title="Linked cognitive policy">
                            Policy: {ex.underlying_policy_id}
                          </span>
                        )}

                        {ex.domain && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200 capitalize">
                            Domain: {ex.domain}
                          </span>
                        )}

                        {/* Quality score badge */}
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-semibold ${
                          ex.quality_score >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ex.quality_score >= 70
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          Quality: {ex.quality_score}/100
                        </span>

                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Confidence: {Math.round(ex.confidence * 100)}%
                        </span>
                      </div>

                      {/* Curation Action Buttons: ACCEPT / EDIT / REJECT */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateExampleStatus(
                            ex.example_id, 
                            ex.user_curation_status === 'accepted' ? 'pending' : 'accepted'
                          )}
                          className={`px-2.5 py-1 text-xs rounded-md border transition flex items-center gap-1 font-medium ${
                            ex.user_curation_status === 'accepted'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-600 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{ex.user_curation_status === 'accepted' ? 'Accepted' : 'Accept'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(ex)}
                          className="px-2.5 py-1 text-xs rounded-md bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 border border-slate-200 transition flex items-center gap-1 font-medium shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onUpdateExampleStatus(
                            ex.example_id, 
                            ex.user_curation_status === 'rejected' ? 'pending' : 'rejected'
                          )}
                          className={`px-2.5 py-1 text-xs rounded-md border transition flex items-center gap-1 font-medium ${
                            ex.user_curation_status === 'rejected'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-slate-600 hover:text-red-700 border-slate-200 hover:border-red-300'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{ex.user_curation_status === 'rejected' ? 'Rejected' : 'Reject'}</span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : ex.example_id)}
                          className="px-2.5 py-1 text-xs rounded-md bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition flex items-center gap-1 font-medium"
                          title="Inspect standalone JSONL line payload"
                        >
                          <Code className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{isExpanded ? 'Hide' : 'JSONL'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Structured Visual Rendering for each Example Type */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs leading-relaxed text-slate-800">
                      {ex.example_type === 'behavioral_sft' && (
                        <div className="space-y-2.5">
                          {ex.payload.messages?.map((m: any, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <span className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded self-start ${
                                m.role === 'user' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {m.role}:
                              </span>
                              <span className="whitespace-pre-wrap flex-1">{m.content}</span>
                            </div>
                          ))}
                          
                          {/* Provenance Footnote */}
                          {(ex.payload as any).metadata?.provenance && (
                            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                              <span className="font-semibold text-slate-600">Provenance:</span> {(ex.payload as any).metadata?.provenance}
                            </div>
                          )}
                        </div>
                      )}

                      {ex.example_type === 'decision' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">SITUATION:</span>
                            <p>{(ex.payload as any).situation}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-emerald-700 block mb-0.5">DECISION & REASONING:</span>
                            <p className="font-semibold text-emerald-800">{(ex.payload as any).decision}</p>
                            <p className="text-slate-700 mt-1">{(ex.payload as any).reasoning_summary}</p>
                          </div>
                        </div>
                      )}

                      {ex.example_type === 'preference' && (
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">PROMPT / SCENARIO:</span>
                            <p className="text-slate-800 font-medium">{(ex.payload as any).prompt}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                              <span className="text-[10px] font-mono text-emerald-800 font-bold block mb-0.5">✓ CHOSEN (Sambit's Stance):</span>
                              <p className="text-slate-800 font-medium">{(ex.payload as any).chosen}</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg">
                              <span className="text-[10px] font-mono text-red-800 font-bold block mb-0.5">✗ REJECTED (Refuted Alternative):</span>
                              <p className="text-slate-600">{(ex.payload as any).rejected}</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 font-mono pt-1">
                            <span className="text-amber-800 font-semibold">Policy Rationale:</span> {(ex.payload as any).reason}
                          </p>
                        </div>
                      )}

                      {ex.example_type === 'tool_selection' && (
                        <div className="space-y-1.5">
                          <p><span className="text-slate-500 font-mono">Task:</span> {(ex.payload as any).task}</p>
                          <p><span className="text-cyan-800 font-mono font-bold">Chosen Tool:</span> {(ex.payload as any).chosen_tool}</p>
                          <p><span className="text-slate-600 font-mono">Rationale:</span> {(ex.payload as any).reason}</p>
                        </div>
                      )}

                      {ex.example_type === 'curiosity' && (
                        <div className="space-y-1.5">
                          <p><span className="text-purple-800 font-mono font-bold">Discovery:</span> {(ex.payload as any).discovery}</p>
                          <p><span className="text-slate-600 font-mono">Why Interesting:</span> {(ex.payload as any).why_interesting}</p>
                          <p><span className="text-indigo-700 font-mono font-semibold">Next Research Probe:</span> {(ex.payload as any).next_question}</p>
                        </div>
                      )}

                      {ex.example_type === 'belief_update' && (
                        <div className="space-y-1.5">
                          <p><span className="text-slate-500 font-mono">Previous Belief:</span> {(ex.payload as any).previous_belief}</p>
                          <p><span className="text-amber-800 font-mono font-semibold">New Evidence:</span> {(ex.payload as any).new_evidence}</p>
                          <p><span className="text-emerald-800 font-mono font-bold">Updated Policy:</span> {(ex.payload as any).updated_belief}</p>
                        </div>
                      )}

                      {ex.example_type === 'correction' && (
                        <div className="space-y-1.5">
                          <p><span className="text-slate-500 font-mono">Initial Reasoning:</span> {(ex.payload as any).initial_reasoning}</p>
                          <p><span className="text-blue-800 font-mono font-bold">Correction:</span> {(ex.payload as any).correction}</p>
                          <p><span className="text-slate-600 font-mono">Root Cause:</span> {(ex.payload as any).why_initial_reasoning_was_wrong}</p>
                        </div>
                      )}
                    </div>

                    {/* Expanded Raw JSONL Line */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center justify-between">
                          <span>Exact JSONL Standalone Line Format:</span>
                          <span>Single JSON Object</span>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto">
                          {JSON.stringify(ex.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: COGNITIVE POLICIES (POLICIES.JSONL)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'policies' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Clustered Conditional Cognitive Policies (`policies.jsonl`)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  High-level conditional policies distilled from 96+ observations. These policies serve as the formal inductive priors and conditioning source for all conversational SFT and DPO examples.
                </p>
              </div>

              <button
                onClick={onClusterPolicies}
                disabled={isClusteringPolicies}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isClusteringPolicies ? 'animate-spin' : ''}`} />
                <span>{isClusteringPolicies ? 'Synthesizing...' : 'Re-cluster Observations'}</span>
              </button>
            </div>
          </div>

          {policies.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-2xs">
              <Brain className="w-12 h-12 mx-auto text-purple-300 mb-3" />
              <h4 className="text-base font-bold text-slate-800">No Clustered Policies Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Run the Policy Clustering Engine to synthesize your 96+ empirical observations into ~15 concise conditional policies with explicit boundary rules.
              </p>
              <button
                onClick={onClusterPolicies}
                disabled={isClusteringPolicies}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition inline-flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Cluster Observations into Policies</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {policies.map(policy => (
                <div 
                  key={policy.policy_id}
                  className="bg-white border border-slate-200 hover:border-purple-200 rounded-xl p-5 shadow-2xs transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="bg-purple-100 text-purple-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-purple-200">
                        {policy.policy_id}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 capitalize">
                        {policy.category.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                        policy.status === 'supported' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {policy.status} ({Math.round(policy.confidence * 100)}% conf)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <span>{policy.supporting_observations?.length || 0} observations</span>
                      <span>•</span>
                      <span>{policy.supporting_experiences?.length || 0} experiences</span>
                    </div>
                  </div>

                  {/* Policy Rule Statement */}
                  <div className="my-3">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "{policy.policy}"
                    </p>
                  </div>

                  {/* Conditions vs Exceptions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 block mb-1 uppercase tracking-wider">
                        Preconditions for Application:
                      </span>
                      <ul className="space-y-1">
                        {policy.conditions.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-lg">
                      <span className="text-[10px] font-mono font-bold text-rose-800 block mb-1 uppercase tracking-wider">
                        Exceptions & Hard Boundary Overrides:
                      </span>
                      <ul className="space-y-1">
                        {policy.exceptions.length === 0 ? (
                          <li className="text-[11px] text-slate-400 italic">No exceptions recorded</li>
                        ) : (
                          policy.exceptions.map((e, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                              <span className="text-rose-600 font-bold">•</span>
                              <span>{e}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Domain Applications */}
                  {policy.domain_applications && policy.domain_applications.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-400">Applies across:</span>
                      {policy.domain_applications.map((dom, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 capitalize">
                          {dom}
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

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: BEHAVIORAL PREDICTIONS (PREDICTION.JSONL)                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'predictions' && (
        <div className="space-y-6">
          
          {/* Test Harness Input Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-rose-600" />
              <span>Behavioral Prediction & Evaluation Benchmark (`prediction.jsonl`)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Before presenting questions to Sambit, test whether the cognitive model accurately predicts his choices and mental models on unseen situations.
            </p>

            <form onSubmit={handleTestPredictionSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testSituation}
                  onChange={e => setTestSituation(e.target.value)}
                  placeholder="Enter a realistic technical, strategic, or engineering situation to predict Sambit's response..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isTestingPrediction || !testSituation.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isTestingPrediction ? 'animate-spin' : ''}`} />
                  <span>{isTestingPrediction ? 'Predicting...' : 'Run Prediction Test'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Predictions List */}
          {predictions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 shadow-2xs">
              <Target className="w-12 h-12 mx-auto text-rose-300 mb-3" />
              <p className="text-base font-bold text-slate-700">No Predictions Evaluated Yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Enter a scenario above to test whether the internal cognitive model can predict Sambit's stance before he answers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map(pred => (
                <div key={pred.prediction_id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {pred.prediction_id}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Predicted with {Math.round(pred.confidence * 100)}% confidence
                      </span>
                    </div>

                    {pred.agreement !== undefined && (
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        pred.agreement >= 0.8 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        Agreement: {Math.round(pred.agreement * 100)}% ({pred.error_type || 'none'})
                      </span>
                    )}
                  </div>

                  <div className="my-3">
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">SITUATION TESTED:</span>
                    <p className="text-xs font-medium text-slate-900">{pred.situation}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-700 font-bold block mb-0.5">PREDICTED CHOICE:</span>
                      <p className="font-semibold text-slate-800">{pred.predicted_decision}</p>
                      <p className="text-slate-600 mt-1 text-[11px]">{pred.predicted_reasoning}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold block mb-0.5">ACTUAL OUTCOME:</span>
                      {pred.actual_decision ? (
                        <>
                          <p className="font-semibold text-slate-800">{pred.actual_decision}</p>
                          <p className="text-slate-600 mt-1 text-[11px]">{pred.actual_reasoning}</p>
                        </>
                      ) : (
                        <p className="text-slate-400 italic text-[11px]">Awaiting Sambit's response in dialogue...</p>
                      )}
                    </div>
                  </div>

                  {pred.evaluation_notes && (
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Evaluation Note:</span> {pred.evaluation_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: DATASET MANIFEST (DATASET_MANIFEST.JSON)                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'manifest' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Machine-Readable Dataset Manifest (`dataset_manifest.json`)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Complete audit of data provenance, coverage metrics, and inductive policy distributions across the 8 export files.
                </p>
              </div>

              <button
                onClick={onNavigateToExport}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-300" />
                <span>Export Dataset Package</span>
              </button>
            </div>
          </div>

          {manifest ? (
            <div className="space-y-6">
              
              {/* Coverage Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500 block">Source Experiences Covered</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      {manifest.provenance_metrics.experiences_covered} / {manifest.provenance_metrics.total_experiences}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      ({manifest.provenance_metrics.experience_coverage_pct}%)
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500 block">Observations Grounded</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      {manifest.provenance_metrics.observations_covered} / {manifest.provenance_metrics.total_observations}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      ({manifest.provenance_metrics.observation_coverage_pct}%)
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500 block">Conditional Policies Covered</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      {manifest.provenance_metrics.policies_covered} / {manifest.provenance_metrics.total_policies}
                    </span>
                    <span className="text-xs font-bold text-purple-600">
                      ({manifest.provenance_metrics.policy_coverage_pct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw Manifest Viewer */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl shadow-xs font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
                  <span>dataset_manifest.json Content Preview</span>
                  <span>Version: {manifest.dataset_version}</span>
                </div>
                <pre>{JSON.stringify(manifest, null, 2)}</pre>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400 shadow-2xs">
              <p className="text-sm text-slate-600">Manifest will be computed automatically upon compilation.</p>
            </div>
          )}

        </div>
      )}

      {/* Edit Example Modal */}
      <ExampleEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingExample(null);
        }}
        example={editingExample}
        policies={policies}
        onSave={onSaveExample}
      />

    </div>
  );
};
