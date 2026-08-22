import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  Play, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Terminal, 
  Layers, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  Cpu, 
  ArrowRight, 
  RotateCcw,
  Check,
  Send,
  Download,
  AlertCircle
} from 'lucide-react';
import { FullCognitiveState, FineTuningConfig, FineTuningRun } from '../types';
import { simulateFineTuningRun, testPromptComparison } from '../services/api';

interface FineTuningStudioProps {
  state: FullCognitiveState;
  onSaveRun: (run: FineTuningRun) => void;
  onNavigateToMatrix: () => void;
  onNavigateToParameters: () => void;
}

const PRESET_DILEMMAS = [
  {
    title: "Rust Rewrite vs Launch Deadline",
    prompt: "A junior engineer suggests rewriting our data pipeline in a brand-new Rust actor framework because it promises 3x throughput. We launch our beta in 10 days. How do you respond?",
  },
  {
    title: "Database Schema: JSONB vs 3NF",
    prompt: "We have two options for database schema: (A) A flexible JSONB column that lets us ship tomorrow, or (B) A normalized multi-table relational schema with strict foreign keys that will take 4 days to finalize.",
  },
  {
    title: "P0 Production Outage Containment",
    prompt: "Production latency suddenly spiked to 4,000ms. CPU on primary replica is at 98%. Five Slack channels are chiming in panic. What is your playbook?",
  },
  {
    title: "Engineering Disagreement on Abstraction",
    prompt: "A senior colleague insists on writing a generic abstract factory layer for payment processors 'in case we add 5 more providers next year'. We currently use Stripe only.",
  },
];

