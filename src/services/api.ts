/**
 * API Service for Cognitive Apprenticeship Server
 */
import { FullCognitiveState, TrainingExampleItem } from '../types';

export async function fetchState(): Promise<FullCognitiveState> {
  const res = await fetch('/api/state');
  if (!res.ok) {
    throw new Error(`Failed to fetch state: ${res.statusText}`);
  }
  return res.json();
}

export async function saveState(state: FullCognitiveState): Promise<{ success: boolean }> {
  const res = await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) {
    throw new Error(`Failed to save state: ${res.statusText}`);
  }
  return res.json();
}

export async function streamChatResponse(
  payload: {
    session_id: string;
    messages: any[];
    observations: any[];
    experiences: any[];
    contradictions: any[];
    boundaries: any[];
    corrections: any[];
  },
  onChunk: (chunk: string) => void,
  onDone: (fullText: string) => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No readable stream available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === 'chunk') {
              onChunk(data.text);
            } else if (data.type === 'done') {
              onDone(data.fullText);
            } else if (data.type === 'error') {
              onError(data.error);
            }
          } catch (e) {
            console.error('Failed to parse SSE line:', line, e);
          }
        }
      }
    }
  } catch (error: any) {
    onError(error.message || 'Stream connection failed');
  }
}

export async function analyzeCognitiveState(payload: {
  session_id: string;
  messages: any[];
  current_state: any;
}): Promise<any> {
  const res = await fetch('/api/cognitive/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze cognitive state');
  }

  return res.json();
}

export async function clusterPolicies(payload: {
  observations: any[];
  experiences: any[];
  contradictions?: any[];
  boundaries?: any[];
  corrections?: any[];
  existing_policies?: any[];
}): Promise<{ success: boolean; policies: any[] }> {
  const res = await fetch('/api/cognitive/policies/cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to cluster policies');
  }

  return res.json();
}

export async function predictAndEvaluate(payload: {
  mode: 'predict' | 'evaluate';
  situation: string;
  session_id?: string;
  message_id?: string;
  actual_response?: string;
  predicted_decision?: string;
  predicted_reasoning?: string;
  policies?: any[];
  observations?: any[];
}): Promise<any> {
  const res = await fetch('/api/cognitive/predict-and-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to execute prediction/evaluation');
  }

  return res.json();
}

export async function compileDataset(payload: {
  session_id: string;
  messages: any[];
  observations: any[];
  experiences: any[];
  policies?: any[];
  contradictions: any[];
  boundaries: any[];
  corrections: any[];
}): Promise<{ compiled_examples: TrainingExampleItem[] }> {
  const res = await fetch('/api/dataset/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to compile dataset');
  }

  return res.json();
}

export async function planNextSession(payload: {
  session_number: number;
  observations: any[];
  experiences: any[];
  contradictions?: any[];
  boundaries?: any[];
  policies?: any[];
}): Promise<{
  success: boolean;
  session_plan: {
    title: string;
    focus_topics: string[];
    summary: string;
    opening_question: string;
    apprentice_intent: string;
    disconfirming_probe?: {
      target_hypothesis: string;
      scenario: string;
      falsification_intent: string;
    };
  };
}> {
  const res = await fetch('/api/cognitive/sessions/plan-next', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to plan next session');
  }

  return res.json();
}

export async function generateHypothesisStressTest(payload: {
  observation: string;
  category: string;
  conditions?: string;
  recent_messages?: any[];
}): Promise<{
  success: boolean;
  stress_test: {
    disconfirming_scenario: string;
    falsification_criteria: string;
    target_boundary_variable: string;
    suggested_interviewer_question: string;
    challenge_angles: Array<{
      angle_name: string;
      scenario_variant: string;
      probe_prompt: string;
    }>;
  };
}> {
  const res = await fetch('/api/cognitive/stress-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate hypothesis stress test');
  }

  return res.json();
}

export async function synthesizePersonalityNarrative(payload: {
  parameters: any;
  domainScores?: any;
  observations?: any[];
  policies?: any[];
  user_name?: string;
}): Promise<{
  success: boolean;
  narrative: any;
}> {
  const res = await fetch('/api/personality/synthesize-narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to synthesize behavioral narrative');
  }

  return res.json();
}

export async function simulateFineTuningRun(payload: {
  config: any;
  parameters?: any;
  narrative?: any;
  dataset_size?: number;
}): Promise<{
  success: boolean;
  run: any;
}> {
  const res = await fetch('/api/finetune/simulate-run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to simulate fine-tuning run');
  }

  return res.json();
}

export async function testPromptComparison(payload: {
  prompt: string;
  narrative?: any;
  parameters?: any;
}): Promise<{
  success: boolean;
  comparison: {
    id: string;
    prompt: string;
    baseline_output: string;
    fine_tuned_output: string;
    alignment_score: number;
  };
}> {
  const res = await fetch('/api/finetune/test-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to test prompt comparison');
  }

  return res.json();
}


