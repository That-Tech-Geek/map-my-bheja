import React, { useState } from 'react';
import { 
  DecisionScenario, 
  DecisionResponse, 
  AdversarialScenario, 
  FailureLogRecord, 
  EvaluationRecord 
} from '../types';
import { 
  ALL_500_DECISION_SCENARIOS, 
  DECISION_CATEGORIES 
} from '../data/decisionScenarios';
import { ADVERSARIAL_SCENARIOS } from '../data/adversarialScenarios';
import { 
  downloadFile, 
  generateFailureJSONL 
} from '../services/decisionCompiler';
import { 
  ShieldAlert, 
  Target, 
  Flame, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  FileCode
} from 'lucide-react';

interface AdversarialEvalHarnessProps {
  responses: Record<string, DecisionResponse>;
  adversarialResponses: Record<string, DecisionResponse>;
  evaluationRecords: Record<string, EvaluationRecord>;
  failureLogs: FailureLogRecord[];
  onSaveAdversarialResponse: (resp: DecisionResponse) => void;
  onSaveEvaluationRecord: (record: EvaluationRecord) => void;
  onAddFailureLog: (record: FailureLogRecord) => void;
  onDeleteFailureLog: (id: string) => void;
}

export const AdversarialEvalHarness: React.FC<AdversarialEvalHarnessProps> = ({
  responses,
  adversarialResponses,
  evaluationRecords,
  failureLogs,
  onSaveAdversarialResponse,
  onSaveEvaluationRecord,
  onAddFailureLog,
  onDeleteFailureLog,
}) => {
  const [activeTab, setActiveTab] = useState<'heldout_eval' | 'adversarial_ladders' | 'failure_logger'>('heldout_eval');

  // Held-Out Scenarios list (~75 scenarios)
  const heldOutScenarios = ALL_500_DECISION_SCENARIOS.filter(s => s.is_held_out);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(heldOutScenarios[0]?.id || '');

  // Failure Log Form State
  const [failureScenarioText, setFailureScenarioText] = useState('');
  const [failureModelAnswer, setFailureModelAnswer] = useState('');
  const [failureSambitAnswer, setFailureSambitAnswer] = useState('');
  const [failureCorrection, setFailureCorrection] = useState('');
  const [failureReason, setFailureReason] = useState('The model overgeneralized autonomy preference');

  const selectedScenario = heldOutScenarios.find(s => s.id === selectedScenarioId) || heldOutScenarios[0];
  const currentSambitResponse = selectedScenario ? responses[selectedScenario.id] : undefined;
  const currentEvalRecord = selectedScenario ? evaluationRecords[selectedScenario.id] : undefined;

  // Eval scoring draft state
  const [evalModelChoice, setEvalModelChoice] = useState<'A' | 'B'>(currentEvalRecord?.model_choice || 'A');
  const [evalValues, setEvalValues] = useState<number>(currentEvalRecord?.values_alignment || 8);
  const [evalTradeoff, setEvalTradeoff] = useState<number>(currentEvalRecord?.tradeoff_alignment || 8);
  const [evalBoundary, setEvalBoundary] = useState<number>(currentEvalRecord?.boundary_alignment || 8);
  const [evalTone, setEvalTone] = useState<number>(currentEvalRecord?.tone_alignment || 8);
  const [evalNotes, setEvalNotes] = useState<string>(currentEvalRecord?.notes || '');

  const handleSaveEval = () => {
    if (!selectedScenario || !currentSambitResponse) return;

    const record: EvaluationRecord = {
      scenario_id: selectedScenario.id,
      model_choice: evalModelChoice,
      sambit_choice: currentSambitResponse.choice,
      decision_matched: evalModelChoice === currentSambitResponse.choice,
      values_alignment: evalValues,
      tradeoff_alignment: evalTradeoff,
      boundary_alignment: evalBoundary,
      tone_alignment: evalTone,
      notes: evalNotes,
      timestamp: new Date().toISOString(),
    };

    onSaveEvaluationRecord(record);
  };

  const handleCreateFailureLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!failureScenarioText.trim() || !failureCorrection.trim()) return;

    const record: FailureLogRecord = {
      id: `fail_${Date.now()}`,
      scenario_id: selectedScenario?.id || 'adhoc',
      scenario_text: failureScenarioText.trim(),
      model_answer: failureModelAnswer.trim(),
      sambit_answer: failureSambitAnswer.trim(),
      correction: failureCorrection.trim(),
      reason: failureReason.trim(),
      timestamp: new Date().toISOString(),
    };

    onAddFailureLog(record);
    setFailureScenarioText('');
    setFailureModelAnswer('');
    setFailureSambitAnswer('');
    setFailureCorrection('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Banner */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Evaluation & Adversarial Studio
            </h1>
            <p className="text-xs text-slate-400">
              Ground-truth human-in-the-loop scoring, boundary perturbation ladders, and failure analysis loop.
            </p>
          </div>
        </div>

        {/* Action button */}
        {failureLogs.length > 0 && (
          <button
            onClick={() => downloadFile('failure.jsonl', generateFailureJSONL(failureLogs), 'text/plain')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export failure.jsonl ({failureLogs.length})
          </button>
        )}
      </div>

      {/* Navigation Sub-tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-2 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('heldout_eval')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'heldout_eval' ? 'bg-slate-800 text-teal-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Held-Out Evaluation Workbench ({Object.keys(evaluationRecords).length}/{heldOutScenarios.length})
        </button>

        <button
          onClick={() => setActiveTab('adversarial_ladders')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'adversarial_ladders' ? 'bg-slate-800 text-teal-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Boundary Perturbation Ladders ({ADVERSARIAL_SCENARIOS.length})
        </button>

        <button
          onClick={() => setActiveTab('failure_logger')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'failure_logger' ? 'bg-slate-800 text-rose-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Failure Logger & Retraining Loop ({failureLogs.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Tab 1: Held-Out Evaluation Workbench */}
        {activeTab === 'heldout_eval' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Held-out Scenario Selector */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                Held-Out Benchmark Set
              </span>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {heldOutScenarios.map((s) => {
                  const isEvaluated = !!evaluationRecords[s.id];
                  const isSelected = s.id === selectedScenarioId;
                  const sambitResp = responses[s.id];

                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenarioId(s.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-teal-950/60 border-teal-500 text-slate-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-teal-400 block">{s.id}</span>
                        <p className="line-clamp-2 mt-0.5 text-[11px] text-slate-300">
                          {s.scenario}
                        </p>
                      </div>
                      {isEvaluated && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Scoring Workbench */}
            <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
              {selectedScenario ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                        {selectedScenario.id}
                      </span>
                      <h2 className="text-sm font-semibold text-slate-200 mt-2">
                        {selectedScenario.scenario}
                      </h2>
                    </div>
                  </div>

                  {/* Sambit's Authentic Policy */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                      Ground Truth (Sambit's Response):
                    </span>
                    {currentSambitResponse ? (
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-200">
                          Option {currentSambitResponse.choice} — {currentSambitResponse.choice === 'A' ? selectedScenario.option_a : selectedScenario.option_b}
                        </p>
                        {currentSambitResponse.reasoning && (
                          <p className="text-slate-400 italic">"{currentSambitResponse.reasoning}"</p>
                        )}
                        {currentSambitResponse.boundary_condition && (
                          <p className="text-amber-300 text-[11px]">Boundary: {currentSambitResponse.boundary_condition}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Not answered yet in Decision Arena. Go to Decision Arena to answer {selectedScenario.id}.
                      </p>
                    )}
                  </div>

                  {/* Model Choice & Human Scoring */}
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Model Evaluation & Alignment Scoring
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Model's Choice:</span>
                      <button
                        onClick={() => setEvalModelChoice('A')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          evalModelChoice === 'A' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Option A
                      </button>
                      <button
                        onClick={() => setEvalModelChoice('B')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          evalModelChoice === 'B' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Option B
                      </button>
                    </div>

                    {/* 4 Dimension Sliders (1-10) */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Values Alignment:</span>
                          <span className="font-bold text-teal-400 font-mono">{evalValues}/10</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={evalValues}
                          onChange={(e) => setEvalValues(Number(e.target.value))}
                          className="w-full accent-teal-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Trade-off Nuance:</span>
                          <span className="font-bold text-teal-400 font-mono">{evalTradeoff}/10</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={evalTradeoff}
                          onChange={(e) => setEvalTradeoff(Number(e.target.value))}
                          className="w-full accent-teal-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Boundary Awareness:</span>
                          <span className="font-bold text-teal-400 font-mono">{evalBoundary}/10</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={evalBoundary}
                          onChange={(e) => setEvalBoundary(Number(e.target.value))}
                          className="w-full accent-teal-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Tone & Voice:</span>
                          <span className="font-bold text-teal-400 font-mono">{evalTone}/10</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={evalTone}
                          onChange={(e) => setEvalTone(Number(e.target.value))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Evaluation Notes:</label>
                      <input
                        type="text"
                        value={evalNotes}
                        onChange={(e) => setEvalNotes(e.target.value)}
                        placeholder="e.g. Model was too defensive on autonomy."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>

                    <button
                      onClick={handleSaveEval}
                      className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
                    >
                      Save Ground-Truth Evaluation
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Select a held-out scenario to evaluate.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Boundary Perturbation Ladders */}
        {activeTab === 'adversarial_ladders' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <h2 className="text-sm font-bold text-slate-200 mb-1">
                Adversarial Boundary Ladders
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Escalates constraints step-by-step (1x → 10x → 100x → lock-in) to find the precise inflection boundary where your decision flips.
              </p>

              <div className="space-y-4">
                {ADVERSARIAL_SCENARIOS.map((adv) => {
                  const resp = adversarialResponses[adv.id];

                  return (
                    <div key={adv.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            Level {adv.progression_level} Ladder
                          </span>
                          <span className="text-xs font-bold text-slate-200">{adv.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target: {adv.boundary_test_target}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        {adv.scenario}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={() => {
                            onSaveAdversarialResponse({
                              id: adv.id,
                              choice: 'A',
                              reasoning: '',
                              confidence: 5,
                              timestamp: new Date().toISOString()
                            });
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            resp?.choice === 'A'
                              ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <strong>A:</strong> {adv.option_a}
                        </button>

                        <button
                          onClick={() => {
                            onSaveAdversarialResponse({
                              id: adv.id,
                              choice: 'B',
                              reasoning: '',
                              confidence: 5,
                              timestamp: new Date().toISOString()
                            });
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            resp?.choice === 'B'
                              ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <strong>B:</strong> {adv.option_b}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Failure Logger & Retraining Loop */}
        {activeTab === 'failure_logger' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Failure Log Submission Form */}
            <form onSubmit={handleCreateFailureLog} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Log Model Policy Failure (for next training batch)
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Scenario / Prompt:</label>
                  <textarea
                    value={failureScenarioText}
                    onChange={(e) => setFailureScenarioText(e.target.value)}
                    required
                    rows={2}
                    placeholder="Enter the scenario where the model failed..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Model Answer (Incorrect Policy):</label>
                    <textarea
                      value={failureModelAnswer}
                      onChange={(e) => setFailureModelAnswer(e.target.value)}
                      rows={2}
                      placeholder="What the model output..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Sambit's Actual Decision:</label>
                    <textarea
                      value={failureSambitAnswer}
                      onChange={(e) => setFailureSambitAnswer(e.target.value)}
                      rows={2}
                      placeholder="What you would actually decide..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Target Policy Correction:</label>
                  <textarea
                    value={failureCorrection}
                    onChange={(e) => setFailureCorrection(e.target.value)}
                    required
                    rows={2}
                    placeholder="Exact corrective directive (e.g., 'Do not choose option B when blast radius is irreversible')..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Failure Reason Classification:</label>
                  <select
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option>The model overgeneralized autonomy preference</option>
                    <option>The model ignored blast-radius / reversibility</option>
                    <option>The model hallucinated a middle-ground compromise</option>
                    <option>The model miscalibrated financial asymmetry</option>
                    <option>The model used robotic/generic phrasing</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Append to failure.jsonl
              </button>
            </form>

            {/* List of Logged Failures */}
            {failureLogs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Logged Retraining Failures ({failureLogs.length})
                </h3>
                {failureLogs.map((log) => (
                  <div key={log.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-rose-400 font-bold">{log.reason}</span>
                      <button
                        onClick={() => onDeleteFailureLog(log.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-300"><strong>Scenario:</strong> {log.scenario_text}</p>
                    <div className="bg-slate-900 p-2 rounded text-teal-300">
                      <strong>Correction:</strong> {log.correction}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
