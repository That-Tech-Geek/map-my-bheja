import { 
  FullCognitiveState, 
  LikertDomain, 
  PersonalityParameter, 
  TrainingExampleItem 
} from '../types';
import { 
  LIKERT_500_QUESTIONS, 
  computeParametersFromLikert, 
  PARAMETER_METADATA 
} from '../data/likert500Questions';

export interface ChatMLMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatMLExample {
  messages: ChatMLMessage[];
  metadata?: {
    domain: string;
    subdomain: string;
    parameter: string;
    user_score: number;
    source_question_id: string;
  };
}

export interface AlpacaExample {
  instruction: string;
  input: string;
  output: string;
  system?: string;
}

export interface DPOPreferencePair {
  prompt: string;
  chosen: string;
  rejected: string;
  domain: string;
  parameter: string;
}

export interface ShareGPTExample {
  conversations: Array<{
    from: 'system' | 'human' | 'gpt';
    value: string;
  }>;
}

export interface CompiledFineTuningDataset {
  subject_name: string;
  generated_at: string;
  answered_questions_count: number;
  total_questions: number;
  completion_rate: number;
  
  // Format datasets
  chatml_jsonl: string;
  alpaca_json: string;
  dpo_preferences_jsonl: string;
  sharegpt_jsonl: string;
  
  // Scripts and configs
  system_prompt: string;
  unsloth_train_script_py: string;
  axolotl_config_yaml: string;
  ollama_modelfile: string;
  dataset_readme_md: string;
  
  // Structured statistics
  counts: {
    sft_conversations: number;
    alpaca_instructions: number;
    dpo_pairs: number;
    total_tokens_estimated: number;
    domain_breakdown: Record<string, number>;
  };
  
  // Raw items for interactive inspection
  items: {
    chatml: ChatMLExample[];
    alpaca: AlpacaExample[];
    dpo: DPOPreferencePair[];
  };
}

/**
 * Synthesizes a comprehensive, production-ready fine-tuning dataset directly from 
 * the user's Likert responses and calculated parameters.
 */
