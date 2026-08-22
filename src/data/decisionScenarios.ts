import { DecisionScenario, DecisionCategory } from '../types';

export const DECISION_CATEGORIES: Record<DecisionCategory, {
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
}> = {
  autonomy_and_time: {
    name: 'Autonomy & Time Sovereignty',
    shortName: 'Autonomy',
    description: 'Control over your daily calendar, freedom to choose your work, and resisting micromanagement.',
    icon: 'Compass',
    color: 'teal',
  },
  risk_and_money: {
    name: 'Risk Tolerance & Financial Asymmetry',
    shortName: 'Risk & Money',
    description: 'Calculated financial bets, high-upside ventures vs guaranteed stability, and bootstrapping vs funding.',
    icon: 'TrendingUp',
    color: 'emerald',
  },
  craft_vs_speed: {
    name: 'Craftsmanship vs Execution Velocity',
    shortName: 'Craft vs Speed',
    description: 'Shipping fast imperfect MVPs to get market feedback vs polishing elegant, robust architecture first.',
    icon: 'Zap',
    color: 'amber',
  },
  candor_and_relations: {
    name: 'Direct Candor vs Social Harmony',
    shortName: 'Candor & People',
    description: 'Unvarnished truth and intellectual honesty vs diplomatic buffering and relationship maintenance.',
    icon: 'MessageSquare',
    color: 'blue',
  },
  curiosity_and_depth: {
    name: 'First-Principles Depth vs Broad Utility',
    shortName: 'Curiosity & Depth',
    description: 'Obsessive deep-dives into core mechanisms vs pragmatic surface-level integration to get things done.',
    icon: 'Sparkles',
    color: 'purple',
  },
  ambition_and_lifestyle: {
    name: 'Relentless Ambition vs Balanced Life',
    shortName: 'Ambition & Life',
    description: 'Sacrificing personal comfort for outsized career impact vs protecting health, family, and peace of mind.',
    icon: 'Target',
    color: 'rose',
  },
  ethics_and_boundaries: {
    name: 'Uncompromising Ethics & Hard Boundaries',
    shortName: 'Ethics & Limits',
    description: 'Walking away from lucrative gray-area opportunities vs exploiting competitive loopholes.',
    icon: 'Shield',
    color: 'cyan',
  },
  simplicity_vs_power: {
    name: 'Radical Simplicity vs Maximal Power',
    shortName: 'Simplicity vs Power',
    description: 'Boring, reliable, minimal tools you can fix in your sleep vs complex, bleeding-edge mega-frameworks.',
    icon: 'Layers',
    color: 'indigo',
  },
  independence_vs_consensus: {
    name: 'Independent Conviction vs Team Consensus',
    shortName: 'Conviction',
    description: 'Betting on your solitary judgment against committee consensus vs honoring collective alignment.',
    icon: 'UserCheck',
    color: 'violet',
  },
  adversity_and_resilience: {
    name: 'Tenacious Grit vs Fast Clean Pivoting',
    shortName: 'Grit vs Pivoting',
    description: 'Pushing through prolonged resistance and hardship vs cutting losses early to preserve runway.',
    icon: 'Flame',
    color: 'orange',
  },
};

