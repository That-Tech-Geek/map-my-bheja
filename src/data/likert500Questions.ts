import { LikertQuestion, LikertDomain, PersonalityParameterKey, PersonalityParameter } from '../types';

/**
 * 500 High-Resolution Psychometric & Cognitive Likert-Scale Questions
 * Structured systematically across 10 Cognitive & Behavioral Domains (50 questions per domain).
 */

const rawDomainQuestions: Record<LikertDomain, Array<{
  subdomain: string;
  text: string;
  reversed: boolean;
  parameter: PersonalityParameterKey;
  weight?: number;
}>> = {
  engineering_philosophy: [
    { subdomain: 'Simplicity vs Complexity', text: 'I would rather write 100 lines of straightforward, duplicated code than introduce a complex 20-line generic abstraction.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Simplicity vs Complexity', text: 'Clean elegance and DRY modularity take priority even when building early-stage internal prototypes.', reversed: true, parameter: 'abstraction_tolerance' },
    { subdomain: 'Technical Debt', text: 'I actively encourage shipping temporary technical debt if it secures a crucial competitive or learning window.', reversed: false, parameter: 'technical_debt_tolerance' },
    { subdomain: 'Technical Debt', text: 'Unaddressed technical debt in core systems is a failure of engineering discipline that must be halted immediately.', reversed: true, parameter: 'technical_debt_tolerance' },
    { subdomain: 'Frameworks vs Vanilla', text: 'I prefer building with low-dependency, minimalist primitives over opinionated meta-frameworks.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Premature Optimization', text: 'Profiling and optimizing before hitting measurable performance bottlenecks is almost always wasted energy.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Correctness vs Velocity', text: 'Shipping an 85% correct implementation today is strictly better than waiting three weeks for a formally verified 99.9% implementation.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Architecture Rigor', text: 'Writing exhaustive design docs and architectural RFCs is essential before writing a single line of production backend code.', reversed: true, parameter: 'formalism_weight' },
    { subdomain: 'Tool Selection', text: 'I judge programming languages and tools strictly by their shipping velocity and ergonomics rather than academic purity.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Refactoring', text: 'I enjoy continuous micro-refactoring of working code just to improve semantic readability.', reversed: true, parameter: 'craft_perfectionism' },
    { subdomain: 'Static Typing', text: 'Strict compile-time type guarantees are non-negotiable for any software intended to live more than 3 months.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Microservices vs Monolith', text: 'Modular monoliths should almost always be chosen over microservices until engineering headcount exceeds 100.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Testing Strategy', text: 'I prioritize high-level end-to-end user journey tests over hundreds of brittle, fine-grained unit mocks.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Test-Driven Development', text: 'Strict TDD (writing tests prior to implementation) is excessive for fast-evolving product iterations.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Third-Party Dependencies', text: 'I am comfortable pulling in well-maintained open-source packages rather than rolling my own custom utilities.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Standardization', text: 'Enforcing rigid team-wide code formatters and lint rules is vital to avoid cognitive friction across codebases.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Observability', text: 'Comprehensive structured logging and metric instrumentation must be baked into every service from day one.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Premature Abstraction', text: 'I cringe when I see premature interfaces created for components that only ever have a single implementation.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Boilerplate Tolerance', text: 'A little boilerplate is far better than a magical, reflection-heavy framework that hides runtime behavior.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Defensive Programming', text: 'I write aggressive runtime assertion checks and error boundaries even for cases that "should never happen".', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'API Design', text: 'Public APIs and data contracts should be immutable and backward-compatible at all costs.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Database Choice', text: 'Boring, proven relational databases (like PostgreSQL) should be the default choice 95% of the time.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'State Management', text: 'Global mutable state is the root of all architectural evil; state machines and explicit flows are mandatory.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Legacy Code', text: 'Rewriting a functioning legacy system from scratch is almost always an ego-driven trap.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Code Reviews', text: 'Code reviews should focus solely on logic bugs, security, and architecture, ignoring subjective stylistic nits.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Concurrency Models', text: 'Explicit message passing or actor models are vastly superior to shared-memory multithreading.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Documentation', text: 'Self-documenting, readable code and clear variable naming reduce the need for extensive prose comments.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Failure Isolation', text: 'Systems must be designed so that if any non-critical dependency goes down, the core service degrades gracefully.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Config Management', text: 'Environment-specific configuration should be strictly decoupled from application artifacts.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Prototyping', text: 'When exploring a new problem domain, throwaway spike code is the fastest way to gain domain clarity.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Build Times', text: 'A slow CI/CD build pipeline is a critical emergency that directly destroys engineering morale and velocity.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Schema Migrations', text: 'Live schema migrations must be backward-compatible with zero-downtime dual-write rollouts.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Memory Management', text: 'Manual resource management and zero-copy allocations are worth the cognitive overhead when latency matters.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Event-Driven Systems', text: 'Eventual consistency introduces debugging nightmares that outweigh its scalability benefits in early products.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Security Posture', text: 'I enforce least-privilege access and zero-trust boundaries even within internal development environments.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Error Handling', text: 'Errors should fail fast, loudly, and with exhaustive contextual breadcrumbs rather than failing silently.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Deterministic Builds', text: 'Reproducible hermetic builds and locked dependency hashes are non-negotiable for supply chain sanity.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'API Surface', text: 'A narrow, minimal API surface is vastly better than an expansive API with hundreds of convenience helper methods.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Client-Side Logic', text: 'I prefer keeping business logic server-authoritative rather than distributing complex validation onto clients.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Code Deletion', text: 'Deleting unused code gives me more satisfaction than writing new features.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Idempotency', text: 'All mutation operations and network webhooks must be strictly idempotent by design.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Language Ecosystem', text: 'I value a vibrant package ecosystem more than the theoretical beauty of a programming language.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'UI Separation', text: 'Headless presentation logic decoupled from UI markup is essential for maintainable frontend architectures.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Caching Strategies', text: 'Caching is an optimization of last resort; fix the underlying query or data layout first.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Package Pinning', text: 'I pin all third-party dependencies to exact semver versions to prevent unexpected upstream breaks.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Dogfooding', text: 'Engineers who do not actively dogfood their own software cannot design coherent technical architecture.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Single Responsibility', text: 'Functions and classes that exceed 100 lines almost always indicate poor conceptual boundaries.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Feature Flags', text: 'Shipping dark via feature flags is mandatory for any significant behavioral change.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Rate Limiting', text: 'Every public endpoint must have sensible rate-limiting and backpressure handling from the initial commit.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Code Longevity', text: 'I write code expecting it to be deleted or rewritten within 18 months rather than surviving for a decade.', reversed: false, parameter: 'velocity_bias' },
  ],

  decision_and_tradeoffs: [
    { subdomain: 'Type 1 vs Type 2', text: 'If a decision is easily reversible (Type 2), I decide in minutes rather than gathering consensus.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Type 1 vs Type 2', text: 'Irreversible decisions (Type 1) warrant deliberate slowdowns, devil advocacy, and multi-scenario modeling.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Analysis Paralysis', text: 'I get agitated when teams spend days deliberating between two options with minor difference in expected value.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Speed vs Certainty', text: 'In fast-moving environments, 70% information certainty is the optimal threshold to pull the trigger.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Decisive Leadership', text: 'A mediocre decision executed with immense speed and conviction beats a perfect decision delivered six months late.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Consensus Hunting', text: 'I rarely seek 100% consensus; "disagree and commit" is essential to avoid lowest-common-denominator compromises.', reversed: false, parameter: 'consensus_orientation', weight: 1.2 },
    { subdomain: 'Option Preservation', text: 'I will pay a significant premium to preserve future optionality rather than locking into an optimal but rigid path.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Sunk Cost', text: 'I have zero hesitation killing a multi-month project the exact moment new data shows the core premise is flawed.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Opportunity Cost', text: 'I evaluate every technical task by what high-leverage project we are NOT doing while building it.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Risk Asymmetry', text: 'I actively search for bets with capped, negligible downside but unbounded 10x-100x upside.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Gut vs Data', text: 'When quantitative data contradicts strong qualitative domain intuition, I probe the telemetry pipeline for blind spots.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Second-Order Effects', text: 'I spend significant time mapping unintended second-order consequences before announcing policy or architectural shifts.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Scope Trimming', text: 'When deadlines loom, my immediate reflex is to cut 40% of the feature scope rather than delay the launch date.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Resource Allocation', text: 'I prefer putting 80% of our best talent on our #1 biggest opportunity rather than distributing effort across 5 decent ones.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Compromise Aversion', text: 'Watered-down middle-ground compromises usually inherit the weaknesses of both extremes without the strengths of either.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Speed Premium', text: 'Fast iteration provides a compounding learning advantage that outweighs minor tactical mistakes.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Strategic Focus', text: 'Strategy is defined more by what you explicitly choose NOT to do than what you agree to do.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Validation Speed', text: 'I would rather build a manual concierge test in 24 hours than write automated code before user demand is proven.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Decentralized Decisions', text: 'Decision rights should live with the engineer closest to the problem, not through managerial hierarchies.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Reversibility Signaling', text: 'I explicitly label decisions as "one-way doors" or "two-way doors" to align team urgency.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Threshold Awareness', text: 'I define clear metric tripwires upfront that will trigger automatic rollback or project cancellation.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Disruptive Bets', text: 'I am willing to cannibalize an existing successful product line to build the next-generation architecture.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Heuristic Simplicity', text: 'Simple rules of thumb outperform complex multivariate algorithms when operating in volatile environments.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Regret Minimization', text: 'When weighing major career or architectural leaps, I use regret minimization over 5-year horizons.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Bottleneck Focus', text: 'Optimizing any step in a system other than the primary bottleneck is a complete illusion of progress.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Default Stance', text: 'My default response to incoming feature requests from stakeholders is polite skepticism until clear ROI is demonstrated.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Feedback Loop Latency', text: 'Shortening the feedback loop from days to minutes is worth almost any amount of upfront tooling investment.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Pragmatic Tradeoffs', text: 'I am comfortable with non-ideal code in auxiliary systems if the core revenue or data engine is pristine.', reversed: false, parameter: 'technical_debt_tolerance' },
    { subdomain: 'Exploration vs Exploitation', text: 'I enforce a strict 80/20 split between executing known winning tactics and running speculative moonshots.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Clarity of Thought', text: 'If a decision rationale cannot be explained in a 3-sentence email, the underlying thinking is still muddled.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Conviction under Ambiguity', text: 'I can make high-stakes calls without flinching even when external stakeholders are panicking.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Simplifying Questions', text: 'I frequently ask "What would this look like if it were ridiculously simple?" to break deadlock.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Premature Commitment', text: 'I avoid locking into vendors or architectural stacks until the last responsible moment.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Signal vs Noise', text: 'I deliberately ignore 90% of industry chatter and social feeds to focus deeply on primary inputs.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Pre-Mortems', text: 'Running a pre-mortem ("Assume this fails in 12 months, why did it happen?") is mandatory for critical launches.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Execution Momentum', text: 'Maintaining team momentum and shipping cadence is more important than theoretical architectural perfection.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Zero-Sum Thinking', text: 'I reject zero-sum mindset; true engineering leverage creates non-zero-sum value for all parties.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Escalation Speed', text: 'If two senior engineers are blocked on an architectural impasse for >48 hours, immediate escalation is healthy.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Ruthless Triage', text: 'During an outage, I immediately discard minor sub-issues and laser-focus exclusively on service restoration.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Customer Empathy', text: 'I will happily violate internal architectural dogma if it directly solves a screaming user pain point.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Downside Protection', text: 'Before taking any calculated risk, I ensure the worst-case scenario will not be catastrophic or fatal.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Radical Simplification', text: 'The best feature is often no feature; removing unnecessary capabilities improves system health.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Incentive Alignment', text: 'When debugging organizational dysfunction, I examine systemic incentives rather than blaming individuals.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Bias to Build', text: 'When in doubt between buying a bloated enterprise SaaS or building a tailored 500-line internal tool, I lean build.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Patience for Compounding', text: 'I am willing to endure short-term pain for investments that compound quadratically over multi-year horizons.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Direct Ownership', text: 'Shared ownership often means no ownership; every critical system must have a single directly responsible individual.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Leverage Points', text: 'I constantly search for the single lever that makes all other adjacent problems trivial or irrelevant.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Counter-Intuitive Truths', text: 'The highest-leverage insights are usually non-consensus and right, rather than consensus and obvious.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Decision Auditability', text: 'Documenting the context and constraints of major decisions (via ADRs) saves massive future re-litigation.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Zero-Based Thinking', text: 'I periodically ask: "Knowing what we know today, would we start building this exact system again?"', reversed: false, parameter: 'first_principles_ratio' },
  ],

  problem_solving_heuristics: [
    { subdomain: 'First Principles', text: 'I break complex problems down to their fundamental thermodynamic and computational truths rather than reasoning by analogy.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Reasoning by Analogy', text: 'Copying the design patterns of tech giants (Google/Netflix) is the safest blueprint for our architecture.', reversed: true, parameter: 'first_principles_ratio' },
    { subdomain: 'Root Cause Debugging', text: 'I refuse to apply a band-aid fix until I can deterministically reproduce the bug and explain the exact sequence of failure.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Bisection & Isolation', text: 'My immediate instinct when debugging an elusive failure is binary search: strip away half the system until the fault is isolated.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Mental Simulation', text: 'I spend time mentally stepping through edge-case state permutations before touching the keyboard.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Rubber Ducking', text: 'Explaining a problem aloud to someone else (or a rubber duck) consistently reveals my flawed assumptions.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Inversion Thinking', text: 'When stuck, I invert the question: "How could I guarantee this system fails completely?" to find vulnerabilities.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Telemetry Over Speculation', text: 'I never argue about performance in a meeting without real-world latency traces and flame graphs on screen.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Simplest Reproducer', text: 'Creating a standalone, minimal 10-line reproduction script is my first step when investigating third-party bug reports.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Constraint Manipulation', text: 'If a problem seems intractable, I artificially tighten or loosen one core constraint to unlock creative workarounds.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Hypothesis Generation', text: 'I formulate 3 distinct testable hypotheses before diving into log analysis rather than aimlessly grepping.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'System Boundary Checks', text: 'Bugs almost always hide at the boundaries between two systems, protocols, or serialization formats.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Visual Mapping', text: 'Drawing a quick topological diagram of data flow clarifies architecture faster than 1,000 lines of text.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Falsifiability', text: 'A technical hypothesis is useless unless I can specify an exact experiment that would prove it wrong.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Workaround Pragmatism', text: 'If a quick, safe workaround prevents an emergency, I apply it first and investigate the root cause during daylight.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Underlying Math', text: 'I enjoy digging into the underlying algorithmic complexity (Big-O) and cache locality of data structures.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Pattern Recognition', text: 'I quickly recognize recurring antipatterns across disparate software domains and tech stacks.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Occams Razor', text: 'The simplest explanation—usually a typo, misconfigured env variable, or clock drift—is almost always the true culprit.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Extreme Values', text: 'I test systems with extreme boundary conditions (zero, infinity, negative numbers, max int, network partition).', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Heuristic Decomposition', text: 'Breaking a daunting monolithic problem into 5 decoupled sub-problems is half the battle won.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Reading Source Code', text: 'When third-party documentation is ambiguous, I dive directly into the library source code without hesitation.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Log Hygiene', text: 'I treat clear, structured log messages with timestamps and correlation IDs as first-class citizens.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Intuition Calibration', text: 'My gut intuition about software bugs is usually accurate, but I always verify with hard metrics before declaring victory.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Reframing the Problem', text: 'Often the fastest way to solve a hard technical problem is to realize the user does not actually need that capability.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Lateral Transfer', text: 'I frequently import concepts from physics, economics, or biology to solve distributed computing challenges.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Empirical Verification', text: 'I distrust theoretical benchmarks; I benchmark on actual production-spec hardware with realistic noisy workloads.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Error Budgeting', text: 'A zero-error tolerance is unrealistic; defining acceptable service level objectives (SLOs) guides proper engineering effort.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Code Walking', text: 'I find it useful to manually trace execution paths line-by-line when subtle race conditions occur.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Premise Questioning', text: 'When a project is struggling, I question the foundational premise rather than doubling down on implementation details.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Algorithmic Intuition', text: 'I can quickly assess whether a proposed solution will scale linearly or explode exponentially under 100x load.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Silent Assumptions', text: 'I make a habit of listing all implicit assumptions we are taking for granted in our system design.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Heuristic Pruning', text: 'I rapidly prune 80% of unviable solution paths in the first 10 minutes of brainstorming.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'System Dynamics', text: 'I analyze feedback loops, dampening factors, and cascading failure modes in distributed architectures.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Toy Implementations', text: 'Building a miniature toy version of a database or compiler helps me truly master its mechanics.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Stress Testing', text: 'I intentionally flood new endpoints with chaos payloads and burst traffic to witness their breaking behavior.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Cognitive Offloading', text: 'I write down complex state transition tables on paper rather than juggling them entirely in working memory.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Self-Correcting Heuristics', text: 'When my initial diagnosis is wrong, I rapidly discard my ego and pivot to alternative theories.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Domain Modeling', text: 'Mapping domain language cleanly into software types solves 70% of downstream business logic confusion.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Back of the Envelope', text: 'I can calculate ballpark storage, bandwidth, and IOPS requirements on a napkin in under 60 seconds.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Defensive Invariants', text: 'I love defining strict class and state invariants that make invalid states unrepresentable.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Observational Humility', text: 'I recognize that complex adaptive systems frequently exhibit counter-intuitive behaviors that defy simplistic logic.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Signal Extraction', text: 'In a flood of 10,000 error lines, I can immediately spot the single anomalous stack trace that triggered the cascade.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Algorithmic Tradeoffs', text: 'I am comfortable trading high memory usage for constant-time lookup performance when latency is paramount.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Exploratory Prototyping', text: 'When entering an unfamiliar domain, I write disposable code to map out the API topology before writing clean code.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Root Cause Fixes', text: 'Fixing the root cause of an architectural flaw is deeply satisfying even if the user never notices the change.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Failure Reconstruction', text: 'I write comprehensive post-mortems with timeline reconstructions to turn failures into institutional wisdom.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Decoupled Debugging', text: 'I mock external network boundaries so I can debug core business logic in completely deterministic local environments.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Clarity over Cleverness', text: 'I will always rewrite a clever, esoteric bitwise trick into simple readable code that any junior engineer can maintain.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Continuous Verification', text: 'I verify my assumptions at every single layer of the stack rather than trusting documentation blindly.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'First-Principles Design', text: 'I ask "What are the fundamental limits imposed by physics and network speed?" before accepting standard software constraints.', reversed: false, parameter: 'first_principles_ratio' },
  ],

  risk_and_uncertainty: [
    { subdomain: 'Ambiguity Tolerance', text: 'I thrive when handed an ambiguous problem with zero product specifications and total freedom to chart the solution.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Ambiguity Tolerance', text: 'I require well-defined user stories, acceptance criteria, and clear roadmaps before I can do my best work.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'Blast Radius Containment', text: 'Containing blast radius (so that a failure in one module cannot crash the entire application) is my #1 architectural priority.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Crisis Composure', text: 'During major production outages or company crises, my heart rate stays low and my thinking becomes sharper.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Experimentation Appetite', text: 'I would rather try 10 high-variance experiments where 7 fail than execute 10 safe, predictable tasks.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Downside Hedging', text: 'I always have a concrete contingency rollback plan ready before executing any high-stakes database or infra migration.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Loss Aversion', text: 'The pain of losing an existing customer or breaking an SLA feels twice as intense as the joy of gaining an equivalent win.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'High-Stakes Deployment', text: 'I am comfortable deploying critical changes on a Friday afternoon if our automated verification suite is green.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Uncertainty Communication', text: 'I am completely transparent about estimation uncertainty, providing wide confidence intervals rather than fake precise dates.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Bold Architectural Bets', text: 'I am willing to bet team resources on a nascent, superior technology before it has achieved widespread enterprise adoption.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Safety Margins', text: 'I provision 3x headroom on memory, CPU, and connection pools rather than cutting it close to save minor cloud pennies.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Rapid Rollbacks', text: 'Our deployment pipeline must be able to roll back a catastrophic release in under 60 seconds with zero data corruption.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Calculated Risk Taking', text: 'Taking calculated operational risks is the only way a startup can outcompete entrenched, slow-moving incumbents.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Panic Immunity', text: 'I do not get swayed by alarmist headlines or team panic when unexpected anomalies occur.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Early Warning Systems', text: 'I set up anomaly alerts that notify me when error rates creep up by 0.1% before users ever notice a slowdown.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Red Teaming', text: 'I enjoy thinking like a malicious adversary to uncover attack vectors and edge-case exploits in our systems.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Graceful Degradation', text: 'Under extreme traffic surges, shedding non-essential load to keep core transactions alive is non-negotiable.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Uncharted Territory', text: 'Working on problems where there are no existing StackOverflow answers or tutorials energizes me.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Risk Transparency', text: 'I proactively warn leadership about systemic risks months before they manifest as crises.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Decoupled Rollouts', text: 'Decoupling code deployment from feature release (via dark launches) removes 90% of deployment stress.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Failure Expectation', text: 'I design software assuming that disks will corrupt, network packets will drop, and third-party APIs will fail.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Controlled Chaos', text: 'Intentionally injecting failures in staging (Chaos Engineering) is essential to validate resilience.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Risk Diversification', text: 'Relying on a single cloud vendor or payment gateway without a backup path creates unacceptable existential risk.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Decision Under Fire', text: 'I can make tough triage calls with incomplete data during an active incident without second-guessing myself.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Psychological Safety in Risk', text: 'Team members should never be punished for well-reasoned experiments that happen to fail.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Predictable Over Optimistic', text: 'I prefer predictable, consistent throughput over spiky, occasionally ultra-fast performance.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Overconfidence Resistance', text: 'I am constantly vigilant against the hubris of assuming complex systems are fully understood.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Irreversible Data Safety', text: 'I enforce multi-region immutable backups with automated restore drills for all critical user data.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Volatility Harnessing', text: 'I view market and technological volatility as an opportunity to leapfrog rigid competitors.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Tolerable Flakiness', text: 'A flaky test suite is an unacceptable liability that destroys confidence in deployment safety.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Proactive Hardening', text: 'I allocate 20% of every sprint to hardening infrastructure and removing single points of failure.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Calm Demeanor', text: 'In tense meetings, maintaining a calm, objective, analytical tone de-escalates emotional friction.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Experimental Sandboxes', text: 'Every engineer should have an isolated sandbox where they can break things without touching production.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Asymmetric Bet Allocation', text: 'I allocate small, focused teams to explore high-risk bets that could generate 100x organizational leverage.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Blast Radius Awareness', text: 'I immediately assess the maximum dollar or reputation damage before authorizing an unusual operational action.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'No-Blame Postmortems', text: 'Root causes are systemic, never individual; blameless postmortems are essential for psychological truth.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Contingency Reserves', text: 'I build a 25% buffer into timeline and infrastructure budgets for unforeseen emergent complexity.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Action in Fog of War', text: 'Waiting for all ambiguity to clear before acting leads to inevitable defeat by faster actors.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'High Variance Bets', text: 'In competitive markets, average strategies yield zero excess returns; variance is a necessary virtue.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Security Paranoia', text: 'I operate with healthy paranoia regarding authentication boundaries, session tokens, and cryptographic keys.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Steering Through Chaos', text: 'When project scope is chaotic, I anchor the team to three immutable North Star principles.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Recovery Speed Over Prevention', text: 'Optimizing for Mean Time to Recovery (MTTR) is often more practical than trying to achieve zero incidents.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Calculated Boldness', text: 'I respect colleagues who make bold, calculated moves over those who cautiously maintain the status quo.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Immutable Audit Trails', text: 'Every critical administrative action must produce an immutable, tamper-evident audit record.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Resilience Under Pressure', text: 'When setbacks happen, I rebound rapidly and refocus energy on the immediate forward path.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Scenario Stress Testing', text: 'I test business models against worst-case macroeconomic downturns to ensure survival.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Zero Tolerance for Fragility', text: 'Systems that require manual human babysitting to stay upright should be refactored or decommissioned.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Comfort with Unpredictability', text: 'I accept that the real world is stochastic, non-linear, and messy, rather than neatly deterministic.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Strategic Hedging', text: 'I maintain strategic relationships with alternative suppliers to prevent single-vendor capture.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Uncertainty Embracing', text: 'I find operating in uncertain, frontier domains far more intellectually fulfilling than optimizing mature legacy stacks.', reversed: false, parameter: 'rabbit_hole_curiosity' },
  ],

  epistemic_updating: [
    { subdomain: 'Bayesian Updating', text: 'When high-quality empirical evidence contradicts my cherished worldview, I change my mind instantly.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Bayesian Updating', text: 'I tend to defend my established technical viewpoints vigorously against newly emerging trends.', reversed: true, parameter: 'epistemic_plasticity' },
    { subdomain: 'Hype Skepticism', text: 'I am deeply skeptical of new industry buzzwords and framework hypes until they have survived at least 2 years in production.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Intellectual Humility', text: 'I am quick to publicly admit "I was completely wrong about this" when proven incorrect.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Strong Opinions Loosely Held', text: 'I formulate strong, clear hypotheses quickly, but hold them loosely and discard them without emotional attachment.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Skepticism of Authority', text: 'I evaluate claims on their empirical and logical merits, regardless of the credentials or seniority of the person making them.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Active Disconfirmation', text: 'I actively seek out smart people who disagree with my architectural proposals and try to prove myself wrong.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Confirmation Bias Awareness', text: 'I am constantly on guard against cherry-picking data points that support my pre-existing narrative.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Nuance Appreciation', text: 'Most dogmatic engineering arguments ("SQL vs NoSQL", "Monolith vs Microservices") depend entirely on context.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Curiosity over Defense', text: 'When someone critiques my code, my first internal reaction is intense curiosity to understand their perspective.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Belief Audit', text: 'I periodically re-examine core beliefs I have held for years to verify if underlying assumptions have shifted.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Consensus Skepticism', text: 'When everyone in the room unanimously agrees on a plan, I become suspicious that we are overlooking blind spots.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Statistical Thinking', text: 'I naturally think in terms of probability distributions and confidence intervals rather than binary certainties.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Separation of Ego', text: 'My self-worth is decoupled from whether my initial technical proposal was accepted.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Steel-Manning', text: 'Before critiquing an opposing architecture, I make sure I can articulate its strongest version better than its proponents.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Evidence Calibration', text: 'Extraordinary architectural claims require extraordinary empirical benchmarks.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Openness to Paradox', text: 'I am comfortable holding two competing valid perspectives in tension while evaluating system designs.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Pragmatic Truth', text: 'A mental model is useful if it produces reliable predictive power, even if it is a simplification of reality.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Sunk Ideology', text: 'I have abandoned technology stacks I spent 5 years mastering when a categorically superior paradigm emerged.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Data Integrity Checking', text: 'Before analyzing an interesting anomaly, I verify the data collection pipeline is not simply malfunctioning.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Intellectual Honesty', text: 'I never pretend to understand a technical concept in a meeting just to look competent.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Counter-Hypothesis Testing', text: 'I deliberately test alternative explanations for why our product metrics improved before taking credit.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Scientific Method', text: 'I treat software development as an empirical science: hypothesize, isolate variables, measure, conclude.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Resistance to Cargo Cults', text: 'I despise copying organizational or architectural rituals without understanding their original context.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Listening to Dissidents', text: 'I pay close attention to the quiet junior engineer who points out a flaw the senior architects missed.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Probabilistic Forecasting', text: 'I assign percentage probabilities (e.g. 70% confidence) to my technical predictions.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Skepticism of Benchmark Marketing', text: 'I ignore synthetic vendor benchmarks and only trust benchmarks run under our actual production schema.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Willingness to Unlearn', text: 'Unlearning outdated legacy habits is just as important as acquiring new technical skills.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Respect for Evidence', text: 'A single clean, reproducible benchmark outweighs a hundred theoretical opinions.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Self-Correction Speed', text: 'The faster I can realize and correct my own mistakes, the faster our overall system evolves.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Depth of Investigation', text: 'I am not satisfied with "it started working again magically after restart"; I must understand the mechanism.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Dialectical Inquiry', text: 'I view technical disagreements not as battles to win, but as collaborative searches for objective truth.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Heuristic Validation', text: 'I test heuristics in small-scale environments before codifying them into team-wide engineering policies.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Ego-Free Code Review', text: 'I welcome sharp critiques of my PRs and implement suggestions without feeling defensive.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Calibrated Confidence', text: 'I match the strength of my assertions strictly to the depth and rigor of the supporting evidence.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Questioning Conventional Wisdom', text: 'Standard industry practices are often historical artifacts that no longer make sense with modern hardware.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Epistemic Rigor', text: 'I distinguish clearly between verified empirical facts, educated hypotheses, and speculative opinions.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Continuous Revision', text: 'Our architectural roadmap should be a living document that updates continuously as new learnings arrive.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Skepticism of Over-Fitting', text: 'I am wary of machine learning models or architectures that fit past training data perfectly but fail on novel inputs.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Curiosity in Failure', text: 'A failed experiment that reveals an unexpected system behavior is often more valuable than a predictable success.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Humility in Complexity', text: 'I acknowledge that any non-trivial distributed system has emergent behaviors that no single human fully grasps.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Truth Over Politics', text: 'Technical truth and system reality must always take precedence over organizational diplomacy or vanity metrics.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Evaluating Counter-Arguments', text: 'I spend deliberate effort looking for the strongest counter-arguments before publishing technical proposals.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Receptive to New Tools', text: 'I am always eager to test promising new tools, even if they initially challenge my familiar workflow.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Clarity on Assumptions', text: 'I make a conscious effort to explicitly write down assumptions before running any experimental test.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Skepticism of Shiny Objects', text: 'I resist the urge to adopt new tools merely because they are trending on tech forums.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Transparent Reasoning', text: 'I walk people through the exact chain of logic and evidence that led to my conclusions.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Adaptive Thinking', text: 'I adapt my engineering approach based on whether we are at pre-product-market fit or scaling to 10M users.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Open Inquiry', text: 'I encourage junior teammates to challenge my technical decisions whenever they spot an inconsistency.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Lifelong Epistemic Growth', text: 'I view my cognitive mental model as a perpetual work in progress that will never be final or complete.', reversed: false, parameter: 'epistemic_plasticity' },
  ],

  interpersonal_and_candor: [
    { subdomain: 'Radical Candor', text: 'I deliver direct, unvarnished feedback on technical flaws because sugarcoating harms the team in the long run.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Radical Candor', text: 'I prioritize politeness and harmony over pointing out critical architectural flaws in group meetings.', reversed: true, parameter: 'candor_directness' },
    { subdomain: 'Feedback Delivery', text: 'I give constructive feedback immediately in private rather than letting issues fester until quarterly reviews.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Intellectual Debate', text: 'I love energetic, high-intensity technical debates where we attack ideas vigorously without taking it personally.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Directness over Fluff', text: 'I prefer communications that get straight to the point in the first sentence without conversational filler.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Handling Incompetence', text: 'When someone repeatedly produces sloppy work after coaching, I advocate for their prompt reassignment.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Mentorship Posture', text: 'I mentor by asking guiding Socratic questions rather than dictating solutions to foster independent reasoning.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Clear Expectations', text: 'I set crystal-clear definitions of done and explicit standards before delegating complex engineering tasks.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Respect for Craft', text: 'I have immense respect for colleagues who obsess over craft and deliver flawless execution.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Disagreement Protocol', text: 'Once a decision is finalized after healthy debate, I commit 100% of my energy to its success.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Empathy in Incident Response', text: 'When someone accidentally breaks production, I focus entirely on system defenses rather than pointing fingers.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Honest Self-Assessment', text: 'I am completely honest about my own knowledge gaps and never bluff technical expertise.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Public Praise / Private Critique', text: 'I praise wins publicly and deliver tough course corrections in one-on-one settings.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Transparency in Strategy', text: 'I believe leadership should share raw strategic context and financial realities openly with engineers.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Calling Out Bad Logic', text: 'I feel a moral obligation to intervene when I see flawed technical logic being codified into team policy.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Appreciation of Diversity of Thought', text: 'A team of diverse cognitive styles outperforms a monoculture of like-minded thinkers.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Managing Discontent', text: 'When I disagree strongly with company direction, I address it directly with leadership rather than gossiping.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Encouraging Agency', text: 'I encourage teammates to ask for forgiveness rather than permission on reversible technical improvements.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Objective Code Reviews', text: 'I hold senior engineers and junior engineers to the exact same rigorous standards of code quality.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Active Listening', text: 'When a teammate proposes an unconventional idea, I listen intently to uncover their underlying insight.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Boundary Enforcement', text: 'I defend my team from distracting external requests to protect uninterrupted deep work blocks.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Collaborative Problem Solving', text: 'Whiteboarding a hard architectural dilemma with a sharp peer produces better results than solitary isolation.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Conflict Resolution', text: 'I tackle interpersonal conflicts head-on the moment they arise rather than hoping they resolve on their own.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Recognition of Leverage', text: 'I celebrate the engineer who deleted 5,000 lines of redundant code just as much as the one who built a new feature.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Psychological Safety', text: 'Creating an environment where people feel safe raising weird ideas and admitting mistakes is essential.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'No Bureaucratic Rituals', text: 'I actively push to eliminate status meetings that could be replaced by a 3-bullet asynchronous update.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Intellectual Generosity', text: 'I freely share credit and highlight the contributions of others when presenting project achievements.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Decisive Mediation', text: 'When two engineers are stuck in an ideological deadlock, I step in decisively to break the tie.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'High Expectations', text: 'I hold my colleagues to extraordinarily high standards because I believe in their potential.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Asynchronous Collaboration', text: 'I prefer well-written asynchronous memos over real-time meetings for complex architectural proposals.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Genuine Curiosity in People', text: 'I am fascinated by how different people process information, make decisions, and view the world.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Constructive Disruption', text: 'I am willing to ruffle feathers if it is necessary to eliminate dangerous technical blind spots.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Delegation of Authority', text: 'When I delegate a project, I delegate full decision authority, not just a task checklist.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Clear Communication', text: 'I invest effort into distilling complex technical systems into lucid, accessible mental models.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Trust by Default', text: 'I extend high trust to new teammates by default until they demonstrate otherwise.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Humor and Levity', text: 'Maintaining a sense of humor and camaraderie helps diffuse high-pressure development crunches.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Fair Attribution', text: 'I make sure ideas are attributed to their original creators rather than letting loud voices claim them.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Vulnerability as Strength', text: 'Admitting "I have no idea how to solve this yet" fosters genuine collaboration and rapid breakthroughs.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Respect for Operational Work', text: 'I value the unsung heroes who maintain infrastructure and fix tech debt as much as product developers.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Principled Negotiation', text: 'In technical negotiations, I focus on shared underlying objectives rather than entrenched positions.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Defending Quality Standards', text: 'I will refuse to approve a pull request that compromises system stability, regardless of schedule pressure.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Direct Feedback Reception', text: 'I actively solicit blunt feedback on my leadership and decision-making from peers and subordinates.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Zero Tolerance for Politics', text: 'I have zero patience for corporate gamesmanship, backchanneling, or passive-aggressive dynamics.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Clarity on Non-Goals', text: 'I ensure every team member understands what is explicitly out of scope for the current milestone.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Building Self-Sufficiency', text: 'My goal when helping a colleague is to give them the tools to never need my help on that topic again.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Emotional Regulation', text: 'I do not let frustration or anger dictate my professional interactions or code reviews.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Encouraging Ambition', text: 'I push teammates to attempt projects that are 10x more ambitious than their default comfort zone.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Honoring Commitments', text: 'When I commit to delivering an architectural review or assisting an incident, I execute reliably.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Uncompromising Integrity', text: 'I will never falsify metrics, conceal bugs, or mislead stakeholders about the true state of software.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Championing Simplicity', text: 'I celebrate teammates who find elegant ways to simplify systems rather than those who build complex empires.', reversed: false, parameter: 'scope_ruthlessness' },
  ],

  curiosity_and_depth: [
    { subdomain: 'Rabbit Holes', text: 'I frequently lose track of time diving deep into low-level compiler internals, kernels, or esoteric protocols just to satisfy curiosity.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Rabbit Holes', text: 'I strictly avoid reading about technologies unless there is an immediate, practical business requirement.', reversed: true, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'First-Principles Deconstruction', text: 'I cannot rest until I understand how a system works all the way down to the metal or memory layout.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Polymath Synthesis', text: 'I actively read across diverse domains (neuroscience, history, physics, game theory) and synthesize analogies into software.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Tinkering Instinct', text: 'I regularly build weekend side projects and toy engines to experiment with fresh frameworks and paradigms.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Academic Literature', text: 'I read primary computer science papers (e.g. Raft, Dynamo, Attention Is All You Need) rather than reading blog summaries.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Mastery over Utility', text: 'I strive for true technical craftsmanship and deep mastery rather than superficial familiarity.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Curiosity on Anomalies', text: 'When a piece of software exhibits a 10ms anomalous spike that happens only once in 100,000 requests, I feel compelled to investigate.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Exploratory Prototyping', text: 'I learn new programming languages by immediately writing a parser, mini-interpreter, or game engine in them.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Broad Horizon', text: 'I keep track of foundational breakthroughs in AI, cryptography, quantum computing, and hardware architectures.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Deep Work Immersion', text: 'I can sustain 4-6 hours of intense, uninterrupted hyper-focus when wrestling with a difficult algorithmic problem.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Reverse Engineering', text: 'I enjoy reverse engineering closed-source protocols and disassembling binaries to see how they work.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Boredom with Repetition', text: 'I quickly get bored with routine CRUD development and seek out mathematically challenging or high-scale problems.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Systemic Curiosity', text: 'When using any everyday software product, I immediately mentally architect how their backend and caching is designed.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Questioning Foundations', text: 'I enjoy questioning long-held computing conventions (e.g., Why do we still use file systems? Why POSIX?).', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Craft Pride', text: 'I take immense aesthetic pride in beautifully formatted code, clean architectures, and self-evident domain types.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Learning Speed', text: 'I can pick up a completely unfamiliar language or domain and build a working production system within a week.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Deep Debugging', text: 'I enjoy debugging down into kernel syscalls, memory allocators, and hardware cache lines when mysteries occur.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Curiosity-Driven Research', text: 'Some of my best production architectural breakthroughs came from random curiosity-driven explorations.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'High Signal Absorption', text: 'I can speed-read technical specifications and RFCs and extract the critical 5% that dictates system design.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Mental Modeling', text: 'I constantly build high-fidelity conceptual maps of complex distributed environments in my head.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Intellectual Wanderlust', text: 'I find joy in exploring dead or forgotten computing paradigms (e.g. LISP machines, Smalltalk, Forth).', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Uncovering Edge Cases', text: 'I have a knack for finding the exact input sequence that breaks an algorithm.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Autonomous Exploration', text: 'I do not need someone to give me a task list; I independently explore our codebase and identify high-leverage opportunities.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Cross-Layer Comprehension', text: 'I understand how software instructions translate down to assembly, microcode, transistors, and electrical signals.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Excitement for Hard Problems', text: 'When told "that is theoretically impossible with our current constraints", my motivation increases tenfold.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Curating Knowledge', text: 'I maintain an extensive, highly organized personal knowledge repository of technical insights and snippets.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Investigating Assumptions', text: 'I dig into the source code of standard libraries to verify their internal lock mechanisms and concurrency safety.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Passion for Speed', text: 'I have an intrinsic obsession with microsecond latency and computational efficiency.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Curiosity in Human Behavior', text: 'I am as fascinated by cognitive biases and user psychology as I am by distributed systems.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Generative Synthesis', text: 'I love combining two seemingly unrelated technical primitives to create an entirely new capability.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Depth over Breadth', text: 'When tackling a crucial core competency, I would rather be in the top 1% of mastery than have broad shallow knowledge.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Algorithmic Aesthetics', text: 'An algorithm that is both mathematically optimal and visually clean feels like a work of art to me.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Unquenchable Inquisitiveness', text: 'I ask "Why?" five consecutive times until we reach fundamental ground truths.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Exploring Frontiers', text: 'I spend personal time evaluating cutting-edge frontier AI models, reasoning architectures, and agent frameworks.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Mastery of Tools', text: 'I invest significant time mastering my development tools, shortcuts, and terminal workflow to eliminate all friction.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Deep Architecture Analysis', text: 'I love studying the source code of open-source titans (e.g. SQLite, Linux, Redis, PostgreSQL).', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Pattern Transposition', text: 'I transpose architectural patterns discovered in database engines into frontend state managers.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Continuous Discovery', text: 'A week where I did not learn a fundamentally new technical concept feels like a wasted week.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Deconstruction Instinct', text: 'When I see a breathtaking new software capability, my first reflex is: "How could I recreate this in 48 hours?"', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Curiosity on Failure Modes', text: 'I study famous historical disasters (Therac-25, Ariane 5, Knight Capital) to understand systemic collapse.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Independent Thinking', text: 'I form my own independent technical judgments rather than conforming to whatever is popular on social media.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'High Cognitive Endurance', text: 'I can sustain intense analytical focus across multiple days when solving an elusive architectural bottleneck.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Deep Knowledge Sharing', text: 'I take deep satisfaction in mentoring others and explaining complex concepts in simple terms.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Intuitive Physics of Code', text: 'I develop an intuitive feel for where memory pressure, lock contention, and latency bottlenecks will emerge.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Pursuit of Elegance', text: 'I believe the best technical architectures possess an inherent simplicity that makes them look obvious in hindsight.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Frontier Tinkering', text: 'I regularly clone raw experimental GitHub repos and run them locally before they have documentation.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Systemic Root Cause', text: 'I look beyond the immediate software bug to understand the organizational or cognitive defect that allowed it.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Continuous Intellectual Upgrade', text: 'I actively seek out books, mentors, and challenges that expose the limits of my current knowledge.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Pure Joy of Creation', text: 'The thrill of writing code and watching abstract thoughts turn into working reality never gets old for me.', reversed: false, parameter: 'craft_perfectionism' },
  ],

  stress_and_resilience: [
    { subdomain: 'Incident Pressure', text: 'During an active P0 production incident, I remain emotionally detached, calm, and laser-focused on resolution steps.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Incident Pressure', text: 'High-stakes production outages cause me intense physiological panic and make it hard to think clearly.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Deadline Crunch', text: 'When deadlines accelerate, I get sharper, prioritize ruthlessly, and eliminate all non-essential noise.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Resilience after Failure', text: 'When an architectural project I championed fails publicly, I absorb the lessons, dust off, and move forward immediately.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Critique Tolerance', text: 'Harsh, blunt critiques of my ideas leave me completely unfazed emotionally; I only care if the feedback is accurate.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Workload Surges', text: 'I can handle intense periods of 70-hour sprint intensity without burning out, provided the mission has genuine meaning.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Uncertainty Endurance', text: 'I can work effectively for months in high-uncertainty startup environments where company survival is on the line.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Decision Stamina', text: 'My cognitive judgment remains sound even after making 50 high-impact decisions in a single day.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Decoupling Stress from Identity', text: 'I do not tie my personal self-worth to temporary software bugs or operational setbacks.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Focus Under Chaos', text: 'I can enter a deep flow state even in a noisy, chaotic, high-distraction open office environment.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Patience with Complex Bugs', text: 'I can calmly spend 3 consecutive days tracing a non-deterministic race condition without losing my temper.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Emotional Regulation', text: 'I never send angry, emotional emails or Slack messages when disagreements get heated.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Equanimity in Disruption', text: 'When an executive abruptly pivots company strategy and cancels my roadmap, I pivot without bitterness.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Grace Under Fire', text: 'When stakeholders are screaming about an outage, I give them calm, reassuring, fact-based status updates.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Stress Recovery', text: 'I have reliable daily habits (exercise, sleep, solitude) that reset my cognitive capacity completely.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Courage in Dissent', text: 'I have the courage to stand alone in a room of 20 people and object to a flawed plan.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Stability Anchor', text: 'In times of organizational turbulence, my teammates look to me as an anchor of stability and clarity.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Acceptance of the Uncontrollable', text: 'I do not waste emotional bandwidth raging against things outside of my direct sphere of influence.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Perseverance in Obstacles', text: 'When an obstacle blocks my primary path, I instinctively look for 5 alternative workarounds.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Detachment in Negotiations', text: 'I maintain complete emotional neutrality during tense technical or salary negotiations.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Ambiguous Threats', text: 'When rumors of reorgs or layoffs circulate, I stay focused on delivering undeniable engineering value.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Zero Victim Mentality', text: 'I take extreme ownership of every outcome in my projects, never blaming external circumstances or bad luck.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Thriving in High Stakes', text: 'I actually perform noticeably better when the stakes are astronomical and failure is not an option.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Rebound Speed', text: 'After a grueling launch sprint, I recharge quickly and feel energized to tackle the next frontier.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Steady Hands in Deployments', text: 'My hands are steady when typing production database mutation commands into terminal consoles.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Immunity to Imposter Syndrome', text: 'I focus on what I can learn and execute today rather than agonizing over imposter syndrome.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Perspective on Failures', text: 'I maintain the perspective that in 5 years, today’s critical crisis will be a humorous learning anecdote.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Calm under Time Pressure', text: 'When told I have 2 hours to fix a live exploit, I methodically construct a patch rather than rushing sloppily.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Endurance in Refactoring', text: 'I have the mental stamina to see massive, tedious multi-month codebase migrations through to completion.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Unshakable Focus', text: 'I can tune out macroeconomic doom, market drops, and social media outrage to ship great products.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Calm in Conflict', text: 'When someone attacks my character or motivations, I steer the conversation strictly back to objective facts.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Mental Fortitude', text: 'I view severe challenges as the crucible that separates elite engineers from average practitioners.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'High Frustration Threshold', text: 'It takes an extraordinary amount of repeated friction before I show visible signs of irritation.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Clarity in Fatigue', text: 'Even when physically tired, I know my cognitive boundaries and avoid making irreversible late-night commits.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Decisive Triage Under Fire', text: 'When five systems fail simultaneously, I instantly prioritize the order of operations without freeze.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Resilience to Rejection', text: 'Having a major grant, pitch, or RFC rejected only fuels my desire to refine the evidence and try again.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Maintaining Standards in Crisis', text: 'I refuse to compromise foundational security or data integrity even in the midst of extreme emergency.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Soothe Capability', text: 'I can calm my own internal stress through rational self-talk and breath control in seconds.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Optimism Grounded in Reality', text: 'I maintain relentless optimism that we will solve the problem, combined with brutal honesty about current difficulties.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Composure in Deprecations', text: 'When an upstream service we rely on deprecates an API with 30 days notice, I mobilize execution calmly.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Constructive Release of Pressure', text: 'I channel high work stress into productive physical exercise or creative building rather than rumination.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Unflinching Honesty with Leadership', text: 'I will calmly tell the CEO that their proposed deadline is physically impossible based on engineering realities.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Grace in Victory', text: 'When my controversial technical bet pays off massively, I remain humble and avoid gloating.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Stability in Fast Scaling', text: 'When team size triples in 6 months, I help preserve architectural culture without succumbing to vertigo.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Patience in Bureaucracy', text: 'When forced to navigate complex enterprise compliance hurdles, I execute methodically without tantrums.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Emotional Independence', text: 'My internal motivation and standards are self-generated, not dependent on external praise.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Decisiveness in Ambiguity', text: 'When nobody knows the right path forward in a crisis, I step up, make the call, and accept full accountability.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Resilience Against Setbacks', text: 'A hard disk crash or accidental data wipe is an engineering problem to fix, not a reason to despair.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Calm Demeanor Under Spotlight', text: 'I am completely composed when giving high-stakes technical presentations to thousands of people.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Iron Will for Excellence', text: 'I possess the grit and stamina to see through monumental challenges that cause others to surrender.', reversed: false, parameter: 'craft_perfectionism' },
  ],

  execution_and_velocity: [
    { subdomain: 'Bias for Action', text: 'I believe aggressive action produces far more information and learning than passive contemplation.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Bias for Action', text: 'I prefer to wait until every requirement is crystal clear before writing my first line of code.', reversed: true, parameter: 'velocity_bias' },
    { subdomain: 'MVP Philosophy', text: 'A true MVP should make you slightly embarrassed; if you launched without embarrassment, you launched too late.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Ruthless Scope Cutting', text: 'When building a prototype, I ruthlessly chop away 70% of feature ideas to ship the single core loop.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Meeting Elimination', text: 'I consider almost all meetings an interruption to productive deep flow; asynchronous memos are strictly superior.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Momentum Preservation', text: 'Team momentum and continuous shipping cadence is a magical superpower that solves most morale problems.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Fast Turnaround', text: 'I review incoming pull requests within 30 minutes to prevent teammates from stalling on blockers.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Pragmatic Tooling', text: 'I use standard scripts, AI assistants, and automation to eliminate any repetitive task taking more than 5 minutes.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Short Iteration Cycles', text: 'I break projects down into milestones that can be completed and deployed within 48 hours.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Done over Perfect', text: 'A good solution shipped and working in production today is vastly better than a perfect solution next month.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Rapid Feedback Gathering', text: 'I put rough prototypes in front of real users immediately to test willingness to pay and engagement.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Direct Execution', text: 'Instead of debating whether a feature is technically feasible in a meeting, I build a proof of concept in 2 hours.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Eliminating Red Tape', text: 'I bypass unnecessary bureaucratic approval steps when the blast radius of the change is zero.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Extreme Prototyping', text: 'I can scaffold an entire end-to-end full-stack web application with database and auth over a single weekend.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Aggressive Prioritization', text: 'I only work on my single highest-priority task until it is done, ignoring all minor secondary distractions.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Continuous Deployment', text: 'Code should be deployed to production multiple times a day rather than batched into scary bi-weekly releases.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'High Energy Cadence', text: 'I bring infectious high energy, urgency, and drive to every engineering project I lead.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Rapid Recovery from Blockers', text: 'When I hit a technical blocker, I find a creative detour within 15 minutes rather than waiting on external teams.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Automating Toil', text: 'If I have to perform a manual operational task three times, I write an automated script to handle it forever.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Relentless Focus on Shipping', text: 'My primary metric of personal productivity is working software shipped into the hands of delighted users.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Minimalist Architecture', text: 'I intentionally design the simplest possible initial database schema and expand it only when proven necessary.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Unblocking Others', text: 'I drop what I am doing immediately if a junior engineer is blocked on a critical path item.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Fast Prototyping Tools', text: 'I leverage UI component libraries and generative AI tools to accelerate scaffolding by 5x.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Zero Procrastination', text: 'When faced with a painful, dreaded technical task, I tackle it first thing in the morning.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Tight Milestones', text: 'I set ambitious 1-week sprint goals that force us to be creative and eliminate scope bloat.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Decisive Execution', text: 'I would rather make 5 decisions and execute immediately (even if 1 is sub-optimal) than spend a week deliberating.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Continuous Improvement', text: 'I constantly optimize my personal development environment, shell aliases, and editor shortcuts for maximum speed.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Saying No to Bloat', text: 'I say no to 90% of feature suggestions to ensure the remaining 10% are exceptionally fast and polished.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'High Output Rate', text: 'I consistently produce a higher volume of working code, architecture docs, and products than my peers.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Speed as a Feature', text: 'Sub-100ms interface responsiveness is a core feature that directly drives user engagement.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Fast Hypothesis Disproof', text: 'I design experiments specifically to disprove false hypotheses as quickly and cheaply as possible.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Low Friction Workflows', text: 'Any friction that slows down the commit-to-production loop is a bug that must be eradicated.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Decoupled Development', text: 'I structure team work so that engineers can build and test modules in parallel without waiting on each other.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Action-Oriented Memos', text: 'I write internal memos with clear, concrete action items and deadlines rather than open-ended musings.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Fierce Urgency', text: 'I operate with a sense of urgency because window of opportunity in modern tech closes rapidly.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Rapid Synthesis', text: 'I can read 50 customer feedback complaints and distill the top 2 actionable product improvements in 10 minutes.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Immediate Follow-Through', text: 'When I agree to an action item in a conversation, I execute it or schedule it immediately.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Eliminating Distractions', text: 'I turn off all non-critical notifications on phone and computer during deep execution blocks.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Fast Refactoring Spikes', text: 'When code starts smelling, I dedicate an uninterrupted afternoon to clean up the architecture before it rots.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Ruthless Simplification', text: 'I constantly look for ways to replace 1,000 lines of custom code with a standard library call.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Shortening Cycles', text: 'I view my job as continuously cutting the time between having an idea and seeing it running live in production.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Direct Hands-On Building', text: 'I stay hands-on with code and architecture regardless of my leadership title or management scope.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Rapid User Feedback', text: 'I watch real users interact with my software over screen share to immediately spot UX friction points.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'High Bandwidth Communication', text: 'I use bullet points, diagrams, and code snippets rather than long prose paragraphs to communicate fast.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Tenacious Follow-Through', text: 'I do not stop when a project is 90% done; I push through the unglamorous final 10% polish to ship.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Agile Calibration', text: 'I adapt project scope continuously based on what we learn each week rather than adhering to a rigid 6-month plan.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Zero Toleration for Stalling', text: 'If a pull request sits unreviewed for 24 hours, I proactively reach out to get it merged.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Building What Sells', text: 'I focus engineering effort on capabilities that directly create value or solve acute pain for customers.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Fast Feedback Loop Architecture', text: 'I invest heavily in local hot-reloading and instant test runners to maximize development velocity.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Shipping as Learning', text: 'I consider software in production to be the only true test of whether our mental models were accurate.', reversed: false, parameter: 'velocity_bias' },
  ],

  autonomy_and_work_ethic: [
    { subdomain: 'Self-Direction', text: 'I operate with extreme autonomy and do my best work when given high-level goals with zero micro-management.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Self-Direction', text: 'I prefer having a manager who assigns daily tasks and closely inspects my step-by-step progress.', reversed: true, parameter: 'autonomy_preference' },
    { subdomain: 'Craft Perfectionism', text: 'I care deeply about the invisible details of my work, even the internal parts that nobody else will ever see.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Intrinsic Motivation', text: 'My drive to create exceptional software is entirely intrinsic, fueled by curiosity and high personal standards.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Extreme Ownership', text: 'If a project fails, I take 100% personal responsibility for every breakdown, communication lapse, and bug.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Deep Work Preservation', text: 'I fiercely protect uninterrupted 4-hour time blocks on my calendar for intense engineering flow.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Initiative Taking', text: 'When I see an unowned problem or broken process, I step up and fix it without waiting for permission.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'High Personal Standards', text: 'I set much higher standards of rigor and output for myself than any manager could ever impose on me.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Disdain for Micromanagement', text: 'Micromanagement suffocates my creativity, enthusiasm, and productivity faster than anything else.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Self-Directed Learning', text: 'I proactively teach myself complex new paradigms, languages, and math without needing formal courses.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Resourcefulness', text: 'When missing tools or budget, I find resourceful ways to build what we need using available primitives.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Relentless Work Ethic', text: 'When working on a mission I believe in, I bring boundless energy, stamina, and commitment.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Ownership of Environment', text: 'I craft my physical and digital workspace with extreme intentionality for maximum ergonomics and focus.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Integrity in Isolation', text: 'I write just as rigorous, well-tested code when working alone as when an architect is watching.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Courage of Conviction', text: 'I am willing to pursue unconventional technical paths even when peers express skepticism.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Accountability for Outcomes', text: 'I evaluate my value by tangible business and technical outcomes, not by hours logged at a desk.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Continuous Self-Improvement', text: 'I regularly critique my own performance and actively work to eliminate my cognitive and technical bottlenecks.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Independent Problem Discovery', text: 'I can drop into a messy legacy codebase and identify the top 3 architectural bottlenecks within 24 hours.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Self-Starter', text: 'I do not wait around when blocked; I find productive secondary tasks or unblock myself immediately.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Pride in Craftsmanship', text: 'I treat software engineering as a serious professional craft comparable to architecture or surgery.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Autonomous Prioritization', text: 'I can organize my own quarterly goals, align them with company strategy, and execute without supervision.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Zero Tolerance for Slacking', text: 'I cannot stand coasting or putting in half-hearted effort on meaningful engineering endeavors.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Long-Horizon Dedication', text: 'I am willing to grind through difficult, unglamorous infrastructural work to achieve long-term breakthroughs.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Regulation', text: 'I maintain discipline around sleep, nutrition, and mental health to keep my cognitive edge sharp.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Direct Responsibility', text: 'I prefer holding sole accountability for a critical module over sharing nebulous responsibility in a committee.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Fearless Exploration', text: 'I am not intimidated by massive codebases with millions of lines of code; I dive in and master them.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Refusal of Mediocrity', text: 'I refuse to sign my name to mediocre, buggy, or poorly architected software.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Decisive Independence', text: 'I trust my own technical judgment to make critical calls when authoritative guidance is absent.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Uncompromising Focus', text: 'When immersed in solving an intricate technical challenge, I can block out all external distractions.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Self-Correction on Blind Spots', text: 'I actively ask trusted peers to point out my blind spots so I can improve my leadership.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Joy in Tough Problems', text: 'I genuinely enjoy wrestling with hard, complex technical challenges that stump most engineers.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Zero Entitlement', text: 'I believe respect, influence, and authority in engineering must be earned continuously through demonstrated competence.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Disciplined Execution', text: 'I show up every single day with consistent discipline, regardless of whether I feel inspired.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Freedom over Conformity', text: 'I prioritize having intellectual autonomy over climbing corporate ladder hierarchies.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Rigorous Verification', text: 'I never mark a task complete until I have personally verified it in an end-to-end production-like environment.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Proactive Architecture', text: 'I anticipate scalability and security bottlenecks 6 months in advance and lay the groundwork quietly.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Extreme Agency', text: 'I believe that with sufficient determination, intellect, and first-principles thinking, almost any technical problem is solvable.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Respect for Time', text: 'I treat my time and my teammates’ time as the scarcest, most non-renewable asset in the universe.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Self-Driven Excellence', text: 'Even when working on internal tools that only 2 people will use, I strive for rock-solid reliability and speed.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Courage to Walk Away', text: 'I have the courage to walk away from projects or companies that demand compromising my ethical or technical integrity.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Tenacity in Hard Bug Hunts', text: 'I will not abandon an elusive, critical bug until I have completely decoded its root cause.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Mastery of Fundamentals', text: 'I invest continuous effort into reviewing computing fundamentals (algorithms, networking, operating systems).', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Autonomous Vision', text: 'I have a clear, compelling vision of what great technical systems should look like and work towards it daily.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Humility and Grit', text: 'I am not above doing the dirty work: writing migration scripts, fixing flaky tests, or updating documentation.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Internal Locus of Control', text: 'I believe my success or failure is dictated by my decisions, skill, and effort, not by external fate.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'High Output under Freedom', text: 'When given 100% freedom and high trust, my engineering output and innovation increases dramatically.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Unshakable Professionalism', text: 'I uphold the highest standards of professional execution in every pull request, meeting, and deployment.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Hunger for Meaningful Impact', text: 'I want to build software that fundamentally improves human agency, efficiency, and intelligence.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Lifelong Apprenticeship', text: 'I consider myself a perpetual apprentice to the craft of computer science, forever learning and honing my skills.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Total Dedication to Truth', text: 'At the end of the day, reality and the machine do not care about opinions—only working code speaks the truth.', reversed: false, parameter: 'first_principles_ratio' },
  ],
};

/**
 * Build and export the full array of 500 questions with deterministic IDs and indices.
 */
export const LIKERT_500_QUESTIONS: LikertQuestion[] = (() => {
  const all: LikertQuestion[] = [];
  let index = 1;

  const domains: LikertDomain[] = [
    'engineering_philosophy',
    'decision_and_tradeoffs',
    'problem_solving_heuristics',
    'risk_and_uncertainty',
    'epistemic_updating',
    'interpersonal_and_candor',
    'curiosity_and_depth',
    'stress_and_resilience',
    'execution_and_velocity',
    'autonomy_and_work_ethic',
  ];

  for (const domain of domains) {
    const list = rawDomainQuestions[domain] || [];
    for (const q of list) {
      all.push({
        id: `q_${index.toString().padStart(3, '0')}`,
        index,
        domain,
        subdomain: q.subdomain,
        text: q.text,
        reversed: q.reversed,
        mapped_parameter: q.parameter,
        weight: q.weight || 1.0,
      });
      index++;
    }
  }

  return all;
})();

/**
 * Personality Parameter Definitions (20 Core Behavioral Dimensions)
 */
export const PARAMETER_METADATA: Record<PersonalityParameterKey, {
  label: string;
  category: string;
  description: string;
  low_pole: string;
  high_pole: string;
  default_baseline: number; // 0 to 100
}> = {
  velocity_bias: {
    label: 'Velocity & Shipping Bias',
    category: 'Execution & Strategy',
    description: 'Propensity to ship quickly, cut scope, and learn via production feedback vs. formal planning.',
    low_pole: 'Deliberate & Methodical',
    high_pole: 'Aggressive Shipping Bias',
    default_baseline: 82,
  },
  formalism_weight: {
    label: 'Formal Rigor & Invariants',
    category: 'Engineering Architecture',
    description: 'Weight placed on static typing, exhaustive RFCs, formal specs, and contract invariants.',
    low_pole: 'Flexible & Heuristic',
    high_pole: 'Mathematically Formal',
    default_baseline: 68,
  },
  risk_tolerance: {
    label: 'Risk & Ambiguity Appetite',
    category: 'Decision & Risk',
    description: 'Comfort operating in unmapped territory, taking asymmetric bets, and embracing volatility.',
    low_pole: 'Conservative / Defensive',
    high_pole: 'Bold Experimentalist',
    default_baseline: 78,
  },
  reversibility_sensitivity: {
    label: 'Reversibility (Type 1 vs 2) Calibration',
    category: 'Decision & Risk',
    description: 'Strict awareness of irreversible vs reversible doors; slowing down only on irreversible mutations.',
    low_pole: 'Uniform Pace',
    high_pole: 'Hyper-Calibrated on Reversibility',
    default_baseline: 90,
  },
  candor_directness: {
    label: 'Radical Candor & Directness',
    category: 'Interpersonal & Communication',
    description: 'Commitment to unvarnished, direct truth-telling and high-intensity intellectual debate.',
    low_pole: 'Diplomatic / Buffered',
    high_pole: 'Radically Candid & Direct',
    default_baseline: 86,
  },
  epistemic_plasticity: {
    label: 'Epistemic Plasticity (Bayesian Updating)',
    category: 'Cognition & Learning',
    description: 'Speed of updating mental models when presented with valid empirical counter-evidence.',
    low_pole: 'Dogmatic / Conservative',
    high_pole: 'Rapid Bayesian Updater',
    default_baseline: 92,
  },
  abstraction_tolerance: {
    label: 'Simplicity vs Abstraction Preference',
    category: 'Engineering Architecture',
    description: 'Tolerance for generic layers vs bias toward straightforward, concrete modular primitives.',
    low_pole: 'High Concrete Simplicity',
    high_pole: 'High Abstract Layering',
    default_baseline: 38, // Favors concrete simplicity
  },
  technical_debt_tolerance: {
    label: 'Technical Debt Pragmatism',
    category: 'Engineering Architecture',
    description: 'Willingness to incur tactical technical debt for rapid validation vs zero-debt purism.',
    low_pole: 'Zero Debt Purism',
    high_pole: 'Pragmatic Tactical Debt',
    default_baseline: 74,
  },
  autonomy_preference: {
    label: 'Extreme Autonomy & Self-Direction',
    category: 'Work Ethic & Agency',
    description: 'Preference for self-directed goals, extreme agency, and zero micromanagement.',
    low_pole: 'Guided / Supervised',
    high_pole: 'Extreme Self-Direction',
    default_baseline: 95,
  },
  stress_neutrality: {
    label: 'Stress Equanimity & Incident Composure',
    category: 'Resilience & Crisis',
    description: 'Physiological and emotional calm during active production crises and high-stakes crunch.',
    low_pole: 'Reactive / High Alert',
    high_pole: 'Stoic Equanimity',
    default_baseline: 88,
  },
  first_principles_ratio: {
    label: 'First-Principles Deconstruction',
    category: 'Cognition & Learning',
    description: 'Tendency to reason from fundamental physical/computational limits rather than analogy.',
    low_pole: 'Analogy & Best Practices',
    high_pole: 'Strict First-Principles',
    default_baseline: 94,
  },
  pragmatic_empiricism: {
    label: 'Empirical Telemetry Focus',
    category: 'Problem Solving & Verification',
    description: 'Relying on hard production telemetry, flame graphs, and benchmarks over theoretical dogma.',
    low_pole: 'Theoretical Dogma',
    high_pole: 'Radical Empiricism',
    default_baseline: 91,
  },
  craft_perfectionism: {
    label: 'Invisible Craft & Quality Standards',
    category: 'Work Ethic & Agency',
    description: 'Obsession with internal code hygiene, zero flakiness, and high craftsmanship standards.',
    low_pole: 'Good Enough / Functional',
    high_pole: 'Master Craftsmanship',
    default_baseline: 85,
  },
  delegation_willingness: {
    label: 'Empowering Delegation Posture',
    category: 'Interpersonal & Communication',
    description: 'Delegating full decision authority and using Socratic coaching rather than micromanagement.',
    low_pole: 'Hands-on Direct Control',
    high_pole: 'High Autonomy Delegation',
    default_baseline: 80,
  },
  rabbit_hole_curiosity: {
    label: 'Deep Rabbit-Hole Inquisitiveness',
    category: 'Cognition & Learning',
    description: 'Unquenchable curiosity to disassemble systems to the metal and explore frontier tools.',
    low_pole: 'Targeted Need-to-Know',
    high_pole: 'Boundary-Pushing Polymath',
    default_baseline: 96,
  },
  hype_skepticism: {
    label: 'Hype Skepticism & Trend Immunity',
    category: 'Decision & Risk',
    description: 'Immunity to industry buzzwords, shiny object syndrome, and unproven cargo-cult trends.',
    low_pole: 'Early Trend Adopter',
    high_pole: 'Hardened Skeptic',
    default_baseline: 89,
  },
  crisis_decisiveness: {
    label: 'Crisis Triage Decisiveness',
    category: 'Resilience & Crisis',
    description: 'Ability to make rapid, high-stakes triage calls with incomplete information during emergencies.',
    low_pole: 'Cautious Consultation',
    high_pole: 'Decisive Commander',
    default_baseline: 87,
  },
  consensus_orientation: {
    label: 'Disagree & Commit (Low Consensus Need)',
    category: 'Interpersonal & Communication',
    description: 'Willingness to bypass 100% consensus to avoid watered-down compromises while committing fully once decided.',
    low_pole: 'Strict Consensus Seeking',
    high_pole: 'Disagree & Commit Bias',
    default_baseline: 84,
  },
  failure_transparency: {
    label: 'Failure Transparency & Egoless Reflection',
    category: 'Resilience & Crisis',
    description: 'Willingness to own mistakes publicly, write blameless postmortems, and eliminate ego.',
    low_pole: 'Defensive / Protective',
    high_pole: 'Radical Egoless Transparency',
    default_baseline: 93,
  },
  scope_ruthlessness: {
    label: 'Ruthless Scope Simplification',
    category: 'Execution & Strategy',
    description: 'Instinct to delete unnecessary code, cut auxiliary features, and reject scope creep.',
    low_pole: 'Feature Expansive',
    high_pole: 'Ruthless Scope Cutter',
    default_baseline: 92,
  },
};

/**
 * Mathematical Scoring Engine
 * Computes normalized (0-100) parameters from 500 Likert responses (1 to 5 scale).
 */
export function computeParametersFromLikert(
  responses: Record<string, number>
): {
  parameters: PersonalityParameter[];
  domainScores: Record<LikertDomain, number>;
  completionStats: {
    answeredCount: number;
    totalCount: number;
    completionPercentage: number;
  };
} {
  const answeredCount = Object.keys(responses).length;
  const totalCount = LIKERT_500_QUESTIONS.length;
  const completionPercentage = Math.round((answeredCount / totalCount) * 100);

  // Group questions by parameter
  const paramAccumulators: Record<PersonalityParameterKey, { totalScore: number; maxScore: number; count: number }> = {
    velocity_bias: { totalScore: 0, maxScore: 0, count: 0 },
    formalism_weight: { totalScore: 0, maxScore: 0, count: 0 },
    risk_tolerance: { totalScore: 0, maxScore: 0, count: 0 },
    reversibility_sensitivity: { totalScore: 0, maxScore: 0, count: 0 },
    candor_directness: { totalScore: 0, maxScore: 0, count: 0 },
    epistemic_plasticity: { totalScore: 0, maxScore: 0, count: 0 },
    abstraction_tolerance: { totalScore: 0, maxScore: 0, count: 0 },
    technical_debt_tolerance: { totalScore: 0, maxScore: 0, count: 0 },
    autonomy_preference: { totalScore: 0, maxScore: 0, count: 0 },
    stress_neutrality: { totalScore: 0, maxScore: 0, count: 0 },
    first_principles_ratio: { totalScore: 0, maxScore: 0, count: 0 },
    pragmatic_empiricism: { totalScore: 0, maxScore: 0, count: 0 },
    craft_perfectionism: { totalScore: 0, maxScore: 0, count: 0 },
    delegation_willingness: { totalScore: 0, maxScore: 0, count: 0 },
    rabbit_hole_curiosity: { totalScore: 0, maxScore: 0, count: 0 },
    hype_skepticism: { totalScore: 0, maxScore: 0, count: 0 },
    crisis_decisiveness: { totalScore: 0, maxScore: 0, count: 0 },
    consensus_orientation: { totalScore: 0, maxScore: 0, count: 0 },
    failure_transparency: { totalScore: 0, maxScore: 0, count: 0 },
    scope_ruthlessness: { totalScore: 0, maxScore: 0, count: 0 },
  };

  const domainAccumulators: Record<LikertDomain, { total: number; count: number }> = {
    engineering_philosophy: { total: 0, count: 0 },
    decision_and_tradeoffs: { total: 0, count: 0 },
    problem_solving_heuristics: { total: 0, count: 0 },
    risk_and_uncertainty: { total: 0, count: 0 },
    epistemic_updating: { total: 0, count: 0 },
    interpersonal_and_candor: { total: 0, count: 0 },
    curiosity_and_depth: { total: 0, count: 0 },
    stress_and_resilience: { total: 0, count: 0 },
    execution_and_velocity: { total: 0, count: 0 },
    autonomy_and_work_ethic: { total: 0, count: 0 },
  };

  for (const q of LIKERT_500_QUESTIONS) {
    const rawVal = responses[q.id];
    // If not answered yet, use the parameter's default baseline converted to 1..5 scale (3 is neutral)
    const effectiveVal = rawVal !== undefined 
      ? rawVal 
      : (PARAMETER_METADATA[q.mapped_parameter]?.default_baseline ? 1 + (PARAMETER_METADATA[q.mapped_parameter].default_baseline / 100) * 4 : 3);

    // If reversed: 5 -> 1, 4 -> 2, 3 -> 3, 2 -> 4, 1 -> 5
    const adjustedVal = q.reversed ? (6 - effectiveVal) : effectiveVal;

    // Accumulate to parameter (scale: 1..5 -> 0..4)
    const pAcc = paramAccumulators[q.mapped_parameter];
    if (pAcc) {
      pAcc.totalScore += (adjustedVal - 1) * q.weight;
      pAcc.maxScore += 4 * q.weight;
      pAcc.count += 1;
    }

    // Accumulate to domain
    const dAcc = domainAccumulators[q.domain];
    if (dAcc) {
      dAcc.total += ((adjustedVal - 1) / 4) * 100;
      dAcc.count += 1;
    }
  }

  const parameters: PersonalityParameter[] = (Object.keys(PARAMETRIC_KEYS) as PersonalityParameterKey[]).map(key => {
    const meta = PARAMETER_METADATA[key];
    const acc = paramAccumulators[key];
    const computedVal = acc.maxScore > 0 ? Math.round((acc.totalScore / acc.maxScore) * 100) : meta.default_baseline;
    
    return {
      key,
      label: meta.label,
      category: meta.category,
      value: computedVal,
      normalized: computedVal / 100,
      description: meta.description,
      low_pole: meta.low_pole,
      high_pole: meta.high_pole,
      weight: 1.0,
      question_count: acc.count,
    };
  });

  const domainScores: Record<LikertDomain, number> = {} as any;
  for (const d of Object.keys(domainAccumulators) as LikertDomain[]) {
    const acc = domainAccumulators[d];
    domainScores[d] = acc.count > 0 ? Math.round(acc.total / acc.count) : 75;
  }

  return {
    parameters,
    domainScores,
    completionStats: {
      answeredCount,
      totalCount,
      completionPercentage,
    },
  };
}

const PARAMETRIC_KEYS: Record<PersonalityParameterKey, boolean> = {
  velocity_bias: true,
  formalism_weight: true,
  risk_tolerance: true,
  reversibility_sensitivity: true,
  candor_directness: true,
  epistemic_plasticity: true,
  abstraction_tolerance: true,
  technical_debt_tolerance: true,
  autonomy_preference: true,
  stress_neutrality: true,
  first_principles_ratio: true,
  pragmatic_empiricism: true,
  craft_perfectionism: true,
  delegation_willingness: true,
  rabbit_hole_curiosity: true,
  hype_skepticism: true,
  crisis_decisiveness: true,
  consensus_orientation: true,
  failure_transparency: true,
  scope_ruthlessness: true,
};

/**
 * Persona Preset Generator
 * Allows instant 500-question population based on cognitive archetypes.
 */
export function generatePresetLikertResponses(archetype: 'sambit_exact' | 'pragmatic_hacker' | 'rigorous_architect' | 'startup_founder' | 'academic_purist'): Record<string, number> {
  const result: Record<string, number> = {};

  for (const q of LIKERT_500_QUESTIONS) {
    let score = 3; // Neutral default

    if (archetype === 'sambit_exact') {
      // Sambit's true cognitive profile: High velocity, strict reversibility awareness, first-principles, high candor, extreme autonomy, low abstraction tolerance
      const key = q.mapped_parameter;
      if (['velocity_bias', 'first_principles_ratio', 'autonomy_preference', 'rabbit_hole_curiosity', 'candor_directness', 'scope_ruthlessness', 'reversibility_sensitivity'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else if (['epistemic_plasticity', 'pragmatic_empiricism', 'stress_neutrality', 'failure_transparency'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else if (key === 'abstraction_tolerance') {
        score = q.reversed ? 5 : 2; // Prefers concrete simplicity
      } else if (key === 'formalism_weight') {
        score = q.reversed ? 2 : 4; // High on typing/contracts, low on bureaucracy
      } else {
        score = q.reversed ? 2 : 4;
      }
    } else if (archetype === 'pragmatic_hacker') {
      const key = q.mapped_parameter;
      if (['velocity_bias', 'technical_debt_tolerance', 'scope_ruthlessness'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else if (['formalism_weight'].includes(key)) {
        score = q.reversed ? 5 : 2;
      } else {
        score = q.reversed ? 2 : 4;
      }
    } else if (archetype === 'rigorous_architect') {
      const key = q.mapped_parameter;
      if (['formalism_weight', 'craft_perfectionism', 'abstraction_tolerance'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else if (['technical_debt_tolerance', 'velocity_bias'].includes(key)) {
        score = q.reversed ? 5 : 2;
      } else {
        score = q.reversed ? 2 : 4;
      }
    } else if (archetype === 'startup_founder') {
      const key = q.mapped_parameter;
      if (['velocity_bias', 'risk_tolerance', 'crisis_decisiveness', 'scope_ruthlessness'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else {
        score = q.reversed ? 2 : 4;
      }
    } else if (archetype === 'academic_purist') {
      const key = q.mapped_parameter;
      if (['first_principles_ratio', 'rabbit_hole_curiosity', 'formalism_weight'].includes(key)) {
        score = q.reversed ? 1 : 5;
      } else if (['velocity_bias', 'technical_debt_tolerance'].includes(key)) {
        score = q.reversed ? 5 : 1;
      } else {
        score = q.reversed ? 2 : 4;
      }
    }

    result[q.id] = score;
  }

  return result;
}
