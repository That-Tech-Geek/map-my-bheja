import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Header, 
  ActiveTab 
} from './components/Header';
import { PersonalityMatrix } from './components/PersonalityMatrix';
import { ParameterEngine } from './components/ParameterEngine';
import { ExportView } from './components/ExportView';
import { 
  FullCognitiveState, 
  PersonalityParameterKey,
  DatasetVersion
} from './types';
import { 
  computeParametersFromLikert, 
  generateDeterministicBehavioralNarrative 
} from './data/likert500Questions';
import { buildDatasetVersion } from './services/storage';

const LOCAL_STORAGE_KEY = 'likert_cognitive_assessment_state_v2';

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
    sessions: [
      {
        session_id: 'session_01',
        session_number: 1,
        title: 'Cognitive Calibration',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 0,
        status: 'active',
        focus_topics: ['Likert Psychometric Calibration'],
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('personality_matrix');
  const [state, setState] = useState<FullCognitiveState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
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

  // Handle Likert question score changes
  const handleUpdateLikertResponses = useCallback((newResponses: Record<string, number>) => {
    setState((prevState) => {
      const { parameters } = computeParametersFromLikert(newResponses);
      const paramMap: Record<PersonalityParameterKey, number> = {} as any;
      for (const p of parameters) {
        paramMap[p.key] = p.value;
      }
      const updatedNarrative = generateDeterministicBehavioralNarrative(paramMap, prevState.user_name || 'Sambit');

      return {
        ...prevState,
        likert_responses: newResponses,
        computed_parameters: paramMap,
        behavioral_narrative: updatedNarrative,
      };
    });
  }, []);

  // Handle single parameter direct adjustment in trait engine
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

  // Re-synthesize narrative client-side
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

  // Save new dataset version
  const handleSaveDatasetVersion = useCallback((version: DatasetVersion) => {
    setState((prev) => ({
      ...prev,
      dataset_versions: [...(prev.dataset_versions || []), version],
    }));
  }, []);

  const likertAnsweredCount = Object.keys(state.likert_responses || {}).length;

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-teal-500 selection:text-white">
      
      {/* Top Single Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        likertAnsweredCount={likertAnsweredCount}
        userName={state.user_name}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
        {activeTab === 'personality_matrix' && (
          <PersonalityMatrix
            state={state}
            onUpdateResponses={handleUpdateLikertResponses}
            onNavigateToParameters={() => setActiveTab('parameters')}
          />
        )}

        {activeTab === 'parameters' && (
          <ParameterEngine
            state={state}
            onUpdateParameter={handleUpdateSingleParameter}
            onSynthesizeNarrative={handleSynthesizeNarrative}
            onNavigateToExport={() => setActiveTab('exports')}
            isSynthesizing={isSynthesizing}
          />
        )}

        {activeTab === 'exports' && (
          <ExportView
            state={state}
            onSaveDatasetVersion={handleSaveDatasetVersion}
          />
        )}
      </main>

    </div>
  );
}
