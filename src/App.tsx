import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header, 
  ActiveTab 
} from './components/Header';
import { DecisionArena } from './components/DecisionArena';
import { ResponseVault } from './components/ResponseVault';
import { DeterministicCompilerView } from './components/DeterministicCompilerView';
import { AdversarialEvalHarness } from './components/AdversarialEvalHarness';
import { BaselineArchive } from './components/BaselineArchive';
import { 
  FullCognitiveState, 
  DecisionResponse,
  EvaluationRecord,
  FailureLogRecord,
  PersonalityParameterKey
} from './types';
import { 
  computeParametersFromLikert, 
  generateDeterministicBehavioralNarrative 
} from './data/likert500Questions';

const LOCAL_STORAGE_KEY = 'decision_policy_distillation_state_v1';

// Pre-seeded starter decisions for initial zero-friction exploration
const INITIAL_STARTER_RESPONSES: Record<string, DecisionResponse> = {
  autonomy_001: {
    id: 'autonomy_001',
    choice: 'B',
    reasoning: 'Schedule sovereignty is non-negotiable. With 100% control over my time, I can compound personal assets and work at peak cognitive energy without bureaucratic tax.',
    boundary_condition: 'If compensation exceeds ₹10Cr and the time commitment is strictly bounded to <12 months with zero non-competes.',
    confidence: 5,
    importance: 5,
    timestamp: new Date().toISOString(),
  },
  risk_001: {
    id: 'risk_001',
    choice: 'B',
    reasoning: '18 months of runway is plenty. Part-time side projects suffer from split attention; going all-in creates intense focus and forced clarity.',
    boundary_condition: 'If runway drops below 6 months without clear retention or customer pull.',
    confidence: 5,
    importance: 5,
    timestamp: new Date().toISOString(),
  },
  craft_001: {
    id: 'craft_001',
    choice: 'A',
    reasoning: 'Fast feedback loops beat premature perfection. Real user interaction immediately reveals which architectural assumptions actually matter.',
    boundary_condition: 'If the feature touches irreversible stateful data, payment billing, or credentials security.',
    confidence: 4,
    importance: 4,
    timestamp: new Date().toISOString(),
  },
  candor_001: {
    id: 'candor_001',
    choice: 'A',
    reasoning: 'Clear is kind. Sugarcoating critical architectural flaws wastes months of team execution time.',
    boundary_condition: 'If the person is in acute personal crisis and psychological support takes temporary precedence.',
    confidence: 5,
    importance: 4,
    timestamp: new Date().toISOString(),
  },
  curiosity_001: {
    id: 'curiosity_001',
    choice: 'B',
    reasoning: 'Mastering underlying root mechanics builds deep engineering intuition that compounds for decades.',
    boundary_condition: 'If we are in an active P0 production outage with customers impacted right now.',
    confidence: 4,
    importance: 4,
    timestamp: new Date().toISOString(),
  }
};

