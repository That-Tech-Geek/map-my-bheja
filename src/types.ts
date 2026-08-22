/**
 * Cognitive Apprenticeship — Identity Dataset Builder
 * Global Type Definitions
 */

export type SpeakerRole = 'user' | 'interviewer';

export interface DisconfirmingProbe {
  target_hypothesis: string;
  scenario: string;
  falsification_intent: string;
  target_boundary_variable?: string;
  status?: 'active' | 'qualified' | 'falsified' | 'confirmed';
}

export interface ChatMessage {
  message_id: string;
  session_id: string;
  timestamp: string;
  speaker: SpeakerRole;
  content: string;
  // Internal apprentice note (kept unobtrusive, inferred rationale for asking)
  apprentice_intent?: string;
  tested_hypothesis_id?: string;
  disconfirming_probe?: DisconfirmingProbe;
}

export type ObservationStatus = 'hypothesis' | 'supported' | 'contradicted' | 'deprecated';
export type ProbeStatus = 'untested' | 'active_probe' | 'qualified' | 'falsified' | 'confirmed';

export type CognitiveCategory = 
  | 'decision_making'
  | 'risk_reward'
  | 'uncertainty_and_ambiguity'
  | 'prioritization_and_tradeoffs'
  | 'engineering_judgment'
  | 'debugging_and_problem_solving'
  | 'tool_selection'
  | 'curiosity_and_research'
  | 'belief_updating_and_evidence'
  | 'communication_style'
  | 'failure_and_resilience'
  | 'optionality_and_speed'
  | 'quality_thresholds';

export interface Observation {
  observation_id: string;
  observation: string;
  category: CognitiveCategory;
  confidence: number; // 0.0 to 1.0
  supporting_messages: string[]; // message_ids
  contradicting_messages: string[]; // message_ids
  status: ObservationStatus;
  conditions?: string; // Nuanced conditional policy: e.g., "When actions are reversible..."
  user_correction_notes?: string;
  user_feedback?: 'not_me' | 'partially' | 'exactly' | 'context_dependent';
  // Disconfirmation & Stress-testing Engine fields
  disconfirming_scenario?: string; // Scenario crafted to potentially disprove/qualify this hypothesis
  falsification_criteria?: string; // What reaction/choice disproves or bounds this
  target_boundary_variable?: string; // Dimension tested (e.g. Reversibility, Blast Radius, Stakes)
  probe_status?: ProbeStatus;
  qualification_nuance?: string; // Discovered nuance from stress testing
  disconfirming_history?: Array<{
    timestamp: string;
    scenario: string;
    user_response_summary: string;
    outcome: 'qualified' | 'falsified' | 'confirmed';
    resulting_rule?: string;
  }>;
  last_updated: string;
}

export interface Experience {
  experience_id: string;
  context: string;
  situation: string;
  what_sambit_noticed: string[];
  options: string[];
  decision: string;
  reasoning_summary: string;
  action: string;
  outcome: string;
  reflection: string;
  principles_involved: string[];
  source_messages: string[]; // message_ids
  extracted_at: string;
}

export interface Contradiction {
  contradiction_id: string;
  stated_pattern_a: string;
  observed_pattern_b: string;
  resolution_hypothesis: string;
  status: 'open' | 'probing' | 'resolved';
  source_messages: string[];
  discovered_at: string;
  resolved_at?: string;
}

export interface DecisionBoundary {
  boundary_id: string;
  domain: string;
  dimension: string; // e.g. "Reversibility vs Latency", "Downside Risk %"
  inferred_threshold: string;
  evidence_messages: string[];
  confidence: number;
  recorded_at: string;
}

export interface UserCorrection {
  correction_id: string;
  target_observation_id: string;
  feedback_type: 'not_me' | 'partially' | 'exactly' | 'context_dependent';
  user_explanation: string;
  original_observation_text: string;
  timestamp: string;
  message_id?: string;
}

export type PolicyStatus = 'hypothesis' | 'supported' | 'qualified' | 'contradicted' | 'deprecated';

export type GeneralizationDomain = 
  | 'coding'
  | 'business'
  | 'research'
  | 'product'
  | 'strategy'
  | 'finance'
  | 'academic_work'
  | 'tool_selection';