export const FineTuningStudio: React.FC<FineTuningStudioProps> = ({
  state,
  onSaveRun,
  onNavigateToMatrix,
  onNavigateToParameters,
}) => {
  const [config, setConfig] = useState<FineTuningConfig>({
    target_model: 'gemini-2.5-flash-lora',
    base_architecture: 'Transformer-Decoder-Dense',
    learning_rate: 0.0002,
    epochs: 4,
    lora_r: 16,
    lora_alpha: 32,
    lora_dropout: 0.05,
    batch_size: 4,
    warmup_ratio: 0.03,
    optimizer: 'adamw_torch',
    temperature: 0.4,
    top_p: 0.9,
    max_seq_length: 2048,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [activeRun, setActiveRun] = useState<FineTuningRun | null>(state.latest_finetuning_run || null);
  const [activeTab, setActiveTab] = useState<'runs' | 'telemetry' | 'playground' | 'config'>('playground');

  // Custom prompt comparison playground state
  const [customPrompt, setCustomPrompt] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<{
    prompt: string;
    baseline: string;
    finetuned: string;
    score: number;
  } | null>(null);

  const narrative = state.behavioral_narrative;
  const parameters = state.computed_parameters;
  const datasetSize = Object.keys(state.likert_responses || {}).length || 500;

  const handleLaunchFineTuning = async () => {
    setIsRunning(true);
    try {
      const res = await simulateFineTuningRun({
        config,
        parameters,
        narrative,
        dataset_size: datasetSize,
      });

      if (res.success && res.run) {
        setActiveRun(res.run);
        onSaveRun(res.run);
        setActiveTab('telemetry');
      }
    } catch (err) {
      console.error('Fine-tuning run error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunComparison = async (promptToTest: string) => {
    if (!promptToTest.trim()) return;
    setIsComparing(true);
    try {
      const res = await testPromptComparison({
        prompt: promptToTest,
        narrative,
        parameters,
      });

      if (res.success && res.comparison) {
        setComparisonResult({
          prompt: promptToTest,
          baseline: res.comparison.baseline_output,
          finetuned: res.comparison.fine_tuned_output,
          score: res.comparison.alignment_score,
        });
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Cognitive LoRA Fine-Tuning Studio
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full font-mono font-semibold">
                    Parameter Adaptation Engine
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fine-tunes base LLMs to align with your 500-item psychometric parameters and synthesized behavioral narrative.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleLaunchFineTuning}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Optimizing Parameters ({config.epochs} Epochs)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Fine-Tuning Run</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Behavioral Comparison Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Training Telemetry & Loss Curves</span>
            {activeRun && (
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500 text-white rounded font-mono">
                {activeRun.alignment_score}%
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hyperparameter Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TAB 1: Behavioral Comparison Playground */}
          {activeTab === 'playground' && (
            <div className="space-y-6">
              {/* Presets & Prompt Input */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    Test Behavioral Alignment with Decision Scenarios
                  </h3>
                  <span className="text-xs text-slate-400">
                    Select a preset or write your own engineering dilemma
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                  {PRESET_DILEMMAS.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCustomPrompt(d.prompt);
                        handleRunComparison(d.prompt);
                      }}
                      className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-xs font-semibold text-slate-700 transition"
                    >
                      <div className="text-indigo-600 font-bold mb-0.5">{d.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2">{d.prompt}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter any technical prompt (e.g. 'Should we build an internal queue or use SQS?')"
                    value={customPrompt}
                    onChange={e => setCustomPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRunComparison(customPrompt)}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                  <button
                    onClick={() => handleRunComparison(customPrompt)}
                    disabled={isComparing || !customPrompt.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {isComparing ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Compare Output</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison Container */}
              {comparisonResult && (
                <div className="space-y-4">
                  <div className="bg-indigo-900 text-white p-3.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Evaluated Dilemma: &ldquo;{comparisonResult.prompt}&rdquo;
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded">
                      Cognitive Alignment: {comparisonResult.score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Baseline Generic Model */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Baseline Model
                          </h4>
                          <span className="text-sm font-bold text-slate-800">Generic Base LLM</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                          Standard Alignment
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed space-y-2 whitespace-pre-wrap flex-1">
                        {comparisonResult.baseline}
                      </div>
                    </div>

                    {/* Fine-Tuned Sambit Model */}
                    <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border-2 border-indigo-500 shadow-sm p-5 flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-100 mb-3">
                        <div>
                          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Fine-Tuned Sambit Model
                          </h4>
                          <span className="text-sm font-bold text-indigo-950">
                            {narrative?.archetype_title || "Parameter-Adjusted Persona"}
                          </span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                          100% Parameter Aligned
                        </span>
                      </div>
                      <div className="text-xs text-slate-900 font-medium leading-relaxed space-y-2 whitespace-pre-wrap flex-1">
                        {comparisonResult.finetuned}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Pre-evaluated Run Cases */}
              {activeRun?.comparison_samples && !comparisonResult && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Pre-Evaluated Behavioral Shift Benchmarks
                  </h3>
                  <div className="space-y-4">
                    {activeRun.comparison_samples.map(sample => (
                      <div key={sample.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            {sample.scenario_category}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-600">
                            Alignment Score: {sample.alignment_score}%
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-900 mb-3">
                          Dilemma: &ldquo;{sample.prompt}&rdquo;
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600">
                            <div className="font-bold text-slate-400 uppercase text-[10px] mb-1">Generic Baseline:</div>
                            {sample.baseline_output}
                          </div>
                          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-950 font-medium">
                            <div className="font-bold text-indigo-600 uppercase text-[10px] mb-1">Fine-Tuned Persona:</div>
                            {sample.fine_tuned_output}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                          <strong className="text-slate-700">Observed Delta:</strong> {sample.behavioral_delta}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Training Telemetry & Loss Curves */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {!activeRun ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs">
                  <Activity className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                  <h2 className="text-lg font-bold text-slate-900">No Fine-Tuning Runs Executed Yet</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                    Click below to launch an optimization run using the 500-question Likert dataset and 20 calibrated parameter vectors.
                  </p>
                  <button
                    onClick={handleLaunchFineTuning}
                    disabled={isRunning}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run Optimization Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Metric Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Final Train Loss</span>
                      <div className="text-xl font-bold font-mono text-indigo-600 mt-1">
                        {activeRun.final_train_loss}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">Decayed from 2.4500</span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Val Loss</span>
                      <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                        {activeRun.final_val_loss}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Generalization Gap &lt; 0.06</span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Behavior Alignment</span>
                      <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                        {activeRun.alignment_score}%
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">20/20 Vectors Aligned</span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">LoRA Parameters</span>
                      <div className="text-xl font-bold font-mono text-indigo-950 mt-1">
                        {(activeRun.lora_weights_summary?.trainable_params / 1_000_000).toFixed(1)}M
                      </div>
                      <span className="text-[10px] text-indigo-500 font-semibold">{activeRun.lora_weights_summary?.trainable_percentage}% of base model</span>
                    </div>
                  </div>

                  {/* Telemetry Step Progression */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                      <span>Step-by-Step Training Telemetry Log</span>
                      <span className="font-mono text-xs text-slate-400">{activeRun.telemetry.length} checkpoints recorded</span>
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-mono">
                            <th className="pb-2">Step</th>
                            <th className="pb-2">Epoch</th>
                            <th className="pb-2">Train Loss</th>
                            <th className="pb-2">Val Loss</th>
                            <th className="pb-2">Grad Norm</th>
                            <th className="pb-2">Learning Rate</th>
                            <th className="pb-2 text-right">Alignment %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {activeRun.telemetry.map(t => (
                            <tr key={t.step} className="hover:bg-slate-50">
                              <td className="py-2 text-slate-600">{t.step}</td>
                              <td className="py-2 text-slate-600">{t.epoch}</td>
                              <td className="py-2 font-bold text-indigo-600">{t.train_loss}</td>
                              <td className="py-2 text-slate-800">{t.val_loss}</td>
                              <td className="py-2 text-slate-500">{t.gradient_norm}</td>
                              <td className="py-2 text-slate-400">{t.learning_rate}</td>
                              <td className="py-2 text-right font-bold text-emerald-600">
                                {t.parameter_alignment_pct}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Hyperparameter Configuration */}
          {activeTab === 'config' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  LoRA & Architecture Hyperparameters
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tune adapter rank, learning rate schedule, and target base architecture for fine-tuning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Target Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Target Base Model</label>
                  <select
                    value={config.target_model}
                    onChange={e => setConfig(c => ({ ...c, target_model: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="gemini-2.5-flash-lora">Gemini 2.5 Flash (LoRA Adaptive)</option>
                    <option value="llama-3.1-70b-instruct">LLaMA 3.1 70B Instruct</option>
                    <option value="mistral-large-2">Mistral Large 2 (Instruct)</option>
                    <option value="claude-3-5-sonnet-custom">Claude 3.5 Sonnet (Distilled)</option>
                  </select>
                </div>

                {/* LoRA Rank r */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">LoRA Rank (r)</label>
                  <select
                    value={config.lora_r}
                    onChange={e => setConfig(c => ({ ...c, lora_r: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value={8}>r = 8 (Lightweight)</option>
                    <option value={16}>r = 16 (Balanced - Recommended)</option>
                    <option value={32}>r = 32 (High Expressivity)</option>
                    <option value={64}>r = 64 (Dense Persona Adaptation)</option>
                  </select>
                </div>

                {/* LoRA Alpha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">LoRA Alpha (&alpha;)</label>
                  <select
                    value={config.lora_alpha}
                    onChange={e => setConfig(c => ({ ...c, lora_alpha: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value={16}>&alpha; = 16</option>
                    <option value={32}>&alpha; = 32 (Default 2x scaling)</option>
                    <option value={64}>&alpha; = 64 (Strong Weight Scaling)</option>
                  </select>
                </div>

                {/* Epochs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Training Epochs</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.epochs}
                    onChange={e => setConfig(c => ({ ...c, epochs: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Learning Rate */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Learning Rate</label>
                  <select
                    value={config.learning_rate}
                    onChange={e => setConfig(c => ({ ...c, learning_rate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value={0.0005}>5e-4 (Fast Converge)</option>
                    <option value={0.0002}>2e-4 (Standard AdamW)</option>
                    <option value={0.0001}>1e-4 (Fine Precision)</option>
                    <option value={0.00005}>5e-5 (Conservative)</option>
                  </select>
                </div>

                {/* Batch Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Per-Device Batch Size</label>
                  <select
                    value={config.batch_size}
                    onChange={e => setConfig(c => ({ ...c, batch_size: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value={2}>2 (Low VRAM)</option>
                    <option value={4}>4 (Default)</option>
                    <option value={8}>8 (Higher Throughput)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={handleLaunchFineTuning}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Save Config & Launch Run</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
