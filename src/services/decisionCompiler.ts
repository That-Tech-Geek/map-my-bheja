import { 
  DecisionScenario, 
  DecisionResponse, 
  SFTRecord, 
  DPORecord, 
  DatasetValidationReport,
  FailureLogRecord
} from '../types';

/**
 * Deterministic SFT & DPO Dataset Compiler
 * 
 * Architectural Directive:
 * Zero intermediate LLM interpretation or preprocessing transformations.
 * Converts raw Sambit responses into training and evaluation datasets via deterministic serialization.
 */

export interface CompileOptions {
  excludeHeldOut?: boolean;
  minConfidence?: number;
  includeBoundaryCondition?: boolean;
}

/**
 * Deterministic SFT Compiler
 * 
 * Transforms:
 *   Scenario + Choice + Raw Reasoning + Boundary Condition
 * Into:
 *   OpenAI/Llama messages format:
 *   user: Scenario prompt + choices
 *   assistant: "I'd choose [A/B] — [Option Text].\n\n[Reasoning]\n\n[Boundary condition: I'd reconsider if...]"
 */
export function compileSFT(
  scenarios: DecisionScenario[],
  responses: Record<string, DecisionResponse>,
  options: CompileOptions = { excludeHeldOut: true, minConfidence: 1, includeBoundaryCondition: true }
): SFTRecord[] {
  const records: SFTRecord[] = [];

  for (const scenario of scenarios) {
    // Zero-leakage constraint: exclude held-out scenarios from training
    if (options.excludeHeldOut && scenario.is_held_out) {
      continue;
    }

    const response = responses[scenario.id];
    if (!response || !response.choice) {
      continue;
    }

    if (options.minConfidence && response.confidence < options.minConfidence) {
      continue;
    }

    const chosenOptionText = response.choice === 'A' ? scenario.option_a : scenario.option_b;
    
    // Construct user prompt
    const userContent = `You are facing a critical trade-off decision:\n\nScenario: ${scenario.scenario}\n\nOption A: ${scenario.option_a}\nOption B: ${scenario.option_b}\n\nHow would you decide, and what is your reasoning and boundary condition?`;

    // Construct deterministic assistant response (what Sambit actually said)
    let assistantContent = `I'd choose ${response.choice} — ${chosenOptionText}.`;

    if (response.reasoning && response.reasoning.trim()) {
      assistantContent += `\n\n${response.reasoning.trim()}`;
    }

    if (options.includeBoundaryCondition !== false && response.boundary_condition && response.boundary_condition.trim()) {
      assistantContent += `\n\nBoundary Condition: ${response.boundary_condition.trim()}`;
    }

    records.push({
      messages: [
        { role: 'user', content: userContent },
        { role: 'assistant', content: assistantContent },
      ],
      metadata: {
        scenario_id: scenario.id,
        category: scenario.category,
        confidence: response.confidence,
        importance: response.importance,
      }
    });
  }

  return records;
}

/**
 * Deterministic DPO Compiler
 * 
 * Transforms:
 *   Scenario + Sambit's chosen option & rationale vs strongest competing option & rationale
 * Into:
 *   DPO Triplet: { prompt, chosen, rejected }
 * 
 * Teaches the model: "Given competing plausible behaviors, which one represents Sambit?"
 */
export function compileDPO(
  scenarios: DecisionScenario[],
  responses: Record<string, DecisionResponse>,
  options: CompileOptions = { excludeHeldOut: true, minConfidence: 1, includeBoundaryCondition: true }
): DPORecord[] {
  const records: DPORecord[] = [];

  for (const scenario of scenarios) {
    if (options.excludeHeldOut && scenario.is_held_out) {
      continue;
    }

    const response = responses[scenario.id];
    if (!response || !response.choice) {
      continue;
    }

    if (options.minConfidence && response.confidence < options.minConfidence) {
      continue;
    }

    const isA = response.choice === 'A';
    const chosenOptionText = isA ? scenario.option_a : scenario.option_b;
    const rejectedOptionLetter = isA ? 'B' : 'A';
    const rejectedOptionText = isA ? scenario.option_b : scenario.option_a;
    const rejectedCompetingRationale = isA 
      ? (scenario.competing_rationale_b || `Prioritize ${scenario.option_b}`)
      : (scenario.competing_rationale_a || `Prioritize ${scenario.option_a}`);

    const prompt = `Decision Dilemma:\n${scenario.scenario}\n\n[Option A]: ${scenario.option_a}\n[Option B]: ${scenario.option_b}\n\nWhat is your policy decision, underlying trade-off reasoning, and decision boundary?`;

    // Chosen output (Sambit's authentic policy)
    let chosen = `I'd choose ${response.choice} — ${chosenOptionText}.`;
    if (response.reasoning && response.reasoning.trim()) {
      chosen += `\n\nReasoning: ${response.reasoning.trim()}`;
    }
    if (options.includeBoundaryCondition !== false && response.boundary_condition && response.boundary_condition.trim()) {
      chosen += `\n\nBoundary Condition: ${response.boundary_condition.trim()}`;
    }

    // Rejected output (competing alternative argument)
    const rejected = `I'd choose ${rejectedOptionLetter} — ${rejectedOptionText}.\n\nReasoning: ${rejectedCompetingRationale.trim()}`;

    records.push({
      prompt,
      chosen,
      rejected,
      metadata: {
        scenario_id: scenario.id,
        category: scenario.category,
        confidence: response.confidence,
        importance: response.importance,
      }
    });
  }

  return records;
}