export interface Policy {
  policy_id: string; // e.g. "POL_001"
  policy: string; // High-level conditional cognitive policy statement
  category: CognitiveCategory;
  conditions: string[]; // e.g. ["action is reasonably reversible", "analysis cost is meaningful"]
  exceptions: string[]; // e.g. ["irreversible decision", "high-impact unknown"]
  supporting_experiences: string[]; // experience_ids (e.g. ["exp_04", "exp_19"])
  supporting_observations: string[]; // observation_ids (e.g. ["obs_031", "obs_057"])
  counter_evidence: string[]; // experience_ids or observation_ids
  confidence: number; // 0.0 - 1.0
  status: PolicyStatus;
  domain_applications?: string[]; // ["coding", "business", "research", "product", "strategy", "finance", "academic_work", "tool_selection"]
  created_at: string;
  updated_at: string;
}

export type PredictionErrorType = 
  | 'none'
  | 'wrong_priority'
  | 'wrong_boundary'
  | 'unforeseen_constraint'
  | 'overly_cautious'
  | 'overly_aggressive'
  | 'misaligned_value';

export interface SambitPrediction {
  prediction_id: string;
  session_id: string;
  message_id?: string; // which interviewer message posed this situation
  situation: string;
  predicted_decision: string;
  predicted_reasoning: string;
  confidence: number;
  actual_response_id?: string;
  actual_decision?: string;
  actual_reasoning?: string;
  agreement?: number; // 0.0 to 1.0
  error_type?: PredictionErrorType;
  evaluation_notes?: string;
  status: 'pending_response' | 'evaluated' | 'skipped';
  timestamp: string;
  evaluated_at?: string;
}

export interface SFTMetadata {
  source_experience?: string;
  source_observations?: string[];
  source_policy?: string;
  domain?: GeneralizationDomain | string;
  confidence: number;
  provenance: string;
  supporting_evidence?: string[];
  counter_evidence?: string[];
  cognitive_dimensions?: string[];
}

// Training Example Types (7 Types)
export interface BehavioralSFTExample {
  type: 'behavioral_sft';
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  metadata: SFTMetadata;
}

export interface DecisionExample {
  type: 'decision';
  situation: string;
  decision: string;
  reasoning_summary: string;
  confidence: number;
  source_experience?: string;
  source_policy?: string;
  domain?: string;
}

export interface PreferenceExample {
  type: 'preference';
  prompt: string;
  chosen: string;
  rejected: string;
  reason: string;
  source_experience?: string;
  source_correction?: string;
  source_policy?: string;
  evidence_type?: 'rejected_ai_suggestion' | 'user_correction' | 'explicit_tradeoff_choice' | 'real_decision';
  confidence?: number;
}

export interface ToolSelectionExample {
  type: 'tool_selection';
  task: string;
  chosen_tool: string;
  alternatives: string[];
  reason: string;
  source_experience?: string;
  source_policy?: string;
}

export interface CuriosityExample {
  type: 'curiosity';
  discovery: string;
  why_interesting: string;
  next_question: string;
  research_direction: string;
  source_experience?: string;
  source_policy?: string;
}

export interface BeliefUpdateExample {
  type: 'belief_update';
  previous_belief: string;
  new_evidence: string;
  updated_belief: string;
  reason_for_change: string;
  source_experience?: string;
  source_policy?: string;
}

export interface CorrectionExample {
  type: 'correction';
  initial_reasoning: string;
  correction: string;
  why_initial_reasoning_was_wrong: string;
  source_experience?: string;
  source_correction?: string;
  source_policy?: string;
}

export type TrainingExamplePayload = 
  | BehavioralSFTExample
  | DecisionExample
  | PreferenceExample
  | ToolSelectionExample
  | CuriosityExample
  | BeliefUpdateExample
  | CorrectionExample;

