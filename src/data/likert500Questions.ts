import { LikertQuestion, LikertDomain, PersonalityParameterKey, PersonalityParameter } from '../types';

/**
 * 500 Personal Life & Decision-Making Likert Questions
 * Focused 100% on everyday life, relationships, personal habits, values, communication, and emotional resilience.
 * Free of coding, business buzzwords, and corporate jargon.
 */

const rawDomainQuestions: Record<LikertDomain, Array<{
  subdomain: string;
  text: string;
  reversed: boolean;
  parameter: PersonalityParameterKey;
  weight?: number;
}>> = {
  engineering_philosophy: [
    { subdomain: 'Simplicity in Life', text: 'I would rather live a peaceful, unhurried life with modest possessions than constantly chase higher status and luxury.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Simplicity in Life', text: 'I feel pressure to keep up with the lifestyle, gadgets, and purchases of people around me.', reversed: true, parameter: 'abstraction_tolerance' },
    { subdomain: 'Living with Purpose', text: 'I value having deep personal freedom more than having a prestigious job title or high social standing.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Living with Purpose', text: 'I believe true success is defined by how content and present you feel each day, not by your external achievements.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Social Pressure', text: 'I often worry about what distant acquaintances or social media followers think of my life choices.', reversed: true, parameter: 'consensus_orientation' },
    { subdomain: 'Protecting Peace', text: 'When my week gets too busy, I have no problem canceling non-essential social plans to protect my rest and peace of mind.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Quality vs Quantity', text: 'I prefer owning a few well-made, reliable things that last for years rather than buying cheap, disposable stuff constantly.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Authenticity', text: 'I would rather speak up for what I genuinely believe in, even if it creates temporary awkwardness in the room.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Social Comparison', text: 'I frequently find myself comparing my life milestones to friends and feeling like I am falling behind.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Core Values', text: 'Living in alignment with my personal values matters far more to me than trying to please everyone around me.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Living Space', text: 'I feel much calmer in a simple, tidy living space with minimal visual clutter.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Close Friendships', text: 'I would rather have three deeply trusted close friends than a large circle of casual acquaintances.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Saying No', text: 'I feel guilty saying no to invitations or favors, even when I am exhausted and need downtime.', reversed: true, parameter: 'scope_ruthlessness' },
    { subdomain: 'Unplugging', text: 'I make a conscious effort to unplug from screens and spend quiet time outdoors or reading.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Tradition vs Logic', text: 'I question old family traditions and social rules when they no longer make practical sense.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Pleasing Others', text: 'I often put what other people want ahead of what I truly need for my own wellbeing.', reversed: true, parameter: 'consensus_orientation' },
    { subdomain: 'Daily Joys', text: 'I find deep happiness in simple everyday moments, like a slow morning coffee, a good walk, or a homemade meal.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Constant Striving', text: 'I feel restless and guilty whenever I am relaxing because I feel like I should always be productive.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Work-Life Balance', text: 'I would choose a job with lower pay if it gave me genuine free time, good sleep, and flexibility over high pay with constant stress.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Staying True', text: 'I refuse to pretend to like things or act like someone I am not just to fit into a social group.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Decluttering', text: 'I regularly donate or throw away clothes, clutter, and items I have not used in the past year.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Honest Living', text: 'I value honesty with myself above telling myself comfortable little lies.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Patience with Life', text: 'I trust that good things take time and avoid rushing major life steps before I feel ready.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Envy & Gratitude', text: 'I find it easy to feel genuinely happy for others when they succeed, without feeling secretly envious.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Material Possessions', text: 'Buying new luxury goods brings me only fleeting happiness that fades within a couple of days.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Personal Ethics', text: 'I make an effort to do the right thing even when nobody is watching and there is no credit to be gained.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Acceptance', text: 'I have learned to embrace my quirks and flaws rather than obsessing over trying to be perfect.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Spiritual Peace', text: 'Taking time for mindfulness, meditation, or quiet gratitude makes a noticeable difference in my day.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Kindness First', text: 'Being kind and considerate in everyday interactions is more important to me than always being right.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Financial Freedom', text: 'I prioritize building emergency savings and living debt-free over spending money on flashy things.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Letting Go of Grudges', text: 'I would rather forgive someone and move forward with my life than hold onto bitter resentment.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Living in the Present', text: 'I am good at soaking in the present moment instead of always worrying about next month.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Personal Standards', text: 'I hold myself to high personal standards in the things that matter to me, even when it takes extra effort.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Solitude & Reflection', text: 'I cherish spending an afternoon entirely by myself to reflect, think, and recharge.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Rejecting Fads', text: 'I am skeptical of viral lifestyle fads and self-help trends that promise quick fixes to happiness.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Honoring Promises', text: 'If I give my word to a friend or family member, I do everything I can to follow through.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Humility', text: 'I am comfortable acknowledging that luck and good timing played a big role in my successes.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Deep Conversations', text: 'I prefer talking about life experiences, feelings, and ideas over superficial small talk.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Healthy Boundaries', text: 'I have clear boundaries and do not let demanding people take advantage of my good nature.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Joy in Giving', text: 'Doing a quiet favor or giving a thoughtful gift to someone brings me more joy than buying something for myself.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Self-Compassion', text: 'When I have a bad day or make a mistake, I speak gently to myself rather than beating myself up.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Embracing Change', text: 'I view aging and new seasons of life with curiosity and acceptance rather than dread.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Simple Pleasures', text: 'A walk in the park, cooking a good meal, or listening to music can easily turn a rough day around for me.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Independent Path', text: 'I am comfortable choosing an unconventional lifestyle if it fits who I really am.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Cherishing Family', text: 'I actively make time to stay in touch with loved ones, even when life gets hectic.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Contentment', text: 'I feel a genuine sense of gratitude for what I already have in life.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Authentic Expression', text: 'I dress and style myself for my own comfort and taste rather than following whatever is trendy.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Emotional Honesty', text: 'I allow myself to feel my emotions honestly rather than bottling them up inside.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Inner Peace', text: 'Protecting my mental calm is my top priority when deciding who and what to let into my life.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Life Legacy', text: 'At the end of my life, I want to be remembered for being caring, genuine, and present.', reversed: false, parameter: 'abstraction_tolerance' }
  ],
  decision_and_tradeoffs: [
    { subdomain: 'Quick Decisions', text: 'When picking a restaurant or picking out food at a market, I make up my mind in seconds rather than agonizing over options.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Overthinking Choices', text: 'I often spend excessive time reading reviews, comparing five different options, and worrying about making the wrong small purchase.', reversed: true, parameter: 'velocity_bias' },
    { subdomain: 'Reversible Choices', text: 'If a choice is easily undone (like returning a shirt or trying a new coffee shop), I decide fast and don’t look back.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Second-Guessing', text: 'After making a decision, I often second-guess myself and wonder if the other option would have been better.', reversed: true, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Gut Instinct', text: 'I trust my intuition and gut feelings when meeting new people or making everyday choices.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Asking Opinions', text: 'I usually ask three or four friends for their opinions before I feel confident making a personal choice.', reversed: true, parameter: 'autonomy_preference' },
    { subdomain: 'Vacation Planning', text: 'When taking a vacation, I prefer leaving most of the days open to spontaneous adventure rather than having a strict schedule.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Itinerary Comfort', text: 'I feel anxious and disorganized on trips unless I have planned out where we are going and what we are doing each day.', reversed: true, parameter: 'formalism_weight' },
    { subdomain: 'Big Life Choices', text: 'When deciding on major life moves (like changing apartments or switching fields), I write down pros and cons to see things clearly.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Committing Fully', text: 'Once I make a decision, I jump into it fully and focus on making it work instead of dwelling on alternatives.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Menu Hesitation', text: 'When the waiter comes to take our order, I am usually ready right away rather than asking for more time.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Impulse Buying', text: 'I rarely buy items on impulse; I prefer sleeping on an idea before spending money.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Handling Dilemmas', text: 'When two good options conflict, I look for a creative compromise rather than feeling stuck.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Regret Management', text: 'I view bad decisions as helpful learning experiences rather than reasons to beat myself up.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Group Decisions', text: 'When a group of friends cannot decide where to go for dinner, I am happy to step in and pick a place.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Staying Flexible', text: 'I am quick to change my weekend plans if the weather turns bad or something better comes up.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Financial Trade-Offs', text: 'I would rather spend money on memorable experiences with loved ones than on material objects.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Prioritizing Energy', text: 'I consciously prioritize where I spend my daily energy, ignoring things I cannot control.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Choosing What to Wear', text: 'Getting dressed in the morning takes me less than five minutes because I keep my routine simple.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Major Commitments', text: 'When making a long-term commitment (like signing a lease or getting a pet), I take plenty of time to weigh the consequences.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Cutting Losses', text: 'If a movie or book is boring after 30 minutes, I stop immediately rather than forcing myself to finish it.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Seeking Perfection', text: 'I would rather pick a "good enough" option right now than spend hours hunting for absolute perfection.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Confidence in Taste', text: 'I know what music, food, and clothes I like and don’t need validation from others to enjoy them.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Decision Fatigue', text: 'By the end of a long day, I find it exhausting to make even basic choices like what to eat for dinner.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Living with Outcomes', text: 'Even when a decision turns out poorly, I take responsibility without blaming others.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Practicality First', text: 'I choose clothes and shoes based on comfort and practicality rather than pure fashion.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Time Management', text: 'I protect my mornings from distractions so I can focus on what matters most.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Risk vs Safety', text: 'I prefer taking a small calculated chance over staying in a situation where I am unhappy and stagnant.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Saying No to Deals', text: 'I don’t buy things just because they are on sale if I didn’t already need them.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Letting Things Settle', text: 'When I am angry or upset, I wait until I calm down before making any important decisions.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Clear Priorities', text: 'I know my top three personal priorities in life right now and use them as a compass for my choices.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Independent Thinking', text: 'I am comfortable making a choice that goes against the popular advice of friends if I know it is right for me.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Grocery Shopping', text: 'I shop with a clear list and rarely get sidetracked by random snack aisles.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Resolving Conflicts', text: 'When planning group activities, I try to make sure everyone feels heard without letting the plan stall.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Learning from Blunders', text: 'When a choice blows up in my face, I laugh it off, learn the lesson, and move forward.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Investing in Health', text: 'I am willing to spend extra on nutritious food, good sleep, and exercise because my health comes first.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Daily Boundaries', text: 'I turn off work notifications on my phone in the evening to be present with my personal life.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Quick Adjustments', text: 'If an ingredient is missing while I am cooking, I substitute something else on the fly without stress.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Balancing Heart & Mind', text: 'I balance emotional desires with logical reality when choosing a path forward in life.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Declining Extra Work', text: 'I politely decline taking on extra favors when my plate is already completely full.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Trusting Past Lessons', text: 'I rely on my past experiences to guide me when facing unfamiliar personal choices.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Decisive Action', text: 'I would rather make a decision and adjust later than sit in indecisive paralysis for days.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Choosing Friends', text: 'I surround myself with people who are uplifting and kind rather than dramatic or draining.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Living Simply', text: 'I keep my financial life simple with automated bills and minimal subscriptions.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Honoring My Energy', text: 'I listen to my body when I am tired and rest instead of forcing myself to push through.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Dilemmas', text: 'I am comfortable with the fact that every choice has trade-offs; you cannot have everything at once.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Sticking to Commitments', text: 'When I promise to attend an event, I show up on time unless an emergency happens.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Evaluating Advice', text: 'I listen to advice from friends with an open mind, but I always filter it through my own common sense.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Daily Peace', text: 'I choose peace over proving a petty point in everyday disagreements.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Moving Forward', text: 'Once a decision is behind me, I focus 100% on the road ahead.', reversed: false, parameter: 'velocity_bias' }
  ],
  problem_solving_heuristics: [
    { subdomain: 'Fixing Things at Home', text: 'When a household appliance or piece of furniture acts up, I try to fix it myself before calling someone.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Simple Solutions', text: 'I prefer simple, straightforward solutions over elaborate ideas that involve ten different steps.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Travel Delays', text: 'If my flight gets canceled or traffic is blocked, I quickly look for alternative routes without panicking.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Overwhelmed by Tech', text: 'When my phone or computer glitched, I get frustrated and feel lost right away.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Trial & Error', text: 'I enjoy figuring out how to build or assemble things by tinkering and experimenting on my own.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Reading Manuals', text: 'I usually skip the instruction booklet and figure things out naturally as I go.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Breaking Problems Down', text: 'When a personal problem feels overwhelming, I break it down into small, concrete action steps.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Resourcefulness', text: 'I can make a great dinner out of whatever random ingredients happen to be in the fridge.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Finding Lost Things', text: 'When I lose my keys or wallet, I retrace my steps calmly rather than running around frantically.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Asking for Help', text: 'I have no problem asking a friend or neighbor for a hand when I genuinely cannot solve something alone.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Stubbornness', text: 'I would rather spend three hours struggling by myself than ask someone for five minutes of help.', reversed: true, parameter: 'delegation_willingness' },
    { subdomain: 'Root Cause Thinking', text: 'When an ongoing problem keeps happening in my life, I look for the root cause instead of applying temporary band-aids.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Cooking Intuition', text: 'I cook by tasting and adjusting seasonings on the go rather than following exact measurements rigidly.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Budgeting Habits', text: 'If my budget gets tight one month, I easily identify and cut back on non-essential spending right away.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Navigating New Places', text: 'I have a good sense of direction and can find my way around an unfamiliar neighborhood without getting stressed.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Handling Misunderstandings', text: 'When a misunderstanding happens with a friend, I pick up the phone or meet in person to clear it up quickly.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Staying Calm in Chaos', text: 'When things go wrong all at once during an event or party, I keep a cool head and handle one thing at a time.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Learning Everyday Skills', text: 'I enjoy learning basic practical skills, like sewing a button, changing a flat tire, or unclogging a drain.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Creative Hacks', text: 'I love finding clever, low-cost life hacks to solve daily annoyances around the house.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Preventing Issues', text: 'I like taking care of little maintenance tasks early (like getting an oil change) before they turn into huge headaches.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Patience with Puzzles', text: 'I enjoy working through puzzles, brain teasers, or organizing messy spaces until everything fits.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Emergency Preparedness', text: 'I keep a basic emergency kit, flashlight, and first-aid supplies easily accessible at home.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Dealing with Bureaucracy', text: 'I can patiently handle annoying paperwork or customer service calls without losing my temper.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Common Sense', text: 'I value street smarts and practical everyday wisdom over fancy theoretical explanations.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Adapting to Constraints', text: 'When working with limited time or money, I get creative and make the most of what is available.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Untangling Clutter', text: 'I find it satisfying to clean out a cluttered closet or reorganize a chaotic garage.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Helping Friends', text: 'Friends often come to me when they need practical, level-headed advice on everyday dilemmas.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Observant Nature', text: 'I naturally notice small details in my environment that others often overlook.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Fixing Routine Snags', text: 'If a daily habit is not working, I change the setup instead of just relying on willpower.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Staying Objective', text: 'When analyzing a personal disagreement, I can step back and see both sides objectively.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'DIY Projects', text: 'I enjoy taking on DIY home improvement or gardening projects on the weekend.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Quick Thinking', text: 'I can think on my feet and come up with a backup plan in seconds when surprises happen.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Troubleshooting Devices', text: 'When WiFi goes down or a device won’t connect, I systematically restart and test things step by step.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Time Estimation', text: 'I am generally accurate when estimating how long a personal errand or drive will take.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Resolving Arguments', text: 'I focus on finding a fair resolution rather than trying to "win" an argument with someone I care about.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Curious Mind', text: 'When I see an interesting mechanism or tool, I want to understand how it works.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Simple Packing', text: 'I can pack for a week-long trip in a single carry-on bag without overpacking.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Handling Bad Weather', text: 'A sudden downpour on a day out is just an adventure to laugh through rather than a disaster.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Learning by Doing', text: 'I learn best by diving in and trying something hands-on rather than listening to lectures.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Decluttering Schedule', text: 'I know how to strip away non-essential tasks when life gets temporarily overwhelming.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Staying Grounded', text: 'I don’t get easily swept away by dramatic stories until I know the actual facts.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Practical Aesthetics', text: 'I prefer furniture and household goods that are durable and comfortable over things that just look fancy.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Self-Correction', text: 'If a project or plan is clearly going nowhere, I am willing to scrap it and start fresh.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Organizing Activities', text: 'I can plan a fun group outing with friends without making the logistics complicated.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Staying Inquisitive', text: 'I ask questions when I don’t understand something rather than nodding along blindly.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Financial Common Sense', text: 'I compare prices and look for good value without becoming obsessed over every penny.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Resource Sharing', text: 'I am happy to lend my tools or gear to friends who need them.', reversed: false, parameter: 'delegation_willingness' },
    { subdomain: 'Finding Alternatives', text: 'If a gym or park is closed, I find another spot to exercise without skipping my routine.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Clear Communication', text: 'When explaining directions or recipes to someone, I keep instructions simple and clear.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Living Resourcefully', text: 'I pride myself on being self-sufficient and able to take care of my own daily life.', reversed: false, parameter: 'autonomy_preference' }
  ],
  risk_and_uncertainty: [
    { subdomain: 'Trying New Foods', text: 'I eagerly try strange or unfamiliar foods when visiting new cultures or restaurants.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Comfort Zone', text: 'I prefer sticking to the exact same restaurants, dishes, and vacation spots where I know what to expect.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'Moving Cities', text: 'I would be open to moving to a new city or country for a few years just for the adventure.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Handling the Unknown', text: 'I get anxious and restless when I don’t know what my life will look like six months from now.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Taking Personal Leaps', text: 'Taking a calculated leap (like starting a side project or switching life paths) excites me more than it scares me.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Playing It Safe', text: 'I usually choose the safest, most predictable option in life to avoid any chance of regret or failure.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'Talking to Strangers', text: 'I enjoy striking up friendly conversations with people I meet in coffee shops, lines, or travel.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Spontaneous Road Trips', text: 'I would happily pack a bag and go on a spontaneous weekend road trip with friends on an hour’s notice.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Career Exploration', text: 'I would rather try an exciting new opportunity and risk it not working out than stay comfortable and bored.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Financial Risk', text: 'I feel very uncomfortable investing any money unless it has a guaranteed, safe return.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'Unplanned Weekends', text: 'Waking up on a Saturday with zero plans and complete freedom feels wonderful to me.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Meeting New People', text: 'Going to a social gathering where I barely know anyone sounds fun rather than intimidating.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Physical Adventure', text: 'I enjoy activities like hiking steep trails, trying water sports, or exploring nature off the beaten track.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Fear of Looking Silly', text: 'I avoid trying new physical activities (like dancing or a new sport) because I worry about looking silly.', reversed: true, parameter: 'failure_transparency' },
    { subdomain: 'Embracing Change', text: 'When a big unexpected change happens in my life, I look for the silver lining and new opportunities.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Handling Uncertainty', text: 'I am okay with not having all the answers before beginning a new journey or hobby.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Trying New Styles', text: 'I enjoy experimenting with new haircuts, outfits, or home decor from time to time.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Solo Travel', text: 'I would feel comfortable traveling by myself to a foreign city and exploring independently.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Living with Ambiguity', text: 'I can stay calm and happy even when major aspects of my future are still up in the air.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Calculated Risks', text: 'I believe that the biggest risk in life is never taking any risks at all.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Testing Limits', text: 'I like testing my own limits occasionally (like running a longer distance or fasting) to build mental grit.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Saying Yes to Opportunities', text: 'When a rare or interesting life opportunity comes up, my default instinct is to say yes.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Safe Routine', text: 'I feel most content when my daily life is steady, predictable, and free from surprises.', reversed: true, parameter: 'risk_tolerance' },
    { subdomain: 'Public Speaking', text: 'Giving a toast at a wedding or speaking to a group of friends does not make me terribly nervous.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Trusting People', text: 'I tend to give new people the benefit of the doubt rather than being overly guarded.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Uncertain Weather', text: 'I don’t cancel outdoor activities just because there is a small chance of rain.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Investing in Yourself', text: 'I am willing to spend money on personal education, classes, and tools to learn new skills.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Handling Rejection', text: 'If I ask someone out or apply for something and get rejected, I move on quickly without taking it to heart.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Exploring Unfamiliar Neighborhoods', text: 'I like getting lost on foot in a new neighborhood to see what hidden gems I can discover.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Changing Living Arrangements', text: 'I find moving into a new home or apartment refreshing rather than purely stressful.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Letting Go of Control', text: 'I accept that I cannot control everything that happens to me, only how I respond.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Trying New Routines', text: 'I like switching up my workout or morning routine every few months to keep things fresh.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Financial Backups', text: 'Having a solid safety net makes me feel bold enough to take exciting personal chances.', reversed: false, parameter: 'reversibility_sensitivity' },
    { subdomain: 'Dealing with Surprises', text: 'When someone surprises me with sudden plans, I usually roll with it happily.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Open to Romance', text: 'I am willing to be emotionally vulnerable with someone even if there is a risk of getting hurt.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Challenging Beliefs', text: 'I enjoy having friendly conversations with people who have completely different political or spiritual views.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Stepping into the Spotlight', text: 'I don’t mind being the center of attention in a room full of people.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Learning Tough Lessons', text: 'I would rather try something and fail than always wonder what could have happened.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Adapting to Chaos', text: 'When traveling in countries where things are chaotic and disorganized, I find it charming rather than infuriating.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Embracing the Unpredictable', text: 'Life would be boring if everything went exactly according to plan 100% of the time.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Trying Creative Hobbies', text: 'I am willing to try creative pursuits (like painting or playing guitar) even if I have no natural talent.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Personal Courage', text: 'I have the courage to walk away from bad friendships or toxic environments even when it feels scary.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Handling Feedback', text: 'I welcome direct, honest feedback from close friends because it helps me grow.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Curiosity Over Fear', text: 'When encountering something strange or unfamiliar, my primary emotion is curiosity rather than suspicion.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Living Without Guarantees', text: 'I don’t need guaranteed outcomes to feel excited about starting a new life chapter.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Spontaneous Generosity', text: 'I like leaving generous tips or doing unexpected kind deeds for strangers on a whim.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Trying New Sports', text: 'I am game to try new recreational sports or activities at least once.', reversed: false, parameter: 'risk_tolerance' },
    { subdomain: 'Building Confidence', text: 'Every time I push through fear and do something uncomfortable, my self-confidence grows.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Trusting the Future', text: 'I have an underlying optimism that things usually work out in the end if you put in honest effort.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Living Boldly', text: 'I want my life story to be filled with interesting experiences rather than safe regrets.', reversed: false, parameter: 'risk_tolerance' }
  ],
  epistemic_updating: [
    { subdomain: 'Changing Your Mind', text: 'When someone shares compelling facts that contradict my personal opinion, I readily change my mind.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Admitting Being Wrong', text: 'I find it very hard to admit when I was wrong during an argument with a friend or partner.', reversed: true, parameter: 'epistemic_plasticity' },
    { subdomain: 'Seeking Other Perspectives', text: 'I actively read articles or books from authors whose views I normally disagree with.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'First Impressions', text: 'I assume my initial gut impression of a new person is almost always accurate and rarely changes.', reversed: true, parameter: 'epistemic_plasticity' },
    { subdomain: 'Evolving Beliefs', text: 'I hold significantly different views on lifestyle, career, or politics today compared to five years ago.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Handling Criticism', text: 'I get defensive and angry inside when someone points out a blind spot in my thinking.', reversed: true, parameter: 'epistemic_plasticity' },
    { subdomain: 'Saying "I Don’t Know"', text: 'I am completely comfortable saying "I honestly don’t know enough about that to have an opinion."', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Fact-Checking', text: 'When I see a dramatic headline or viral rumor on social media, I check whether it is actually true before sharing it.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Questioning Assumptions', text: 'I regularly question my own daily habits and ask myself if there is a better way to do things.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Intellectual Humility', text: 'I realize how little I truly know about the complex world around me.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Nuanced Thinking', text: 'I recognize that most real-life debates have valid points on both sides rather than being pure black and white.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Listening to Understand', text: 'When listening to someone explain their view, I focus on understanding them rather than just waiting for my turn to talk.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Updating Daily Habits', text: 'If new reliable health information shows a habit is bad for me, I make an effort to change it.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Acknowledging Bias', text: 'I am aware of my own personal biases and try to catch myself when they cloud my judgment.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Learning from Opponents', text: 'I can respect someone’s intelligence and character even if we disagree on fundamental life issues.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Testing Hypotheses', text: 'I like testing personal lifestyle changes (like changing sleep times or coffee intake) to see what actually works for my body.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Open to New Music', text: 'I enjoy discovering new musical genres and artists that I used to dislike.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Dropping Old Feuds', text: 'I am willing to let go of old disagreements once the facts become clear.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Re-evaluating Past Choices', text: 'I can look back on my past decisions with honesty and see where I acted foolishly.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Staying Inquisitive', text: 'I find people with unique backgrounds and life paths fascinating to talk to.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Comfort with Nuance', text: 'I am suspicious of people who claim to have simple, 100% certain answers to every complex problem.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Changing Daily Routines', text: 'If my morning routine stops serving me, I throw it out and try something new without hesitation.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Evaluating Evidence', text: 'I look for concrete, real-world proof before buying into bold wellness or productivity claims.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Empathy in Disagreements', text: 'I try to understand what life experiences made someone hold the opinions they have.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Self-Correction', text: 'If I catch myself saying something inaccurate, I correct myself openly in front of others.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Flexibility in Plans', text: 'I don’t cling stubbornly to an idea when everyone around me sees that it is not working.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Curiosity About Culture', text: 'I enjoy learning about cultural customs and traditions that are completely different from my own.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Independent Verification', text: 'I prefer doing my own research rather than accepting what popular influencers tell me.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Lifelong Growth', text: 'I believe a person should never stop learning and refining their understanding of life.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Grace with Others', text: 'I give people room to change their minds without teasing them about what they believed in the past.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Appreciating Feedback', text: 'Constructive criticism from a loved one feels like a gift rather than an attack.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Re-reading Books', text: 'I find that re-reading a great book years later reveals completely new insights because I have grown.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Patience with Complex Topics', text: 'I take time to think through complicated questions rather than jumping to immediate conclusions.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Questioning Conventional Wisdom', text: 'Just because "everyone does it this way" does not mean it is the right way for me.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Reflecting on Mistakes', text: 'I write down or think about lessons learned when a personal plan fails.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Humor About Errors', text: 'I can laugh at my own silly assumptions when reality proves me wrong.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Welcoming Better Ideas', text: 'I don’t care whose idea it was; I just want to go with whatever idea actually works best.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Skepticism of Hype', text: 'When a new diet or product goes viral, my initial reaction is healthy skepticism.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Seeking Mentorship', text: 'I enjoy talking to older, wiser people to learn from their life journeys and mistakes.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Broad Horizons', text: 'I like reading about history, science, psychology, and philosophy just to broaden my worldview.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Adapting to New Tools', text: 'I readily adopt better everyday tools or apps when they genuinely save me time.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Non-Defensive Posture', text: 'I can remain calm when someone challenges my point of view in a friendly conversation.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Deepening Self-Awareness', text: 'I spend time thinking about what triggers my emotional reactions so I can handle them better.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Unlearning Bad Habits', text: 'I have successfully broken unhealthy personal habits once I realized the harm they were causing.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Observing Reality', text: 'I trust what I see with my own eyes over polished marketing and pretty promises.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Staying Teachable', text: 'I treat every person I meet as someone who knows something I don’t.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Balancing Conviction & Openness', text: 'I hold strong values while remaining flexible on the specific ways to live them out.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Recognizing Growth', text: 'I feel proud when I look back and see how much more mature I am today than a few years ago.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Embracing Questions', text: 'I am comfortable with having unanswered questions about life, universe, and the future.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Intellectual Clarity', text: 'I strive for clear, honest thinking in my everyday life.', reversed: false, parameter: 'first_principles_ratio' }
  ],
  interpersonal_and_candor: [
    { subdomain: 'Direct Honesty', text: 'If a close friend asks for my honest opinion, I tell them the gentle truth rather than giving fake flattery.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'People Pleasing', text: 'I often agree with people or bite my tongue just to prevent any possible tension in the room.', reversed: true, parameter: 'candor_directness' },
    { subdomain: 'Healthy Disagreements', text: 'I can have a calm, constructive conversation with a friend even when we see things completely differently.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Passive Aggression', text: 'When someone upsets me, I tend to give them the silent treatment or make sarcastic comments instead of talking directly.', reversed: true, parameter: 'candor_directness' },
    { subdomain: 'Setting Boundaries', text: 'I am comfortable letting friends know when a boundary has been crossed, without getting aggressive.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Sincere Apologies', text: 'I apologize quickly and sincerely when I realize my words or actions hurt someone.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Resolving Tension', text: 'I prefer talking through relationship friction right away rather than letting awkward feelings linger for weeks.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Expressing Gratitude', text: 'I make a habit of telling the people in my life how much I appreciate and value them.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Saying No to Demands', text: 'I can firmly turn down unreasonable requests from family or friends without feeling guilty for days.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Emotional Support', text: 'When a friend is going through a hard time, I focus on listening with empathy before offering unsolicited advice.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Speaking with Tact', text: 'I know how to deliver constructive feedback kindly without tearing down the other person’s confidence.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Avoiding Drama', text: 'I actively steer clear of gossipy friend groups and unnecessary interpersonal drama.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Showing Vulnerability', text: 'I find it easy to open up to close friends about my personal struggles and insecurities.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Patience with Quirks', text: 'I am patient with friends’ little eccentricities and don’t try to change them.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Calling Out Bad Behavior', text: 'If someone is being cruel or unfair to a friend in my presence, I speak up to defend them.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Keeping Confidences', text: 'When a friend shares a private secret with me, I guard it and never repeat it to anyone.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Deep Friendship', text: 'I put genuine effort into maintaining long-term friendships through phone calls, visits, and quality time.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Accepting Apologies', text: 'When someone genuinely apologizes to me, I accept it and let the issue go completely.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Jealousy', text: 'I talk through feelings of jealousy or insecurity openly with my partner instead of acting out.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Clear Expectations', text: 'I communicate what I need in relationships clearly rather than expecting people to read my mind.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Respecting Privacy', text: 'I respect other people’s personal space and don’t pry into things they don’t want to discuss.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Celebrating Others', text: 'I love throwing surprises or celebrating my friends when they achieve something special.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Calm Demeanor', text: 'I rarely raise my voice or shout during personal arguments.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Genuine Compliments', text: 'When I compliment someone, it comes from a genuine place, never from flattery.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Giving Space', text: 'When a loved one is having a rough day and needs alone time, I give them space without taking it personally.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Being Dependable', text: 'My friends know they can call me in the middle of the night if they ever have an emergency.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Cutting Toxic Ties', text: 'I have the strength to walk away from one-sided friendships where I am constantly taken advantage of.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Active Listening', text: 'I put my phone away when having a one-on-one conversation over coffee or dinner.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Handling Differences', text: 'I enjoy being around friends who have different interests, personalities, and styles than me.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Straightforward Communication', text: 'I prefer people to be direct with me rather than hinting at what they want.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Being Approachable', text: 'People usually find it easy to start a conversation with me and feel comfortable around me.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Holding Grudges', text: 'I tend to replay past insults or slight offenses in my mind for months after they happened.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Encouraging Loved Ones', text: 'I am a vocal cheerleader for my friends’ dreams and creative pursuits.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Honest Praise', text: 'I point out what I genuinely admire in people rather than keeping it to myself.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Handling Misunderstandings', text: 'If a text message sounds blunt, I give the sender the benefit of the doubt rather than assuming bad intent.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Personal Warmth', text: 'I naturally make new guests feel welcome when they visit my home.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Sharing Honest Feelings', text: 'I can tell a partner "I am feeling overwhelmed today" without fearing judgment.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Fair Compromises', text: 'When planning a trip with a partner, I am happy to meet in the middle on activities and dining.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Navigating Family Dynamics', text: 'I can maintain healthy boundaries with difficult family members while remaining respectful.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Mutual Respect', text: 'I treat cashiers, servers, and hospitality workers with the exact same respect as high-status professionals.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Expressing Affection', text: 'I am comfortable expressing affection and warmth to people I love.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Reconnecting Easily', text: 'With true friends, we can go months without talking and pick up right where we left off without weirdness.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Staying Grounded in Conflict', text: 'I separate the problem from the person when resolving a conflict with a loved one.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Self-Restraint', text: 'I have the self-control to bite my tongue when a snarky comment would only cause unnecessary pain.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Valuing Real Connection', text: 'I would rather spend an evening having a meaningful conversation with one person than mingling at a loud party.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Being True in Public', text: 'I act the same way around my closest friends as I do in wider social circles.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Kindness Over Cruelty', text: 'I never make fun of someone for things they cannot control.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Gentle Corrections', text: 'If a friend has something stuck in their teeth or a stain on their shirt, I tell them quietly right away.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Building Trust', text: 'I believe trust is built through small, consistent actions over time rather than grand gestures.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Living with Empathy', text: 'I genuinely care about how my actions impact the emotional wellbeing of those around me.', reversed: false, parameter: 'consensus_orientation' }
  ],
  curiosity_and_depth: [
    { subdomain: 'Late-Night Rabbit Holes', text: 'I often lose track of time late at night reading about a random, fascinating topic that caught my interest.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Learning for Fun', text: 'I rarely feel motivated to read non-fiction or learn new topics unless I am forced to for school or obligations.', reversed: true, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Personal Hobbies', text: 'I have several personal hobbies (like cooking, writing, gardening, crafts, or music) that bring me pure joy.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'How Things Work', text: 'I enjoy learning how everyday machines, nature, or human psychology work beneath the surface.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Exploring Museums & Towns', text: 'When I visit a new town or museum, I love wandering down every side street and reading the little plaques.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Getting Bored Easily', text: 'I get restless and bored if I go too long without learning a new skill or exploring a fun personal project.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Reading Books', text: 'I love curling up with a great book and getting completely absorbed in its world for hours.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Documentaries & Podcasts', text: 'I regularly listen to podcasts or watch documentaries about history, science, true crime, or philosophy.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Creative Expression', text: 'I enjoy creative hobbies where I make something with my hands or mind from scratch.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Daydreaming & Ideas', text: 'I often find myself daydreaming about creative ideas, travel adventures, or story concepts.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Deep Conversations', text: 'I find conversations about astronomy, human nature, or the universe far more interesting than celebrity gossip.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Curiosity About People', text: 'I love asking older relatives or strangers about what life was like when they were young.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Collecting Knowledge', text: 'I remember lots of fascinating, quirky facts about random topics that come up in conversation.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Learning an Instrument or Language', text: 'I have tried learning an instrument, a foreign language, or an artistic craft just for personal enrichment.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Nature Observation', text: 'I enjoy sitting in a park or forest and observing birds, plants, and natural surroundings with genuine curiosity.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Investigating Mysteries', text: 'When I hear an unsolved mystery or unexplained phenomenon, I want to dig into theories about what happened.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Curiosity in the Kitchen', text: 'I like experimenting with new spices, cooking techniques, and recipes from around the world.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Asking "Why?"', text: 'I frequently ask myself "why do we do it this way?" about daily societal conventions.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Appreciating Art & Architecture', text: 'I notice and appreciate beautiful architecture, craftsmanship, and visual design in everyday spaces.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Following Passions', text: 'When a topic excites me, I will read five different books or articles on it in a single week.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Taking Notes & Journaling', text: 'I like jotting down interesting thoughts, quotes, or ideas in a notebook or phone note.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Understanding Both Sides', text: 'I enjoy researching historical events from multiple perspectives to see how different people experienced them.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Exploring Science & Nature', text: 'I am amazed by how science explains everyday wonders, like weather patterns or how our senses work.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Watching Stargazing', text: 'Looking up at the night sky and stars fills me with a sense of wonder and perspective.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Trying New Games', text: 'I enjoy learning new strategic board games or puzzle games with friends.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Writing for Pleasure', text: 'I enjoy writing thoughts, letters, or creative stories simply for the pleasure of expressing myself.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Curiosity Over Judgment', text: 'When someone has an unusual hobby or obsession, I find it cool and want to hear all about it.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Visiting Botanical Gardens', text: 'I enjoy visiting botanical gardens, zoos, and science exhibits to learn about living things.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Exploring Old Maps', text: 'I can spend an hour looking at historical maps or satellite imagery just exploring geography.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Learning from Children', text: 'I love how young children ask endless questions and try to keep that same sense of wonder alive.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Crafting & Building', text: 'There is a unique joy in building a piece of woodwork, sewing an outfit, or planting a vegetable garden.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Tasting Nuances', text: 'I enjoy learning to taste the subtle flavor notes in different coffees, teas, or chocolates.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Watching Masterclass Content', text: 'I love watching skilled artisans or experts explain their craft with passion and precision.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Exploring Philosophy', text: 'Thinking about ethical dilemmas and how to live a good life is deeply interesting to me.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Appreciating Music Details', text: 'I listen to music with good headphones to catch all the subtle instruments and production layers.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Visiting Libraries & Bookstores', text: 'Browsing through aisles of books in a quiet library or cozy bookstore is my idea of a great afternoon.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Understanding Human Behavior', text: 'I love observing human dynamics and psychology in public spaces like airports or plazas.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Learning DIY Skills', text: 'I regularly watch video tutorials to learn how to do basic plumbing, carpentry, or car care.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Keeping an Open Imagination', text: 'I enjoy science fiction and fantasy stories that imagine completely different worlds.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Finding Hidden Beauty', text: 'I notice beautiful light, shadows, and textures in ordinary everyday scenes.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Investigating History', text: 'I love learning the surprising origin stories of everyday sayings, foods, and holidays.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Deep Knowledge', text: 'I prefer gaining deep mastery in a few passions rather than superficial familiarity with a hundred things.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Joy of Discovery', text: 'Finding an amazing, obscure song or indie film that few people know about gives me a thrill.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Staying Inquisitive', text: 'My curiosity never really shuts off; I am always wondering how or why something is the way it is.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Documenting Life', text: 'I like taking meaningful photos of small moments rather than staged selfies.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Taught Skills', text: 'Many of my most useful personal skills were completely self-taught out of pure interest.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Engaging with Ideas', text: 'I love debating big ideas with friends in a friendly, respectful atmosphere over dinner.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Cherishing Solitude for Hobbies', text: 'I look forward to quiet weekends where I can get lost in my favorite personal projects.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Evergreen Curiosity', text: 'I believe staying curious is one of the best secrets to staying young at heart.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Rich Inner Life', text: 'I have a rich inner world of thoughts, curiosities, and ideas that keeps me from ever feeling bored.', reversed: false, parameter: 'autonomy_preference' }
  ],
  stress_and_resilience: [
    { subdomain: 'Handling Delays', text: 'When traffic jams, long lines, or transit delays happen, I stay relaxed and listen to music rather than fuming.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Daily Annoyances', text: 'Small everyday annoyances (like a spilled coffee or a slow app) easily ruin my mood for hours.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Bouncing Back', text: 'I bounce back quickly after experiencing a personal setback, bad day, or disappointment.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Calm in Emergencies', text: 'When an emergency happens at home, I stay level-headed, think clearly, and take care of what needs doing.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Catastrophizing', text: 'I often spiral into worst-case scenarios in my head when facing an uncertain situation.', reversed: true, parameter: 'stress_neutrality' },
    { subdomain: 'Decompressing Healthily', text: 'I know healthy ways to decompress (like a walk, workout, or calling a friend) when life feels overwhelming.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling High Pressure', text: 'I perform well under tight deadlines or high-pressure situations without freezing up.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Sleeping Well', text: 'I can easily quiet my mind and fall asleep even when there is unfinished business on my to-do list.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Patience with People', text: 'I am patient with people who are moving slowly, learning something new, or having an off day.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Physical Stress Awareness', text: 'I notice where my body holds tension (like tight shoulders) and take deep breaths to release it.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Not Taking Things Personally', text: 'When someone is rude or grumpy in public, I assume they are having a rough day rather than taking it personally.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Laughing at Chaos', text: 'I can find the humor and laugh when everything that could go wrong goes wrong in a ridiculous way.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Criticism', text: 'Harsh words or criticism from people who don’t know me do not shake my self-worth.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Dealing with Bad News', text: 'When I receive disappointing news, I give myself time to feel it, then focus on the next step forward.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Remaining Even-Tempered', text: 'My friends would describe me as emotionally steady and calm rather than volatile.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Managing Life Overload', text: 'When my calendar gets too packed, I know how to trim back commitments to protect my health.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Patience in Customer Service', text: 'I treat customer service representatives with patience even when resolving a frustrating billing issue.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Physical Discomfort', text: 'I can tolerate bad weather, a sore muscle, or a cold room without complaining endlessly.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Staying Grounded', text: 'I stay calm during medical appointments, dental visits, or routine procedures.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Releasing Control', text: 'I don’t waste emotional energy stressing over things that are completely outside of my control.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Staying Focused in Noise', text: 'I can focus on a book or conversation even in a noisy, crowded environment.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Resolving Arguments Calmly', text: 'During intense disagreements, I keep my voice calm and avoid throwing cheap insults.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Recovery After Illness', text: 'When I get sick, I rest properly and allow my body time to recover without feeling guilty.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Unexpected Expenses', text: 'When an unexpected car repair or home bill pops up, I handle the logistics without losing sleep.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Perspective on Life', text: 'I remind myself that most things that feel like huge emergencies today won’t matter in five years.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Self-Soothing', text: 'I have practical habits (like taking a hot shower or drinking herbal tea) that help me reset after a long day.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Stepping Back from Drama', text: 'I don’t get sucked into other people’s emotional storms unless I can genuinely help them.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Handling Exam or Interview Jitters', text: 'A little nervous excitement helps me focus rather than paralyzing me.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Patience with Kids & Pets', text: 'I am patient and gentle when young children or pets act up or make messes.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Accepting Imperfect Days', text: 'I accept that some days are just unproductive or messy, and that is okay.', reversed: false, parameter: 'technical_debt_tolerance' },
    { subdomain: 'Maintaining Routine Under Stress', text: 'Even during busy periods, I maintain basic self-care like brushing teeth, eating meals, and hydrating.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Staying Positive', text: 'I naturally look for reasons to be grateful even when circumstances are challenging.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Dealing with Crowds', text: 'I can navigate busy malls or airports without feeling completely drained or panicked.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Moving Days', text: 'Moving houses is definitely tiring, but I take it box by box without having a meltdown.', reversed: false, parameter: 'crisis_decisiveness' },
    { subdomain: 'Letting Go of Envy', text: 'I don’t let other people’s flashy social media highlights make me feel insecure about my own life.', reversed: false, parameter: 'hype_skepticism' },
    { subdomain: 'Emotional Maturity', text: 'I take responsibility for my own mood rather than expecting others to fix it for me.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Quiet Confidence', text: 'I have an inner sense of calm that doesn’t depend on constant external praise.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Handling Disorganized People', text: 'I can work smoothly alongside friends who are messy or spontaneous without getting furious.', reversed: false, parameter: 'technical_debt_tolerance' },
    { subdomain: 'Dealing with Lost Items', text: 'If I drop and break a favorite mug or lose a pair of sunglasses, I accept it with a sigh and move on.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Schedule Shifts', text: 'When a friend cancels dinner at the last minute, I enjoy having a quiet evening at home instead.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Building Mental Grit', text: 'Hard times in my past have made me much stronger and more resilient today.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Staying Cool in Negotiations', text: 'I can negotiate the price of a car or rent politely and firmly without getting flustered.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Breathwork & Mindfulness', text: 'Taking three slow, deep breaths helps me instantly reset my nervous system.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Handling Public Mistakes', text: 'If I stumble or trip in public, I laugh it off rather than feeling deeply mortified.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Patience with Tech Glitches', text: 'When video calls drop or software buffers, I wait patiently without smacking the desk.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Emotional Boundaries', text: 'I can support a friend through their grief without absorbing all their pain into my own body.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Steady Energy', text: 'My energy levels throughout the day are relatively steady without massive crashes.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Uncertainty', text: 'I can live happily with the fact that tomorrow is never 100% guaranteed.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Self-Forgiveness', text: 'I forgive myself for past mistakes once I have made amends and learned the lesson.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Inner Peace', text: 'I have cultivated a peaceful relationship with my own mind.', reversed: false, parameter: 'stress_neutrality' }
  ],
  execution_and_velocity: [
    { subdomain: 'Beating Procrastination', text: 'When I have an annoying personal task (like making a dentist appointment or mailing a parcel), I do it right away rather than putting it off.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Putting Off Chores', text: 'I frequently put off important personal chores until the last possible minute.', reversed: true, parameter: 'velocity_bias' },
    { subdomain: 'Keeping Promises to Yourself', text: 'When I set a private personal goal (like going for a morning jog), I stick to it even when nobody is watching.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Finishing What You Start', text: 'I often start exciting personal projects with high energy but abandon them halfway through.', reversed: true, parameter: 'craft_perfectionism' },
    { subdomain: 'Morning Momentum', text: 'Getting one or two small productive things done early in the morning sets a great tone for my entire day.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Tidy Space', text: 'I tidy up my kitchen and desk at the end of each day so I can start fresh the next morning.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Steady Daily Habits', text: 'I believe small, steady daily habits beat massive bursts of irregular effort every time.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Action Over Overthinking', text: 'I would rather take imperfect action today than spend weeks planning the "perfect" routine that never happens.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Unpacking After Trips', text: 'When I get home from a trip, I unpack my suitcase and put away laundry within 24 hours.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Managing Daily Tasks', text: 'I use a simple to-do list or calendar on my phone to keep track of important appointments and errands.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Overcoming Friction', text: 'I lay out my gym clothes or prep breakfast the night before to make good habits frictionless.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Quick Errands', text: 'If a chore takes less than two minutes to do (like hanging up a coat), I do it immediately.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Focus on One Thing', text: 'I focus on completing one personal task at a time rather than juggling five things poorly.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Consistent Sleep Schedule', text: 'I go to bed and wake up at roughly the same time every day, even on weekends.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Punctuality', text: 'I arrive on time or a few minutes early to personal meetups and appointments.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Decluttering Regularly', text: 'I regularly go through my inbox, photos, or closet and delete what I don’t need.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Finishing Errands in Batches', text: 'I like knocking out all my weekly grocery shopping and errands in one efficient trip.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Making the Bed', text: 'I make my bed most mornings because it brings a sense of order to my room.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Turning Ideas into Reality', text: 'When I get a fun idea for a recipe, outing, or gift, I actually make it happen rather than just daydreaming.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Managing Screen Time', text: 'I set healthy boundaries on my phone screen time so I don’t mindlessly scroll away my evenings.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Doing Difficult Things First', text: 'I prefer tackling the hardest or least pleasant errand first so I can enjoy the rest of my day in peace.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Cooking Real Meals', text: 'I cook fresh, nutritious meals at home on most weeknights rather than ordering takeout every day.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Staying Hydrated & Active', text: 'Drinking enough water and getting daily movement are non-negotiable habits for me.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Replying to Messages', text: 'I reply to messages from close friends in a timely manner without leaving them on read for weeks.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Organized Finances', text: 'I know roughly how much money I spend each month and review my bank statements regularly.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Keeping Things in Their Place', text: 'I have designated spots for my keys, wallet, and glasses so I rarely lose them.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Following Workout Routines', text: 'I exercise regularly each week because it keeps my body strong and my mind clear.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Quick Cleanup', text: 'I wash dishes right after cooking rather than letting a mountain of dirty plates sit in the sink overnight.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Personal Discipline', text: 'I have the willpower to say no to short-term temptations when they conflict with my long-term health.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Energy Management', text: 'I schedule demanding activities during the hours of the day when my energy is naturally highest.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Car Maintenance', text: 'I keep my car clean and take it in for regular service without waiting for warning lights to flash.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Finishing the Book', text: 'When I read a compelling book, I finish it within a couple of weeks rather than letting it sit on my nightstand for a year.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Clear Decision Deadlines', text: 'I give myself a clear deadline to make personal choices so I don’t sit in limbo indefinitely.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Setting Daily Top Priorities', text: 'I know the one or two most important things I want to accomplish on any given day.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Practicing a Craft', text: 'I dedicate time every week to practice my musical instrument, writing, or art.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Starter Attitude', text: 'I don’t need someone to tell me to get moving on personal projects; I take the initiative myself.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Maintaining Personal Space', text: 'I keep my bathroom, bedroom, and kitchen clean and sanitary.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Quick Action on Repairs', text: 'When a lightbulb burns out or a hinge squeaks, I fix or replace it within a couple of days.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Budgeting & Saving', text: 'I automatically save a portion of my income every paycheck before spending on fun.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Streamlined Wardrobe', text: 'I keep a functional wardrobe where most clothes match easily, making morning decisions effortless.', reversed: false, parameter: 'abstraction_tolerance' },
    { subdomain: 'Reflecting on Weekly Progress', text: 'On Sunday evenings, I like taking ten minutes to look over the coming week and prepare.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Taking the First Step', text: 'I know that the hardest part of any new habit is simply starting, so I focus on getting over that initial hurdle.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Avoiding Distraction Traps', text: 'I leave my phone in another room when I want to read deeply or spend quality time with loved ones.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Finishing Gifts on Time', text: 'I buy or make birthday gifts well ahead of time rather than scrambling on the day of the event.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Continuous Improvement', text: 'I like finding small ways to make my daily routine 1% smoother and more enjoyable.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Walking Daily', text: 'I try to get fresh air and walk outside every single day, rain or shine.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Honoring Deadlines', text: 'I file my taxes, renew licenses, and pay rent well before the deadline.', reversed: false, parameter: 'formalism_weight' },
    { subdomain: 'Maintaining Momentum', text: 'When I get into a productive flow, I ride the wave and get a ton done in one sitting.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Celebrating Small Wins', text: 'I celebrate finishing small milestones because it keeps my daily motivation high.', reversed: false, parameter: 'consensus_orientation' },
    { subdomain: 'Living with Purpose', text: 'I go to sleep at night feeling like I made good, meaningful use of my day.', reversed: false, parameter: 'craft_perfectionism' }
  ],
  autonomy_and_work_ethic: [
    { subdomain: 'Comfort in Solitude', text: 'I am completely comfortable spending a whole weekend alone doing activities I enjoy without feeling lonely.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Need for Constant Company', text: 'I feel anxious or bored if I have to spend more than a few hours by myself at home.', reversed: true, parameter: 'autonomy_preference' },
    { subdomain: 'Independent Life Choices', text: 'I make my own life decisions based on what feels right for me, even when family or peers disagree.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'People-Pleasing Favors', text: 'I find myself agreeing to favors I dislike simply because I am terrified of letting people down.', reversed: true, parameter: 'consensus_orientation' },
    { subdomain: 'Solo Activities', text: 'I enjoy going to the cinema, a cafe, or a museum by myself from time to time.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Taking Full Responsibility', text: 'I take 100% personal responsibility for my own happiness rather than blaming outside circumstances.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Protecting Private Time', text: 'I protect my private time and don’t feel obligated to reply to non-urgent messages immediately.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Self-Reliance', text: 'I take pride in being able to manage my own finances, cooking, and household independently.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Resisting Peer Pressure', text: 'I have no trouble saying "no thanks" to drinking, staying out late, or spending money when I don’t want to.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Following Your Own Schedule', text: 'I work best when I can set my own daily rhythm and work at my own pace.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Crafting Your Own Identity', text: 'I don’t define myself by social labels or peer group expectations; I define who I am.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Solo Travel', text: 'I love the freedom of traveling alone where I can wake up and decide what to do without compromising.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Personal Integrity', text: 'I hold myself to high standards because of my own internal compass, not because of external rules.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Saying No to Toxic Dynamics', text: 'I am willing to distance myself from relatives or friends who bring constant negativity and disrespect.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Self-Validation', text: 'I don’t need constant likes or validation on social media to feel good about what I am doing.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Managing My Own Health', text: 'I take proactive care of my physical and mental health without needing someone to remind me.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Financial Independence', text: 'Being financially self-sufficient and free from relying on others is a huge life priority for me.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Comfortable in My Own Skin', text: 'I feel at home with who I am, including my quiet moments and idiosyncratic habits.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Making Your Own Living Space', text: 'I enjoy designing and arranging my living space so that it reflects my personal taste and comfort.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Unconventional Career Paths', text: 'I would rather pursue a career that genuinely fits my passions than follow a traditional corporate ladder just to look successful.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Self-Motivated Learning', text: 'I learn new skills because of my own curiosity, never just because someone assigned it.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Independent Opinions', text: 'I form my views through personal reflection rather than repeating whatever talking points are popular online.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Emotional Independence', text: 'My mood is grounded in my own inner peace rather than being a rollercoaster dictated by other people’s drama.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Handling Solitary Tasks', text: 'I can happily spend hours focused on deep reading, writing, or creating without needing background chatter.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Creating Your Own Traditions', text: 'I like creating my own personal holiday rituals and weekend traditions that bring me joy.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Self-Care Without Guilt', text: 'I can take a relaxing bath or spend an afternoon reading without feeling guilty about "wasting time".', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Freedom of Speech', text: 'I express my thoughts respectfully, even when the rest of the room holds a different view.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Setting Personal Limits', text: 'I know my personal limits and step away from overwhelming environments before I burn out.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Owning Your Choices', text: 'When a personal gamble fails, I own the outcome 100% without feeling like a victim.', reversed: false, parameter: 'failure_transparency' },
    { subdomain: 'Living Outside the Mold', text: 'I am proud of the ways my lifestyle differs from conventional expectations.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Finding Meaning on Your Own', text: 'I find meaning through my relationships, creative passions, and everyday experiences.', reversed: false, parameter: 'pragmatic_empiricism' },
    { subdomain: 'Self-Discipline as Freedom', text: 'I see personal discipline as the ultimate tool for creating true freedom in life.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Saying No to Over-Commitment', text: 'I refuse to say yes to every social event just to keep up appearances.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Direct Problem Solving', text: 'When I want something to change in my life, I take direct action rather than complaining to friends for months.', reversed: false, parameter: 'velocity_bias' },
    { subdomain: 'Emotional Clarity', text: 'I check in with myself regularly to understand what I genuinely feel and need.', reversed: false, parameter: 'first_principles_ratio' },
    { subdomain: 'Authentic Friendships', text: 'I only invest in friendships where we can both be 100% ourselves without masks.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Comfortable with Silence', text: 'I am comfortable with long, companionable silences when spending time with close loved ones.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Living Intentionally', text: 'I make conscious choices about how I spend my time, money, and attention every day.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Self-Forgiveness and Freedom', text: 'I don’t let past regrets hold me prisoner; I focus on who I am choosing to be today.', reversed: false, parameter: 'epistemic_plasticity' },
    { subdomain: 'Relying on Internal Strength', text: 'I have faith in my own resilience to handle whatever unexpected challenges life throws at me.', reversed: false, parameter: 'stress_neutrality' },
    { subdomain: 'Unapologetic Passions', text: 'I enjoy my favorite hobbies and interests with zero embarrassment, regardless of what others think.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Maintaining Personal Space', text: 'Having a quiet, private sanctuary to come home to at the end of the day is essential for my wellbeing.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Navigating Solo Projects', text: 'I love taking an idea from a simple sketch to a finished project through my own dedication.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Honoring Your Word', text: 'I keep promises to myself with the exact same rigor that I keep promises to others.', reversed: false, parameter: 'craft_perfectionism' },
    { subdomain: 'Free from Petty Drama', text: 'I stay above gossip and petty rumors because I have far more interesting things to focus on.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'True Freedom', text: 'To me, the greatest luxury in life is having control over your own time and calendar.', reversed: false, parameter: 'autonomy_preference' },
    { subdomain: 'Self-Sufficient Joy', text: 'I don’t rely on others to entertain me; I can always find something fascinating to do.', reversed: false, parameter: 'rabbit_hole_curiosity' },
    { subdomain: 'Clear Personal Boundaries', text: 'I clearly know what I will and will not tolerate in my relationships and living space.', reversed: false, parameter: 'scope_ruthlessness' },
    { subdomain: 'Living Authentically', text: 'I would rather be loved for who I really am than adored for a false persona.', reversed: false, parameter: 'candor_directness' },
    { subdomain: 'Peaceful Sovereignty', text: 'I am the author of my own life, and I write my story with intention, gratitude, and courage.', reversed: false, parameter: 'autonomy_preference' }
  ]
};

// Generate 500 validated, indexed question array
export const LIKERT_500_QUESTIONS: LikertQuestion[] = (() => {
  const result: LikertQuestion[] = [];
  let globalIndex = 1;

  const domains = Object.keys(rawDomainQuestions) as LikertDomain[];
  for (const domain of domains) {
    const list = rawDomainQuestions[domain];
    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      const id = `likert_${String(globalIndex).padStart(3, '0')}`;
      result.push({
        id,
        index: globalIndex,
        domain,
        subdomain: q.subdomain,
        text: q.text,
        reversed: q.reversed,
        mapped_parameter: q.parameter,
        weight: q.weight || 1.0,
      });
      globalIndex++;
    }
  }

  return result;
})();

export const PARAMETER_METADATA: Record<PersonalityParameterKey, {
  label: string;
  category: string;
  description: string;
  low_pole: string;
  high_pole: string;
  weight: number;
}> = {
  velocity_bias: {
    label: 'Action vs Deliberation',
    category: 'daily_habits',
    description: 'Tendency to take action and make decisions quickly versus waiting, planning, and overthinking.',
    low_pole: 'Deliberate & Cautious',
    high_pole: 'Decisive & Action-Oriented',
    weight: 1.0,
  },
  formalism_weight: {
    label: 'Structure & Routine',
    category: 'daily_habits',
    description: 'Preference for organized schedules, tidy living spaces, and punctuality versus spontaneous flow.',
    low_pole: 'Flexible & Spontaneous',
    high_pole: 'Organized & Structured',
    weight: 1.0,
  },
  risk_tolerance: {
    label: 'Life Adventure & Risk',
    category: 'lifestyle',
    description: 'Willingness to step outside comfort zones, try unfamiliar experiences, and embrace life leaps.',
    low_pole: 'Comfort & Safety',
    high_pole: 'Adventurous & Bold',
    weight: 1.0,
  },
  reversibility_sensitivity: {
    label: 'Choice Flexibility Awareness',
    category: 'decisions',
    description: 'Distinguishing easily undoable everyday choices from major, permanent life commitments.',
    low_pole: 'Equal Weight on All Decisions',
    high_pole: 'Nuanced Choice Categorization',
    weight: 1.0,
  },
  candor_directness: {
    label: 'Direct Honesty & Communication',
    category: 'relationships',
    description: 'Speaking plainly, honestly, and directly with friends versus softening or avoiding difficult conversations.',
    low_pole: 'Polite & Diplomatic',
    high_pole: 'Direct & Truthful',
    weight: 1.0,
  },
  epistemic_plasticity: {
    label: 'Open-Mindedness & Growth',
    category: 'mindset',
    description: 'Readiness to change your mind, admit personal mistakes, and listen to opposing viewpoints.',
    low_pole: 'Firm & Unchanging',
    high_pole: 'Open-Minded & Adaptive',
    weight: 1.0,
  },
  abstraction_tolerance: {
    label: 'Practical Simplicity',
    category: 'lifestyle',
    description: 'Preference for simple, down-to-earth solutions and living spaces versus complicated, over-theorized setups.',
    low_pole: 'Intricate & Multi-Layered',
    high_pole: 'Simple & Grounded',
    weight: 1.0,
  },
  technical_debt_tolerance: {
    label: 'Tolerance for Loose Ends',
    category: 'mindset',
    description: 'Comfort with temporary imperfection or mess in order to stay relaxed and enjoy the moment.',
    low_pole: 'Zero-Tolerance for Disorder',
    high_pole: 'Relaxed & Easygoing',
    weight: 1.0,
  },
  autonomy_preference: {
    label: 'Independence & Self-Reliance',
    category: 'agency',
    description: 'Need for personal freedom, self-direction, and living on your own terms without needing constant validation.',
    low_pole: 'Collaborative & Group-Dependent',
    high_pole: 'Independent & Self-Reliant',
    weight: 1.0,
  },
  stress_neutrality: {
    label: 'Patience & Emotional Calm',
    category: 'emotional_resilience',
    description: 'Staying level-headed, patient, and unbothered when unexpected chaos or delays disrupt your day.',
    low_pole: 'Emotionally Reactive',
    high_pole: 'Calm & Steady',
    weight: 1.0,
  },
  first_principles_ratio: {
    label: 'Independent Thinking',
    category: 'mindset',
    description: 'Questioning social conventions and traditions to find your own authentic answers.',
    low_pole: 'Traditional & Convention-Oriented',
    high_pole: 'Original & Axiomatic Thinker',
    weight: 1.0,
  },
  pragmatic_empiricism: {
    label: 'Learning by Doing',
    category: 'lifestyle',
    description: 'Trusting hands-on trial-and-error and real lived experience over abstract advice.',
    low_pole: 'Theoretical & Advice-Seeking',
    high_pole: 'Hands-On & Empirical',
    weight: 1.0,
  },
  craft_perfectionism: {
    label: 'Pride in Personal Standards',
    category: 'daily_habits',
    description: 'Caring deeply about doing things properly, honoring commitments, and keeping personal standards high.',
    low_pole: 'Casual & Relaxed',
    high_pole: 'Attentive & Dedicated',
    weight: 1.0,
  },
  delegation_willingness: {
    label: 'Asking for Help & Sharing',
    category: 'relationships',
    description: 'Comfort in reaching out to loved ones for help versus insisting on handling everything alone.',
    low_pole: 'Hyper-Self-Reliant',
    high_pole: 'Willing to Share & Ask for Help',
    weight: 1.0,
  },
  rabbit_hole_curiosity: {
    label: 'Curiosity & Deep Passions',
    category: 'curiosity',
    description: 'Getting absorbed for hours exploring fascinating topics, hobbies, books, and creative pursuits.',
    low_pole: 'Focused on Immediate Needs',
    high_pole: 'Insatiably Curious',
    weight: 1.0,
  },
  hype_skepticism: {
    label: 'Trend & Fad Skepticism',
    category: 'mindset',
    description: 'Naturally questioning viral social media fads, marketing promises, and popular crowd hype.',
    low_pole: 'Early Trend Adopter',
    high_pole: 'Discerning & Skeptical',
    weight: 1.0,
  },
  crisis_decisiveness: {
    label: 'Calm Under Pressure',
    category: 'emotional_resilience',
    description: 'Stepping up calmly and taking clear action during personal or family emergencies.',
    low_pole: 'Overwhelmed by Sudden Chaos',
    high_pole: 'Decisive & Steady in Emergencies',
    weight: 1.0,
  },
  consensus_orientation: {
    label: 'Social Harmony vs Independence',
    category: 'relationships',
    description: 'Balancing the desire for warmth and empathy with the willingness to stand alone when necessary.',
    low_pole: 'Independent & Individualistic',
    high_pole: 'Warm & Community-Oriented',
    weight: 1.0,
  },
  failure_transparency: {
    label: 'Owning Personal Mistakes',
    category: 'mindset',
    description: 'Talking honestly about your blunders and lessons learned without getting defensive or embarrassed.',
    low_pole: 'Guarded & Self-Protective',
    high_pole: 'Open & Transparent About Flaws',
    weight: 1.0,
  },
  scope_ruthlessness: {
    label: 'Simplifying & Setting Boundaries',
    category: 'agency',
    description: 'Saying no to draining obligations, cutting out drama, and keeping your life simple and peaceful.',
    low_pole: 'Obligation-Heavy & Over-Committed',
    high_pole: 'Ruthlessly Simple & Boundary-Clear',
    weight: 1.0,
  },
};

/**
 * Computes 20 Normalized Personality Parameters (0..100) from Likert responses.
 */
export function computeParametersFromLikert(responses: Record<string, number>): {
  parameters: PersonalityParameter[];
  completionStats: {
    totalQuestions: number;
    answeredCount: number;
    completionPercentage: number;
  };
} {
  const totalQuestions = LIKERT_500_QUESTIONS.length; // 500
  const answeredKeys = Object.keys(responses);
  const answeredCount = answeredKeys.length;
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const accumulator: Record<PersonalityParameterKey, { sum: number; count: number; maxPossible: number }> = {} as any;

  for (const key of Object.keys(PARAMETER_METADATA) as PersonalityParameterKey[]) {
    accumulator[key] = { sum: 0, count: 0, maxPossible: 0 };
  }

  for (const q of LIKERT_500_QUESTIONS) {
    const key = q.mapped_parameter;
    const rawVal = responses[q.id];

    if (rawVal !== undefined && rawVal >= 1 && rawVal <= 7) {
      const normalizedScore = (rawVal - 1) / 6.0;
      const score = q.reversed ? (1.0 - normalizedScore) : normalizedScore;
      accumulator[key].sum += score * q.weight;
      accumulator[key].count += 1;
      accumulator[key].maxPossible += q.weight;
    } else {
      accumulator[key].maxPossible += q.weight;
    }
  }

  const parameters: PersonalityParameter[] = (Object.keys(PARAMETER_METADATA) as PersonalityParameterKey[]).map(key => {
    const meta = PARAMETER_METADATA[key];
    const data = accumulator[key];
    let normalized = 0.5;

    if (data.count > 0 && data.maxPossible > 0) {
      normalized = data.sum / data.count;
    }

    const value = Math.round(normalized * 100);

    return {
      key,
      label: meta.label,
      category: meta.category,
      value,
      normalized,
      description: meta.description,
      low_pole: meta.low_pole,
      high_pole: meta.high_pole,
      weight: meta.weight,
      question_count: data.count,
    };
  });

  return {
    parameters,
    completionStats: {
      totalQuestions,
      answeredCount,
      completionPercentage,
    },
  };
}

/**
 * Pure Client-Side Deterministic Behavioral Narrative Generator
 * Generates rich system prompt directives and personal cognitive profiles directly from calculated parameters.
 */
export function generateDeterministicBehavioralNarrative(
  paramMap: Record<PersonalityParameterKey, number>,
  userName: string = 'Sambit'
): import('../types').BehavioralNarrative {
  const vel = paramMap.velocity_bias ?? 50;
  const candor = paramMap.candor_directness ?? 50;
  const firstPrinc = paramMap.first_principles_ratio ?? 50;
  const rev = paramMap.reversibility_sensitivity ?? 50;
  const autonomy = paramMap.autonomy_preference ?? 50;
  const formal = paramMap.formalism_weight ?? 50;
  const scope = paramMap.scope_ruthlessness ?? 50;
  const stress = paramMap.stress_neutrality ?? 50;
  const curiosity = paramMap.rabbit_hole_curiosity ?? 50;

  // Derive archetype title based on personal traits
  let archetypeTitle = 'Independent & Thoughtful Explorer';
  if (vel > 70 && scope > 70) {
    archetypeTitle = 'Decisive & Unapologetically Authentic Operator';
  } else if (firstPrinc > 70 && autonomy > 75) {
    archetypeTitle = 'Self-Directed Free Thinker & Autonomous Individual';
  } else if (stress > 70 && candor > 70) {
    archetypeTitle = 'Level-Headed & Radically Honest Companion';
  } else if (curiosity > 75) {
    archetypeTitle = 'Insatiably Curious & Creative Lifelong Learner';
  }

  const tenets: string[] = [
    vel > 60 ? 'Action over overthinking: It is better to try an imperfect step forward today than be paralyzed in planning.' : 'Deliberate care: Thoughtful pacing and intentional choices bring lasting peace of mind.',
    autonomy > 60 ? 'True sovereignty: Live by your own internal compass rather than seeking external validation or crowd approval.' : 'Connected harmony: Cherish mutual community and find joy in shared milestones.',
    scope > 60 ? 'Protect your peace: Say no to draining obligations, declutter toxic noise, and preserve personal space.' : 'Generous openness: Welcome unexpected invitations and make time for others.',
    firstPrinc > 60 ? 'Question conventions: Don’t follow life rules blindly just because "everyone does it that way."' : 'Respect wisdom: Value proven life traditions and time-tested family habits.',
    candor > 60 ? 'Honest and kind: Speak the gentle truth directly without passive-aggressive games or fake pleasantries.' : 'Gentle diplomacy: Prioritize harmony and emotional comfort in conversations.',
  ];

  const heuristics: string[] = [
    rev > 60 ? 'Distinguish between flexible daily choices (decide fast) and permanent life commitments (take your time).' : 'Give every decision careful thought and weigh the trade-offs.',
    'Identify what is truly in your control; let go of worrying about external chaos.',
    candor > 60 ? 'Clear is kind: Communicate expectations plainly rather than expecting people to read your mind.' : 'Nurture relationships with gentle empathy and understanding.',
    stress > 60 ? 'Patience under fire: When unexpected delays or disruptions strike, take a breath and adapt with humor.' : 'Mobilize immediately and address issues head-on.',
  ];

  const commRules: string[] = [
    candor > 60 ? 'Speak directly, honestly, and without superficial hedging.' : 'Listen actively and frame advice constructively.',
    'Lead with the honest conclusion and stay grounded in empathy.',
    'Normalize friendly disagreement without taking differences personally.',
    'Express genuine gratitude and appreciation openly to loved ones.',
  ];

  const playbook: string[] = [
    'Take three slow, deep breaths to reset the nervous system before reacting.',
    'Step back from high-emotion moments and wait until heads are cool to discuss tough topics.',
    'Break overwhelming life situations into tiny, manageable next steps.',
    'Reach out to trusted loved ones for a grounding conversation when needed.',
  ];

  const antiPatterns: string[] = [
    'People-pleasing that drains your mental health and builds silent resentment.',
    'Holding onto bitter grudges or replaying past arguments endlessly.',
    'Passive-aggressive communication and expecting others to guess your needs.',
    'Cluttering your calendar with obligations you secretly dread.',
  ];

  const systemDirective = `You are a fine-tuned digital twin calibrated to replicate the exact decision-making philosophy, personal values, emotional temperament, and communication style of ${userName}.

CORE PERSONAL TRAITS:
- Action Bias: ${vel}/100 (${vel > 50 ? 'Prefers taking action quickly and adjusting on the fly' : 'Prefers careful reflection and planning'})
- Direct Candor & Honesty: ${candor}/100 (${candor > 50 ? 'Direct, authentic, gentle truth-teller' : 'Diplomatic, tactful, prioritizing comfort'})
- Independent Thinking: ${firstPrinc}/100 (${firstPrinc > 50 ? 'Reasons from core values and personal inquiry' : 'Draws on established traditions and social norms'})
- Autonomy & Self-Reliance: ${autonomy}/100 (${autonomy > 50 ? 'Values personal freedom, solitude, and self-direction' : 'Thrives in collaborative, community settings'})
- Emotional Composure: ${stress}/100 (${stress > 50 ? 'Level-headed, patient, resilient under unexpected disruptions' : 'Deeply empathetic and emotionally responsive'})
- Simplifying & Setting Boundaries: ${scope}/100 (${scope > 50 ? 'Ruthlessly protects peace of mind, declines toxic obligations' : 'Accommodating and flexible'})

BEHAVIORAL RULES:
1. Speak in a warm, grounded, authentic, and human voice.
2. Avoid corporate jargon, buzzwords, and technical abstractions.
3. When giving personal life advice, consider trade-offs (peace of mind, freedom, honesty, relationships).
4. Emphasize self-honesty, simple joys, genuine boundaries, and personal autonomy.`;

  return {
    archetype_title: archetypeTitle,
    executive_summary: `${userName}'s calibrated personal profile reflects a score of ${vel}/100 in action orientation, ${candor}/100 in direct honesty, and ${autonomy}/100 in personal autonomy. Decisions are guided by a commitment to living authentically, keeping life simple, and protecting emotional peace.`,
    cognitive_dna_summary: `Operating philosophy centers on personal freedom, down-to-earth practicality, and honest human connections. Rejects superficial social pressure in favor of genuine relationships and purposeful living.`,
    core_engineering_tenets: tenets,
    core_life_tenets: tenets,
    decision_heuristics: heuristics,
    interpersonal_communication_rules: commRules,
    stress_and_crisis_playbook: playbook,
    unacceptable_anti_patterns: antiPatterns,
    system_prompt_directive: systemDirective,
    generated_at: new Date().toISOString(),
  };
}
