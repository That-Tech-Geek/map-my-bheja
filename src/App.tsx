import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Header, 
  ActiveTab 
} from './components/Header';
import { LeftNav } from './components/LeftNav';
import { ChatView } from './components/ChatView';
import { CognitiveInspector } from './components/CognitiveInspector';
import { DatasetCompiler } from './components/DatasetCompiler';
import { ExportView } from './components/ExportView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CorrectionModal } from './components/CorrectionModal';
import { SessionManagerModal } from './components/SessionManagerModal';
import { StressTestModal } from './components/StressTestModal';
import { PersonalityMatrix } from './components/PersonalityMatrix';
import { ParameterEngine } from './components/ParameterEngine';
import { FineTuningStudio } from './components/FineTuningStudio';
import { 
  FullCognitiveState, 
  ChatMessage, 
  Observation, 
  Experience, 
  Contradiction, 
  DecisionBoundary, 
  UserCorrection, 
  TrainingExampleItem, 
  DatasetVersion,
  SessionRecord,
  DisconfirmingProbe,
  Policy,
  SambitPrediction,
  PersonalityParameterKey,
  FineTuningRun
} from './types';
import { 
  fetchState, 
  saveState, 
  streamChatResponse, 
  analyzeCognitiveState, 
  compileDataset,
  clusterPolicies,
  predictAndEvaluate,
  planNextSession,
  synthesizePersonalityNarrative
} from './services/api';
import { computeParametersFromLikert } from './data/likert500Questions';
import { INITIAL_SENTIMENT_SESSIONS } from './data/sentimentData';
import { buildDatasetVersion, computeDatasetManifest } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('personality_matrix');
  const [state, setState] = useState<FullCognitiveState | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isClusteringPolicies, setIsClusteringPolicies] = useState(false);
  const [isSynthesizingNarrative, setIsSynthesizingNarrative] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Modal states
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionTargetObs, setCorrectionTargetObs] = useState<Observation | undefined>(undefined);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isStressTestModalOpen, setIsStressTestModalOpen] = useState(false);
  const [stressTestTargetObs, setStressTestTargetObs] = useState<Observation | null>(null);

  // State ref to guarantee callbacks always read the absolute latest state without closure staleness
  const stateRef = useRef<FullCognitiveState | null>(null);
  stateRef.current = state;

  // Persist state atomically to React state, localStorage backup, and server store
  const persistState = useCallback(async (newState: FullCognitiveState) => {
    setState(newState);
    stateRef.current = newState;
    try {
      localStorage.setItem('cognitive_app_state_backup', JSON.stringify(newState));
      await saveState(newState);
    } catch (err) {
      console.error('Failed to persist state:', err);
    }
  }, []);

  // Load state on mount with multi-layer resilience
  useEffect(() => {
    async function init() {
      // Check server health & API key presence
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.hasApiKey === 'boolean') {
            setHasApiKey(data.hasApiKey);
          }
        })
        .catch((e) => console.error('Health check failed:', e));

      try {
        const loadedState = await fetchState();
        const localBackupRaw = localStorage.getItem('cognitive_app_state_backup');
        let chosenState = loadedState;

        if (localBackupRaw) {
          try {
            const localBackup = JSON.parse(localBackupRaw);
            const serverMsgCount = Object.values(loadedState?.messages || {}).flat().length;
            const localMsgCount = Object.values(localBackup?.messages || {}).flat().length;

            // If local storage has more messages or sessions than server store, restore local backup and sync
            if (
              localMsgCount > serverMsgCount ||
              (localBackup?.sessions?.length || 0) > (loadedState?.sessions?.length || 0)
            ) {
              console.log('Restoring richer session and chat data from local cache...');
              chosenState = localBackup;
              saveState(localBackup).catch((e) => console.error('Error syncing local backup to server:', e));
            }
          } catch (e) {
            console.error('Failed to parse local backup:', e);
          }
        }

        if (chosenState) {
          if (!chosenState.sentiment_sessions || chosenState.sentiment_sessions.length === 0) {
            chosenState.sentiment_sessions = INITIAL_SENTIMENT_SESSIONS;
          }
        }

        setState(chosenState);
        stateRef.current = chosenState;
        if (chosenState) {
          localStorage.setItem('cognitive_app_state_backup', JSON.stringify(chosenState));
        }
      } catch (err) {
        console.error('Failed to load state from server, checking local backup...', err);
        const localBackupRaw = localStorage.getItem('cognitive_app_state_backup');
        if (localBackupRaw) {
          try {
            const localBackup = JSON.parse(localBackupRaw);
            if (!localBackup.sentiment_sessions || localBackup.sentiment_sessions.length === 0) {
              localBackup.sentiment_sessions = INITIAL_SENTIMENT_SESSIONS;
            }
            setState(localBackup);
            stateRef.current = localBackup;
          } catch (e) {
            // ignore
          }
        }
      }
    }
    init();
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-700 font-mono">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs text-slate-500 font-medium">Initializing Cognitive Apprenticeship Engine...</p>
      </div>
    );
  }

  const activeSessionId = state.active_session_id || state.sessions[0]?.session_id;
  const currentSession = state.sessions.find(s => s.session_id === activeSessionId) || state.sessions[0];
  const currentMessages = state.messages[activeSessionId] || [];

  // Run background cognitive extraction (merges results into current state without overwriting chat messages)
  const triggerCognitiveAnalysis = async (sessionMessages: ChatMessage[], targetSessionId?: string) => {
    const currentState = stateRef.current;
    if (!currentState) return;
    const sessId = targetSessionId || activeSessionId;

    setIsAnalyzing(true);
    try {
      const result = await analyzeCognitiveState({
        session_id: sessId,
        messages: sessionMessages,
        current_state: {
          observations: currentState.observations,
          contradictions: currentState.contradictions,
          experiences: currentState.experiences,
          boundaries: currentState.boundaries,
        },
      });

      if (result?.analysis) {
        const { 
          new_observations = [], 
          extracted_experiences = [], 
          discovered_contradictions = [], 
          discovered_boundaries = [] 
        } = result.analysis;

        const now = new Date().toISOString();

        // Always read the absolute latest state from stateRef so concurrent messages are never lost
        const latestState = stateRef.current || currentState;

        // Merge Observations (avoid duplicates based on text match)
        const updatedObservations = [...latestState.observations];
        new_observations.forEach((obs: any) => {
          const existingIdx = updatedObservations.findIndex(o => 
            o.observation.toLowerCase().trim() === obs.observation.toLowerCase().trim()
          );
          if (existingIdx >= 0) {
            updatedObservations[existingIdx] = {
              ...updatedObservations[existingIdx],
              confidence: Math.max(updatedObservations[existingIdx].confidence, obs.confidence),
              status: obs.status || updatedObservations[existingIdx].status,
              conditions: obs.conditions || updatedObservations[existingIdx].conditions,
              disconfirming_scenario: obs.disconfirming_scenario || updatedObservations[existingIdx].disconfirming_scenario,
              falsification_criteria: obs.falsification_criteria || updatedObservations[existingIdx].falsification_criteria,
              target_boundary_variable: obs.target_boundary_variable || updatedObservations[existingIdx].target_boundary_variable,
              supporting_messages: Array.from(new Set([
                ...(updatedObservations[existingIdx].supporting_messages || []),
                ...(obs.supporting_messages || []),
              ])),
              last_updated: now,
            };
          } else {
            updatedObservations.push({
              observation_id: `obs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              observation: obs.observation,
              category: obs.category,
              confidence: obs.confidence || 0.65,
              supporting_messages: obs.supporting_messages || [],
              contradicting_messages: obs.contradicting_messages || [],
              status: obs.status || 'hypothesis',
              conditions: obs.conditions,
              disconfirming_scenario: obs.disconfirming_scenario,
              falsification_criteria: obs.falsification_criteria,
              target_boundary_variable: obs.target_boundary_variable,
              probe_status: 'untested',
              last_updated: now,
            });
          }
        });

        // Merge Experiences
        const updatedExperiences = [...latestState.experiences];
        extracted_experiences.forEach((exp: any) => {
          const exists = updatedExperiences.some(e => 
            e.situation.toLowerCase() === exp.situation.toLowerCase()
          );
          if (!exists) {
            updatedExperiences.push({
              experience_id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              context: exp.context || 'Engineering and decision history',
              situation: exp.situation,
              what_sambit_noticed: exp.what_sambit_noticed || [],
              options: exp.options || [],
              decision: exp.decision,
              reasoning_summary: exp.reasoning_summary,
              action: exp.action || exp.decision,
              outcome: exp.outcome || 'Reflected upon in dialogue',
              reflection: exp.reflection || '',
              principles_involved: exp.principles_involved || [],
              source_messages: exp.source_messages || [],
              extracted_at: now,
            });
          }
        });

        // Merge Contradictions
        const updatedContradictions = [...latestState.contradictions];
        discovered_contradictions.forEach((c: any) => {
          const exists = updatedContradictions.some(existing => 
            existing.stated_pattern_a === c.stated_pattern_a && existing.observed_pattern_b === c.observed_pattern_b
          );
          if (!exists) {
            updatedContradictions.push({
              contradiction_id: `contra_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              stated_pattern_a: c.stated_pattern_a,
              observed_pattern_b: c.observed_pattern_b,
              resolution_hypothesis: c.resolution_hypothesis,
              status: c.status || 'open',
              source_messages: c.source_messages || [],
              discovered_at: now,
            });
          }
        });

        // Merge Boundaries
        const updatedBoundaries = [...latestState.boundaries];
        discovered_boundaries.forEach((b: any) => {
          const exists = updatedBoundaries.some(existing => 
            existing.dimension === b.dimension && existing.domain === b.domain
          );
          if (!exists) {
            updatedBoundaries.push({
              boundary_id: `bound_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              domain: b.domain,
              dimension: b.dimension,
              inferred_threshold: b.inferred_threshold,
              confidence: b.confidence || 0.7,
              evidence_messages: b.evidence_messages || [],
              recorded_at: now,
            });
          }
        });

        const newState: FullCognitiveState = {
          ...latestState,
          observations: updatedObservations,
          experiences: updatedExperiences,
          contradictions: updatedContradictions,
          boundaries: updatedBoundaries,
          last_analysis_timestamp: now,
        };

        await persistState(newState);
      }
    } catch (err) {
      console.error('Background cognitive analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send message from user and stream response
  const handleSendMessage = async (text: string) => {
    const currentState = stateRef.current;
    if (!currentState) return;

    const currentActiveSessionId = currentState.active_session_id || currentState.sessions[0]?.session_id;
    const sessionMessages = currentState.messages[currentActiveSessionId] || [];

    const userMsgId = `msg_user_${Date.now()}`;
    const userMsg: ChatMessage = {
      message_id: userMsgId,
      session_id: currentActiveSessionId,
      timestamp: new Date().toISOString(),
      speaker: 'user',
      content: text,
    };

    const updatedSessionMessages = [...sessionMessages, userMsg];

    // Immediately persist user message so it is NEVER lost
    const stateWithUserMsg: FullCognitiveState = {
      ...currentState,
      messages: {
        ...currentState.messages,
        [currentActiveSessionId]: updatedSessionMessages,
      },
      sessions: currentState.sessions.map(s => 
        s.session_id === currentActiveSessionId 
          ? { ...s, message_count: s.message_count + 1, updated_at: new Date().toISOString() } 
          : s
      ),
    };

    await persistState(stateWithUserMsg);

    setIsStreaming(true);
    setStreamingContent('');

    await streamChatResponse(
      {
        session_id: currentActiveSessionId,
        messages: updatedSessionMessages,
        observations: currentState.observations,
        experiences: currentState.experiences,
        contradictions: currentState.contradictions,
        boundaries: currentState.boundaries,
        corrections: currentState.corrections,
      },
      (chunk) => {
        setStreamingContent(prev => prev + chunk);
      },
      async (fullText) => {
        setIsStreaming(false);
        setStreamingContent('');

        // Parse any embedded Disconfirming Probe metadata tag
        let cleanContent = fullText;
        let disconfirmingProbe: DisconfirmingProbe | undefined = undefined;

        const probeMatch = fullText.match(/<!--\s*DISCONFIRMATION_PROBE:\s*(\{[\s\S]*?\})\s*-->/);
        if (probeMatch) {
          try {
            disconfirmingProbe = JSON.parse(probeMatch[1]);
            cleanContent = fullText.replace(/<!--\s*DISCONFIRMATION_PROBE:[\s\S]*?-->/, '').trim();
          } catch (e) {
            console.error('Failed to parse probe JSON tag:', e);
          }
        }

        const modelMsgId = `msg_model_${Date.now()}`;
        const modelMsg: ChatMessage = {
          message_id: modelMsgId,
          session_id: currentActiveSessionId,
          timestamp: new Date().toISOString(),
          speaker: 'interviewer',
          content: cleanContent,
          disconfirming_probe: disconfirmingProbe,
        };

        // Read the latest state from stateRef to preserve all concurrent user messages
        const latestState = stateRef.current || stateWithUserMsg;
        const currentActiveMsgs = latestState.messages[currentActiveSessionId] || [];
        
        // Ensure user message is retained, then append modelMsg
        const finalSessionMessages = currentActiveMsgs.some(m => m.message_id === userMsgId)
          ? [...currentActiveMsgs, modelMsg]
          : [...currentActiveMsgs, userMsg, modelMsg];
        
        // If there was a probe, update the targeted observation's probe_status
        let updatedObservations = [...latestState.observations];
        if (disconfirmingProbe?.target_hypothesis) {
          const targetText = disconfirmingProbe.target_hypothesis.toLowerCase().trim();
          updatedObservations = updatedObservations.map(obs => {
            if (obs.observation.toLowerCase().includes(targetText) || targetText.includes(obs.observation.toLowerCase())) {
              return {
                ...obs,
                probe_status: 'active_probe' as const,
                disconfirming_scenario: disconfirmingProbe?.falsification_intent || obs.disconfirming_scenario,
              };
            }
            return obs;
          });
        }

        const stateWithModelMsg: FullCognitiveState = {
          ...latestState,
          observations: updatedObservations,
          messages: {
            ...latestState.messages,
            [currentActiveSessionId]: finalSessionMessages,
          },
          sessions: latestState.sessions.map(s => 
            s.session_id === currentActiveSessionId 
              ? { ...s, message_count: finalSessionMessages.length, updated_at: new Date().toISOString() } 
              : s
          ),
        };

        await persistState(stateWithModelMsg);

        // Run background cognitive model extraction safely
        triggerCognitiveAnalysis(finalSessionMessages, currentActiveSessionId);
      },
      (err) => {
        setIsStreaming(false);
        setStreamingContent('');
        console.error('Streaming error:', err);

        const isApiKeyError = typeof err === 'string' && (err.includes('GEMINI_API_KEY') || err.includes('API key'));
        if (isApiKeyError) {
          setHasApiKey(false);
        }

        const errorMsgId = `msg_err_${Date.now()}`;
        const errorContent = isApiKeyError
          ? '⚠️ **API Key Required**: `GEMINI_API_KEY` is not set in this environment. To enable real-time interview generation and autonomous questioning, please configure your key in **Settings > Secrets**.'
          : `⚠️ **Generation Error**: ${err || 'Failed to generate response stream. Please verify your API key and connection.'}`;

        const errModelMsg: ChatMessage = {
          message_id: errorMsgId,
          session_id: currentActiveSessionId,
          timestamp: new Date().toISOString(),
          speaker: 'interviewer',
          content: errorContent,
        };

        const latestState = stateRef.current || stateWithUserMsg;
        const currentActiveMsgs = latestState.messages[currentActiveSessionId] || [];
        const finalSessionMessages = currentActiveMsgs.some(m => m.message_id === userMsgId)
          ? [...currentActiveMsgs, errModelMsg]
          : [...currentActiveMsgs, userMsg, errModelMsg];

        const stateWithErrorMsg: FullCognitiveState = {
          ...latestState,
          messages: {
            ...latestState.messages,
            [currentActiveSessionId]: finalSessionMessages,
          },
        };

        persistState(stateWithErrorMsg);
      }
    );
  };

  // Launch a stress-test probe directly in the chat
  const handleLaunchStressProbeInChat = (probeQuestion: string, observation: Observation) => {
    setActiveTab('interview');
    handleSendMessage(`[Stress-Testing Hypothesis: "${observation.observation}"] ${probeQuestion}`);
  };

  // Update observation conditional nuance directly
  const handleUpdateObservationConditions = async (obsId: string, nuance: string, newStatus: Observation['status']) => {
    const currentState = stateRef.current || state;
    const updatedObservations = currentState.observations.map(obs => {
      if (obs.observation_id === obsId) {
        return {
          ...obs,
          conditions: nuance,
          status: newStatus,
          probe_status: 'qualified' as const,
          last_updated: new Date().toISOString(),
        };
      }
      return obs;
    });

    const newState: FullCognitiveState = {
      ...currentState,
      observations: updatedObservations,
    };
    await persistState(newState);
  };

  // Cluster empirical observations into high-level conditional policies
  const handleClusterPolicies = async () => {
    const currentState = stateRef.current || state;
    if (!currentState) return;
    setIsClusteringPolicies(true);
    try {
      const result = await clusterPolicies({
        observations: currentState.observations,
        experiences: currentState.experiences,
        contradictions: currentState.contradictions,
        boundaries: currentState.boundaries,
        corrections: currentState.corrections,
        existing_policies: currentState.policies,
      });

      if (result?.policies && Array.isArray(result.policies)) {
        const latestState = stateRef.current || currentState;
        const newState: FullCognitiveState = {
          ...latestState,
          policies: result.policies,
        };

        // Snapshot dataset version
        const versionSnapshot = buildDatasetVersion(newState);
        newState.dataset_versions = [...latestState.dataset_versions, versionSnapshot];

        await persistState(newState);
      }
    } catch (err) {
      console.error('Failed to cluster policies:', err);
    } finally {
      setIsClusteringPolicies(false);
    }
  };

  // Compile training dataset using ML dataset synthesizer
  const handleCompileDataset = async () => {
    const currentState = stateRef.current || state;
    setIsCompiling(true);
    try {
      const result = await compileDataset({
        session_id: activeSessionId,
        messages: currentMessages,
        observations: currentState.observations,
        experiences: currentState.experiences,
        policies: currentState.policies,
        contradictions: currentState.contradictions,
        boundaries: currentState.boundaries,
        corrections: currentState.corrections,
      });

      if (result?.compiled_examples && Array.isArray(result.compiled_examples)) {
        const now = new Date().toISOString();
        const newItems: TrainingExampleItem[] = result.compiled_examples.map((item: any) => ({
          example_id: item.example_id || `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          session_id: activeSessionId,
          example_type: item.example_type,
          payload: item.payload,
          confidence: item.confidence || 0.88,
          evidence_count: item.evidence_count || 2,
          source_references: item.source_references || [],
          source_experience_id: item.source_experience_id,
          source_observation_ids: item.source_observation_ids || [],
          underlying_policy_id: item.underlying_policy_id,
          domain: item.domain || 'coding',
          quality_score: item.quality_score || 85,
          stability: item.stability || 'high',
          is_suitable_for_training: item.is_suitable_for_training !== false,
          rejection_reason: item.rejection_reason,
          user_curation_status: item.quality_score >= 75 ? 'accepted' : 'pending',
          generated_at: now,
        }));

        const latestState = stateRef.current || currentState;
        const updatedExamples = [...newItems, ...latestState.training_examples];

        const newState: FullCognitiveState = {
          ...latestState,
          training_examples: updatedExamples,
        };

        // Also build updated dataset version snapshot
        const versionSnapshot = buildDatasetVersion(newState);
        newState.dataset_versions = [...latestState.dataset_versions, versionSnapshot];

        await persistState(newState);
        setActiveTab('dataset_compiler');
      }
    } catch (err) {
      console.error('Dataset compilation failed:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Save curated/edited example
  const handleSaveExample = async (updatedExample: TrainingExampleItem) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;
    const updated = currentState.training_examples.map(ex => 
      ex.example_id === updatedExample.example_id ? updatedExample : ex
    );
    const newState: FullCognitiveState = {
      ...currentState,
      training_examples: updated,
    };
    await persistState(newState);
  };

  // Test Sambit behavioral prediction against a situation
  const handleRunPredictionTest = async (situation: string) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;
    try {
      const result = await predictAndEvaluate({
        mode: 'predict',
        situation,
        session_id: activeSessionId,
        policies: currentState.policies,
        observations: currentState.observations,
      });

      if (result?.prediction) {
        const latestState = stateRef.current || currentState;
        const newState: FullCognitiveState = {
          ...latestState,
          predictions: [result.prediction, ...(latestState.predictions || [])],
        };
        await persistState(newState);
      }
    } catch (err) {
      console.error('Failed to run prediction test:', err);
    }
  };

  // Update example status
  const handleUpdateExampleStatus = async (id: string, status: 'accepted' | 'rejected' | 'pending') => {
    const currentState = stateRef.current || state;
    const updated = currentState.training_examples.map(ex => 
      ex.example_id === id ? { ...ex, user_curation_status: status } : ex
    );
    const newState = { ...currentState, training_examples: updated };
    await persistState(newState);
  };

  // Batch accept high quality
  const handleBatchAcceptHighQuality = async (minScore: number) => {
    const currentState = stateRef.current || state;
    const updated = currentState.training_examples.map(ex => {
      if (ex.quality_score >= minScore && ex.user_curation_status !== 'rejected') {
        return { ...ex, user_curation_status: 'accepted' as const };
      }
      return ex;
    });
    const newState = { ...currentState, training_examples: updated };
    await persistState(newState);
  };

  // Submit human nuance / correction
  const handleSubmitCorrection = async (correctionData: {
    target_observation_id: string;
    feedback_type: 'not_me' | 'partially' | 'exactly' | 'context_dependent';
    user_explanation: string;
    original_observation_text: string;
  }) => {
    const currentState = stateRef.current || state;
    const now = new Date().toISOString();
    const newCorrection: UserCorrection = {
      correction_id: `corr_${Date.now()}`,
      target_observation_id: correctionData.target_observation_id,
      feedback_type: correctionData.feedback_type,
      user_explanation: correctionData.user_explanation,
      original_observation_text: correctionData.original_observation_text,
      timestamp: now,
    };

    // Update target observation with the correction feedback
    const updatedObservations = currentState.observations.map(obs => {
      if (obs.observation_id === correctionData.target_observation_id) {
        let newStatus = obs.status;
        if (correctionData.feedback_type === 'not_me') newStatus = 'deprecated';
        if (correctionData.feedback_type === 'exactly') newStatus = 'supported';
        if (correctionData.feedback_type === 'partially' || correctionData.feedback_type === 'context_dependent') {
          newStatus = 'supported';
        }

        return {
          ...obs,
          status: newStatus,
          user_feedback: correctionData.feedback_type,
          user_correction_notes: correctionData.user_explanation,
          conditions: correctionData.feedback_type === 'context_dependent' 
            ? correctionData.user_explanation 
            : obs.conditions,
          last_updated: now,
        };
      }
      return obs;
    });

    const newState: FullCognitiveState = {
      ...currentState,
      observations: updatedObservations,
      corrections: [...currentState.corrections, newCorrection],
    };

    await persistState(newState);
  };

  // Switch session safely
  const handleSelectSession = async (sessionId: string) => {
    const currentState = stateRef.current || state;
    if (currentState.active_session_id === sessionId) {
      setActiveTab('interview');
      return;
    }
    const newState: FullCognitiveState = {
      ...currentState,
      active_session_id: sessionId,
    };
    await persistState(newState);
    setActiveTab('interview');
  };

  // Autonomous Session creation - system autonomously plans the focus, title and opening dilemma
  const handleCreateSession = async (customTitle?: string, customFocusTopics?: string[]) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;
    const nextSessionNum = (currentState.sessions?.length || 0) + 1;
    const newSessionId = `session_${nextSessionNum.toString().padStart(3, '0')}`;
    const now = new Date().toISOString();

    setIsStreaming(true);
    setStreamingContent('Planning next inquiry agenda...');

    try {
      let sessionTitle = customTitle;
      let sessionTopics = customFocusTopics;
      let sessionSummary = 'Autonomous deep-dive into unmapped boundaries & cognitive heuristics.';
      let openingQuestion = '';
      let apprenticeIntent = 'Autonomous exploration of unmapped mental boundaries';
      let disconfirmingProbe: DisconfirmingProbe | undefined = undefined;

      // If title wasn't manually supplied, let the AI autonomously plan the title, topics, and initial probe
      if (!sessionTitle || sessionTitle.trim() === '') {
        const planned = await planNextSession({
          session_number: nextSessionNum,
          observations: currentState.observations,
          experiences: currentState.experiences,
          contradictions: currentState.contradictions,
          boundaries: currentState.boundaries,
          policies: currentState.policies,
        });

        if (planned?.session_plan) {
          sessionTitle = planned.session_plan.title;
          sessionTopics = planned.session_plan.focus_topics;
          sessionSummary = planned.session_plan.summary;
          openingQuestion = planned.session_plan.opening_question;
          apprenticeIntent = planned.session_plan.apprentice_intent;
          disconfirmingProbe = planned.session_plan.disconfirming_probe;
        }
      }

      const finalTitle = sessionTitle || `Session ${nextSessionNum}: Unmapped Decision Boundaries & Heuristics`;
      const finalTopics = (sessionTopics && sessionTopics.length > 0)
        ? sessionTopics
        : ['Engineering Judgment', 'Tradeoff Boundaries', 'Risk Thresholds'];
      const finalOpening = openingQuestion || `Let's focus this session on mapping how you evaluate tradeoffs in **${finalTopics[0]}**.\n\nImagine a scenario where standard practices suggest one path, but intuition and speed suggest another. What signals do you look for to decide whether to follow the book or break the rules?`;

      const newSession: SessionRecord = {
        session_id: newSessionId,
        session_number: nextSessionNum,
        title: finalTitle,
        created_at: now,
        updated_at: now,
        message_count: 1,
        status: 'active',
        summary: sessionSummary,
        focus_topics: finalTopics,
      };

      const initialOpeningMsg: ChatMessage = {
        message_id: `msg_init_${newSessionId}`,
        session_id: newSessionId,
        timestamp: now,
        speaker: 'interviewer',
        content: finalOpening,
        apprentice_intent: apprenticeIntent,
        disconfirming_probe: disconfirmingProbe,
      };

      const latest = stateRef.current || currentState;
      const newState: FullCognitiveState = {
        ...latest,
        sessions: [...(latest.sessions || []), newSession],
        active_session_id: newSessionId,
        messages: {
          ...latest.messages,
          [newSessionId]: [initialOpeningMsg],
        },
      };

      await persistState(newState);
      setActiveTab('interview');
    } catch (err) {
      console.error('Failed to create planned session:', err);
      // Fallback simple session
      const fallbackTitle = `Session ${nextSessionNum}: Unmapped Decision Boundaries`;
      const fallbackTopics = ['Engineering Judgment', 'Tradeoffs'];
      const fallbackSession: SessionRecord = {
        session_id: newSessionId,
        session_number: nextSessionNum,
        title: fallbackTitle,
        created_at: now,
        updated_at: now,
        message_count: 1,
        status: 'active',
        summary: 'Autonomous probing of engineering instincts and decision thresholds.',
        focus_topics: fallbackTopics,
      };

      const fallbackMsg: ChatMessage = {
        message_id: `msg_init_${newSessionId}`,
        session_id: newSessionId,
        timestamp: now,
        speaker: 'interviewer',
        content: `Let's explore your decision boundaries under ambiguity.\n\nWhen you're faced with two conflicting engineering approaches—one highly robust but slow to ship, and one lightweight and fast—what specific criteria determine which way you lean?`,
        apprentice_intent: 'Probe robustness vs velocity thresholds',
      };

      const latest = stateRef.current || currentState;
      const fallbackState: FullCognitiveState = {
        ...latest,
        sessions: [...(latest.sessions || []), fallbackSession],
        active_session_id: newSessionId,
        messages: {
          ...latest.messages,
          [newSessionId]: [fallbackMsg],
        },
      };
      await persistState(fallbackState);
      setActiveTab('interview');
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  // Session deletion
  const handleDeleteSession = async (sessionId: string) => {
    const currentState = stateRef.current || state;
    if (currentState.sessions.length <= 1) return;
    const remainingSessions = currentState.sessions.filter(s => s.session_id !== sessionId);
    const newActive = remainingSessions[0].session_id;

    const newMessages = { ...currentState.messages };
    delete newMessages[sessionId];

    const newState: FullCognitiveState = {
      ...currentState,
      sessions: remainingSessions,
      active_session_id: newActive,
      messages: newMessages,
    };

    await persistState(newState);
  };

  // Save new dataset version snapshot
  const handleSaveDatasetVersion = async (version: DatasetVersion) => {
    const currentState = stateRef.current || state;
    const newState: FullCognitiveState = {
      ...currentState,
      dataset_versions: [...currentState.dataset_versions, version],
    };
    await persistState(newState);
  };

  // Update Likert 500-question responses and recompute 20 parameters
  const handleUpdateLikertResponses = async (newResponses: Record<string, number>) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;

    const { parameters, domainScores } = computeParametersFromLikert(newResponses);

    const newState: FullCognitiveState = {
      ...currentState,
      likert_responses: newResponses,
      computed_parameters: parameters,
      domain_scores: domainScores,
    };

    await persistState(newState);
  };

  // Update a single parameter slider/override
  const handleUpdateSingleParameter = async (key: PersonalityParameterKey, value: number) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;

    const existingParam = currentState.computed_parameters?.[key];
    const updatedParam = typeof existingParam === 'object' && existingParam !== null
      ? { ...existingParam, value, user_override: value }
      : { key, value, label: key, user_override: value };

    const newState: FullCognitiveState = {
      ...currentState,
      computed_parameters: {
        ...(currentState.computed_parameters || {}),
        [key]: updatedParam,
      },
    };

    await persistState(newState);
  };

  // Synthesize Behavioral Narrative via LLM
  const handleSynthesizeNarrative = async () => {
    const currentState = stateRef.current || state;
    if (!currentState) return;

    setIsSynthesizingNarrative(true);
    try {
      const res = await synthesizePersonalityNarrative({
        parameters: currentState.computed_parameters,
        domainScores: currentState.domain_scores,
        observations: currentState.observations,
        policies: currentState.policies,
        user_name: currentState.user_name || 'Sambit',
      });

      if (res.success && res.narrative) {
        const newState: FullCognitiveState = {
          ...currentState,
          behavioral_narrative: res.narrative,
        };
        await persistState(newState);
        setActiveTab('parameters');
      }
    } catch (err) {
      console.error('Failed to synthesize behavioral narrative:', err);
    } finally {
      setIsSynthesizingNarrative(false);
    }
  };

  // Save fine-tuning run
  const handleSaveFineTuningRun = async (run: FineTuningRun) => {
    const currentState = stateRef.current || state;
    if (!currentState) return;

    const newState: FullCognitiveState = {
      ...currentState,
      latest_finetuning_run: run,
      finetuning_runs: [run, ...(currentState.finetuning_runs || [])],
    };

    await persistState(newState);
  };

  const likertAnsweredCount = Object.keys(state?.likert_responses || {}).length;

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Left Vertical Navigation Bar in Sleek Theme */}
      <LeftNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSessionModal={() => setIsSessionModalOpen(true)}
        onOpenCorrectionModal={() => {
          setCorrectionTargetObs(undefined);
          setIsCorrectionModalOpen(true);
        }}
        trainingExamplesCount={state.training_examples.length}
        likertAnsweredCount={likertAnsweredCount}
      />

      {/* Main Canvas + Header Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sessions={state.sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onOpenSessionModal={() => setIsSessionModalOpen(true)}
          onStartNewSession={() => handleCreateSession()}
          onOpenCorrectionModal={() => {
            setCorrectionTargetObs(undefined);
            setIsCorrectionModalOpen(true);
          }}
          onNavigateToExport={() => setActiveTab('exports')}
          isAnalyzing={isAnalyzing}
          trainingExamplesCount={state.training_examples.length}
          userName={state.user_name}
        />

        {/* Global Alert / Missing API Key Guidance Banner */}
        {hasApiKey === false && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] uppercase font-mono">API Key Required</span>
              <span>To enable automated cognitive interviews and session generation, please add your <strong>GEMINI_API_KEY</strong> in the <strong>Settings &gt; Secrets</strong> panel.</span>
            </div>
            <button
              onClick={() => setHasApiKey(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-semibold px-2 py-0.5 rounded hover:bg-amber-100/60"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-50">
          {activeTab === 'personality_matrix' && (
            <PersonalityMatrix
              state={state}
              onUpdateResponses={handleUpdateLikertResponses}
              onSynthesizeNarrative={handleSynthesizeNarrative}
              onNavigateToParameters={() => setActiveTab('parameters')}
              isSynthesizing={isSynthesizingNarrative}
            />
          )}

          {activeTab === 'cognitive_model' && (
            <CognitiveInspector
              observations={state.observations}
              experiences={state.experiences}
              contradictions={state.contradictions}
              boundaries={state.boundaries}
              onOpenCorrectionModal={(obs) => {
                setCorrectionTargetObs(obs);
                setIsCorrectionModalOpen(true);
              }}
              onOpenStressTestModal={(obs) => {
                setStressTestTargetObs(obs);
                setIsStressTestModalOpen(true);
              }}
              onRefreshAnalysis={() => triggerCognitiveAnalysis(currentMessages)}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === 'personality_matrix' && (
            <PersonalityMatrix
              state={state}
              onUpdateResponses={handleUpdateLikertResponses}
              onSynthesizeNarrative={handleSynthesizeNarrative}
              onNavigateToParameters={() => setActiveTab('parameters')}
              isSynthesizing={isSynthesizingNarrative}
            />
          )}

          {activeTab === 'parameters' && (
            <ParameterEngine
              state={state}
              onUpdateParameter={handleUpdateSingleParameter}
              onSynthesizeNarrative={handleSynthesizeNarrative}
              onNavigateToFineTuning={() => setActiveTab('finetuning')}
              isSynthesizing={isSynthesizingNarrative}
            />
          )}

          {activeTab === 'finetuning' && (
            <FineTuningStudio
              state={state}
              onSaveRun={handleSaveFineTuningRun}
              onNavigateToMatrix={() => setActiveTab('personality_matrix')}
              onNavigateToParameters={() => setActiveTab('parameters')}
            />
          )}

          {activeTab === 'dataset_compiler' && (
            <DatasetCompiler
              examples={state.training_examples}
              policies={state.policies || []}
              predictions={state.predictions || []}
              manifest={computeDatasetManifest(state)}
              state={state}
              onCompile={handleCompileDataset}
              onClusterPolicies={handleClusterPolicies}
              onUpdateExampleStatus={handleUpdateExampleStatus}
              onBatchAcceptHighQuality={handleBatchAcceptHighQuality}
              onSaveExample={handleSaveExample}
              onRunPredictionTest={handleRunPredictionTest}
              onNavigateToExport={() => setActiveTab('exports')}
              isCompiling={isCompiling}
              isClusteringPolicies={isClusteringPolicies}
            />
          )}

          {activeTab === 'exports' && (
            <ExportView
              state={state}
              onSaveDatasetVersion={handleSaveDatasetVersion}
            />
          )}

          {activeTab === 'analytics' && (
            <ProgressDashboard
              state={state}
              onNavigateToCompiler={() => setActiveTab('dataset_compiler')}
              onNavigateToInspector={() => setActiveTab('cognitive_model')}
            />
          )}
        </main>
      </div>

      {/* Stress-Test & Active Disconfirmation Modal */}
      <StressTestModal
        isOpen={isStressTestModalOpen}
        onClose={() => {
          setIsStressTestModalOpen(false);
          setStressTestTargetObs(null);
        }}
        observation={stressTestTargetObs}
        onLaunchProbeInChat={handleLaunchStressProbeInChat}
        onUpdateObservationConditions={handleUpdateObservationConditions}
      />

      {/* Correction Modal */}
      <CorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => {
          setIsCorrectionModalOpen(false);
          setCorrectionTargetObs(undefined);
        }}
        targetObservation={correctionTargetObs}
        allObservations={state.observations}
        onSubmitCorrection={handleSubmitCorrection}
      />

      {/* Session Manager Modal */}
      <SessionManagerModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        sessions={state.sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
      />

    </div>
  );
}