export interface TrainingExampleItem {
  example_id: string;
  session_id: string;
  example_type: TrainingExamplePayload['type'];
  payload: TrainingExamplePayload;
  confidence: number;
  evidence_count: number;
  source_references: string[]; // message_ids or experience_ids
  quality_score: number; // 0 - 100
  stability: 'high' | 'medium' | 'experimental';
  is_suitable_for_training: boolean;
  rejection_reason?: string;
  user_curation_status: 'accepted' | 'rejected' | 'pending';
  generated_at: string;
  // Provenance & Policy links
  source_experience_id?: string;
  source_observation_ids?: string[];
  underlying_policy_id?: string;
  domain?: string;
}

export interface SessionRecord {
  session_id: string;
  session_number: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  status: 'active' | 'paused' | 'completed';
  summary?: string;
  focus_topics: string[];
}

export interface DatasetManifest {
  dataset_version: string;
  subject_identity: string;
  generation_timestamp: string;
  counts_by_dataset: {
    raw_conversations: number;
    experiences: number;
    observations: number;
    policies: number;
    training_sft: number;
    training_preferences: number;
    predictions: number;
    training_all: number;
  };
  policy_count: number;
  average_confidence: number;
  source_coverage: {
    experiences_covered_pct: number;
    observations_covered_pct: number;
    policies_covered_pct: number;
  };
  duplicate_count: number;
  contradiction_count: number;
  unsupported_example_count: number;
  examples_per_policy: Record<string, number>;
  examples_per_cognitive_category: Record<string, number>;
  examples_by_domain: Record<string, number>;
  curation_metrics: {
    accepted: number;
    pending: number;
    rejected: number;
    acceptance_rate: number;
  };
  evaluation_metrics: {
    total_predictions: number;
    evaluated_predictions: number;
    average_agreement: number;
    error_breakdown: Record<string, number>;
  };
  format_spec: string;
  target_use_case: string;
}

export interface DatasetVersion {
  version_id: string;
  dataset_version: string; // e.g. "dataset_v001"
  generation_timestamp: string;
  source_session_ids: string[];
  total_examples: number;
  accepted_examples: number;
  average_quality_score: number;
  counts_by_type: Record<TrainingExamplePayload['type'], number>;
  export_files: {
    raw_conversations: string;
    observations: string;
    experiences: string;
    policies: string;
    training_sft: string;
    training_preferences: string;
    predictions: string;
    training_all: string;
    dataset_manifest: string;
  };
  manifest?: DatasetManifest;
}

export interface LikertQuestion {
  id: string; // e.g. "q_001"
  index: number; // 1 to 500
  domain: LikertDomain;
  subdomain: string;
  text: string;
  reversed: boolean; // if true, 5 means low parameter, 1 means high parameter
  mapped_parameter: PersonalityParameterKey;
  weight: number;
}

export type LikertDomain = 
  | 'engineering_philosophy'
  | 'decision_and_tradeoffs'
  | 'problem_solving_heuristics'
  | 'risk_and_uncertainty'
  | 'epistemic_updating'
  | 'interpersonal_and_candor'
  | 'curiosity_and_depth'
  | 'stress_and_resilience'
  | 'execution_and_velocity'
  | 'autonomy_and_work_ethic';

export type PersonalityParameterKey =
  | 'velocity_bias'
  | 'formalism_weight'
  | 'risk_tolerance'
  | 'reversibility_sensitivity'
  | 'candor_directness'
  | 'epistemic_plasticity'
  | 'abstraction_tolerance'
  | 'technical_debt_tolerance'
  | 'autonomy_preference'
  | 'stress_neutrality'
  | 'first_principles_ratio'
  | 'pragmatic_empiricism'
  | 'craft_perfectionism'
  | 'delegation_willingness'
  | 'rabbit_hole_curiosity'
  | 'hype_skepticism'
  | 'crisis_decisiveness'
  | 'consensus_orientation'
  | 'failure_transparency'
  | 'scope_ruthlessness';

export interface PersonalityParameter {
  key: PersonalityParameterKey;
  label: string;
  category: string;
  value: number; // 0 to 100
  normalized: number; // 0.0 to 1.0
  description: string;
  low_pole: string;
  high_pole: string;
  weight: number;
  question_count: number;
}

export interface BehavioralNarrative {
  archetype_title: string;
  executive_summary: string;
  cognitive_dna_summary: string;
  core_engineering_tenets?: string[];
  core_life_tenets?: string[];
  decision_heuristics?: string[];
  interpersonal_communication_rules?: string[];
  stress_and_crisis_playbook?: string[];
  unacceptable_anti_patterns?: string[];
  system_prompt_directive: string;
  generated_at: string;
}

