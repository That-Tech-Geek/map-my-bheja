import JSZip from 'jszip';
import { 
  FullCognitiveState, 
  DatasetVersion, 
  DatasetManifest,
  TrainingExampleItem, 
  Observation, 
  Experience, 
  Policy,
  SambitPrediction,
  ChatMessage 
} from '../types';

/**
 * Convert array of objects into newline-delimited JSON (JSONL).
 * Ensures every line is valid standalone JSON and not wrapped in an array.
 */
export function toJsonl(items: any[]): string {
  if (!items || items.length === 0) return '';
  return items.map(item => JSON.stringify(item)).join('\n');
}

/**
 * Computes deep dataset manifest with provenance coverage, policy distribution, and evaluation metrics
 */
export function computeDatasetManifest(
  state: FullCognitiveState, 
  datasetVersion: string = `dataset_v${(state.dataset_versions?.length || 0) + 1}`, 
  validExamples: TrainingExampleItem[] = (state.training_examples || []).filter(
    ex => ex.user_curation_status !== 'rejected' && ex.is_suitable_for_training
  )
): DatasetManifest {
  const now = new Date().toISOString();
  const allMessages: ChatMessage[] = Object.values(state.messages).flat();
  const policies = state.policies || [];
  const experiences = state.experiences || [];
  const observations = state.observations || [];
  const predictions = state.predictions || [];

  // 1. Source Coverage Math
  const coveredExpIds = new Set<string>();
  const coveredObsIds = new Set<string>();
  const coveredPolicyIds = new Set<string>();

  // Check from policies
  policies.forEach(p => {
    (p.supporting_experiences || []).forEach(id => coveredExpIds.add(id));
    (p.supporting_observations || []).forEach(id => coveredObsIds.add(id));
  });

  // Check from training examples
  validExamples.forEach(ex => {
    if (ex.source_experience_id) coveredExpIds.add(ex.source_experience_id);
    if (ex.underlying_policy_id) coveredPolicyIds.add(ex.underlying_policy_id);
    if (ex.source_observation_ids) {
      ex.source_observation_ids.forEach(id => coveredObsIds.add(id));
    }
    (ex.source_references || []).forEach(ref => {
      if (ref.startsWith('exp_')) coveredExpIds.add(ref);
      if (ref.startsWith('obs_')) coveredObsIds.add(ref);
      if (ref.startsWith('POL_')) coveredPolicyIds.add(ref);
    });
    // Check payload fields
    const p = ex.payload as any;
    if (p.source_experience) coveredExpIds.add(p.source_experience);
    if (p.source_policy) coveredPolicyIds.add(p.source_policy);
    if (p.source_observations && Array.isArray(p.source_observations)) {
      p.source_observations.forEach((id: string) => coveredObsIds.add(id));
    }
  });

  const expCoveredPct = experiences.length > 0 
    ? Math.min(100, Math.round((coveredExpIds.size / experiences.length) * 100))
    : 0;
  const obsCoveredPct = observations.length > 0 
    ? Math.min(100, Math.round((coveredObsIds.size / observations.length) * 100))
    : 0;
  const policyCoveredPct = policies.length > 0 
    ? Math.min(100, Math.round((coveredPolicyIds.size / policies.length) * 100))
    : 0;

  // 2. Distributions
  const examplesPerPolicy: Record<string, number> = {};
  policies.forEach(p => {
    examplesPerPolicy[p.policy_id] = 0;
  });

  const examplesPerCategory: Record<string, number> = {};
  const examplesByDomain: Record<string, number> = {};

  validExamples.forEach(ex => {
    // Policy
    const polId = ex.underlying_policy_id || (ex.payload as any).source_policy;
    if (polId) {
      examplesPerPolicy[polId] = (examplesPerPolicy[polId] || 0) + 1;
    }

    // Domain
    const domain = ex.domain || (ex.payload as any).metadata?.domain || (ex.payload as any).domain || 'general';
    examplesByDomain[domain] = (examplesByDomain[domain] || 0) + 1;

    // Category
    const cat = (ex.payload as any).metadata?.cognitive_dimensions?.[0] || 'engineering_judgment';
    examplesPerCategory[cat] = (examplesPerCategory[cat] || 0) + 1;
  });

  // 3. Curation counts
  const totalExamples = state.training_examples.length;
  const accepted = state.training_examples.filter(e => e.user_curation_status === 'accepted').length;
  const rejected = state.training_examples.filter(e => e.user_curation_status === 'rejected').length;
  const pending = state.training_examples.filter(e => e.user_curation_status === 'pending').length;
  const acceptanceRate = totalExamples > 0 ? Math.round((accepted / totalExamples) * 100) : 0;

  // 4. Evaluation metrics
  const evaluatedPreds = predictions.filter(p => p.status === 'evaluated');
  const avgAgreement = evaluatedPreds.length > 0
    ? Number((evaluatedPreds.reduce((acc, p) => acc + (p.agreement || 0), 0) / evaluatedPreds.length).toFixed(2))
    : 0;

  const errorBreakdown: Record<string, number> = {};
  evaluatedPreds.forEach(p => {
    const err = p.error_type || 'none';
    errorBreakdown[err] = (errorBreakdown[err] || 0) + 1;
  });

  // 5. Avg confidence
  const allConfidences = validExamples.map(e => e.confidence || 0.85);
  const avgConfidence = allConfidences.length > 0
    ? Number((allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length).toFixed(2))
    : 0.85;

  // 6. Dataset counts
  const sftCount = validExamples.filter(e => e.example_type === 'behavioral_sft').length;
  const prefCount = validExamples.filter(e => e.example_type === 'preference').length;

  return {
    dataset_version: datasetVersion,
    subject_identity: state.user_name || 'Sambit',
    generation_timestamp: now,
    counts_by_dataset: {
      raw_conversations: allMessages.length,
      experiences: experiences.length,
      observations: observations.length,
      policies: policies.length,
      training_sft: sftCount,
      training_preferences: prefCount,
      predictions: predictions.length,
      training_all: validExamples.length,
    },
    policy_count: policies.length,
    average_confidence: avgConfidence,
    source_coverage: {
      experiences_covered_pct: expCoveredPct,
      observations_covered_pct: obsCoveredPct,
      policies_covered_pct: policyCoveredPct,
    },
    duplicate_count: 0,
    contradiction_count: (state.contradictions || []).length,
    unsupported_example_count: state.training_examples.filter(e => !e.is_suitable_for_training).length,
    examples_per_policy: examplesPerPolicy,
    examples_per_cognitive_category: examplesPerCategory,
    examples_by_domain: examplesByDomain,
    curation_metrics: {
      accepted,
      pending,
      rejected,
      acceptance_rate: acceptanceRate,
    },
    evaluation_metrics: {
      total_predictions: predictions.length,
      evaluated_predictions: evaluatedPreds.length,
      average_agreement: avgAgreement,
      error_breakdown: errorBreakdown,
    },
    format_spec: "JSONL (Newline Delimited JSON, un-nested)",
    target_use_case: "Supervised Fine-Tuning (SFT) & Direct Preference Optimization (DPO) to replicate human cognitive policy across domains",
  };
}

