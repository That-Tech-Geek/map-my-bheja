import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Edit3
} from 'lucide-react';
import { Observation } from '../types';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetObservation?: Observation;
  allObservations: Observation[];
  onSubmitCorrection: (correction: {
    target_observation_id: string;
    feedback_type: 'not_me' | 'partially' | 'exactly' | 'context_dependent';
    user_explanation: string;
    original_observation_text: string;
  }) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  targetObservation,
  allObservations,
  onSubmitCorrection,
}) => {
  const [selectedObsId, setSelectedObsId] = useState<string>(
    targetObservation?.observation_id || (allObservations[0]?.observation_id || '')
  );
  const [feedbackType, setFeedbackType] = useState<'not_me' | 'partially' | 'exactly' | 'context_dependent'>('context_dependent');
  const [explanation, setExplanation] = useState<string>('');

  if (!isOpen) return null;

  const currentObservation = allObservations.find(o => o.observation_id === selectedObsId) || targetObservation;

  const feedbackOptions: Array<{
    id: 'not_me' | 'partially' | 'exactly' | 'context_dependent';
    label: string;
    desc: string;
    color: string;
  }> = [
    {
      id: 'context_dependent',
      label: 'Context-Dependent',
      desc: 'True in certain conditions (e.g. when reversible vs irreversible), but not an absolute rule.',
      color: 'border-indigo-500 bg-indigo-50/70 text-indigo-900',
    },
    {
      id: 'partially',
      label: 'Partially Correct',
      desc: 'The general direction is right, but the stated rationale or boundary is slightly off.',
      color: 'border-amber-500 bg-amber-50/70 text-amber-900',
    },
    {
      id: 'exactly',
      label: 'Exactly Me',
      desc: 'Accurately captures my core mental model and how I prioritize actions.',
      color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900',
    },
    {
      id: 'not_me',
      label: 'That’s Not Me',
      desc: 'Incorrect hypothesis or post-hoc artifact. Reject this pattern.',
      color: 'border-red-500 bg-red-50/70 text-red-900',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentObservation) return;

    onSubmitCorrection({
      target_observation_id: currentObservation.observation_id,
      feedback_type: feedbackType,
      user_explanation: explanation.trim() || `Marked as ${feedbackType}`,
      original_observation_text: currentObservation.observation,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Cognitive Nuance & Correction Interface
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Observation Selector (if multiple exist) */}
          {allObservations.length > 1 && !targetObservation && (
            <div>
              <label className="text-xs font-mono text-slate-600 font-semibold block mb-1">
                Select Target Pattern:
              </label>
              <select
                value={selectedObsId}
                onChange={e => setSelectedObsId(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {allObservations.map(o => (
                  <option key={o.observation_id} value={o.observation_id}>
                    [{o.category}] {o.observation.slice(0, 70)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current Observation Box */}
          {currentObservation && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800">
              <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider block mb-1">
                Inferred Pattern Under Review:
              </span>
              <p className="font-medium leading-relaxed italic">
                "{currentObservation.observation}"
              </p>
              {currentObservation.conditions && (
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Current policy: {currentObservation.conditions}
                </p>
              )}
            </div>
          )}

          {/* Feedback Rating Grid */}
          <div>
            <label className="text-xs font-mono text-slate-600 font-semibold block mb-2">
              Calibration Rating:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {feedbackOptions.map(opt => {
                const isSelected = feedbackType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setFeedbackType(opt.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.color} ring-1 ring-indigo-400 font-medium`
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Explanation / Nuance Text */}
          <div>
            <label className="text-xs font-mono text-slate-600 font-semibold block mb-1">
              Add Nuance, Exact Condition, or Correction Rationale:
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="e.g., 'I only prioritize speed when building throwaway prototypes; for core state architecture I demand rigorous immutability.'"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
            />
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              This feedback directly generates high-priority negative constraints and correction training examples.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Apply Nuance & Calibrate Model
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