export interface FineTuningConfig {
  target_model: string;
  base_architecture: string;
  learning_rate: number;
  epochs: number;
  lora_r: number;
  lora_alpha: number;
  lora_dropout: number;
  batch_size: number;
  warmup_ratio: number;
  optimizer: 'adamw_torch' | 'paged_adamw_8bit' | 'adafactor';
  temperature: number;
  top_p: number;
  max_seq_length: number;
}

export interface FineTuningTelemetryPoint {
  step: number;
  epoch: number;
  train_loss: number;
  val_loss: number;
  learning_rate: number;
  gradient_norm: number;
  parameter_alignment_pct: number;
}

export interface ModelComparisonSample {
  id: string;
  prompt: string;
  scenario_category: string;
  baseline_output: string;
  fine_tuned_output: string;
  behavioral_delta: string;
  alignment_score: number; // 0 to 100
  evaluated: boolean;
}

export interface FineTuningRun {
  run_id: string;
  run_name: string;
  timestamp: string;
  status: 'idle' | 'preparing_dataset' | 'training' | 'evaluating' | 'completed' | 'failed';
  config: FineTuningConfig;
  current_epoch: number;
  total_epochs: number;
  current_step: number;
  total_steps: number;
  final_train_loss: number;
  final_val_loss: number;
  alignment_score: number; // 0 to 100
  telemetry: FineTuningTelemetryPoint[];
  comparison_samples: ModelComparisonSample[];
  dataset_size: number;
  lora_weights_summary: {
    trainable_params: number;
    all_params: number;
    trainable_percentage: number;
  };
}

export type DominantEmotion = 
  | 'conviction' 
  | 'pragmatic_calm' 
  | 'constructive_frustration' 
  | 'deep_curiosity' 
  | 'hype_skepticism' 
  | 'crisis_focus' 
  | 'epistemic_doubt'
  | 'craft_pride';

export interface SessionSentimentPoint {
  point_id: string;
  time_offset_min: number; // e.g. 5, 10, 15, 20...
  timestamp: string;
  topic_stimulus: string;
  intensity: number; // 0 to 100 (Emotional Response Intensity / Arousal)
  valence: number; // -1.0 (Critical / High Friction) to +1.0 (Constructive / High Satisfaction)
  dominant_emotion: DominantEmotion;
  cognitive_state_label: string;
  cognitive_category?: CognitiveCategory | string;
  quote_excerpt: string;
  heart_rate_bpm?: number;
  speech_cadence_wpm?: number;
  stress_index: number; // 0 to 100
}

export interface SessionSentimentProfile {
  session_id: string;
  session_number: number;
  session_title: string;
  date: string;
  duration_minutes: number;
  average_intensity: number; // 0-100
  peak_intensity: number; // 0-100
  average_valence: number; // -1.0 to +1.0
  dominant_sentiment: string;
  volatility_score: number; // 0-100 (Variance in intensity)
  composure_score: number; // 0-100
  time_points: SessionSentimentPoint[];
}

export interface FullCognitiveState {
  user_name: string;
  sessions: SessionRecord[];
  active_session_id: string;
  messages: Record<string, ChatMessage[]>; // session_id -> messages
  observations: Observation[];
  experiences: Experience[];
  contradictions: Contradiction[];
  boundaries: DecisionBoundary[];
  corrections: UserCorrection[];
  policies: Policy[];
  predictions: SambitPrediction[];
  training_examples: TrainingExampleItem[];
  dataset_versions: DatasetVersion[];
  last_analysis_timestamp?: string;
  // 500 Likert Assessment & Parameter Mapping
  likert_responses?: Record<string, number>; // question_id -> 1..5
  computed_parameters?: Record<PersonalityParameterKey, number>;
  behavioral_narrative?: BehavioralNarrative;
  finetuning_runs?: FineTuningRun[];
  active_finetuning_run_id?: string;
  // Sentiment & Emotional Response Tracking
  sentiment_sessions?: SessionSentimentProfile[];
}

