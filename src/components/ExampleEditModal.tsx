import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Sparkles } from 'lucide-react';
import { TrainingExampleItem, Policy, GeneralizationDomain } from '../types';

interface ExampleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  example: TrainingExampleItem | null;
  policies: Policy[];
  onSave: (updatedExample: TrainingExampleItem) => void;
}

export const ExampleEditModal: React.FC<ExampleEditModalProps> = ({
  isOpen,
  onClose,
  example,
  policies,
  onSave,
}) => {
  if (!isOpen || !example) return null;

  const [exampleType, setExampleType] = useState(example.example_type);
  const [qualityScore, setQualityScore] = useState(example.quality_score);
  const [confidence, setConfidence] = useState(example.confidence);
  const [selectedPolicyId, setSelectedPolicyId] = useState(example.underlying_policy_id || '');
  const [domain, setDomain] = useState<string>(example.domain || 'coding');

  // Specific payload states
  const [userPrompt, setUserPrompt] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [chosenText, setChosenText] = useState('');
  const [rejectedText, setRejectedText] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [situationText, setSituationText] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [reasoningSummary, setReasoningSummary] = useState('');

  useEffect(() => {
    if (example) {
      setExampleType(example.example_type);
      setQualityScore(example.quality_score);
      setConfidence(example.confidence);
      setSelectedPolicyId(example.underlying_policy_id || '');
      setDomain(example.domain || 'coding');

      const p = example.payload as any;
      if (example.example_type === 'behavioral_sft') {
        const msgs = p.messages || [];
        setUserPrompt(msgs.find((m: any) => m.role === 'user')?.content || '');
        setAssistantResponse(msgs.find((m: any) => m.role === 'assistant')?.content || '');
      } else if (example.example_type === 'preference') {
        setUserPrompt(p.prompt || '');
        setChosenText(p.chosen || '');
        setRejectedText(p.rejected || '');
        setReasonText(p.reason || '');
      } else if (example.example_type === 'decision') {
        setSituationText(p.situation || '');
        setDecisionText(p.decision || '');
        setReasoningSummary(p.reasoning_summary || '');
      }
    }
  }, [example]);

  const handleSave = () => {
    let updatedPayload = { ...example.payload };

    if (exampleType === 'behavioral_sft') {
      updatedPayload = {
        type: 'behavioral_sft',
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: assistantResponse },
        ],
        metadata: {
          ...(example.payload as any).metadata,
          source_policy: selectedPolicyId,
          domain,
          confidence,
          provenance: `User-curated policy distillation (${selectedPolicyId || 'direct'})`,
        },
      };
    } else if (exampleType === 'preference') {
      updatedPayload = {
        type: 'preference',
        prompt: userPrompt,
        chosen: chosenText,
        rejected: rejectedText,
        reason: reasonText,
        source_policy: selectedPolicyId,
        confidence,
      };
    } else if (exampleType === 'decision') {
      updatedPayload = {
        type: 'decision',
        situation: situationText,
        decision: decisionText,
        reasoning_summary: reasoningSummary,
        source_policy: selectedPolicyId,
        confidence,
      };
    }

    const updatedItem: TrainingExampleItem = {
      ...example,
      example_type: exampleType,
      quality_score: qualityScore,
      confidence,
      underlying_policy_id: selectedPolicyId || undefined,
      domain,
      user_curation_status: 'accepted',
      payload: updatedPayload as any,
    };

    onSave(updatedItem);
    onClose();
  };

  const domainOptions: GeneralizationDomain[] = [
    'coding',
    'business',
    'research',
    'product',
    'strategy',
    'finance',
    'academic_work',
    'tool_selection',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit & Curate Training Example</h2>
              <p className="text-xs text-slate-500 font-mono">{example.example_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Metadata Row: Underlying Policy, Domain, Quality Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Underlying Policy:</label>
              <select
                value={selectedPolicyId}
                onChange={e => setSelectedPolicyId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">None / Direct</option>
                {policies.map(p => (
                  <option key={p.policy_id} value={p.policy_id}>
                    {p.policy_id}: {p.policy.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Domain:</label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 capitalize"
              >
                {domainOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Quality Score ({qualityScore}/100):</label>
              <input
                type="range"
                min={50}
                max={100}
                value={qualityScore}
                onChange={e => setQualityScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Form fields based on example_type */}
          {exampleType === 'behavioral_sft' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                  User Prompt / Situation Dilemma:
                </label>
                <textarea
                  rows={3}
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-indigo-500 font-sans"
                  placeholder="The user asks a decision or trade-off question..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Assistant Response (Sambit's Policy in 1st Person):
                </label>
                <textarea
                  rows={6}
                  value={assistantResponse}
                  onChange={e => setAssistantResponse(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-indigo-500 font-sans"
                  placeholder="I would prioritize..."
                />
              </div>
            </div>
          )}

          {exampleType === 'preference' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Decision Prompt / Context:
                </label>
                <textarea
                  rows={2}
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                    ✓ Chosen Response (Sambit's stance):
                  </label>
                  <textarea
                    rows={4}
                    value={chosenText}
                    onChange={e => setChosenText(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-red-800 mb-1">
                    ✗ Rejected Response (Conventional trap / refuted suggestion):
                  </label>
                  <textarea
                    rows={4}
                    value={rejectedText}
                    onChange={e => setRejectedText(e.target.value)}
                    className="w-full bg-red-50/50 border border-red-300 rounded-lg p-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-800 mb-1">
                  Preference Rationale / Policy Justification:
                </label>
                <input
                  type="text"
                  value={reasonText}
                  onChange={e => setReasonText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {exampleType === 'decision' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Situation & Constraints:
                </label>
                <textarea
                  rows={2}
                  value={situationText}
                  onChange={e => setSituationText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                  Decision Taken:
                </label>
                <input
                  type="text"
                  value={decisionText}
                  onChange={e => setDecisionText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reasoning Summary & Mental Model:
                </label>
                <textarea
                  rows={3}
                  value={reasoningSummary}
                  onChange={e => setReasoningSummary(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <span className="text-[11px] text-slate-500">
            Saving marks this example as <span className="font-semibold text-emerald-700">Accepted</span> for fine-tuning.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Accept</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