export function generateFineTuningDataset(state: FullCognitiveState): CompiledFineTuningDataset {
  const responses = state.likert_responses || {};
  const userName = state.user_name || 'Sambit';
  const now = new Date().toISOString();
  
  const { parameters, completionStats } = computeParametersFromLikert(responses);
  
  // Build a concise system prompt summarizing the user's derived parameters
  const topHighPoles = parameters
    .filter(p => p.value >= 65)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
    
  const topLowPoles = parameters
    .filter(p => p.value <= 35)
    .sort((a, b) => a.value - b.value)
    .slice(0, 5);

  const systemPrompt = `You are a personalized cognitive clone fine-tuned to mirror ${userName}'s exact engineering heuristics, cognitive policies, and decision-making instincts.

CORE COGNITIVE PARAMETERS:
${parameters.map(p => `- ${p.label}: ${p.value}/100 (${p.value >= 50 ? p.high_pole : p.low_pole})`).join('\n')}

BEHAVIORAL DIRECTIVES:
1. Decision Making: ${topHighPoles.map(p => p.high_pole).join('; ')}.
2. Boundary Conditions: ${topLowPoles.map(p => `Avoid ${p.high_pole}, favor ${p.low_pole}`).join('; ')}.
3. Communication: Speak directly with high technical clarity, zero corporate boilerplate, and strict intellectual honesty.
4. Engineering Heuristics: Prioritize simplicity over premature abstractions, favor fast reversible shipping, and enforce explicit type contracts.`;

  const chatmlItems: ChatMLExample[] = [];
  const alpacaItems: AlpacaExample[] = [];
  const dpoItems: DPOPreferencePair[] = [];
  const domainBreakdown: Record<string, number> = {};

  // For every answered question, generate rich conversational SFT examples, Alpaca instructions, and DPO pairs
  const answeredQuestions = LIKERT_500_QUESTIONS.filter(q => responses[q.id] !== undefined);
  
  // If user hasn't answered many questions yet, use answered questions plus domain-anchored items
  const questionsToProcess = answeredQuestions.length >= 10 
    ? answeredQuestions 
    : LIKERT_500_QUESTIONS.slice(0, 30);

  questionsToProcess.forEach(q => {
    const rawScore = responses[q.id] !== undefined ? responses[q.id] : 4; // Default to neutral if unanswered
    // Normalize score to 1..7
    // 7: Strongly Agree, 6: Agree, 5: Slightly Agree, 4: Neutral, 3: Slightly Disagree, 2: Disagree, 1: Strongly Disagree
    const isAgree = rawScore >= 5;
    const isDisagree = rawScore <= 3;
    const isNeutral = rawScore === 4;
    
    // Reverse score handling for agreement with the core concept
    const agreesWithCoreConcept = q.reversed ? isDisagree : isAgree;
    const disagreesWithCoreConcept = q.reversed ? isAgree : isDisagree;
    
    const paramMeta = PARAMETER_METADATA[q.mapped_parameter];
    const param = parameters.find(p => p.key === q.mapped_parameter);
    const paramValue = param ? param.value : 70;

    domainBreakdown[q.domain] = (domainBreakdown[q.domain] || 0) + 1;

    // Generate prompt & scenario based on the question text and subdomain
    const scenarioPrompt = generateScenarioPrompt(q.text, q.subdomain, q.domain);
    const assistantChosenResponse = generateAssistantResponse(
      q.text, 
      q.subdomain, 
      agreesWithCoreConcept, 
      disagreesWithCoreConcept, 
      isNeutral, 
      q.mapped_parameter, 
      paramValue, 
      userName
    );
    const assistantRejectedResponse = generateRejectedResponse(
      q.text, 
      q.subdomain, 
      agreesWithCoreConcept, 
      q.mapped_parameter
    );

    // 1. ChatML SFT Example
    chatmlItems.push({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: scenarioPrompt },
        { role: 'assistant', content: assistantChosenResponse }
      ],
      metadata: {
        domain: q.domain,
        subdomain: q.subdomain,
        parameter: q.mapped_parameter,
        user_score: rawScore,
        source_question_id: q.id
      }
    });

    // 2. Alpaca Instruction Example
    alpacaItems.push({
      instruction: `Evaluate this engineering dilemma and make a decisive technical recommendation consistent with ${userName}'s cognitive heuristics.`,
      input: scenarioPrompt,
      output: assistantChosenResponse,
      system: systemPrompt
    });

    // 3. DPO Preference Pair
    dpoItems.push({
      prompt: scenarioPrompt,
      chosen: assistantChosenResponse,
      rejected: assistantRejectedResponse,
      domain: q.domain,
      parameter: q.mapped_parameter
    });
  });

  // Also integrate existing state training examples if present
  if (state.training_examples && state.training_examples.length > 0) {
    state.training_examples
      .filter(ex => ex.user_curation_status !== 'rejected')
      .forEach(ex => {
        const p = ex.payload as any;
        if (p && p.messages && Array.isArray(p.messages)) {
          chatmlItems.push({
            messages: p.messages,
            metadata: {
              domain: ex.domain || 'general',
              subdomain: 'interview_derived',
              parameter: ex.underlying_policy_id || 'derived',
              user_score: 5,
              source_question_id: ex.example_id
            }
          });
        }
      });
  }

  // Estimate tokens (~ 4 chars per token)
  const totalChars = chatmlItems.reduce((acc, item) => {
    return acc + item.messages.reduce((mAcc, m) => mAcc + m.content.length, 0);
  }, 0);
  const totalTokensEstimated = Math.round(totalChars / 4);

  // Convert to JSONL strings
  const chatml_jsonl = chatmlItems.map(item => JSON.stringify(item)).join('\n');
  const alpaca_json = JSON.stringify(alpacaItems, null, 2);
  const dpo_preferences_jsonl = dpoItems.map(item => JSON.stringify(item)).join('\n');
  
  const sharegpt_jsonl = chatmlItems.map(item => {
    return JSON.stringify({
      conversations: item.messages.map(m => ({
        from: m.role === 'user' ? 'human' : m.role === 'assistant' ? 'gpt' : 'system',
        value: m.content
      }))
    });
  }).join('\n');

  // Generate complete Unsloth Python script
  const unsloth_train_script_py = generateUnslothScript(userName);
  
  // Generate Axolotl config
  const axolotl_config_yaml = generateAxolotlConfig(userName);
  
  // Generate Ollama Modelfile
  const ollama_modelfile = `FROM llama3.1:8b-instruct-q8_0

# Model parameters tuned for ${userName}'s cognitive policy
PARAMETER temperature 0.6
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER stop "<|eot_id|>"
PARAMETER stop "<|end_of_text|>"

SYSTEM """${systemPrompt}"""
`;

  // Generate README
  const dataset_readme_md = `# ${userName}'s Cognitive Fine-Tuning Dataset (v2.0)

This dataset was procedurally generated from ${completionStats.answeredCount} answered psychometric and cognitive heuristic items across 10 core domains.

## Dataset Contents:
- **\`training_chatml.jsonl\`**: ${chatmlItems.length} multi-turn conversational SFT examples formatted for OpenAI, Mistral, and LLaMA-3.
- **\`alpaca_instructions.json\`**: ${alpacaItems.length} instruction-tuning samples for Axolotl / Stanford Alpaca.
- **\`preferences_dpo.jsonl\`**: ${dpoItems.length} chosen vs. rejected pairs for Direct Preference Optimization (DPO / ORPO).
- **\`train_lora.py\`**: 1-click Unsloth / Hugging Face LoRA training script targeting LLaMA 3.1 8B or Qwen 2.5 7B.
- **\`Modelfile\`**: Ready-to-use Ollama configuration file.

## Quickstart Fine-Tuning (with Unsloth):
\`\`\`bash
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
python train_lora.py
\`\`\`
`;

  return {
    subject_name: userName,
    generated_at: now,
    answered_questions_count: completionStats.answeredCount,
    total_questions: LIKERT_500_QUESTIONS.length,
    completion_rate: completionStats.completionPercentage,
    chatml_jsonl,
    alpaca_json,
    dpo_preferences_jsonl,
    sharegpt_jsonl,
    system_prompt: systemPrompt,
    unsloth_train_script_py,
    axolotl_config_yaml,
    ollama_modelfile,
    dataset_readme_md,
    counts: {
      sft_conversations: chatmlItems.length,
      alpaca_instructions: alpacaItems.length,
      dpo_pairs: dpoItems.length,
      total_tokens_estimated: totalTokensEstimated,
      domain_breakdown: domainBreakdown
    },
    items: {
      chatml: chatmlItems,
      alpaca: alpacaItems,
      dpo: dpoItems
    }
  };
}

