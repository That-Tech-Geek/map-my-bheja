import { SessionSentimentProfile, DominantEmotion } from '../types';

export const EMOTION_CONFIG: Record<DominantEmotion, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  description: string;
}> = {
  conviction: {
    label: 'High Conviction',
    color: '#4f46e5', // indigo-600
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Firm unwavering technical stance rooted in verified heuristics and historical empirical data.'
  },
  pragmatic_calm: {
    label: 'Pragmatic Composure',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Measured, objective evaluation focusing on practical trade-offs and low-blast-radius execution.'
  },
  constructive_frustration: {
    label: 'Constructive Frustration',
    color: '#d97706', // amber-600
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Impassioned pushback against unnecessary abstraction, premature optimization, or cargo-culting.'
  },
  deep_curiosity: {
    label: 'Deep Curiosity',
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    description: 'High exploratory enthusiasm examining system internals, unstudied edge cases, and polymathic parallels.'
  },
  hype_skepticism: {
    label: 'Hype Skepticism',
    color: '#7c3aed', // violet-600
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-200',
    description: 'Critical dissection of emerging trends with zero tolerance for vaporware or superficial complexity.'
  },
  crisis_focus: {
    label: 'Crisis Laser Focus',
    color: '#e11d48', // rose-600
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Rapid, adrenaline-tempered triage isolating root causes and enforcing emergency stability.'
  },
  epistemic_doubt: {
    label: 'Epistemic Plasticity',
    color: '#0d9488', // teal-600
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Willingness to pause, acknowledge missing context, and immediately revise mental models upon disconfirming data.'
  },
  craft_pride: {
    label: 'Craft Pride',
    color: '#2563eb', // blue-600
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Quiet satisfaction with clean type systems, deterministic state machines, and zero runtime surprises.'
  }
};