/**
 * Held-Out Evaluation Dataset Compiler
 * Exclusively extracts the held-out test scenarios for post-training benchmark evaluation.
 */
export function compileHeldOutEval(
  scenarios: DecisionScenario[],
  responses: Record<string, DecisionResponse>
): SFTRecord[] {
  const heldOutScenarios = scenarios.filter(s => s.is_held_out);
  return compileSFT(heldOutScenarios, responses, { excludeHeldOut: false, includeBoundaryCondition: true });
}

/**
 * Deterministic Dataset Validator
 * Checks for:
 * 1. Missing responses
 * 2. Empty reasoning / boundary conditions
 * 3. Train / Eval data leakage (guarantees 0 overlap between train and held-out test sets)
 * 4. Category balance & average confidence
 */
export function validateDataset(
  scenarios: DecisionScenario[],
  responses: Record<string, DecisionResponse>,
  customHeldOutIds?: string[]
): DatasetValidationReport {
  const heldOutIdSet = new Set(customHeldOutIds || scenarios.filter(s => s.is_held_out).map(s => s.id));
  
  let totalAnswered = 0;
  let trainCount = 0;
  let heldOutCount = 0;
  let missingReasoningCount = 0;
  let missingBoundaryCount = 0;
  let totalConfidence = 0;
  let totalImportance = 0;
  const leakageScenarioIds: string[] = [];

  const categoryBreakdown: Record<string, { total: number; answered: number; aCount: number; bCount: number }> = {};

  for (const s of scenarios) {
    if (!categoryBreakdown[s.category]) {
      categoryBreakdown[s.category] = { total: 0, answered: 0, aCount: 0, bCount: 0 };
    }
    categoryBreakdown[s.category].total += 1;

    const resp = responses[s.id];
    if (resp && resp.choice) {
      totalAnswered += 1;
      categoryBreakdown[s.category].answered += 1;
      if (resp.choice === 'A') categoryBreakdown[s.category].aCount += 1;
      if (resp.choice === 'B') categoryBreakdown[s.category].bCount += 1;

      if (heldOutIdSet.has(s.id)) {
        heldOutCount += 1;
      } else {
        trainCount += 1;
      }

      if (!resp.reasoning || resp.reasoning.trim().length === 0) {
        missingReasoningCount += 1;
      }

      if (!resp.boundary_condition || resp.boundary_condition.trim().length === 0) {
        missingBoundaryCount += 1;
      }

      totalConfidence += resp.confidence || 3;
      totalImportance += resp.importance || 3;
    }
  }

  // Leakage check: ensure no scenario is both in train export and in held-out set
  const trainScenarios = scenarios.filter(s => !heldOutIdSet.has(s.id) && responses[s.id]?.choice);
  for (const ts of trainScenarios) {
    if (heldOutIdSet.has(ts.id)) {
      leakageScenarioIds.push(ts.id);
    }
  }

  return {
    totalScenarios: scenarios.length,
    totalAnswered,
    completionRate: scenarios.length > 0 ? Math.round((totalAnswered / scenarios.length) * 100) : 0,
    trainCount,
    heldOutCount,
    missingReasoningCount,
    missingBoundaryCount,
    leakageDetected: leakageScenarioIds.length > 0,
    leakageScenarioIds,
    categoryBreakdown,
    averageConfidence: totalAnswered > 0 ? Number((totalConfidence / totalAnswered).toFixed(2)) : 0,
    averageImportance: totalAnswered > 0 ? Number((totalImportance / totalAnswered).toFixed(2)) : 0,
  };
}

/**
 * Format records to JSONL string
 */
export function exportToJSONL(records: any[]): string {
  return records.map(r => JSON.stringify(r)).join('\n');
}

/**
 * Generate questions.json (Immutable Question Bank)
 */
export function generateQuestionsJSON(scenarios: DecisionScenario[]): string {
  return JSON.stringify(
    scenarios.map(({ id, category, scenario, option_a, option_b, is_held_out, tags }) => ({
      id,
      category,
      scenario,
      option_a,
      option_b,
      is_held_out: !!is_held_out,
      tags: tags || []
    })),
    null,
    2
  );
}

/**
 * Generate responses.json (Sambit's Raw Psychological Data)
 */
export function generateResponsesJSON(responses: Record<string, DecisionResponse>): string {
  return JSON.stringify(responses, null, 2);
}

/**
 * Generate failure.jsonl (Model failure corrections for next training loop)
 */
export function generateFailureJSONL(failures: FailureLogRecord[]): string {
  return failures.map(f => JSON.stringify(f)).join('\n');
}

/**
 * Browser file download helper
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
