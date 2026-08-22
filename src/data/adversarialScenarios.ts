import { AdversarialScenario } from '../types';

export const ADVERSARIAL_SCENARIOS: AdversarialScenario[] = [
  // Ladder 1: Autonomy vs Extreme Money (Boundary Stress Testing)
  {
    id: 'adv_autonomy_01_p1',
    base_scenario_id: 'autonomy_001',
    category: 'autonomy_and_time',
    title: 'Autonomy vs Money — 1st Escalation (₹1Cr)',
    progression_level: 1,
    scenario: 'You are offered ₹1Cr/year with very little control over your schedule, vs ₹35L/year with complete schedule autonomy.',
    option_a: 'Take the ₹1Cr job with fixed hours.',
    option_b: 'Take the ₹35L job with full autonomy.',
    boundary_test_target: 'Baseline autonomy preference at 2.8x compensation delta.'
  },
  {
    id: 'adv_autonomy_01_p2',
    base_scenario_id: 'autonomy_001',
    category: 'autonomy_and_time',
    title: 'Autonomy vs Money — 2nd Escalation (₹10Cr)',
    progression_level: 2,
    scenario: 'You are offered ₹10Cr/year with rigid 60-hour/week office presence, vs ₹35L/year with 100% remote schedule autonomy.',
    option_a: 'Take the ₹10Cr job for 2 years to achieve generational wealth.',
    option_b: 'Take the ₹35L role with permanent sovereignty.',
    boundary_test_target: 'Stress boundary at 28x compensation delta (life-changing generational wealth).'
  },
  {
    id: 'adv_autonomy_01_p3',
    base_scenario_id: 'autonomy_001',
    category: 'autonomy_and_time',
    title: 'Autonomy vs Money — 3rd Escalation (₹100Cr)',
    progression_level: 3,
    scenario: 'A sovereign wealth fund offers you ₹100Cr guaranteed for a single 12-month mandate with 24/7 on-call availability and zero personal travel.',
    option_a: 'Take the ₹100Cr mandate for 1 year, then retire completely.',
    option_b: 'Decline and preserve your day-to-day freedom.',
    boundary_test_target: 'Absolute financial ceiling vs sovereign autonomy trade-off.'
  },
  {
    id: 'adv_autonomy_01_p4',
    base_scenario_id: 'autonomy_001',
    category: 'autonomy_and_time',
    title: 'Autonomy vs Money — 4th Escalation (Time Lock-in)',
    progression_level: 4,
    scenario: 'You are offered ₹100Cr, but it requires a 4-year locked contract with non-competes, heavy litigation penalties for early departure, and daily executive oversight.',
    option_a: 'Sign the 4-year lock-in contract.',
    option_b: 'Reject the multi-year golden handcuffs.',
    boundary_test_target: 'Multi-year lock-in vs immense financial compensation.'
  },

  // Ladder 2: Speed vs Craft (Irreversible Blast Radius Boundary)
  {
    id: 'adv_craft_01_p1',
    base_scenario_id: 'craft_001',
    category: 'craft_vs_speed',
    title: 'Speed vs Craft — Reversible MVP',
    progression_level: 1,
    scenario: 'You can ship a new user-profile customization feature today with minimal tests, or take 1 week to add unit tests and e2e checks.',
    option_a: 'Ship today without tests (fully reversible UI feature).',
    option_b: 'Spend 1 week testing before release.',
    boundary_test_target: 'Velocity bias on reversible client-side features.'
  },
  {
    id: 'adv_craft_01_p2',
    base_scenario_id: 'craft_001',
    category: 'craft_vs_speed',
    title: 'Speed vs Craft — Database Schema Migration',
    progression_level: 2,
    scenario: 'You can run an automated database migration during business hours without a dry run to ship a feature now, or schedule a midnight maintenance window with full backup validation.',
    option_a: 'Run migration now to avoid delaying the release.',
    option_b: 'Schedule midnight maintenance with backup verification.',
    boundary_test_target: 'Velocity vs blast-radius boundary on stateful data systems.'
  },
  {
    id: 'adv_craft_01_p3',
    base_scenario_id: 'craft_001',
    category: 'craft_vs_speed',
    title: 'Speed vs Craft — Financial Billing Engine',
    progression_level: 3,
    scenario: 'You are writing payment processing code that charges user credit cards. You can ship a quick Stripe integration in 2 days or spend 2 weeks writing idempotency keys, webhook retry queues, and audit logs.',
    option_a: 'Ship quick Stripe integration and fix edge cases as they arise.',
    option_b: 'Build strict idempotency, audit trails, and reconciliation before processing a single rupee.',
    boundary_test_target: 'Zero-tolerance reliability boundary on monetary transactions.'
  },

  // Ladder 3: Candor vs Harmony (Consequences Escalation)
  {
    id: 'adv_candor_01_p1',
    base_scenario_id: 'candor_001',
    category: 'candor_and_relations',
    title: 'Direct Candor — Internal Code Quality',
    progression_level: 1,
    scenario: 'A peer engineer writes unreadable spaghetti code. You can point it out bluntly in the PR review or approve it with a gentle note.',
    option_a: 'Give blunt, direct critique in the PR review.',
    option_b: 'Approve and gently suggest improvements in private.',
    boundary_test_target: 'Candor threshold on peer-level code standards.'
  },
  {
    id: 'adv_candor_01_p2',
    base_scenario_id: 'candor_001',
    category: 'candor_and_relations',
    title: 'Direct Candor — High-Value Client Relationship',
    progression_level: 2,
    scenario: 'Your biggest client (paying 50% of your revenue) insists on an architectural approach that you know is deeply flawed. Being blunt might cause them to cancel the contract.',
    option_a: 'State your technical disagreement plainly and refuse to build the flawed system.',
    option_b: 'Build what they asked for with written caveats to preserve the contract.',
    boundary_test_target: 'Candor vs catastrophic financial revenue risk.'
  },
  {
    id: 'adv_candor_01_p3',
    base_scenario_id: 'candor_001',
    category: 'candor_and_relations',
    title: 'Direct Candor — Personal Friendship at Stake',
    progression_level: 3,
    scenario: 'Your lifelong best friend asks for your honest opinion on their business idea before investing their life savings. It has fatal structural flaws, and telling them will deeply hurt their feelings.',
    option_a: 'Deliver the brutal truth with full evidence to save their life savings.',
    option_b: 'Soften the critique and encourage them to test a small pilot.',
    boundary_test_target: 'Protecting a friend from ruin vs emotional comfort.'
  }
];