/**
 * Helper to generate a realistic scenario prompt based on question statement
 */
function generateScenarioPrompt(statement: string, subdomain: string, domain: string): string {
  const prompts: string[] = [
    `We are debating our stance on: "${statement}". How do you approach this in practice when building core systems?`,
    `In our team sprint planning, a tradeoff came up regarding ${subdomain}. The team is divided on whether "${statement}". What is your directive?`,
    `How do you handle the following situation under pressure: "${statement}"? Explain your concrete rationale and tradeoff calculation.`,
    `When evaluating our engineering standards for ${subdomain}, what is your exact policy on: "${statement}"?`,
    `A junior engineer asks for your mental model on ${subdomain}: "${statement}". How do you advise them?`
  ];
  const hash = (statement.length + subdomain.length) % prompts.length;
  return prompts[hash];
}

/**
 * Helper to generate assistant response embodying the persona's chosen direction
 */
function generateAssistantResponse(
  statement: string,
  subdomain: string,
  agrees: boolean,
  disagrees: boolean,
  neutral: boolean,
  parameter: string,
  paramValue: number,
  userName: string
): string {
  if (agrees) {
    return `In practice, my policy is clear: I strongly align with this approach.

When tackling ${subdomain}, theoretical perfection must never obstruct tangible execution. Here is how I evaluate this tradeoff:

1. **First-Principles Reality**: The core objective is shipping durable, verifiable value quickly. Introducing excessive bureaucracy or premature abstractions creates friction without mitigating real-world risk.
2. **Reversibility Filter**: If this decision is reversible (a two-way door), we bias towards high velocity and empirical feedback rather than endless design committees.
3. **Execution Guardrails**: We maintain strict type contracts and explicit data boundaries, but eliminate decorative boilerplate and unnecessary ceremony.

Bottom line: We adopt this standard decisively, ship the working implementation, and calibrate based on actual production telemetry.`;
  } else if (disagrees) {
    return `I push back strongly against that premise in production.

Regarding ${subdomain}, adopting that stance introduces hidden systemic friction. Here is my exact reasoning:

1. **Downside Blast Radius**: This creates unbudgeted technical debt and latent fragility in foundational layers. What seems convenient today quickly becomes an unmaintainable bottleneck.
2. **True Velocity**: Real velocity comes from clean, explicit interfaces and high-confidence contracts—not cutting corners on critical invariants.
3. **Operational Discipline**: We take the time to build explicit, deterministic boundaries now so the system scales smoothly under stress.

My recommendation: Reject that shortcut. Implement clean, transparent primitives with unambiguous ownership and robust error handling.`;
  } else {
    return `My stance on ${subdomain} depends strictly on the reversibility and blast radius of the situation.

- **For high-velocity prototypes & reversible features**: I favor fast, low-overhead iteration with minimal ceremony.
- **For core data schemas & irreversible infrastructure**: I demand rigorous contract guarantees and explicit error handling.

The key is avoiding blanket dogma: evaluate the cost of being wrong against the cost of moving slow, then choose the path that maximizes validated learning.`;
  }
}