function createInitialState(): FullCognitiveState {
  const initialResponses: Record<string, number> = {};
  const { parameters } = computeParametersFromLikert(initialResponses);
  const paramMap: Record<PersonalityParameterKey, number> = {} as any;
  for (const p of parameters) {
    paramMap[p.key] = p.value;
  }

  const initialNarrative = generateDeterministicBehavioralNarrative(paramMap, 'Sambit');

  return {
    user_name: 'Sambit',
    decision_responses: INITIAL_STARTER_RESPONSES,
    adversarial_responses: {},
    evaluation_records: {},
    failure_logs: [
      {
        id: 'fail_init_1',
        scenario_id: 'craft_001',
        scenario_text: 'Model advised shipping an unverified database schema migration during live peak hours.',
        model_answer: 'Ship now to maintain velocity and fix inconsistencies later.',
        sambit_answer: 'Schedule maintenance window with full backup verification.',
        correction: 'Do not optimize for speed when blast radius is irreversible.',
        reason: 'The model ignored blast-radius / reversibility',
        timestamp: new Date().toISOString(),
      }
    ],
    sessions: [
      {
        session_id: 'session_01',
        session_number: 1,
        title: 'Decision Policy Calibration',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 0,
        status: 'active',
        focus_topics: ['500 Trade-Off Scenarios', 'SFT/DPO Distillation'],
      }
    ],
    active_session_id: 'session_01',
    messages: { session_01: [] },
    observations: [],
    experiences: [],
    contradictions: [],
    boundaries: [],
    corrections: [],
    policies: [],
    predictions: [],
    training_examples: [],
    dataset_versions: [],
    likert_responses: initialResponses,
    computed_parameters: paramMap,
    behavioral_narrative: initialNarrative,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('arena');
  const [state, setState] = useState<FullCognitiveState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...createInitialState(),
            ...parsed,
            decision_responses: parsed.decision_responses || INITIAL_STARTER_RESPONSES,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load local state:', e);
    }
    return createInitialState();
  });

  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Sync state to local storage reliably
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist to localStorage:', e);
    }
  }, [state]);

  // Handle single decision response save
  const handleSaveDecisionResponse = useCallback((response: DecisionResponse) => {
    setState((prev) => ({
      ...prev,
      decision_responses: {
        ...(prev.decision_responses || {}),
        [response.id]: response,
      },
    }));
  }, []);

  // Handle batch response import
  const handleImportResponses = useCallback((imported: Record<string, DecisionResponse>) => {
    setState((prev) => ({
      ...prev,
      decision_responses: {
        ...(prev.decision_responses || {}),
        ...imported,
      },
    }));
  }, []);

  // Handle clear all responses
  const handleClearAllResponses = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all recorded decision responses?')) {
      setState((prev) => ({
        ...prev,
        decision_responses: {},
      }));
    }
  }, []);

  // Handle adversarial response save
  const handleSaveAdversarialResponse = useCallback((response: DecisionResponse) => {
    setState((prev) => ({
      ...prev,
      adversarial_responses: {
        ...(prev.adversarial_responses || {}),
        [response.id]: response,
      },
    }));
  }, []);

  // Handle evaluation record save
  const handleSaveEvaluationRecord = useCallback((record: EvaluationRecord) => {
    setState((prev) => ({
      ...prev,
      evaluation_records: {
        ...(prev.evaluation_records || {}),
        [record.scenario_id]: record,
      },
    }));
  }, []);

  // Handle failure log addition
  const handleAddFailureLog = useCallback((record: FailureLogRecord) => {
    setState((prev) => ({
      ...prev,
      failure_logs: [...(prev.failure_logs || []), record],
    }));
  }, []);

  // Handle failure log deletion
  const handleDeleteFailureLog = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      failure_logs: (prev.failure_logs || []).filter(f => f.id !== id),
    }));
  }, []);

  // Handle legacy baseline parameters update
  const handleUpdateSingleParameter = useCallback((key: PersonalityParameterKey, value: number) => {
    setState((prevState) => {
      const updatedParams = {
        ...(prevState.computed_parameters || {}),
        [key]: value,
      } as Record<PersonalityParameterKey, number>;

      const updatedNarrative = generateDeterministicBehavioralNarrative(updatedParams, prevState.user_name || 'Sambit');

      return {
        ...prevState,
        computed_parameters: updatedParams,
        behavioral_narrative: updatedNarrative,
      };
    });
  }, []);

  // Handle baseline synthesis
  const handleSynthesizeNarrative = useCallback(() => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setState((prevState) => {
        const paramMap = prevState.computed_parameters || {} as Record<PersonalityParameterKey, number>;
        const narrative = generateDeterministicBehavioralNarrative(paramMap, prevState.user_name || 'Sambit');
        return {
          ...prevState,
          behavioral_narrative: narrative,
        };
      });
      setIsSynthesizing(false);
    }, 200);
  }, []);

  const decisionResponses = state.decision_responses || {};
  const decisionAnsweredCount = Object.keys(decisionResponses).length;

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden selection:bg-teal-500 selection:text-slate-950 font-sans">
      
      {/* Top Single Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        decisionAnsweredCount={decisionAnsweredCount}
        userName={state.user_name}
      />

      {/* Main Active Tab Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900">
        {activeTab === 'arena' && (
          <DecisionArena
            responses={decisionResponses}
            onSaveResponse={handleSaveDecisionResponse}
            onNavigateToCompiler={() => setActiveTab('compiler')}
          />
        )}

        {activeTab === 'vault' && (
          <ResponseVault
            responses={decisionResponses}
            onImportResponses={handleImportResponses}
            onClearAllResponses={handleClearAllResponses}
          />
        )}

        {activeTab === 'compiler' && (
          <DeterministicCompilerView
            responses={decisionResponses}
          />
        )}

        {activeTab === 'eval' && (
          <AdversarialEvalHarness
            responses={decisionResponses}
            adversarialResponses={state.adversarial_responses || {}}
            evaluationRecords={state.evaluation_records || {}}
            failureLogs={state.failure_logs || []}
            onSaveAdversarialResponse={handleSaveAdversarialResponse}
            onSaveEvaluationRecord={handleSaveEvaluationRecord}
            onAddFailureLog={handleAddFailureLog}
            onDeleteFailureLog={handleDeleteFailureLog}
          />
        )}

        {activeTab === 'archive' && (
          <BaselineArchive
            state={state}
            onUpdateParameter={handleUpdateSingleParameter}
            onSynthesizeNarrative={handleSynthesizeNarrative}
            isSynthesizing={isSynthesizing}
          />
        )}
      </main>

    </div>
  );
}