/**
 * Generate versioned exports from full state
 */
export function buildDatasetVersion(state: FullCognitiveState): DatasetVersion {
  const versionNum = (state.dataset_versions.length + 1).toString().padStart(3, '0');
  const dataset_version = `dataset_v${versionNum}`;
  const now = new Date().toISOString();

  // All messages across sessions
  const allMessages: ChatMessage[] = Object.values(state.messages).flat();

  // Filter training examples: accept all curated or suitable examples (not rejected)
  const validExamples = state.training_examples.filter(
    ex => ex.user_curation_status !== 'rejected' && ex.is_suitable_for_training
  );

  const countsByType: Record<string, number> = {
    behavioral_sft: 0,
    decision: 0,
    preference: 0,
    tool_selection: 0,
    curiosity: 0,
    belief_update: 0,
    correction: 0,
  };

  validExamples.forEach(ex => {
    if (countsByType[ex.example_type] !== undefined) {
      countsByType[ex.example_type]++;
    }
  });

  const rawConversationsJsonl = toJsonl(allMessages);
  const observationsJsonl = toJsonl(state.observations || []);
  const experiencesJsonl = toJsonl(state.experiences || []);
  const policiesJsonl = toJsonl(state.policies || []);
  const predictionsJsonl = toJsonl(state.predictions || []);
  
  // Specific Conversational SFT file (training_sft.jsonl)
  const sftExamples = validExamples
    .filter(e => e.example_type === 'behavioral_sft')
    .map(e => e.payload);
  const trainingSftJsonl = toJsonl(sftExamples);

  // Specific Strict Preferences file (training_preferences.jsonl)
  const prefExamples = validExamples
    .filter(e => e.example_type === 'preference')
    .map(e => e.payload);
  const trainingPreferencesJsonl = toJsonl(prefExamples);

  // Master Training All file (every payload is standalone line)
  const masterExamples = validExamples.map(e => e.payload);
  const trainingAllJsonl = toJsonl(masterExamples);

  const avgQuality = validExamples.length > 0
    ? Math.round(validExamples.reduce((sum, e) => sum + e.quality_score, 0) / validExamples.length)
    : 0;

  const manifest = computeDatasetManifest(state, dataset_version, validExamples);
  const manifestJson = JSON.stringify(manifest, null, 2);

  return {
    version_id: `ver_${Date.now()}`,
    dataset_version,
    generation_timestamp: now,
    source_session_ids: state.sessions.map(s => s.session_id),
    total_examples: state.training_examples.length,
    accepted_examples: validExamples.length,
    average_quality_score: avgQuality,
    counts_by_type: countsByType as any,
    manifest,
    export_files: {
      raw_conversations: rawConversationsJsonl,
      observations: observationsJsonl,
      experiences: experiencesJsonl,
      policies: policiesJsonl,
      training_sft: trainingSftJsonl,
      training_preferences: trainingPreferencesJsonl,
      predictions: predictionsJsonl,
      training_all: trainingAllJsonl,
      dataset_manifest: manifestJson,
    },
  };
}