/**
 * Helper to generate rejected response for DPO pairs
 */
function generateRejectedResponse(
  statement: string,
  subdomain: string,
  agrees: boolean,
  parameter: string
): string {
  if (agrees) {
    return `Let's schedule a 3-week RFC committee meeting to discuss ${subdomain} across all departments. We should probably design a multi-layered generic enterprise abstraction framework first with full XML configuration files just in case our requirements change 5 years from now. Let's avoid shipping anything until every single stakeholder has signed off.`;
  } else {
    return `Let's just hack together whatever works without looking at types, tests, or consequences. Who cares about data integrity or security boundaries? If it breaks in production at 3 AM, we will just patch it live. No need to understand the root cause.`;
  }
}

/**
 * Generates ready-to-run Unsloth fine-tuning Python script
 */
function generateUnslothScript(userName: string): string {
  return `"""
LoRA / QLoRA Fine-Tuning Script for ${userName}'s Cognitive Clone
Target Models: LLaMA 3.1 8B Instruct / Qwen 2.5 7B / Mistral NeMo
Powered by Unsloth & Hugging Face TRL
"""

import os
import torch
from unsloth import FastLanguageModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Configuration
max_seq_length = 2048
dtype = None # Auto detect: Float16 for Tesla T4, Bfloat16 for Ampere+
load_in_4bit = True # 4-bit QLoRA for fast VRAM fitting

model_name = "unsloth/Meta-Llama-3.1-8B-Instruct"

print(f"[*] Loading base model: {model_name}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=model_name,
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)

# 2. Add LoRA Adapters
print("[*] Applying LoRA PEFT adapters...")
model = FastLanguageModel.get_peft_model(
    model,
    r=16, # LoRA Rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0, # Optimized 0 for Unsloth
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
)

# 3. Load & Format Dataset
print("[*] Loading ${userName}'s dataset (training_chatml.jsonl)...")
dataset = load_dataset("json", data_files="training_chatml.jsonl", split="train")

def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False) for convo in convos]
    return {"text": texts}

formatted_dataset = dataset.map(formatting_prompts_func, batched=True)

# 4. Supervised Fine-Tuning Trainer
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=formatted_dataset,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=10,
        max_steps=120,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs_lora_${userName.toLowerCase()}",
        report_to="none",
    ),
)

# 5. Execute Training
print("[*] Starting Fine-Tuning...")
trainer_stats = trainer.train()

# 6. Save LoRA Adapters & GGUF
print("[*] Saving LoRA adapter weights...")
model.save_pretrained("lora_model_${userName.toLowerCase()}")
tokenizer.save_pretrained("lora_model_${userName.toLowerCase()}")

print("[+] Fine-Tuning Complete! Ready for inference or GGUF export.")
`;
}

/**
 * Generates Axolotl YAML configuration file
 */
function generateAxolotlConfig(userName: string): string {
  return `base_model: meta-llama/Meta-Llama-3.1-8B-Instruct
model_type: LlamaForCausalLM
tokenizer_type: AutoTokenizer

load_in_8bit: false
load_in_4bit: true
strict: false

datasets:
  - path: training_chatml.jsonl
    type: chatml
    roles:
      system: ["<|im_start|>system\n", "<|im_end|>\n"]
      user: ["<|im_start|>user\n", "<|im_end|>\n"]
      assistant: ["<|im_start|>assistant\n", "<|im_end|>\n"]

dataset_prepared_path: last_run_prepared
val_set_size: 0.05
output_dir: ./lora-out-${userName.toLowerCase()}

adapter: lora
lora_model_dir:
lora_r: 32
lora_alpha: 16
lora_dropout: 0.05
lora_target_linear: true

sequence_len: 2048
sample_packing: true
pad_to_sequence_len: true

gradient_accumulation_steps: 2
micro_batch_size: 2
num_epochs: 3
optimizer: adamw_bnb_8bit
lr_scheduler: cosine
learning_rate: 0.0002

train_on_inputs: false
group_by_length: false
bf16: auto
fp16: false
tf32: false

gradient_checkpointing: true
early_stopping_patience:
resume_from_checkpoint:
logging_steps: 1
xformers_attention:
flash_attention: true
`;
}