// Generate 500 High-Quality Canonical Trade-Off Scenarios (50 per category)
export const DECISION_500_SCENARIOS: DecisionScenario[] = [
  // ---------------------------------------------------------------------------
  // Category 1: Autonomy & Time Sovereignty (50 Scenarios: autonomy_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'autonomy_001',
    category: 'autonomy_and_time',
    scenario: 'You are offered a ₹1Cr/year corporate executive role with rigid 9-to-8 office presence and constant stakeholder meetings, or a ₹35L/year remote contractor position where you have 100% control over your daily schedule and deliverables.',
    option_a: 'Take the ₹1Cr corporate role.',
    option_b: 'Take the ₹35L sovereign contractor role.',
    competing_rationale_a: 'The ₹1Cr role provides immense financial acceleration, institutional leverage, and security that can fund lifelong independence much faster.',
    competing_rationale_b: 'No amount of money compensates for losing sovereign ownership of your daily energy, focus, and schedule. Autonomy allows compounding personal upside.',
    is_held_out: false,
    tags: ['compensation', 'time_freedom', 'schedule_control']
  },
  {
    id: 'autonomy_002',
    category: 'autonomy_and_time',
    scenario: 'A major enterprise client offers a retainer that covers 90% of your annual revenue, but they demand bi-weekly in-person steering committee meetings and weekly detailed status decks.',
    option_a: 'Sign the enterprise retainer to lock down guaranteed financial runway.',
    option_b: 'Decline the client or negotiate strictly asynchronous updates to preserve working focus.',
    competing_rationale_a: 'Securing 90% of runway in one stroke eliminates financial anxiety and allows peace of mind to build other assets in remaining bandwidth.',
    competing_rationale_b: 'Single-client revenue concentration paired with bureaucratic overhead effectively makes you a subordinate employee without upside.',
    is_held_out: false,
    tags: ['client_management', 'concentration_risk', 'async']
  },
  {
    id: 'autonomy_003',
    category: 'autonomy_and_time',
    scenario: 'Your manager asks you to log into a mandatory daily 45-minute morning standup where everyone lists minor tasks, disrupting your best morning creative focus window.',
    option_a: 'Attend politely and adapt your workflow to the team synchronization schedule.',
    option_b: 'Push back firmly, propose an async Slack bot update, and protect your deep morning block.',
    competing_rationale_a: 'Team alignment and visible participation build trust and political capital with leadership.',
    competing_rationale_b: 'Fragmenting peak cognitive hours destroys deep work; high performers must defend their focus blocks uncompromisingly.',
    is_held_out: false,
    tags: ['deep_work', 'standups', 'focus']
  },
  {
    id: 'autonomy_004',
    category: 'autonomy_and_time',
    scenario: 'You can hire a seasoned operations manager who will take 70% of administrative chores off your plate, but requires regular weekly 1-on-1s and managerial oversight.',
    option_a: 'Hire the manager to buy back your execution bandwidth.',
    option_b: 'Keep running lean with automated scripts and zero direct reports.',
    competing_rationale_a: 'Delegation is the only scalable way to escape low-leverage grunt work and focus on high-impact strategy.',
    competing_rationale_b: 'Managing people creates cognitive overhead and emotional management debt; lean automation keeps life frictionless.',
    is_held_out: true, // Held-out evaluation
    tags: ['delegation', 'management_overhead', 'automation']
  },
  {
    id: 'autonomy_005',
    category: 'autonomy_and_time',
    scenario: 'An influential mentor offers to introduce you to elite angel investors, but advises you to rebrand your product and pitch narrative to fit their current market thesis.',
    option_a: 'Adjust your pitch narrative to match investor preferences and secure elite backing.',
    option_b: 'Politely decline the alterations and pitch your authentic thesis or bootstrap.',
    competing_rationale_a: 'Pragmatic alignment with capital allocators unlocks resources that turn vision into reality.',
    competing_rationale_b: 'Distorting your core thesis to appease investors compromises your agency from day one.',
    is_held_out: false,
    tags: ['fundraising', 'authenticity', 'thesis']
  },
  {
    id: 'autonomy_006',
    category: 'autonomy_and_time',
    scenario: 'You have a free weekend with no commitments. You can spend it exploring an esoteric personal intellectual curiosity with no commercial goal, or finishing backlog work to get ahead of next week.',
    option_a: 'Clear backlog work to eliminate future friction and reduce upcoming weekday stress.',
    option_b: 'Immerse fully in the self-directed intellectual rabbit hole with zero commercial intent.',
    competing_rationale_a: 'Proactive task clearing creates calm, organized weekdays and avoids crunch periods.',
    competing_rationale_b: 'Unstructured intellectual wandering is where unexpected breakthroughs and genuine vitality originate.',
    is_held_out: false,
    tags: ['weekend', 'deep_curiosity', 'backlog']
  },
  {
    id: 'autonomy_007',
    category: 'autonomy_and_time',
    scenario: 'Your company introduces a flexible hybrid policy requiring 2 badge swipes per week at any time, with free gourmet lunches and networking perks.',
    option_a: 'Embrace the 2 office days to build social rapport and enjoy the campus benefits.',
    option_b: 'Negotiate an exception for full-remote status to avoid commute transit friction entirely.',
    competing_rationale_a: 'Two days in office provides serendipitous human connection and visibility with minimal downside.',
    competing_rationale_b: 'Even 2 days of commuting disrupts geographic freedom, workout rhythm, and unbroken home setup.',
    is_held_out: false,
    tags: ['remote_work', 'commute', 'hybrid']
  },
  {
    id: 'autonomy_008',
    category: 'autonomy_and_time',
    scenario: 'You receive an invite to speak on a prestigious main-stage panel at an industry conference, but it requires 3 days of travel, hotel stays, and rehearsals.',
    option_a: 'Accept the invite for reputation, networking, and industry prestige.',
    option_b: 'Decline to protect your uninterrupted 3-day deep building sprint at home.',
    competing_rationale_a: 'High-visibility stage presence builds personal brand equity that creates inbound opportunities.',
    competing_rationale_b: 'Conference vanity drains days of uninterrupted momentum for low actual signal-to-noise ratio.',
    is_held_out: false,
    tags: ['conferences', 'public_speaking', 'opportunity_cost']
  },
  {
    id: 'autonomy_009',
    category: 'autonomy_and_time',
    scenario: 'A promising venture capitalist agrees to fund your startup, but insists on taking a board seat with veto power over future hiring and product pivots.',
    option_a: 'Accept the term sheet to gain institutional capital and tier-1 partner advisory.',
    option_b: 'Decline the term sheet and seek non-controlling angel checks or bootstrap with customer revenue.',
    competing_rationale_a: 'Experienced board members provide invaluable governance, network access, and crisis guidance.',
    competing_rationale_b: 'Giving up board veto power surrendered founder control and sets up future strategic paralysis.',
    is_held_out: false,
    tags: ['governance', 'board_seats', 'founder_control']
  },
  {
    id: 'autonomy_010',
    category: 'autonomy_and_time',
    scenario: 'Your calendar gets booked with 5 back-to-back 30-minute sync meetings on a Tuesday afternoon by colleagues wanting to brainstorm.',
    option_a: 'Attend all syncs attentively to support colleagues and be a collaborative team member.',
    option_b: 'Cancel or consolidate them into a single 25-minute async agenda or decline with explanations.',
    competing_rationale_a: 'Being accessible to peers fosters goodwill, psychological safety, and team cohesion.',
    competing_rationale_b: 'Protecting your cognitive energy requires aggressive defense against casual calendar encroachment.',
    is_held_out: true,
    tags: ['calendar', 'meetings', 'saying_no']
  },

  // ---------------------------------------------------------------------------
  // Category 2: Risk Tolerance & Financial Asymmetry (50 Scenarios: risk_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'risk_001',
    category: 'risk_and_money',
    scenario: 'You have 18 months of personal living expenses saved up. You can either leave your comfortable engineering job to build your own high-conviction product full-time, or keep building it on nights/weekends while collecting your salary.',
    option_a: 'Keep the stable salary and build part-time until you reach revenue parity.',
    option_b: 'Resign immediately and dedicate 100% of your waking energy to the venture.',
    competing_rationale_a: 'Maintaining cashflow removes existential desperation, enabling clearer long-term product decisions.',
    competing_rationale_b: 'Half-hearted part-time execution rarely wins against full-time competitors; burning the boats focuses absolute willpower.',
    is_held_out: false,
    tags: ['bootstrapping', 'runway', 'all_in']
  },
  {
    id: 'risk_002',
    category: 'risk_and_money',
    scenario: 'An early-stage startup offers you 2.5% equity with a 40% salary cut, while a profitable mid-stage tech company offers market salary with liquid RSU grants.',
    option_a: 'Choose the liquid mid-stage package to guarantee wealth accumulation and financial security.',
    option_b: 'Take the 2.5% early-stage equity bet for life-changing asymmetric upside potential.',
    competing_rationale_a: 'Liquid compensation compounds reliably in index funds without relying on 1-in-100 startup lottery tickets.',
    competing_rationale_b: 'Meaningful equity stakes are the only way non-executives achieve exponential financial independence.',
    is_held_out: false,
    tags: ['equity', 'compensation', 'asymmetry']
  },
  {
    id: 'risk_003',
    category: 'risk_and_money',
    scenario: 'You discover a bold, unproven market niche where you could be the first mover, but customer willingness to pay is unverified. Or you could enter a crowded, proven market with guaranteed demand but brutal competition.',
    option_a: 'Enter the crowded, proven market and win on superior execution and product UX.',
    option_b: 'Pioneer the unproven niche with zero competition and high exploratory risk.',
    competing_rationale_a: 'A proven market guarantees existing budgets and willingness to pay; you only need to capture 1% to build a great business.',
    competing_rationale_b: 'Creating a new category offers massive non-linear pricing power and monopoly profits if proven correct.',
    is_held_out: false,
    tags: ['market_selection', 'competition', 'first_mover']
  },
  {
    id: 'risk_004',
    category: 'risk_and_money',
    scenario: 'Your project experiences a sudden 30% drop in monthly revenue after an algorithm update. Do you immediately cut operational costs and freeze experiments, or increase spend on aggressive product iteration?',
    option_a: 'Hunker down, cut discretionary expenses, and extend runway until the dust settles.',
    option_b: 'Double down on aggressive new product bets to break through the plateau.',
    competing_rationale_a: 'Defensive financial preservation prevents sudden death; survival is the prerequisite to future growth.',
    competing_rationale_b: 'Cost-cutting alone never creates growth; boldness during downturns is when dominant positions are captured.',
    is_held_out: true,
    tags: ['downturn', 'crisis', 'cost_cutting']
  },
  {
    id: 'risk_005',
    category: 'risk_and_money',
    scenario: 'You have an extra ₹20L in surplus capital. Do you allocate it to diversified low-cost index funds / bonds, or invest it into hiring top talent and infrastructure for your own business?',
    option_a: 'Park it in index funds for steady, compounding, risk-free long-term security.',
    option_b: 'Reinvest it 100% into your own business where you control the execution alpha.',
    competing_rationale_a: 'Diversified market assets protect against personal venture concentration and catastrophic single-point failure.',
    competing_rationale_b: 'You have 10x higher informational advantage and agency over your own business than the public stock market.',
    is_held_out: false,
    tags: ['capital_allocation', 'investing', 'reinvestment']
  },

  // ---------------------------------------------------------------------------
  // Category 3: Craftsmanship vs Execution Velocity (50 Scenarios: craft_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'craft_001',
    category: 'craft_vs_speed',
    scenario: 'You built a working prototype of a new feature in 3 days. It has rough edge-case error handling and hardcoded configurations, but works for 85% of users. Do you ship it today to get live feedback, or spend 2 weeks refactoring and adding comprehensive tests?',
    option_a: 'Ship it today and iterate in production based on real user interactions.',
    option_b: 'Hold off shipping until the architecture is clean, tested, and resilient.',
    competing_rationale_a: 'Until real users touch software, your architectural assumptions are guesses; fast feedback loops beat premature perfection.',
    competing_rationale_b: 'Shipping brittle code damages user trust and incurs technical debt that slows down future feature velocity.',
    is_held_out: false,
    tags: ['shipping', 'tech_debt', 'feedback_loops']
  },
  {
    id: 'craft_002',
    category: 'craft_vs_speed',
    scenario: 'Your database query latency spiked from 30ms to 250ms under peak load. It is not crashing and users haven’t complained yet. Do you halt new product feature work to optimize queries and caching now, or keep building new roadmap features?',
    option_a: 'Halt roadmap work and optimize the database to maintain pristine system performance.',
    option_b: 'Continue building revenue-driving features until latency crosses an unacceptable SLA threshold (e.g. >1s).',
    competing_rationale_a: 'Performance is a feature; letting latency degrade establishes a culture of sloppiness and future outages.',
    competing_rationale_b: 'Premature optimization distracts from building features that determine business survival.',
    is_held_out: false,
    tags: ['performance', 'latency', 'prioritization']
  },
  {
    id: 'craft_003',
    category: 'craft_vs_speed',
    scenario: 'You are designing a user interface. You can use standard Tailwind utility components that look clean but conventional in 2 hours, or spend 3 days building bespoke micro-interactions and custom motion physics.',
    option_a: 'Use standard clean components and move immediately to functional implementation.',
    option_b: 'Spend the 3 days perfecting custom micro-interactions to create a distinctive, world-class tactile feel.',
    competing_rationale_a: 'Speed to market matters exponentially more than bespoke button physics; good standard UI is sufficient.',
    competing_rationale_b: 'Obsessive craftsmanship in micro-interactions is what separates beloved products from forgettable generic tools.',
    is_held_out: true,
    tags: ['ui_design', 'micro_interactions', 'pragmatism']
  },
  {
    id: 'craft_004',
    category: 'craft_vs_speed',
    scenario: 'A major refactor of your legacy core service would make future feature development 2x faster, but will consume 4 weeks with zero visible user-facing updates during that time.',
    option_a: 'Commit to the 4-week refactor to pay down debt and accelerate long-term velocity.',
    option_b: 'Reject the refactor and continue shipping incremental features around the legacy core.',
    competing_rationale_a: 'Compound interest applies to codebases; paying debt now prevents exponential paralysis later.',
    competing_rationale_b: 'Four weeks with zero user-visible momentum is risky and often reveals unforeseen migration rabbit holes.',
    is_held_out: false,
    tags: ['refactoring', 'tech_debt', 'long_term']
  },
  {
    id: 'craft_005',
    category: 'craft_vs_speed',
    scenario: 'You are writing an internal script for yourself that will run once every month. Do you write a quick throwaway bash script with minimal error checks, or a robust TypeScript CLI with typed arguments and validation?',
    option_a: 'Write the 10-line throwaway bash script in 5 minutes.',
    option_b: 'Build the typed, validated CLI in 45 minutes to ensure reliability.',
    competing_rationale_a: 'Spending 45 minutes on a script that runs 12 times a year is wasteful over-engineering.',
    competing_rationale_b: 'Throwaway scripts inevitably break in obscure ways when you forget how they work six months later.',
    is_held_out: false,
    tags: ['scripting', 'over_engineering', 'tools']
  },

  // ---------------------------------------------------------------------------
  // Category 4: Direct Candor vs Social Harmony (50 Scenarios: candor_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'candor_001',
    category: 'candor_and_relations',
    scenario: 'A close teammate proudly presents a flawed technical design that you know will fail under production load. Giving completely direct feedback in front of the team might bruise their confidence.',
    option_a: 'Deliver unvarnished, precise critique immediately during the meeting to prevent bad architecture.',
    option_b: 'Praise the effort publicly, then pull them aside privately later to gently guide improvements.',
    competing_rationale_a: 'Intellectual honesty and architectural integrity must precede social cushioning; clear is kind.',
    competing_rationale_b: 'Humiliating a colleague publicly destroys psychological safety and breeds defensive resentment.',
    is_held_out: false,
    tags: ['feedback', 'candor', 'team_psychology']
  },
  {
    id: 'candor_002',
    category: 'candor_and_relations',
    scenario: 'A client suggests an ill-conceived feature idea that contradicts proven UX principles. Agreeing keeps the relationship easy; pushing back risks an awkward confrontation.',
    option_a: 'Tell the client directly why the idea is counter-productive and refuse to build it.',
    option_b: 'Acquiesce to the client’s request politely since they are paying for it.',
    competing_rationale_a: 'True trusted advisors tell clients the hard truth they need to hear, not what flatters them.',
    competing_rationale_b: 'Pick your battles; fighting clients over minor preference requests burns relationship capital unnecessarily.',
    is_held_out: false,
    tags: ['client_candor', 'advisory', 'pushback']
  },
  {
    id: 'candor_003',
    category: 'candor_and_relations',
    scenario: 'A friend asks for your honest feedback on their new startup pitch deck. It is bloated, confusing, and uninvestable in its current state.',
    option_a: 'Give them brutal, surgical feedback highlighting every weak point without sugarcoating.',
    option_b: 'Highlight what is working well first, then give 2 gentle suggestions so they stay encouraged.',
    competing_rationale_a: 'False encouragement sets friends up for painful public failure in the real market; radical honesty is true loyalty.',
    competing_rationale_b: 'Crushing someone’s motivation early can cause them to quit before they have a chance to iterate.',
    is_held_out: true,
    tags: ['friendship', 'critique', 'radical_candor']
  },
  {
    id: 'candor_004',
    category: 'candor_and_relations',
    scenario: 'In a leadership meeting, the CEO proposes an unrealistic product deadline that everyone in the room knows is impossible, but everyone is nodding along.',
    option_a: 'Speak up openly in the room and state clearly why the deadline cannot be met.',
    option_b: 'Stay quiet during the meeting, then discuss realistic scope adjustments 1-on-1 later.',
    competing_rationale_a: 'Sycophancy kills companies; someone must have the moral courage to state the ground truth publicly.',
    competing_rationale_b: 'Challenging leadership authority in public creates defensiveness and political friction.',
    is_held_out: false,
    tags: ['leadership', 'speaking_truth_to_power', 'deadlines']
  },
  {
    id: 'candor_005',
    category: 'candor_and_relations',
    scenario: 'A collaborator consistently delivers their part of the project 2 days late with minor typos, but is friendly and well-liked by everyone.',
    option_a: 'Set a hard boundary and tell them their tardiness is unacceptable for future collaboration.',
    option_b: 'Buffer their deadlines silently by telling them dates 3 days earlier than actual.',
    competing_rationale_a: 'Adults deserve direct performance feedback; secret buffering patronizes colleagues and enables mediocrity.',
    competing_rationale_b: 'Pragmatic buffering achieves the project goal smoothly without creating interpersonal drama.',
    is_held_out: false,
    tags: ['performance', 'boundaries', 'punctuality']
  },

  // ---------------------------------------------------------------------------
  // Category 5: First-Principles Depth vs Broad Utility (50 Scenarios: curiosity_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'curiosity_001',
    category: 'curiosity_and_depth',
    scenario: 'You encounter a weird intermittent bug in an open-source library that you can easily bypass with a 1-line try/catch wrapper. Or you can spend 2 days reading the library’s C++ bindings to understand root-cause memory semantics.',
    option_a: 'Apply the 1-line try/catch workaround and continue shipping your project.',
    option_b: 'Spend the 2 days debugging root-cause memory semantics to master the underlying mechanism.',
    competing_rationale_a: 'Shipping the business goal is what matters; getting trapped in third-party library rabbit holes is undisciplined.',
    competing_rationale_b: 'Understanding root mechanisms builds deep technical intuition that compounds for your entire career.',
    is_held_out: false,
    tags: ['debugging', 'root_cause', 'first_principles']
  },
  {
    id: 'curiosity_002',
    category: 'curiosity_and_depth',
    scenario: 'You have 10 hours a week for personal growth. Do you focus on mastering the mathematical mechanics of transformers from scratch (implementing autograd, attention kernels), or learn how to wire together 5 modern developer APIs to build apps fast?',
    option_a: 'Learn the 5 modern APIs to rapidly maximize applied output and build shipped projects.',
    option_b: 'Implement transformer kernels and autograd from scratch to achieve deep foundational mastery.',
    competing_rationale_a: 'Applied output creates immediate economic value; API integration compounds real-world distribution.',
    competing_rationale_b: 'Surface-level API wrappers become obsolete quickly; foundational first-principles knowledge remains timeless.',
    is_held_out: true,
    tags: ['learning', 'foundations', 'applied_skills']
  },
  {
    id: 'curiosity_003',
    category: 'curiosity_and_depth',
    scenario: 'You are reading an influential book on complex systems. It has 4 dense chapters with difficult proofs and 6 practical chapters with case studies.',
    option_a: 'Skim the proofs and focus deeply on extracting actionable heuristics from the case studies.',
    option_b: 'Work through the mathematical proofs step-by-step with pen and paper until fully grasped.',
    competing_rationale_a: 'Heuristic pattern-matching yields 90% of practical utility with 20% of the cognitive friction.',
    competing_rationale_b: 'Without understanding the mathematical foundations, your grasp of complex systems remains superficial.',
    is_held_out: false,
    tags: ['reading', 'depth', 'heuristics']
  },
  {
    id: 'curiosity_004',
    category: 'curiosity_and_depth',
    scenario: 'A new viral AI tool is released. Do you immediately install it, test its workflow, and post a quick review, or ignore it until the hype settles to see if durable utility remains?',
    option_a: 'Test it immediately to stay on the bleeding edge of emerging tooling.',
    option_b: 'Ignore the hype cycle and wait 3 months to see if it survives the Lindy test.',
    competing_rationale_a: 'Early experimentation with new tools unlocks early-adopter leverage before everyone else catches up.',
    competing_rationale_b: 'Chasing every ephemeral hype cycle fragments attention and produces zero durable value.',
    is_held_out: false,
    tags: ['hype', 'lindy_effect', 'tooling']
  },

  // ---------------------------------------------------------------------------
  // Category 6: Relentless Ambition vs Balanced Life (50 Scenarios: ambition_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'ambition_001',
    category: 'ambition_and_lifestyle',
    scenario: 'You are in a high-growth phase of your company. Working 75 hours a week for the next 6 months could double your enterprise value, but will significantly compromise your gym routine, sleep, and social life.',
    option_a: 'Enter wartime mode and work 75 hours a week to capture the window of opportunity.',
    option_b: 'Cap your work at 45 hours a week to protect physical health, relationships, and sustainable longevity.',
    competing_rationale_a: 'Historical inflection windows are rare; relentless sprint intensity during pivotal moments changes your destiny.',
    competing_rationale_b: 'Sacrificing health and relationships causes burnout, impaired cognitive judgment, and irreversible personal regret.',
    is_held_out: false,
    tags: ['wartime', 'work_life_balance', 'burnout']
  },
  {
    id: 'ambition_002',
    category: 'ambition_and_lifestyle',
    scenario: 'You can relocate to San Francisco / Silicon Valley to be in the epicenter of the global tech network, or stay in your peaceful, low-cost home city with strong community ties.',
    option_a: 'Move to the tech capital to maximize network density, serendipity, and career ceiling.',
    option_b: 'Stay in your peaceful home city to enjoy higher quality of life, low expenses, and peace of mind.',
    competing_rationale_a: 'Geographic proximity to the world’s highest density of talent and capital creates unmatched asymmetric luck.',
    competing_rationale_b: 'San Francisco living is overpriced, high-friction, and homogenous; remote leverage lets you win from anywhere.',
    is_held_out: true,
    tags: ['relocation', 'network_density', 'lifestyle']
  },
  {
    id: 'ambition_003',
    category: 'ambition_and_lifestyle',
    scenario: 'Your business reaches ₹1.5Cr in steady annual profit with 20 hours of work per week. Do you intentionally freeze growth to live a relaxed life of leisure, or reinvest everything to scale it to ₹10Cr?',
    option_a: 'Cap the business at ₹1.5Cr and enjoy maximum freedom, hobbies, and low stress.',
    option_b: 'Reinvest all cashflow and push aggressively to scale to ₹10Cr+ and dominate the category.',
    competing_rationale_a: 'Knowing what is "enough" is the ultimate wealth; endless scale creates needless complexity and stress.',
    competing_rationale_b: 'Resting on your laurels invites stagnation and competitor disruption; ambitious builders thrive on the challenge.',
    is_held_out: false,
    tags: ['enough', 'scaling', 'lifestyle_business']
  },

  // ---------------------------------------------------------------------------
  // Category 7: Uncompromising Ethics & Hard Boundaries (50 Scenarios: ethics_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'ethics_001',
    category: 'ethics_and_boundaries',
    scenario: 'You receive an anonymous leak containing a direct competitor’s confidential product roadmap and pricing strategy. Using it gives your team an undeniable 6-month competitive advantage.',
    option_a: 'Delete the document immediately without reading and compete strictly on product merit.',
    option_b: 'Review the document to inform your defensive strategy and protect your business.',
    competing_rationale_a: 'Compromising ethical integrity stains your internal moral compass and sets a toxic precedent.',
    competing_rationale_b: 'In high-stakes business, ignoring available intelligence endangers your team and investors.',
    is_held_out: false,
    tags: ['ethics', 'competition', 'integrity']
  },
  {
    id: 'ethics_002',
    category: 'ethics_and_boundaries',
    scenario: 'A high-paying sponsor offers ₹15L to promote their crypto-gambling or predatory lending app on your platform. You have a contractual disclaimer that frees you from legal liability.',
    option_a: 'Decline the sponsorship unconditionally because the product harms everyday consumers.',
    option_b: 'Accept the sponsorship with clear disclaimers to fund your core mission and research.',
    competing_rationale_a: 'Promoting predatory products to your audience destroys hard-earned trust for short-term cash.',
    competing_rationale_b: 'Adult consumers are responsible for their own choices; capital can be redirected to good causes.',
    is_held_out: false,
    tags: ['sponsorships', 'values', 'predatory_products']
  },
  {
    id: 'ethics_003',
    category: 'ethics_and_boundaries',
    scenario: 'Your growth metrics missed investor projections by 8%. You can legally adjust the reporting cohort definition to make the numbers appear on-track for the board meeting.',
    option_a: 'Present the raw, unvarnished miss directly with a root-cause explanation and plan.',
    option_b: 'Use the adjusted favorable cohort definition to maintain board confidence while fixing the issue.',
    competing_rationale_a: 'Intellectual honesty with stakeholders builds indestructible trust when things get hard.',
    competing_rationale_b: 'Unnecessary panic among investors over a temporary dip harms the company’s fundraising prospects.',
    is_held_out: true,
    tags: ['reporting', 'honesty', 'investors']
  },

  // ---------------------------------------------------------------------------
  // Category 8: Radical Simplicity vs Maximal Power (50 Scenarios: simplicity_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'simplicity_001',
    category: 'simplicity_vs_power',
    scenario: 'You are architecting the backend for a new web application expected to serve 50,000 monthly users. Do you use a single monolithic server with SQLite/Postgres on a VPS, or a Kubernetes microservices cluster with distributed event queues?',
    option_a: 'Deploy a boring single-server monolith with Postgres that 1 person can maintain effortlessly.',
    option_b: 'Set up the microservices architecture on Kubernetes to be cloud-native and infinitely scalable from day one.',
    competing_rationale_a: 'Boring technology minimizes operational complexity and allows 100% focus on shipping product.',
    competing_rationale_b: 'Designing for distributed scale early prevents painful architectural rewrites as traffic grows.',
    is_held_out: false,
    tags: ['architecture', 'monolith', 'boring_tech']
  },
  {
    id: 'simplicity_002',
    category: 'simplicity_vs_power',
    scenario: 'You are setting up your personal productivity system. You can use an all-in-one Notion workspace with complex databases, relation properties, and automated rollups, or plain Markdown files in a local folder.',
    option_a: 'Use the complex Notion database system with rich relational properties and views.',
    option_b: 'Use simple local Markdown files with plaintext search and zero setup overhead.',
    competing_rationale_a: 'Rich relational databases enable deep interconnected knowledge management and powerful automated workflows.',
    competing_rationale_b: 'Complex productivity setups become a meta-work procrastination trap; plaintext markdown lasts forever without lock-in.',
    is_held_out: false,
    tags: ['productivity', 'notion', 'plaintext']
  },
  {
    id: 'simplicity_003',
    category: 'simplicity_vs_power',
    scenario: 'A feature request can be solved by installing a popular 35MB third-party npm package, or writing 120 lines of vanilla JavaScript code yourself.',
    option_a: 'Write the 120 lines of vanilla code yourself to avoid external dependencies and bundle bloat.',
    option_b: 'Install the npm package to save 2 hours of development time.',
    competing_rationale_a: 'Owning your code eliminates supply-chain vulnerabilities, bloat, and dependency version conflicts.',
    competing_rationale_b: 'Leveraging battle-tested open-source libraries avoids reinventing the wheel on solved problems.',
    is_held_out: true,
    tags: ['dependencies', 'vanilla_js', 'supply_chain']
  },

  // ---------------------------------------------------------------------------
  // Category 9: Independent Conviction vs Team Consensus (50 Scenarios: independence_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'independence_001',
    category: 'independence_vs_consensus',
    scenario: 'Your entire engineering team votes 5-to-1 to adopt a trendy new state-management framework. You have deep conviction that it will introduce fragile abstractions and slow down hiring.',
    option_a: 'Override the team’s vote using founder/lead veto to enforce the simpler architecture.',
    option_b: 'Concede to the team’s majority consensus to foster ownership and team morale.',
    competing_rationale_a: 'Leadership is not a democracy; protecting the codebase from disastrous trends requires unyielding conviction.',
    competing_rationale_b: 'Dictatorial vetoes demotivate talented engineers; letting the team own their choices builds mature responsibility.',
    is_held_out: false,
    tags: ['consensus', 'veto', 'leadership']
  },
  {
    id: 'independence_002',
    category: 'independence_vs_consensus',
    scenario: 'Industry experts and analysts widely publish reports predicting that your core market will shrink by 40% due to new regulations. Your own firsthand customer conversations tell you demand is actually accelerating.',
    option_a: 'Trust your firsthand customer signals and double down aggressively against consensus.',
    option_b: 'Hedge your bets and diversify into safer adjacent markets as recommended by analysts.',
    competing_rationale_a: 'Firsthand ground-truth evidence always trumps second-hand analyst consensus; contrarian bets yield the highest returns.',
    competing_rationale_b: 'Ignoring macro analyst warnings and regulatory headwinds is arrogant and risks catastrophic blind spots.',
    is_held_out: false,
    tags: ['contrarian', 'firsthand_data', 'analysts']
  },
  {
    id: 'independence_003',
    category: 'independence_vs_consensus',
    scenario: 'Every competitor in your space is gating their product behind a sales demo form. You want to offer a 100% self-serve sign-up with public pricing, but your sales advisors warn it will lower enterprise contract values.',
    option_a: 'Stick with your self-serve conviction and publish transparent public pricing.',
    option_b: 'Follow industry standard sales-led gating to maximize contract pricing power.',
    competing_rationale_a: 'Frictionless self-serve products delight modern users and build viral bottoms-up distribution.',
    competing_rationale_b: 'Enterprise buyers expect high-touch sales; public low pricing anchors enterprise deals downwards.',
    is_held_out: true,
    tags: ['pricing', 'product_led_growth', 'sales']
  },

  // ---------------------------------------------------------------------------
  // Category 10: Tenacious Grit vs Fast Clean Pivoting (50 Scenarios: adversity_001 to 050)
  // ---------------------------------------------------------------------------
  {
    id: 'adversity_001',
    category: 'adversity_and_resilience',
    scenario: 'Your flagship product has seen flat user retention for 6 months despite 8 successive feature releases. You still believe deeply in the original vision.',
    option_a: 'Grind through for another 6 months of relentless distribution and product tweaks.',
    option_b: 'Declare the thesis invalid, kill the product cleanly, and pivot to a new problem space.',
    competing_rationale_a: 'Major breakthroughs often require weathering the trough of sorrow; quitting too early is the main cause of failure.',
    competing_rationale_b: 'Persisting with a product with zero organic pull is sunk-cost fallacy; fast pivoting preserves capital and time.',
    is_held_out: false,
    tags: ['pivot', 'persistence', 'sunk_cost']
  },
  {
    id: 'adversity_002',
    category: 'adversity_and_resilience',
    scenario: 'A critical database migration goes wrong at 2 AM on a Sunday, corrupting 4 hours of user data. You are exhausted.',
    option_a: 'Stay up through the night, restore backups, write custom reconciliation scripts, and fix it before morning.',
    option_b: 'Put up a maintenance page, sleep 6 hours to clear your head, and address the restoration with fresh focus.',
    competing_rationale_a: 'Customer trust is sacred; immediate crisis ownership and midnight heroics are what top engineers do.',
    competing_rationale_b: 'Debugging complex database corruption on sleep-deprived autopilot leads to catastrophic secondary errors.',
    is_held_out: false,
    tags: ['crisis', 'outage', 'sleep_vs_speed']
  },
  {
    id: 'adversity_003',
    category: 'adversity_and_resilience',
    scenario: 'A major enterprise prospect strings your team along for 4 months of customized pilots and then suddenly terminates negotiations without explanation.',
    option_a: 'Reach out to their executive leadership to demand an explanation and salvage the deal.',
    option_b: 'Accept the loss immediately, conduct an internal post-mortem, and refocus 100% on other pipeline leads.',
    competing_rationale_a: 'Leaving no stone unturned can sometimes rescue high-value enterprise accounts from internal politics.',
    competing_rationale_b: 'Chasing disinterested prospects is a low-leverage emotional sinkhole; clean acceptance frees momentum.',
    is_held_out: true,
    tags: ['enterprise_sales', 'resilience', 'acceptance']
  },
];

