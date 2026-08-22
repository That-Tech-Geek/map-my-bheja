import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  Compass, 
  ShieldAlert,
  HelpCircle,
  Play
} from 'lucide-react';
import { Observation } from '../types';
import { generateHypothesisStressTest } from '../services/api';

interface StressTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  observation: Observation | null;
  onLaunchProbeInChat: (probeQuestion: string, observation: Observation) => void;
  onUpdateObservationConditions?: (obsId: string, nuance: string, newStatus: Observation['status']) => void;
}

export const StressTestModal: React.FC<StressTestModalProps> = ({
  isOpen,
  onClose,
  observation,
  onLaunchProbeInChat,
  onUpdateObservationConditions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stressData, setStressData] = useState<{
    disconfirming_scenario: string;
    falsification_criteria: string;
    target_boundary_variable: string;
    suggested_interviewer_question: string;
    challenge_angles: Array<{
      angle_name: string;
      scenario_variant: string;
      probe_prompt: string;
    }>;
  } | null>(null);
  const [selectedAngleIdx, setSelectedAngleIdx] = useState<number>(0);
  const [customNuanceText, setCustomNuanceText] = useState('');
  const [resolvedStatus, setResolvedStatus] = useState<Observation['status']>('supported');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && observation) {
      setSavedSuccess(false);
      setCustomNuanceText(observation.conditions || observation.qualification_nuance || '');
      
      // If the observation already has disconfirming info, initialize with it
      if (observation.disconfirming_scenario) {
        setStressData({
          disconfirming_scenario: observation.disconfirming_scenario,
          falsification_criteria: observation.falsification_criteria || 'Observe if decision criteria changes under inverted stakes/reversibility',
          target_boundary_variable: observation.target_boundary_variable || 'Reversibility vs Stakes',
          suggested_interviewer_question: `Suppose you faced: ${observation.disconfirming_scenario} How would you decide, and what boundary changes your choice?`,
          challenge_angles: [
            {
              angle_name: 'Asymmetric Payoff / Catastrophic Downside',
              scenario_variant: observation.disconfirming_scenario,
              probe_prompt: `Let's test the boundary of this rule: "${observation.observation}". What if the stakes were 10x higher and mistakes were irreversible?`,
            },
            {
              angle_name: 'High Uncertainty / Low Information',
              scenario_variant: 'Decision under total ambiguity where conventional heuristics lead to failure.',
              probe_prompt: `When empirical metrics are unavailable and you cannot prototype quickly, how does your policy adjust?`,
            }
          ]
        });
      }

      // Fetch freshly generated multi-angle stress test
      fetchFreshStressTest();
    }
  }, [isOpen, observation]);

  const fetchFreshStressTest = async () => {
    if (!observation) return;
    setIsLoading(true);
    try {
      const res = await generateHypothesisStressTest({
        observation: observation.observation,
        category: observation.category,
        conditions: observation.conditions,
      });
      if (res.success && res.stress_test) {
        setStressData(res.stress_test);
      }
    } catch (err) {
      console.error('Failed to generate stress test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !observation) return null;

  const handleLaunchInChat = () => {
    const questionToAsk = stressData?.challenge_angles?.[selectedAngleIdx]?.probe_prompt || 
      stressData?.suggested_interviewer_question || 
      `Let's probe this pattern: "${observation.observation}". Under what specific circumstances would you deliberately violate this rule?`;
    
    onLaunchProbeInChat(questionToAsk, observation);
    onClose();
  };

  const handleSaveNuance = () => {
    if (onUpdateObservationConditions && customNuanceText.trim()) {
      onUpdateObservationConditions(observation.observation_id, customNuanceText.trim(), resolvedStatus);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-sans">
                <span>Hypothesis Disconfirmation Engine</span>
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  Falsification Probe
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Active scientific stress-testing to turn 1-dimensional assumptions into robust conditional policies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Target Hypothesis Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
              <span className="uppercase font-semibold text-indigo-600">Target Inferred Pattern</span>
              <span>Domain: {observation.category.replace(/_/g, ' ')}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
              "{observation.observation}"
            </p>
            {observation.conditions && (
              <div className="mt-2 text-xs font-mono text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                <span className="font-semibold text-indigo-700">Existing Policy: </span>
                {observation.conditions}
              </div>
            )}
          </div>

          {/* Active Stress-Test Scenario Box */}
          <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Crafted Disconfirming Counter-Scenario</span>
              </span>
              {isLoading && (
                <span className="text-[11px] font-mono text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" /> Synthesizing edge cases...
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3">
              {stressData?.disconfirming_scenario || 'Engine is preparing a challenging counter-scenario...'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-amber-100 text-xs">
              <div className="bg-amber-50/50 p-2 rounded-lg">
                <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold block mb-0.5">
                  Falsification Target:
                </span>
                <span className="text-slate-600 text-[11px]">
                  {stressData?.falsification_criteria || 'Tests if user changes strategy when stakes or reversibility shift.'}
                </span>
              </div>
              <div className="bg-amber-50/50 p-2 rounded-lg">
                <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold block mb-0.5">
                  Calibrated Variable:
                </span>
                <span className="text-slate-600 text-[11px]">
                  {stressData?.target_boundary_variable || 'Reversibility vs Latency vs Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Angles Selector */}
          {stressData?.challenge_angles && stressData.challenge_angles.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono block mb-2">
                Select Probing Angle to Challenge in Chat:
              </label>
              <div className="space-y-2">
                {stressData.challenge_angles.map((angle, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAngleIdx(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      selectedAngleIdx === idx
                        ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${selectedAngleIdx === idx ? 'bg-indigo-600' : 'bg-slate-400'}`} />
                        <span>{angle.angle_name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Angle #{idx + 1}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] font-sans pl-3.5 leading-relaxed">
                      "{angle.probe_prompt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual Nuance & Calibration (Quick Override) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Or Record Discovered Nuance / Conditional Rule:</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={customNuanceText}
              onChange={(e) => setCustomNuanceText(e.target.value)}
              placeholder="e.g. Speed is prioritized only for reversible prototypes; formal validation is required whenever schema migrations or external customer contracts are involved."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-400 font-sans"
            />

            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">Updated Status:</span>
                <select
                  value={resolvedStatus}
                  onChange={(e) => setResolvedStatus(e.target.value as Observation['status'])}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-mono"
                >
                  <option value="supported">Supported (Nuanced Rule)</option>
                  <option value="hypothesis">Hypothesis (Still Probing)</option>
                  <option value="contradicted">Contradicted (Disproven)</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>

              {onUpdateObservationConditions && customNuanceText.trim() && (
                <button
                  onClick={handleSaveNuance}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved!' : 'Save Nuance'}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={fetchFreshStressTest}
            disabled={isLoading}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate New Edge Case</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunchInChat}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Stress-Test in Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