export const INITIAL_SENTIMENT_SESSIONS: SessionSentimentProfile[] = [
  {
    session_id: 'sess_01',
    session_number: 1,
    session_title: 'Engineering Philosophy & Core Heuristics',
    date: '2026-08-18',
    duration_minutes: 45,
    average_intensity: 62,
    peak_intensity: 89,
    average_valence: 0.45,
    dominant_sentiment: 'Conviction & Pragmatic Composure',
    volatility_score: 28,
    composure_score: 84,
    time_points: [
      {
        point_id: 'p_01_01',
        time_offset_min: 5,
        timestamp: '10:05 AM',
        topic_stimulus: 'Opening discussion on architecture complexity vs speed',
        intensity: 45,
        valence: 0.3,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Baseline Orientation',
        quote_excerpt: "I prefer starting with the simplest dumbest thing that can work, provided we don't paint ourselves into a corner.",
        speech_cadence_wpm: 135,
        stress_index: 20
      },
      {
        point_id: 'p_01_02',
        time_offset_min: 10,
        timestamp: '10:10 AM',
        topic_stimulus: 'Debating microservices vs monolith for early startups',
        intensity: 78,
        valence: -0.2,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Anti-Cargo-Culting Trigger',
        quote_excerpt: "Splitting into microservices when you don't even have 10,000 active users is organizational malpractice.",
        speech_cadence_wpm: 168,
        stress_index: 42
      },
      {
        point_id: 'p_01_03',
        time_offset_min: 15,
        timestamp: '10:15 AM',
        topic_stimulus: 'First-principles breakdown of database indices & query plans',
        intensity: 82,
        valence: 0.75,
        dominant_emotion: 'deep_curiosity',
        cognitive_state_label: 'Polymathic Flow State',
        quote_excerpt: "When you actually inspect the B-Tree leaf page splits and cache line misses, the intuition becomes trivial.",
        speech_cadence_wpm: 152,
        stress_index: 18
      },
      {
        point_id: 'p_01_04',
        time_offset_min: 20,
        timestamp: '10:20 AM',
        topic_stimulus: 'Irreversible data migrations & zero-downtime safety',
        intensity: 89,
        valence: 0.2,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'High-Stakes Boundary',
        quote_excerpt: "Never run an irreversible DDL migration in the same deployment as the code change. Two-phase expand and contract.",
        speech_cadence_wpm: 140,
        stress_index: 35
      },
      {
        point_id: 'p_01_05',
        time_offset_min: 25,
        timestamp: '10:25 AM',
        topic_stimulus: 'Handling ambiguous product requirements from non-technical stakeholders',
        intensity: 54,
        valence: 0.1,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Ambiguity Absorption',
        quote_excerpt: "I don't expect clean specs. My job is to translate human confusion into deterministic state transitions.",
        speech_cadence_wpm: 130,
        stress_index: 25
      },
      {
        point_id: 'p_01_06',
        time_offset_min: 30,
        timestamp: '10:30 AM',
        topic_stimulus: 'Technical debt: intentional vs accidental',
        intensity: 65,
        valence: 0.4,
        dominant_emotion: 'craft_pride',
        cognitive_state_label: 'Taxonomic Precision',
        quote_excerpt: "Intentional tech debt is leverage. Unintentional tech debt is just sloppy thinking.",
        speech_cadence_wpm: 144,
        stress_index: 22
      },
      {
        point_id: 'p_01_07',
        time_offset_min: 35,
        timestamp: '10:35 AM',
        topic_stimulus: 'Hyped new frontend frameworks & build tool fatigue',
        intensity: 72,
        valence: -0.4,
        dominant_emotion: 'hype_skepticism',
        cognitive_state_label: 'Skeptical Filter',
        quote_excerpt: "Show me the bundle size, cold start latency, and debuggability in prod before telling me about syntactic sugar.",
        speech_cadence_wpm: 158,
        stress_index: 38
      },
      {
        point_id: 'p_01_08',
        time_offset_min: 40,
        timestamp: '10:40 AM',
        topic_stimulus: 'Synthesis of Session 1 observations',
        intensity: 40,
        valence: 0.6,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Reflective Closure',
        quote_excerpt: "Yeah, this capture is accurate. Keep the heuristics crisp.",
        speech_cadence_wpm: 125,
        stress_index: 15
      }
    ]
  },
  {
    session_id: 'sess_02',
    session_number: 2,
    session_title: 'P0 Production Outages & High-Stakes Incidents',
    date: '2026-08-19',
    duration_minutes: 50,
    average_intensity: 76,
    peak_intensity: 96,
    average_valence: -0.1,
    dominant_sentiment: 'Crisis Focus & Radical Candor',
    volatility_score: 42,
    composure_score: 91,
    time_points: [
      {
        point_id: 'p_02_01',
        time_offset_min: 5,
        timestamp: '02:05 PM',
        topic_stimulus: 'Recalling a midnight distributed deadlock cascade outage',
        intensity: 75,
        valence: -0.3,
        dominant_emotion: 'crisis_focus',
        cognitive_state_label: 'Incident Recall Arousal',
        quote_excerpt: "The first 3 minutes are crucial: silence the noise, stop deploys, protect the database write pipeline.",
        speech_cadence_wpm: 160,
        stress_index: 60
      },
      {
        point_id: 'p_02_02',
        time_offset_min: 10,
        timestamp: '02:10 PM',
        topic_stimulus: 'Triage prioritization: user-facing impact vs finding root cause',
        intensity: 88,
        valence: 0.1,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'Triage Invariant',
        quote_excerpt: "Mitigate first, diagnose later. I don't care why it's burning until the bleeding is contained.",
        speech_cadence_wpm: 172,
        stress_index: 55
      },
      {
        point_id: 'p_02_03',
        time_offset_min: 15,
        timestamp: '02:15 PM',
        topic_stimulus: 'Leadership panicking in incident response channel',
        intensity: 92,
        valence: -0.6,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Noise Rejection Response',
        quote_excerpt: "Executives asking for ETA updates every 4 minutes destroys engineer focus. Designate one scribe and lock the room.",
        speech_cadence_wpm: 180,
        stress_index: 70
      },
      {
        point_id: 'p_02_04',
        time_offset_min: 20,
        timestamp: '02:20 PM',
        topic_stimulus: 'Executing destructive recovery procedures under pressure',
        intensity: 96,
        valence: 0.0,
        dominant_emotion: 'crisis_focus',
        cognitive_state_label: 'Peak Adrenaline Composure',
        quote_excerpt: "When you have to drop a connection pool or failover a cluster manually, double-check the target cluster ARN twice.",
        speech_cadence_wpm: 142,
        stress_index: 78
      },
      {
        point_id: 'p_02_05',
        time_offset_min: 25,
        timestamp: '02:25 PM',
        topic_stimulus: 'Blameless post-mortem analysis and accountability',
        intensity: 70,
        valence: 0.5,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Systemic Attribution',
        quote_excerpt: "If a human typod a config and took down production, the fault is 100% the tooling and validation layer, not the human.",
        speech_cadence_wpm: 138,
        stress_index: 30
      },
      {
        point_id: 'p_02_06',
        time_offset_min: 30,
        timestamp: '02:30 PM',
        topic_stimulus: 'Dealing with cover-up behavior or dishonest post-mortems',
        intensity: 85,
        valence: -0.7,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Radical Candor Enforcer',
        quote_excerpt: "Downplaying the timeline in a post-mortem to look good is unacceptable. Truth is the only substrate we can build on.",
        speech_cadence_wpm: 165,
        stress_index: 62
      },
      {
        point_id: 'p_02_07',
        time_offset_min: 35,
        timestamp: '02:35 PM',
        topic_stimulus: 'Automated remediation scripts vs manual intervention boundaries',
        intensity: 68,
        valence: 0.3,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'Boundary Calibration',
        quote_excerpt: "Auto-remediation for known restart patterns is great; auto-remediation that alters partition schemas is suicidal.",
        speech_cadence_wpm: 148,
        stress_index: 35
      },
      {
        point_id: 'p_02_08',
        time_offset_min: 45,
        timestamp: '02:45 PM',
        topic_stimulus: 'Cooldown and reflection on incident playbooks',
        intensity: 48,
        valence: 0.4,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Systemic Solidification',
        quote_excerpt: "Every P0 must produce at least one automated integration test that would have caught it in staging.",
        speech_cadence_wpm: 128,
        stress_index: 20
      }
    ]
  },
  {
    session_id: 'sess_03',
    session_number: 3,
    session_title: 'Reversibility, Two-Way Doors & Decision Boundaries',
    date: '2026-08-20',
    duration_minutes: 40,
    average_intensity: 58,
    peak_intensity: 84,
    average_valence: 0.55,
    dominant_sentiment: 'Epistemic Plasticity & Velocity Bias',
    volatility_score: 24,
    composure_score: 89,
    time_points: [
      {
        point_id: 'p_03_01',
        time_offset_min: 5,
        timestamp: '11:05 AM',
        topic_stimulus: 'Classifying two-way vs one-way door architectural decisions',
        intensity: 50,
        valence: 0.4,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Taxonomic Decision Mapping',
        quote_excerpt: "If reverting takes under an hour and loses zero customer data, decide in 5 minutes and move.",
        speech_cadence_wpm: 132,
        stress_index: 18
      },
      {
        point_id: 'p_03_02',
        time_offset_min: 10,
        timestamp: '11:10 AM',
        topic_stimulus: 'When an engineer demands 3 weeks of benchmarking for a reversible cache TTL',
        intensity: 80,
        valence: -0.3,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Anti-Analysis-Paralysis Trigger',
        quote_excerpt: "Stop writing 20-page RFCs for decisions that can be toggled behind a LaunchDarkly feature flag.",
        speech_cadence_wpm: 170,
        stress_index: 45
      },
      {
        point_id: 'p_03_03',
        time_offset_min: 15,
        timestamp: '11:15 AM',
        topic_stimulus: 'Bayesian updating when production metrics contradict original thesis',
        intensity: 76,
        valence: 0.8,
        dominant_emotion: 'epistemic_doubt',
        cognitive_state_label: 'Epistemic Plasticity Surge',
        quote_excerpt: "If data proves my architectural assumption was wrong, I drop it immediately. Zero ego attached to deprecated code.",
        speech_cadence_wpm: 145,
        stress_index: 22
      },
      {
        point_id: 'p_03_04',
        time_offset_min: 20,
        timestamp: '11:20 AM',
        topic_stimulus: 'Irreversible database sharding key selection',
        intensity: 84,
        valence: 0.3,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'High-Formalism Enforcement',
        quote_excerpt: "Sharding keys are one-way doors. You model hot partitions for 2 weeks before you sign off.",
        speech_cadence_wpm: 138,
        stress_index: 32
      },
      {
        point_id: 'p_03_05',
        time_offset_min: 25,
        timestamp: '11:25 AM',
        topic_stimulus: 'Speed vs perfectionism tension in zero-to-one prototypes',
        intensity: 62,
        valence: 0.6,
        dominant_emotion: 'craft_pride',
        cognitive_state_label: 'Pragmatic Empiricism',
        quote_excerpt: "Speed is the greatest de-risker. Working software in users' hands teaches you more than 100 design meetings.",
        speech_cadence_wpm: 142,
        stress_index: 20
      },
      {
        point_id: 'p_03_06',
        time_offset_min: 35,
        timestamp: '11:35 AM',
        topic_stimulus: 'Summary of decision boundaries and thresholds',
        intensity: 42,
        valence: 0.7,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Model Calibration',
        quote_excerpt: "Reversibility is the master filter. High reversibility = high velocity; Low reversibility = high rigor.",
        speech_cadence_wpm: 126,
        stress_index: 12
      }
    ]
  },
  {
    session_id: 'sess_04',
    session_number: 4,
    session_title: 'Radical Candor, Code Reviews & Team Dynamics',
    date: '2026-08-21',
    duration_minutes: 45,
    average_intensity: 68,
    peak_intensity: 91,
    average_valence: 0.25,
    dominant_sentiment: 'Direct Candor & Craft Standards',
    volatility_score: 34,
    composure_score: 82,
    time_points: [
      {
        point_id: 'p_04_01',
        time_offset_min: 5,
        timestamp: '04:05 PM',
        topic_stimulus: 'Code review philosophy: nitpicks vs semantic correctness',
        intensity: 55,
        valence: 0.3,
        dominant_emotion: 'pragmatic_calm',
        cognitive_state_label: 'Automated Standard Enforcement',
        quote_excerpt: "If a linter or formatter can catch it, no human should ever type a comment about it on GitHub.",
        speech_cadence_wpm: 134,
        stress_index: 22
      },
      {
        point_id: 'p_04_02',
        time_offset_min: 10,
        timestamp: '04:10 PM',
        topic_stimulus: 'Giving direct feedback on sloppy architecture to a defensive peer',
        intensity: 87,
        valence: -0.2,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Radical Candor Engagement',
        quote_excerpt: "Being nice by staying silent while someone builds a fragile system is actually the cruelest thing you can do.",
        speech_cadence_wpm: 162,
        stress_index: 52
      },
      {
        point_id: 'p_04_03',
        time_offset_min: 15,
        timestamp: '04:15 PM',
        topic_stimulus: 'Mentoring junior engineers on systems thinking',
        intensity: 75,
        valence: 0.85,
        dominant_emotion: 'deep_curiosity',
        cognitive_state_label: 'Apprenticeship Transmission',
        quote_excerpt: "I don't give answers; I ask what failure modes happen when network latency spikes by 400ms.",
        speech_cadence_wpm: 146,
        stress_index: 18
      },
      {
        point_id: 'p_04_04',
        time_offset_min: 20,
        timestamp: '04:20 PM',
        topic_stimulus: 'Consensus-seeking cultures that avoid hard technical disagreements',
        intensity: 91,
        valence: -0.5,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Consensus Fatigue Spike',
        quote_excerpt: "Design by committee creates compromised monsters that please everyone in meetings and fail in production.",
        speech_cadence_wpm: 176,
        stress_index: 64
      },
      {
        point_id: 'p_04_05',
        time_offset_min: 25,
        timestamp: '04:25 PM',
        topic_stimulus: 'Rewarding engineers who delete 5,000 lines of redundant code',
        intensity: 82,
        valence: 0.9,
        dominant_emotion: 'craft_pride',
        cognitive_state_label: 'Subtractive Elegance',
        quote_excerpt: "The best PR I ever reviewed deleted 12 microservices and replaced them with 400 lines of clean SQL.",
        speech_cadence_wpm: 148,
        stress_index: 15
      },
      {
        point_id: 'p_04_06',
        time_offset_min: 35,
        timestamp: '04:35 PM',
        topic_stimulus: 'Psychological safety vs high performance standards balance',
        intensity: 66,
        valence: 0.4,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'Integrative Principle',
        quote_excerpt: "High safety + high standards = high performance. High safety + low standards = comfortable mediocrity.",
        speech_cadence_wpm: 140,
        stress_index: 26
      }
    ]
  },
  {
    session_id: 'sess_05',
    session_number: 5,
    session_title: '500-Item Psychometric Matrix & Parameter Engine Calibration',
    date: '2026-08-22',
    duration_minutes: 60,
    average_intensity: 71,
    peak_intensity: 94,
    average_valence: 0.65,
    dominant_sentiment: 'Deep Rigor & First-Principles Synthesis',
    volatility_score: 30,
    composure_score: 93,
    time_points: [
      {
        point_id: 'p_05_01',
        time_offset_min: 5,
        timestamp: '08:05 AM',
        topic_stimulus: 'Initiating 500-question deep psychometric matrix assessment',
        intensity: 58,
        valence: 0.5,
        dominant_emotion: 'deep_curiosity',
        cognitive_state_label: 'Methodological Activation',
        quote_excerpt: "Let's calibrate the full 500-item vector. Granular items capture nuances that conversational chat glosses over.",
        speech_cadence_wpm: 138,
        stress_index: 20
      },
      {
        point_id: 'p_05_02',
        time_offset_min: 15,
        timestamp: '08:15 AM',
        topic_stimulus: 'Engineering Philosophy questions: Refactoring vs greenfield',
        intensity: 76,
        valence: 0.6,
        dominant_emotion: 'conviction',
        cognitive_state_label: 'Deterministic Vectors',
        quote_excerpt: "Strongly Agree: Code that is easy to delete is vastly superior to code designed for indefinite extensibility.",
        speech_cadence_wpm: 150,
        stress_index: 25
      },
      {
        point_id: 'p_05_03',
        time_offset_min: 25,
        timestamp: '08:25 AM',
        topic_stimulus: 'Interpersonal Candor & Consensus aversion questions',
        intensity: 89,
        valence: 0.4,
        dominant_emotion: 'constructive_frustration',
        cognitive_state_label: 'Candor Metric Maxima',
        quote_excerpt: "Strongly Disagree on softening criticism. Polite ambiguity is technical debt in human communication.",
        speech_cadence_wpm: 165,
        stress_index: 40
      },
      {
        point_id: 'p_05_04',
        time_offset_min: 35,
        timestamp: '08:35 AM',
        topic_stimulus: 'Stress & P0 resilience items: Autonomic reaction to database corruptions',
        intensity: 94,
        valence: 0.7,
        dominant_emotion: 'crisis_focus',
        cognitive_state_label: 'Composure Vector Pinning',
        quote_excerpt: "Heart rate drops during outages. Emotion is a CPU leak; execute the checklists.",
        speech_cadence_wpm: 130,
        stress_index: 30
      },
      {
        point_id: 'p_05_05',
        time_offset_min: 45,
        timestamp: '08:45 AM',
        topic_stimulus: '20-Parameter Engine Vector recalculation & radar alignment',
        intensity: 84,
        valence: 0.9,
        dominant_emotion: 'craft_pride',
        cognitive_state_label: 'Parameter Equilibrium',
        quote_excerpt: "Reversibility Sensitivity at 92, Hype Skepticism at 88, Formalism Weight at 35. The radar fits reality perfectly.",
        speech_cadence_wpm: 145,
        stress_index: 15
      },
      {
        point_id: 'p_05_06',
        time_offset_min: 55,
        timestamp: '08:55 AM',
        topic_stimulus: 'Synthesizing Behavioral Narrative system prompt',
        intensity: 78,
        valence: 0.85,
        dominant_emotion: 'deep_curiosity',
        cognitive_state_label: 'Cognitive DNA Synthesis',
        quote_excerpt: "The synthesized prompt directives capture the exact operational heuristic playbook I use every day.",
        speech_cadence_wpm: 140,
        stress_index: 12
      }
    ]
  }
];