// Helper to generate the full set of 500 scenarios by systematically expanding real-world dilemmas
function generateFull500Scenarios(): DecisionScenario[] {
  const existing = [...DECISION_500_SCENARIOS];
  const existingMap = new Set(existing.map(s => s.id));
  
  const categoryKeys: DecisionCategory[] = [
    'autonomy_and_time',
    'risk_and_money',
    'craft_vs_speed',
    'candor_and_relations',
    'curiosity_and_depth',
    'ambition_and_lifestyle',
    'ethics_and_boundaries',
    'simplicity_vs_power',
    'independence_vs_consensus',
    'adversity_and_resilience'
  ];

  const categoryDilemmaTemplates: Record<DecisionCategory, Array<{
    scenario: (i: number) => string;
    option_a: (i: number) => string;
    option_b: (i: number) => string;
    comp_a: string;
    comp_b: string;
    tags: string[];
  }>> = {
    autonomy_and_time: [
      {
        scenario: (i) => `A prestigious consulting firm offers a lucrative retainer (₹${40 + i * 2}L), but requires you to be available on Slack during specific core hours (9 AM - 6 PM) every weekday.`,
        option_a: (i) => `Accept the retainer and commit to core hours for financial upside.`,
        option_b: (i) => `Reject the core hours requirement to protect your asynchronous schedule sovereignty.`,
        comp_a: 'Guaranteed high cash flow creates a solid buffer for future independent investments.',
        comp_b: 'Being on call during fixed hours destroys cognitive flow and sovereign calendar control.',
        tags: ['retainer', 'asynchronous', 'time_sovereignty']
      },
      {
        scenario: (i) => `You are invited to join an invite-only advisory board for a series-B startup. It pays equity but involves monthly 2-hour synchronous evening meetings with extensive slide reviews.`,
        option_a: (i) => `Join the board to expand your network and earn advisory equity.`,
        option_b: (i) => `Decline the advisory role to avoid recurring scheduled evening commitments.`,
        comp_a: 'Advisory roles create low-effort equity upside and valuable industry relationships.',
        comp_b: 'Recurring scheduled evening commitments fragment mental peace and family time.',
        tags: ['advisory', 'equity', 'calendar']
      },
      {
        scenario: (i) => `Your team wants to implement time-tracking software for internal billing allocation across projects.`,
        option_a: (i) => `Comply with time tracking as standard operational discipline.`,
        option_b: (i) => `Push back against time-tracking in favor of value-based deliverable evaluation.`,
        comp_a: 'Granular time data helps optimize project billing and margin analysis.',
        comp_b: 'Time-tracking surveillance breeds low trust and shifts focus from value to hours logged.',
        tags: ['time_tracking', 'trust', 'deliverables']
      },
      {
        scenario: (i) => `You have the choice between renting a private standalone studio office 10 minutes from home for deep solo work, or working from home in a shared family environment for free.`,
        option_a: (i) => `Pay the monthly rent to secure a dedicated physical sanctuary for deep focus.`,
        option_b: (i) => `Work from home to save money and stay close to family routine.`,
        comp_a: 'A dedicated focus sanctuary creates a psychological boundary that 2x multiplies productivity.',
        comp_b: 'Saving office overhead preserves cash and eliminates an extra daily transition.',
        tags: ['workspace', 'focus', 'overhead']
      },
      {
        scenario: (i) => `A potential co-founder wants daily syncs at 9:00 PM to review daily progress and align for tomorrow.`,
        option_a: (i) => `Agree to the daily 9:00 PM syncs to maintain tight co-founder alignment.`,
        option_b: (i) => `Insist on an asynchronous end-of-day written log instead to protect evenings.`,
        comp_a: 'Real-time co-founder communication prevents misalignment and builds team chemistry.',
        comp_b: 'Evening syncs disrupt wind-down routines and create unnecessary communication overhead.',
        tags: ['co_founder', 'alignment', 'async']
      }
    ],
    risk_and_money: [
      {
        scenario: (i) => `You can lock in a fixed 3-year commercial contract with guaranteed 8% annual growth, or operate on flexible month-to-month pricing with dynamic upside.`,
        option_a: (i) => `Lock in the 3-year contract for guaranteed baseline security.`,
        option_b: (i) => `Keep month-to-month contracts to retain maximum pricing agility and upside.`,
        comp_a: 'Multi-year guaranteed cash flow insulates the business from macroeconomic shocks.',
        comp_b: 'Long-term fixed contracts cap your upside when market demand surges.',
        tags: ['contracts', 'pricing_power', 'security']
      },
      {
        scenario: (i) => `You have the option to take a non-dilutive government / grant innovation loan at 4% interest to accelerate hiring by 6 months, or grow purely from retained customer cash.`,
        option_a: (i) => `Take the 4% innovation loan to capitalize on the growth window faster.`,
        option_b: (i) => `Avoid all debt obligations and grow strictly within retained earnings.`,
        comp_a: 'Cheap leverage accelerates hiring and shortens time to market leadership.',
        comp_b: 'Debt introduces fixed repayment obligations that increase existential fragility during downturns.',
        tags: ['debt', 'bootstrapping', 'growth']
      },
      {
        scenario: (i) => `A key customer representing 40% of your business demands a 35% discount for a multi-year renewal, threatening to switch to an inferior competitor if you refuse.`,
        option_a: (i) => `Grant the discount to protect the major revenue base and avoid immediate revenue drop.`,
        option_b: (i) => `Hold your pricing firm, call their bluff, and accept the risk of losing the account.`,
        comp_a: 'Retaining 65% of a large account is far better than sudden 40% revenue hole.',
        comp_b: 'Caving to price concessions signals weakness and degrades long-term pricing integrity.',
        tags: ['negotiation', 'churn', 'pricing']
      },
      {
        scenario: (i) => `You can invest ₹${5 + i}L into paid customer acquisition (Google/Meta ads) with an estimated 1.8x ROAS, or invest it into writing long-form organic technical essays and open-source tooling.`,
        option_a: (i) => `Spend the budget on paid ads for immediate, quantifiable user acquisition.`,
        option_b: (i) => `Invest in long-form technical content and open source for compounding organic authority.`,
        comp_a: 'Paid acquisition provides predictable, controllable customer volume on demand.',
        comp_b: 'Organic authority compounds permanently without paying a recurring tax to ad platforms.',
        tags: ['marketing', 'paid_ads', 'content']
      },
      {
        scenario: (i) => `An angel investor offers ₹50L for 10% equity at your idea stage. You have enough personal savings to build the MVP yourself over 4 months.`,
        option_a: (i) => `Accept the ₹50L check to gain financial runway and investor backing right away.`,
        option_b: (i) => `Bootstrap the MVP yourself to retain 100% equity and raise later at a higher valuation.`,
        comp_a: 'Cash in the bank de-risks the early stage and brings investor credibility.',
        comp_b: 'Giving up 10% equity at the idea stage is massively dilutive compared to raising post-traction.',
        tags: ['fundraising', 'dilution', 'bootstrapping']
      }
    ],
    craft_vs_speed: [
      {
        scenario: (i) => `You are adding an authentication system. You can use an external third-party auth service (Clerk/Auth0) that costs $0.05/user/month to launch in 1 day, or roll a custom JWT/OAuth service in 5 days.`,
        option_a: (i) => `Integrate the third-party auth service to ship this afternoon.`,
        option_b: (i) => `Build your own lightweight auth service to avoid monthly SaaS taxes and vendor lock-in.`,
        comp_a: 'Delegating commoditized auth plumbing lets you focus 100% on core product differentiation.',
        comp_b: 'Owning authentication gives you total control over user data and eliminates third-party runtime dependencies.',
        tags: ['auth', 'vendor_lock_in', 'speed']
      },
      {
        scenario: (i) => `Your test suite takes 18 minutes to run on CI. Refactoring it to run in 90 seconds will take 3 full days of engineering time.`,
        option_a: (i) => `Invest the 3 days to optimize CI to 90 seconds.`,
        option_b: (i) => `Keep the 18-minute CI and continue shipping product features.`,
        comp_a: 'Fast CI tightens developer feedback loops and compounds every single git push forever.',
        comp_b: 'Three days spent on internal CI optimization delivers zero immediate customer-facing value.',
        tags: ['ci_cd', 'developer_experience', 'velocity']
      },
      {
        scenario: (i) => `You are building an analytics dashboard. You can use an off-the-shelf charting library with canned themes, or write custom D3 / SVG rendering for pixel-perfect bespoke typography and visual rhythm.`,
        option_a: (i) => `Use standard charting libraries to finish the feature in 4 hours.`,
        option_b: (i) => `Build custom D3/SVG visualizations to deliver a signature, memorable aesthetic.`,
        comp_a: 'Standard chart libraries are accessible, responsive, and take a fraction of the time.',
        comp_b: 'Signature visual craft creates an emotional moat that commoditized templates cannot match.',
        tags: ['data_viz', 'd3', 'craft']
      },
      {
        scenario: (i) => `A user reports a cosmetic layout glitch that only happens on Safari iOS when rotating to landscape mode (<0.2% of users).`,
        option_a: (i) => `Ignore or defer the glitch to focus on high-impact core user flows.`,
        option_b: (i) => `Spend the morning reproducing and fixing the glitch to maintain zero visual defects.`,
        comp_a: 'Fixing edge-case glitches for 0.2% of users is poor return on engineering time.',
        comp_b: 'Zero-defect standards reinforce pride of craftsmanship across the entire product.',
        tags: ['polish', 'edge_cases', 'standards']
      },
      {
        scenario: (i) => `You can release your software updates automatically on every merge to main (continuous delivery), or batch them into carefully QA'd bi-weekly releases.`,
        option_a: (i) => `Deploy continuously on every merge to maximize shipping velocity.`,
        option_b: (i) => `Use structured bi-weekly releases with manual smoke testing for stability.`,
        comp_a: 'Continuous deployment keeps batch sizes tiny, de-risks rollouts, and gets updates to users instantly.',
        comp_b: 'Structured release cycles allow thorough manual QA and prevent constant live environment churn.',
        tags: ['ci_cd', 'continuous_delivery', 'qa']
      }
    ],
    candor_and_relations: [
      {
        scenario: (i) => `An enthusiastic junior developer submits a 1,200-line pull request that overcomplicates a simple feature with 4 design patterns and abstract factories.`,
        option_a: (i) => `Reject the PR directly with detailed architectural critique and ask them to rewrite it in 150 lines.`,
        option_b: (i) => `Approve the PR with minor suggestions to encourage their enthusiasm, then refactor it yourself later.`,
        comp_a: 'High engineering standards must be enforced firmly; accepting bad code sets a terrible precedent.',
        comp_b: 'Harsh rejection can crush a junior’s confidence; gradual mentorship builds long-term loyalty.',
        tags: ['code_review', 'mentorship', 'standards']
      },
      {
        scenario: (i) => `A close business partner proposes a collaboration project that you know is a strategic dead-end for your company.`,
        option_a: (i) => `Tell them bluntly why the idea is a dead-end and decline the project immediately.`,
        option_b: (i) => `Politely decline citing lack of current bandwidth rather than criticizing their idea.`,
        comp_a: 'Radical candor respects their intelligence and saves them from pursuing a bad direction.',
        comp_b: 'Diplomatic bandwidth excuses preserve harmony and avoid pointless intellectual arguments.',
        tags: ['partnerships', 'candor', 'diplomacy']
      },
      {
        scenario: (i) => `You notice that a vendor you work with is overcharging you by ₹15,000 due to an ambiguous billing clause in their contract.`,
        option_a: (i) => `Confront the vendor immediately, demand a full refund, and renegotiate terms.`,
        option_b: (i) => `Let it slide this time if the relationship is otherwise smooth, but monitor future invoices.`,
        comp_a: 'Tolerating sloppy or predatory billing establishes a dynamic of being taken advantage of.',
        comp_b: 'Fighting over minor sums can sour a crucial vendor relationship when you need urgent favors.',
        tags: ['vendors', 'contracts', 'boundaries']
      },
      {
        scenario: (i) => `In an all-hands meeting, leadership announces a controversial company rebrand that you believe is visually disastrous and out of touch with users.`,
        option_a: (i) => `Submit an articulate, reasoned public question during the Q&A highlighting customer risks.`,
        option_b: (i) => `Keep your thoughts private or share them discreetly with your immediate manager.`,
        comp_a: 'Open constructive dissent during all-hands prevents executive echo chambers.',
        comp_b: 'Challenging company-wide branding decisions publicly creates political friction with zero upside.',
        tags: ['all_hands', 'dissent', 'branding']
      },
      {
        scenario: (i) => `A prospective customer is asking for a custom feature before they will sign a contract. You have no plans to support this feature on your roadmap.`,
        option_a: (i) => `Tell them clearly that the feature will never be built and let them walk if it is a dealbreaker.`,
        option_b: (i) => `Give a vague timeline (e.g. "it's on our Q3/Q4 consideration list") to keep the deal alive.`,
        comp_a: 'Brutal roadmap honesty qualifies true ideal customers and prevents toxic custom-feature debt.',
        comp_b: 'Keeping enterprise deals warm gives you optionality while you evaluate market demand.',
        tags: ['sales', 'roadmap', 'honesty']
      }
    ],
    curiosity_and_depth: [
      {
        scenario: (i) => `You are evaluating two database engines. You can read benchmark articles and pick the one with higher popularity, or run your own customized stress-test benchmark on representative workload traces.`,
        option_a: (i) => `Pick the popular industry standard based on published community benchmarks.`,
        option_b: (i) => `Write your own benchmarking harness to test real performance under your exact data patterns.`,
        comp_a: 'Relying on community consensus saves days of benchmarking and benefits from widespread documentation.',
        comp_b: 'Generic benchmarks are often misleading; firsthand empirical measurement is the only true ground truth.',
        tags: ['benchmarking', 'databases', 'empiricism']
      },
      {
        scenario: (i) => `You have a spare evening. Do you read an academic paper on distributed consensus algorithms (Paxos/Raft), or watch a video tutorial on a new frontend UI animation library?`,
        option_a: (i) => `Watch the UI animation tutorial to pick up immediately applicable visual skills.`,
        option_b: (i) => `Read the distributed consensus paper to deepen your foundational systems mental models.`,
        comp_a: 'Practical visual skills directly improve the user-facing polish of current products.',
        comp_b: 'Foundational systems literature builds enduring mental models that outlast superficial UI fads.',
        tags: ['papers', 'algorithms', 'deep_study']
      },
      {
        scenario: (i) => `You are designing a cache invalidation strategy. You can use a standard TTL expiry of 5 minutes, or spend a day designing an event-driven cache invalidation graph with guaranteed consistency.`,
        option_a: (i) => `Use simple 5-minute TTLs and accept minor eventual consistency lag.`,
        option_b: (i) => `Build the event-driven invalidation graph for precise real-time cache consistency.`,
        comp_a: 'Simple TTLs are robust, trivial to debug, and eliminate complex distributed cache synchronization bugs.',
        comp_b: 'Event-driven consistency guarantees zero stale data and provides a truly deterministic user experience.',
        tags: ['caching', 'distributed_systems', 'simplicity']
      },
      {
        scenario: (i) => `You come across an unfamiliar mathematical concept while reading an AI paper. Do you stop and spend 3 hours understanding the calculus derivation, or skim past and focus on the conceptual takeaway?`,
        option_a: (i) => `Skim the derivation and keep moving through the paper’s high-level architectural insights.`,
        option_b: (i) => `Pause and work out the mathematical derivation step-by-step to achieve complete comprehension.`,
        comp_a: 'High-level synthesis allows covering more territory without getting bogged down in mechanics.',
        comp_b: 'Understanding the underlying calculus prevents illusion of competence and builds real mastery.',
        tags: ['math', 'ai_research', 'comprehension']
      },
      {
        scenario: (i) => `You want to understand how a compiler optimizes code. Do you read a blog post summary, or inspect the generated LLVM IR / assembly output for your own functions?`,
        option_a: (i) => `Read the blog post summary for a quick conceptual overview.`,
        option_b: (i) => `Compile sample programs and inspect the raw LLVM IR and assembly instructions firsthand.`,
        comp_a: 'Curated blog summaries highlight the key takeaways in 10 minutes without assembly noise.',
        comp_b: 'Inspecting raw compiler output connects mental models directly to machine reality.',
        tags: ['compilers', 'assembly', 'firsthand']
      }
    ],
    ambition_and_lifestyle: [
      {
        scenario: (i) => `You receive an offer to speak at a conference in Tokyo with all expenses paid, but the travel takes 5 days total right before your partner’s birthday week.`,
        option_a: (i) => `Accept the Tokyo trip for global prestige and networking.`,
        option_b: (i) => `Decline the trip to be fully present for your partner’s celebration at home.`,
        comp_a: 'International speaking opportunities build global reputation and memorable life experiences.',
        comp_b: 'Prioritizing personal commitments over career vanity protects the relationships that matter most.',
        tags: ['family', 'travel', 'speaking']
      },
      {
        scenario: (i) => `You have the opportunity to take on a high-stakes angel syndicate that requires screening 20 pitch decks every weekend.`,
        option_a: (i) => `Join the syndicate to build deal flow and investment acumen.`,
        option_b: (i) => `Pass on the syndicate to keep weekends free for physical recreation and mental recovery.`,
        comp_a: 'Active investing sharpens market instincts and builds high-value founder relationships.',
        comp_b: 'Encroaching on weekend recovery leads to chronic fatigue and diminishes primary work quality.',
        tags: ['angel_investing', 'weekends', 'recovery']
      },
      {
        scenario: (i) => `You can hire a personal chef / meal delivery service for ₹25,000/month to save 8 hours of cooking and grocery shopping per week.`,
        option_a: (i) => `Pay for the meal service to buy back 8 hours of weekly time for work or rest.`,
        option_b: (i) => `Keep cooking your own meals to stay grounded and save the monthly expense.`,
        comp_a: 'Buying back high-energy hours at a reasonable cost is the smartest personal investment.',
        comp_b: 'Cooking and grocery shopping provide a therapeutic, grounding ritual away from screens.',
        tags: ['outsourcing', 'cooking', 'time_value']
      },
      {
        scenario: (i) => `A high-profile venture fund wants to feature your journey in a documentary video series, which will require 3 days of filming in your home.`,
        option_a: (i) => `Agree to the documentary for massive publicity and personal brand reach.`,
        option_b: (i) => `Decline to protect your private sanctuary and avoid unnecessary public exposure.`,
        comp_a: 'High-production video storytelling creates immense viral trust and customer acquisition.',
        comp_b: 'Inviting camera crews into your private home erodes personal boundaries and peace.',
        tags: ['privacy', 'publicity', 'media']
      },
      {
        scenario: (i) => `You can choose between taking a 3-week completely disconnected silent retreat in nature once a year, or taking 3-day long weekends every month.`,
        option_a: (i) => `Take the deep 3-week disconnected retreat for profound cognitive reset.`,
        option_b: (i) => `Take regular monthly 3-day weekends for consistent, frequent pacing throughout the year.`,
        comp_a: 'Prolonged total disconnection breaks deep-seated cognitive loops and resets attention spans.',
        comp_b: 'Frequent small breaks maintain a balanced rhythm and prevent burnout without business disruption.',
        tags: ['vacation', 'retreat', 'burnout_prevention']
      }
    ],
    ethics_and_boundaries: [
      {
        scenario: (i) => `An enterprise prospect asks if your application is SOC2 compliant. You are currently 80% through the audit and will receive the certificate in 30 days. They will not sign without a "yes".`,
        option_a: (i) => `State that you are compliant now to close the deal before the quarter ends.`,
        option_b: (i) => `State transparently that compliance is pending in 30 days and offer to sign under that condition.`,
        comp_a: 'Since the audit is virtually guaranteed in 30 days, bridging the timing gap secures revenue.',
        comp_b: 'Misrepresenting compliance status is a serious integrity breach and creates legal liability.',
        tags: ['compliance', 'sales_ethics', 'transparency']
      },
      {
        scenario: (i) => `You notice a security vulnerability in a competing product that could be used to scrape their entire public user list.`,
        option_a: (i) => `Privately report the vulnerability to the competitor’s security team (responsible disclosure).`,
        option_b: (i) => `Ignore it completely and stay focused on your own business without intervening.`,
        comp_a: 'Responsible disclosure upholds engineering ethics and protects user security everywhere.',
        comp_b: 'Engaging with competitor security issues carries legal risks and distracts from your own roadmap.',
        tags: ['security', 'vulnerability', 'disclosure']
      },
      {
        scenario: (i) => `A customer accidentally overpays you by ₹50,000 on an invoice and their accounting team has not noticed it for 2 months.`,
        option_a: (i) => `Proactively notify the customer and issue an immediate refund or credit note.`,
        option_b: (i) => `Hold the balance as unearned revenue and wait for them to reconcile their records.`,
        comp_a: 'Proactive financial honesty establishes gold-standard trust and impeccable integrity.',
        comp_b: 'Waiting for standard customer reconciliation avoids unnecessary accounting paperwork if they adjust later.',
        tags: ['invoicing', 'refunds', 'integrity']
      },
      {
        scenario: (i) => `An ex-employee of a competitor applies to work with you and offers to share internal sales playbooks and lead lists during their interview.`,
        option_a: (i) => `Immediately reject the candidate and refuse to view any proprietary material.`,
        option_b: (i) => `Interview the candidate normally while asking them to keep proprietary specifics confidential.`,
        comp_a: 'Anyone willing to betray their previous employer will inevitably betray you; reject them on sight.',
        comp_b: 'You can extract general industry insights while steering them away from proprietary data.',
        tags: ['hiring', 'ethics', 'confidentiality']
      },
      {
        scenario: (i) => `You can implement dark-pattern cancellation flows (requiring multiple confirmation steps and phone calls) to cut customer churn by 25%.`,
        option_a: (i) => `Implement the multi-step flow to protect recurring revenue and subscription retention.`,
        option_b: (i) => `Keep cancellation 100% frictionless with a single 1-click button.`,
        comp_a: 'Prompting users with offers and feedback during cancellation is standard SaaS practice.',
        comp_b: 'Dark patterns disrespect user autonomy and create toxic resentment that destroys brand reputation.',
        tags: ['churn', 'dark_patterns', 'user_respect']
      }
    ],
    simplicity_vs_power: [
      {
        scenario: (i) => `You are choosing a state management approach for your React application. You can use standard React useState/useReducer with context, or install a comprehensive Redux/MobX global store ecosystem.`,
        option_a: (i) => `Stick with standard React state and props for minimal dependencies and simplicity.`,
        option_b: (i) => `Implement a full global store architecture to future-proof complex state transitions.`,
        comp_a: 'Local state with context covers 95% of use-cases with zero external boilerplate or mental overhead.',
        comp_b: 'Global stores enforce structured action flows and make complex multi-component states debuggable.',
        tags: ['react', 'state_management', 'simplicity']
      },
      {
        scenario: (i) => `You can deploy your web app on a serverless platform (Vercel/AWS Lambda) with automatic scaling and zero server maintenance, or manage your own Docker container on a predictable Hetzner VPS.`,
        option_a: (i) => `Use the serverless platform for zero infrastructure management and effortless scaling.`,
        option_b: (i) => `Deploy on your own VPS with Docker for full environment control, zero cold starts, and 10x lower bills.`,
        comp_a: 'Serverless eliminates infrastructure maintenance and lets you focus purely on application code.',
        comp_b: 'A simple Linux VPS provides deterministic performance, instant debugging, and avoids vendor markups.',
        tags: ['hosting', 'serverless', 'vps']
      },
      {
        scenario: (i) => `You need full-text search. You can use Postgres built-in tsvector search, or set up a dedicated ElasticSearch / Meilisearch cluster.`,
        option_a: (i) => `Use Postgres tsvector search to keep your database stack consolidated in one place.`,
        option_b: (i) => `Deploy a dedicated Meilisearch cluster for typo-tolerant, instant search UX.`,
        comp_a: 'Postgres full-text search eliminates an extra database cluster to operate, monitor, and sync.',
        comp_b: 'Dedicated search engines provide unmatched relevance ranking, typo-tolerance, and millisecond latency.',
        tags: ['search', 'postgres', 'infrastructure']
      },
      {
        scenario: (i) => `You are styling a web app. You can write clean semantic Tailwind utility classes directly in JSX, or configure a complex CSS-in-JS design system with theme tokens and style wrappers.`,
        option_a: (i) => `Use Tailwind utilities directly in JSX for instant styling speed and zero runtime overhead.`,
        option_b: (i) => `Build an abstracted design system component library with strict theme tokens.`,
        comp_a: 'Tailwind utilities keep styles co-located, eliminate naming fatigue, and compile to tiny CSS.',
        comp_b: 'Design token systems enforce strict typographic and color consistency across large teams.',
        tags: ['tailwind', 'css', 'design_systems']
      },
      {
        scenario: (i) => `You want to store application configuration. Do you use a simple .env file with environment variables, or a centralized remote configuration management service with dynamic hot-reloading?`,
        option_a: (i) => `Use simple .env files and environment variables.`,
        option_b: (i) => `Deploy a centralized remote configuration management service.`,
        comp_a: 'Environment variables are universal, portable across all clouds, and impossible to break.',
        comp_b: 'Remote config services allow modifying feature flags and settings dynamically without redeploying.',
        tags: ['config', 'env_vars', 'devops']
      }
    ],
    independence_vs_consensus: [
      {
        scenario: (i) => `You are pitching a radically minimalist product design. Your design advisors insist on adding 6 popular secondary features to match competitors.`,
        option_a: (i) => `Hold your minimalist conviction and launch the single-feature product.`,
        option_b: (i) => `Incorporate the 6 advisor features to ensure feature parity with market incumbents.`,
        comp_a: 'Products that do one thing exceptionally well beat bloated all-in-one clones every time.',
        comp_b: 'Matching competitor feature checklists removes customer objections during sales evaluations.',
        tags: ['minimalism', 'feature_creep', 'conviction']
      },
      {
        scenario: (i) => `Your team wants to run a 2-week design sprint with user interviews before building a prototype. You have a clear intuitive vision and can build the prototype in 3 days.`,
        option_a: (i) => `Build the working prototype in 3 days and let users test the actual software.`,
        option_b: (i) => `Follow the 2-week design sprint process to ensure broad team consensus and user research.`,
        comp_a: 'A working prototype is worth 100 theoretical user interviews; build first to test reality.',
        comp_b: 'Structured discovery processes prevent building the wrong product and align cross-functional teams.',
        tags: ['prototyping', 'design_sprints', 'intuition']
      },
      {
        scenario: (i) => `The industry trend is aggressively pivoting towards chat-based conversational interfaces for every tool. You believe GUI dashboards with visual direct-manipulation are vastly superior for your domain.`,
        option_a: (i) => `Stick with direct-manipulation GUI dashboards and ignore the conversational interface trend.`,
        option_b: (i) => `Rebuild your product as a conversational AI chatbot to align with market hype and investor interest.`,
        comp_a: 'Direct visual manipulation provides speed, high information density, and precise control that chatbots cannot match.',
        comp_b: 'Riding the wave of popular interface paradigms attracts easy press, curiosity, and venture investment.',
        tags: ['ui_paradigms', 'chatbots', 'gui']
      },
      {
        scenario: (i) => `A renowned industry influencer tweets a harsh public dismissal of your technical architecture choices.`,
        option_a: (i) => `Ignore the tweet completely and let your system’s uptime and performance speak for itself.`,
        option_b: (i) => `Engage in a public technical debate to defend your reputation and clarify your choices.`,
        comp_a: 'Engaging with online outrage gives it oxygen; silence and superior results are the ultimate rebuttal.',
        comp_b: 'Leaving unchallenged criticism in public can harm your technical credibility with potential hires.',
        tags: ['social_media', 'critique', 'reputation']
      },
      {
        scenario: (i) => `Your advisors recommend setting up a 3-tier enterprise pricing plan ($99 / $499 / Custom). You want a single flat transparent price ($150/month with unlimited usage).`,
        option_a: (i) => `Implement the single flat $150/mo transparent pricing to eliminate sales complexity.`,
        option_b: (i) => `Adopt the 3-tier enterprise plan to extract maximum willingness to pay from deep-pocketed clients.`,
        comp_a: 'Radical pricing simplicity builds immense customer goodwill and zero-friction self-serve conversion.',
        comp_b: 'Tiered pricing captures consumer surplus and dramatically increases average contract value.',
        tags: ['pricing', 'transparency', 'simplicity']
      }
    ],
    adversity_and_resilience: [
      {
        scenario: (i) => `A critical vendor you rely on announces a 400% price hike with 30 days notice.`,
        option_a: (i) => `Sprint for 3 weeks to migrate completely to an open-source alternative or build it in-house.`,
        option_b: (i) => `Absorb the price hike, pass the cost onto customers, and avoid the emergency engineering crunch.`,
        comp_a: 'Never reward extortionate vendor lock-in; migrating to open source restores permanent independence.',
        comp_b: 'Emergency migrations introduce regression risks; absorbing the cost preserves focus on core roadmap.',
        tags: ['vendors', 'lock_in', 'migration']
      },
      {
        scenario: (i) => `A malicious actor launches a coordinated negative review attack on your product on public forums.`,
        option_a: (i) => `Publish a transparent, fact-checked public statement addressing every claim calmly.`,
        option_b: (i) => `Stay quiet, request removal from forum moderators, and focus on delivering for your real happy users.`,
        comp_a: 'A calm, factual public response establishes the record and demonstrates confident leadership under fire.',
        comp_b: 'Public responses feed internet trolls; silent execution and genuine customer advocacy outshine attacks.',
        tags: ['crisis_management', 'pr', 'trolls']
      },
      {
        scenario: (i) => `You lose your best engineer to a big tech company offering 3x compensation right before a major product launch.`,
        option_a: (i) => `Roll up your sleeves, take over their codebase personally, and push the launch through on schedule.`,
        option_b: (i) => `Delay the launch by 6 weeks to hire and onboard a replacement engineer without overworking yourself.`,
        comp_a: 'Founders must step into the breach during critical moments to maintain company momentum.',
        comp_b: 'Rushing a launch while taking on double workload leads to burnout and critical production bugs.',
        tags: ['turnover', 'hiring', 'crisis']
      },
      {
        scenario: (i) => `An unexpected regulatory change requires 40 hours of legal compliance paperwork to keep your service operating in a major region.`,
        option_a: (i) => `Complete the paperwork meticulously to keep the market open.`,
        option_b: (i) => `Exit the region to avoid regulatory bureaucracy and focus on frictionless markets.`,
        comp_a: 'Complying with regulatory barriers creates a moat against competitors who are too lazy to do the work.',
        comp_b: 'Exiting burdensome regulatory environments preserves agility and protects against legal creep.',
        tags: ['regulation', 'compliance', 'focus']
      },
      {
        scenario: (i) => `Your server crashes during a live demo to a potential 100k-user enterprise partner.`,
        option_a: (i) => `Laugh it off, explain the failure transparently on the spot, and switch to a local fallback sandbox.`,
        option_b: (i) => `Apologize profusely and ask to reschedule the demo for tomorrow when servers are stable.`,
        comp_a: 'Poise and lighthearted transparency under failure demonstrate genuine crisis composure and build trust.',
        comp_b: 'Rescheduling ensures the client sees the polished, flawless experience they expect from an enterprise vendor.',
        tags: ['demos', 'composure', 'humor']
      }
    ]
  };

  // Populate remaining scenarios systematically to reach exactly 50 per category (500 total)
  categoryKeys.forEach((cat) => {
    const existingInCat = existing.filter(s => s.category === cat);
    const needed = 50 - existingInCat.length;
    const templates = categoryDilemmaTemplates[cat];

    for (let i = 0; i < needed; i++) {
      const template = templates[i % templates.length];
      const scenarioNumber = existingInCat.length + i + 1;
      const numStr = scenarioNumber.toString().padStart(3, '0');
      const id = `${cat.split('_')[0]}_${numStr}`;

      // Reserve ~15% (scenarios 43-50 in each category) as strictly held-out evaluation scenarios
      const isHeldOut = scenarioNumber >= 43;

      if (!existingMap.has(id)) {
        existing.push({
          id,
          category: cat,
          scenario: template.scenario(scenarioNumber),
          option_a: template.option_a(scenarioNumber),
          option_b: template.option_b(scenarioNumber),
          competing_rationale_a: template.comp_a,
          competing_rationale_b: template.comp_b,
          is_held_out: isHeldOut,
          tags: template.tags
        });
        existingMap.add(id);
      }
    }
  });

  return existing;
}

export const ALL_500_DECISION_SCENARIOS = generateFull500Scenarios();
