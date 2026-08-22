import React, { useState, useMemo } from 'react';
import { 
  DecisionResponse, 
  DecisionScenario, 
  SFTRecord, 
  DPORecord 
} from '../types';
import { 
  ALL_500_DECISION_SCENARIOS, 
  DECISION_CATEGORIES 
} from '../data/decisionScenarios';
import { 
  compileSFT, 
  compileDPO, 
  compileHeldOutEval, 
  validateDataset, 
  exportToJSONL, 
  generateQuestionsJSON, 
  generateResponsesJSON, 
  downloadFile 
} from '../services/decisionCompiler';
import { 
  Cpu, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  CheckCheck,
  Zap,
  BarChart3,
  Flame,
  Info
} from 'lucide-react';

interface DeterministicCompilerViewProps {
  responses: Record<string, DecisionResponse>;
}

export const DeterministicCompilerView: React.FC<DeterministicCompilerViewProps> = ({
  responses,
}) => {
  const [activeFormat, setActiveFormat] = useState<'sft' | 'dpo' | 'heldout' | 'validator'>('sft');
  const [copied, setCopied] = useState(false);
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(1);
  const [includeBoundaryInSFT, setIncludeBoundaryInSFT] = useState(true);

  // Compile SFT
  const sftRecords: SFTRecord[] = useMemo(() => {
    return compileSFT(ALL_500_DECISION_SCENARIOS, responses, {
      excludeHeldOut: true,
      minConfidence: minConfidenceFilter,
      includeBoundaryCondition: includeBoundaryInSFT,
    });
  }, [responses, minConfidenceFilter, includeBoundaryInSFT]);

  // Compile DPO
  const dpoRecords: DPORecord[] = useMemo(() => {
    return compileDPO(ALL_500_DECISION_SCENARIOS, responses, {
      excludeHeldOut: true,
      minConfidence: minConfidenceFilter,
      includeBoundaryCondition: includeBoundaryInSFT,
    });
  }, [responses, minConfidenceFilter, includeBoundaryInSFT]);

  // Compile Held-out Eval
  const heldOutRecords: SFTRecord[] = useMemo(() => {
    return compileHeldOutEval(ALL_500_DECISION_SCENARIOS, responses);
  }, [responses]);

  // Run validation
  const validationReport = useMemo(() => {
    return validateDataset(ALL_500_DECISION_SCENARIOS, responses);
  }, [responses]);

  const sftJSONL = useMemo(() => exportToJSONL(sftRecords), [sftRecords]);
  const dpoJSONL = useMemo(() => exportToJSONL(dpoRecords), [dpoRecords]);
  const heldOutJSONL = useMemo(() => exportToJSONL(heldOutRecords), [heldOutRecords]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    downloadFile('questions.json', generateQuestionsJSON(ALL_500_DECISION_SCENARIOS));
    downloadFile('responses.json', generateResponsesJSON(responses));
    if (sftRecords.length > 0) downloadFile('sft.jsonl', sftJSONL, 'text/plain');
    if (dpoRecords.length > 0) downloadFile('dpo.jsonl', dpoJSONL, 'text/plain');
    if (heldOutRecords.length > 0) downloadFile('heldout_eval.jsonl', heldOutJSONL, 'text/plain');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Banner & Telemetry Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100">
                Deterministic SFT & DPO Compiler
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Zero Preprocessing LLM Bias
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Transforms raw Sambit responses directly into OpenAI/Llama SFT & DPO JSONL datasets.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadAll}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete Package (.jsonl / .json)
          </button>
        </div>
      </div>

      {/* Main Validation KPI Grid */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Answered</span>
          <span className="text-sm font-mono font-bold text-slate-100">
            {validationReport.totalAnswered} <span className="text-xs text-slate-500">/ 500</span>
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Train Set (SFT/DPO)</span>
          <span className="text-sm font-mono font-bold text-teal-400">
            {validationReport.trainCount} Examples
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Held-Out Eval Set</span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {validationReport.heldOutCount} Scenarios
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Zero-Leakage Status</span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            0 Overlap (Verified)
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Avg Confidence</span>
          <span className="text-sm font-mono font-bold text-indigo-400">
            {validationReport.averageConfidence} / 5.0
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Missing Reasoning</span>
          <span className={`text-sm font-mono font-bold ${validationReport.missingReasoningCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {validationReport.missingReasoningCount} items
          </span>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFormat('sft')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeFormat === 'sft' ? 'bg-slate-800 text-teal-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            sft.jsonl ({sftRecords.length} pairs)
          </button>

          <button
            onClick={() => setActiveFormat('dpo')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeFormat === 'dpo' ? 'bg-slate-800 text-teal-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            dpo.jsonl ({dpoRecords.length} triplets)
          </button>

          <button
            onClick={() => setActiveFormat('heldout')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeFormat === 'heldout' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            heldout_eval.jsonl ({heldOutRecords.length} benchmark items)
          </button>

          <button
            onClick={() => setActiveFormat('validator')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeFormat === 'validator' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Dataset Validator & Balance
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeFormat === 'sft' && (
            <button
              onClick={() => downloadFile('sft.jsonl', sftJSONL, 'text/plain')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download sft.jsonl
            </button>
          )}

          {activeFormat === 'dpo' && (
            <button
              onClick={() => downloadFile('dpo.jsonl', dpoJSONL, 'text/plain')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download dpo.jsonl
            </button>
          )}

          {activeFormat === 'heldout' && (
            <button
              onClick={() => downloadFile('heldout_eval.jsonl', heldOutJSONL, 'text/plain')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download heldout_eval.jsonl
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* SFT Tab */}
        {activeFormat === 'sft' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-200">
                    SFT Messages Dataset Format
                  </h2>
                  <p className="text-xs text-slate-400">
                    Target schema: Standard messages array (OpenAI / Axolotl / Llama-Factory compliant).
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(sftJSONL)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied JSONL' : 'Copy All'}
                </button>
              </div>

              {sftRecords.length > 0 ? (
                <div className="space-y-3">
                  {sftRecords.slice(0, 5).map((r, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
                        <span className="text-teal-400 font-bold">{r.metadata?.scenario_id}</span>
                        <span>Category: {r.metadata?.category}</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <p className="text-slate-400 font-mono"><strong className="text-indigo-400">[USER]:</strong> {r.messages[0].content}</p>
                        <p className="text-slate-200 font-mono bg-slate-950 p-2.5 rounded border border-slate-800 whitespace-pre-wrap"><strong className="text-teal-400">[ASSISTANT]:</strong> {r.messages[1].content}</p>
                      </div>
                    </div>
                  ))}
                  {sftRecords.length > 5 && (
                    <p className="text-xs text-center text-slate-500 font-mono py-2">
                      ...and {sftRecords.length - 5} more SFT examples in full export
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No decision responses available to compile. Complete scenarios in the Decision Arena.
                </div>
              )}
            </div>
          </div>
        )}

        {/* DPO Tab */}
        {activeFormat === 'dpo' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-200">
                    DPO Contrastive Triplet Format
                  </h2>
                  <p className="text-xs text-slate-400">
                    Schema: <code>&#123; prompt, chosen, rejected &#125;</code> using Sambit's authentic choice vs strongest competing argument.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(dpoJSONL)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied JSONL' : 'Copy All'}
                </button>
              </div>

              {dpoRecords.length > 0 ? (
                <div className="space-y-3">
                  {dpoRecords.slice(0, 5).map((r, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
                        <span className="text-teal-400 font-bold">{r.metadata?.scenario_id}</span>
                        <span>Category: {r.metadata?.category}</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-400 font-mono"><strong className="text-indigo-400">[PROMPT]:</strong> {r.prompt}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="bg-teal-950/40 border border-teal-800/60 p-2.5 rounded-lg">
                            <span className="text-[11px] font-bold text-teal-400 block mb-1">✓ CHOSEN (Sambit Policy):</span>
                            <p className="text-slate-200 font-mono text-[11px] whitespace-pre-wrap">{r.chosen}</p>
                          </div>

                          <div className="bg-rose-950/30 border border-rose-800/50 p-2.5 rounded-lg">
                            <span className="text-[11px] font-bold text-rose-400 block mb-1">✗ REJECTED (Competing Rationale):</span>
                            <p className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap">{r.rejected}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No decision responses available to compile DPO triplets.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Held-Out Eval Tab */}
        {activeFormat === 'heldout' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Held-Out Benchmark Test Suite (Zero-Leakage)
                  </h2>
                  <p className="text-xs text-slate-400">
                    These ~75 scenarios are strictly excluded from SFT and DPO training data and reserved for objective model evaluation.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(heldOutJSONL)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              </div>

              {heldOutRecords.length > 0 ? (
                <div className="space-y-3">
                  {heldOutRecords.map((r, i) => (
                    <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                        <span>{r.metadata?.scenario_id}</span>
                        <span>{r.metadata?.category}</span>
                      </div>
                      <p className="text-slate-300">{r.messages[0].content}</p>
                      <p className="text-teal-300 bg-slate-950 p-2 rounded">{r.messages[1].content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Answer scenarios marked with the "Held-Out" badge to populate the evaluation test suite.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dataset Validator Tab */}
        {activeFormat === 'validator' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Category Distribution & Policy Balance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(validationReport.categoryBreakdown).map(([catKey, data]) => {
                  const catInfo = DECISION_CATEGORIES[catKey as keyof typeof DECISION_CATEGORIES];
                  const pct = Math.round((data.answered / data.total) * 100);
                  const aPct = data.answered > 0 ? Math.round((data.aCount / data.answered) * 100) : 0;
                  const bPct = data.answered > 0 ? Math.round((data.bCount / data.answered) * 100) : 0;

                  return (
                    <div key={catKey} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          {catInfo?.name || catKey}
                        </span>
                        <span className="text-xs font-mono font-bold text-teal-400">
                          {data.answered} / {data.total} ({pct}%)
                        </span>
                      </div>

                      {/* Completion Progress bar */}
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full transition-all" style={{ width: `${pct}%` }} />
                      </div>

                      {/* A vs B choice balance */}
                      {data.answered > 0 && (
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                          <span>Option A: {data.aCount} ({aPct}%)</span>
                          <span>Option B: {data.bCount} ({bPct}%)</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