/**
 * Triggers a browser download for a single text / JSONL file
 */
export function downloadFile(filename: string, content: string, mimeType = 'application/x-jsonlines'): void {
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

/**
 * Generates and downloads a complete ZIP bundle containing all 8 JSONL files + dataset_manifest.json + README
 */
export async function downloadFullDatasetZip(version: DatasetVersion, userName: string = 'Sambit'): Promise<void> {
  const zip = new JSZip();

  const folderName = `${version.dataset_version}_${userName.toLowerCase()}_cognitive_sft`;
  const folder = zip.folder(folderName) || zip;

  folder.file('training_all.jsonl', version.export_files.training_all || '');
  folder.file('training_sft.jsonl', version.export_files.training_sft || '');
  folder.file('training_preferences.jsonl', version.export_files.training_preferences || '');
  folder.file('policies.jsonl', version.export_files.policies || '');
  folder.file('prediction.jsonl', version.export_files.predictions || '');
  folder.file('experiences.jsonl', version.export_files.experiences || '');
  folder.file('observations.jsonl', version.export_files.observations || '');
  folder.file('raw_conversations.jsonl', version.export_files.raw_conversations || '');
  folder.file('dataset_manifest.json', version.export_files.dataset_manifest || (version.manifest ? JSON.stringify(version.manifest, null, 2) : '{}'));

  const readmeContent = `# Cognitive Apprenticeship — Identity Training Dataset
**Subject:** ${userName}
**Version:** ${version.dataset_version}
**Timestamp:** ${version.generation_timestamp}
**Total Training Examples:** ${version.accepted_examples}
**Average Quality Score:** ${version.average_quality_score}/100

---

## The Cognitive Pipeline Architecture
\`\`\`text
RAW CONVERSATION (raw_conversations.jsonl)
       ↓
EXPERIENCES (experiences.jsonl)
       ↓
OBSERVATIONS (observations.jsonl)
       ↓
POLICIES (policies.jsonl)
       ↓
COGNITIVE TRAINING COMPILER
       ├── training_sft.jsonl (Conversational SFT across domains testing underlying policies)
       ├── training_preferences.jsonl (Real DPO pairs from corrections/disagreements)
       ├── prediction.jsonl (Held-out behavioral prediction & evaluation dataset)
       ├── training_all.jsonl (Master composite dataset with all 7 cognitive types)
       └── dataset_manifest.json (Metrics, provenance coverage, and policy matrix)
\`\`\`

## Files Included:
1. **training_sft.jsonl** — High-fidelity conversational SFT examples. Model learns the *policy demonstrated by ${userName}* applied across diverse domains (coding, business, research, strategy, product).
2. **training_preferences.jsonl** — Strict DPO preference pairs derived ONLY from real human choices, rejected AI suggestions, and user corrections.
3. **policies.jsonl** — Clustered high-level conditional policies with explicit conditions, exceptions, supporting evidence IDs, and counter-evidence.
4. **prediction.jsonl** — Sambit behavioral prediction and evaluation logs comparing internal predicted decisions vs actual responses.
5. **training_all.jsonl** — Master cognitive fine-tuning dataset with all 7 structured spec types.
6. **experiences.jsonl** — Situation-options-reasoning-outcome structured decision logs.
7. **observations.jsonl** — Validated empirical cognitive observations and confidence levels.
8. **raw_conversations.jsonl** — Full interview transcript with message-level provenance.
9. **dataset_manifest.json** — Full machine-readable dataset manifest with source coverage and evaluation statistics.

## Usage for PEFT / LoRA / SFT:
Each line in \`*.jsonl\` is a standalone, un-nested valid JSON object.
Directly compatible with **Axolotl**, **Unsloth**, **HuggingFace TRL (SFTTrainer / DPOTrainer)**, **OpenAI Fine-Tuning**, and **Google Vertex AI**.
`;
  folder.file('README.md', readmeContent);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
