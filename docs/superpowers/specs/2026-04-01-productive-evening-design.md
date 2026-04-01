# Productive Evening System Design

## Context

The user struggles with an all-or-nothing mindset around evening productivity. After work, they default to passive phone scrolling instead of engaging with creative activities they genuinely value: reading literature, watching art house films, and writing. The core issues are: (1) no mental category between "working" and "doing nothing," (2) no transition ritual between work and rest, and (3) decision paralysis when choosing what to do. The system draws from Justin Sung's 7 productivity strategies and a modified Kolb's experiential learning cycle to create a sustainable, self-improving evening routine.

## Goals

- Create a low-friction evening routine that channels energy into reading, film, and writing
- Build an iterative feedback loop (Kolb's cycle) that continuously improves the routine
- Track pre-evening factors that affect energy levels and optimize them over time
- Provide AI-assisted pattern recognition during weekly reviews
- Embody "marginal gains" — start minimal, grow only as the habit sticks

## Non-Goals

- Replacing a full productivity/task management system
- Tracking work-related tasks or PhD progress
- Building a social/accountability platform
- Gamification or streak-based motivation

---

## System Architecture

The system has three layers operating at different timescales.

### Layer 1: The Evening Routine (daily, ~10 min overhead)

A six-step flow performed each evening:

**Step 1: The Cut (2 min)**
A single physical action that signals the transition from work to evening. Examples: make tea, change clothes, step outside. The specific action does not matter; consistency does. This addresses Justin Sung's "energy dead spot" concept — the unstructured gap between work ending and the evening starting is where energy dies.

**Step 2: Pre-Evening Context (1 min)**
Capture two things:
- **Day tags**: short labels describing what happened today. Pre-populated options: "long work day," "light day," "gym," "bad commute," "good sleep," "poor sleep," "social day," with ability to add custom tags. Multiple tags per day.
- **Energy check**: a simple 1/2/3 rating.
  - 1 (Empty): depleted, minimal capacity
  - 2 (Okay): functional, can do light engagement
  - 3 (Good): sharp, ready for deep work

Over time, the correlation between tags and energy levels reveals which pre-evening factors to optimize via Kolb's cycles.

**Step 3: Active Experiment Check (1 min)**
If there are active experiments from the Kolb's cycle registry, the system surfaces them one at a time: "You said you'd try: [X]. Did you try it today?"
- Yes: prompt for a one-sentence note on how it went. This result feeds the next Kolb's iteration.
- No / Not applicable today: skip.
- If there are 2 active experiments, both are shown sequentially.
- If no active experiments exist, this step is skipped entirely.

**Step 4: Activity (flexible duration)**
The system surfaces a random suggestion from the content queue, matched to the user's energy level:

| Energy | Reading | Movies | Writing |
|--------|---------|--------|---------|
| 1 (Empty) | Read 1 page | Short film (<15 min) or one scene | Write 3 sentences about anything |
| 2 (Okay) | Read a chapter (~20 min) | Watch a full film | Short reflection paragraph on recent reading/viewing |
| 3 (Good) | Extended reading session | Film + written notes | Longer writing piece or essay attempt |

The user can: accept the suggestion, skip to get another, or pick their own activity. The "or not and" principle applies — only ONE activity per evening.

Fallback: even just browsing the queue and bookmarking something for later counts as a completed evening. This prevents the all-or-nothing spiral.

**Step 5: Quick Log (1-2 min)**
After the activity (or fallback), capture:
- What did I do? (auto-filled if they accepted a suggestion)
- What struck me? (one sentence — free text)

This log is the raw material that feeds Kolb's cycle pattern recognition over time.

**Step 6: Winddown (30 min before bed)**
Not managed by the app — triggered by an Apple Reminder. Screens off. Reading fits naturally here as a calming activity. If reading was the main activity earlier, do something else calming.

### Layer 2: Kolb's Cycle Registry (spans days/weeks)

A persistent system that tracks specific problems or improvement areas through iterative Kolb's cycles.

**Cycle Structure**

Each cycle contains:
- **Title**: short name for the problem (e.g., "Phone distraction while reading")
- **Category**: one of `pre-evening`, `routine`, or `activity`
  - `pre-evening`: optimizing factors before the evening (commute, work schedule, sleep)
  - `routine`: optimizing the routine itself (transitions, decision-making, consistency)
  - `activity`: improving the creative activities (writing depth, reading focus, film appreciation)
- **Target**: concrete definition of "solved" (e.g., "Can read 30 min without breaking focus")
- **Iterations**: ordered list of Kolb's cycle iterations, each containing:
  - **Experience**: what happened (fact)
  - **Reflection**: what went well or poorly, how it felt
  - **Abstraction**: what pattern, habit, or belief this reveals
  - **Experiment**: one specific, small thing to try next time
  - **Result**: outcome of the experiment (filled in later, via Step 3 of the daily flow or during weekly review)
- **Status**: `open` or `resolved`
- **Created date** and **resolved date**

**Cycle Lifecycle**

1. A new cycle is created when the user notices a recurring problem — either during a daily log, during weekly review, or from an AI insight.
2. The first iteration's Experience/Reflection/Abstraction are filled in immediately. The Experiment is designed.
3. The experiment becomes the "active experiment" surfaced in Step 3 of the daily routine.
4. When the user reports results (via Step 3 or weekly review), a new iteration begins.
5. Iterations continue until the target is met, at which point the cycle is marked `resolved`.

**Constraint**: only 1-2 active experiments at a time. This follows the "or not and" principle — running too many experiments at once dilutes attention and makes it impossible to attribute results. The weekly review is when the user decides which experiments to prioritize.

**Weekly Review (15-20 min, once per week)**

A dedicated session (suggested: Sunday evening) where the user:
1. Reviews all active cycles: which experiments ran this week? What results?
2. Runs full Kolb's iterations on cycles that received new data
3. Closes resolved cycles (target met)
4. Spots new patterns from daily logs — opens new cycles if warranted
5. Applies "or not and" check: am I running too many experiments? Prioritize 1-2 for next week.
6. Reviews pre-evening tag correlations: which tags consistently correlate with higher/lower energy?

The "Get AI Insights" button is available here to assist with pattern recognition and experiment suggestions.

The weekly review has a **guided flow** accessible from a "Weekly Review" button in the app. It walks the user through steps 1-6 above in sequence, pulling data from both the Cycles and Patterns views, so the user doesn't need to navigate between views manually.

### Layer 3: The Digital Tool

A single-page web application with three views:

**View 1: Tonight (daily flow)**
- Pre-evening context form (tags + energy)
- Active experiment reminder and check-in
- Random activity suggestion with energy-appropriate tier
- Quick log form
- Displays the current streak/completion dot for today

**View 2: Cycles (Kolb's registry)**
- List of all cycles, grouped by category (pre-evening / routine / activity)
- Each cycle expandable to show iteration history
- Add new cycle form
- Mark cycle as resolved
- Indicate which experiment is currently active (max 2)

**View 3: Patterns (progress + insights)**
- Dot calendar showing completed evenings (color-coded by energy level)
- Activity distribution chart (reading / movies / writing over time)
- Pre-evening tag correlation display (which tags → which energy levels)
- "Get AI Insights" button for weekly review analysis

---

## Technical Architecture

### Frontend
- Single HTML file with embedded CSS and JS (no build step, no framework)
- Responsive design for phone-first usage
- Installable as a Progressive Web App (PWA) via home screen bookmark
- All UI state managed in vanilla JS

### Data Storage
- **localStorage** for all persistent data:
  - Daily logs (date, tags, energy, activity, reflection)
  - Kolb's cycles (full iteration history)
  - Content queue (books, movies, writing prompts)
  - Settings (winddown time, preferred categories)
- Data export/import as JSON for backup
- Note: localStorage is device-bound and has a ~5MB limit. This is acceptable for v1 — a typical year of daily logs + cycles is well under 1MB.

### Content Queue
- Stored in localStorage alongside other data
- Each item has: `title`, `category` (read/watch/write), `energy_levels` (which tiers it's appropriate for), `notes` (optional), `status` (queued/completed/skipped)
- An in-app "add to queue" form allows adding items directly from the phone (v1 feature — essential for low friction)
- A `content.json` seed file can be used to bulk-import initial content on first load
- Items can be marked as completed or skipped; completed items move to a history log

### AI Integration
- A **Cloudflare Worker** (free tier) serves as a proxy between the frontend and Claude's API
- The Worker stores the Anthropic API key as an environment secret — never exposed to the browser
- The frontend sends recent logs + cycle data to the Worker
- The Worker constructs a prompt asking Claude to:
  1. Identify patterns across daily logs (recurring tags, energy correlations, activity preferences)
  2. Suggest which Kolb's cycles to prioritize
  3. Propose specific experiments based on the user's history and behavioral science principles
  4. Highlight any pre-evening factors that consistently affect evening quality
- Claude's response is displayed in the Patterns view
- Rate limiting: max 1 API call per day to manage cost

### Hosting
- GitHub Pages (free) for the static HTML/CSS/JS
- Cloudflare Worker (free tier) for the AI proxy
- No database, no server, no accounts

---

## Content Queue: Initial Seed

The user has scattered lists of books and movies across various places. The initial `content.json` should be populated by the user during setup. The structure:

```json
[
  {
    "id": "1",
    "title": "Example Book Title",
    "category": "read",
    "energy_levels": [2, 3],
    "notes": "Recommended by a friend"
  },
  {
    "id": "2",
    "title": "Example Film Title",
    "category": "watch",
    "energy_levels": [1, 2, 3],
    "notes": "Short film, good for low energy"
  },
  {
    "id": "3",
    "title": "Write about: what 'home' means to you",
    "category": "write",
    "energy_levels": [1, 2, 3],
    "notes": ""
  }
]
```

Writing prompts can be pre-seeded with a starter set; the user adds their own over time.

---

## Key Design Principles

1. **Marginal gains**: the system starts with the minimum viable routine (The Cut + one activity + quick log) and layers on complexity only as the habit solidifies. The Kolb's cycle registry and AI insights are available from day one but not required.

2. **"Or not And"**: one activity per evening, 1-2 active experiments at a time. The system actively prevents overcommitment.

3. **Energy as generator**: the fallback tiers ensure that even a tiny engagement (read one page) counts. The system reframes the evening as an energy-generating activity, not a drain.

4. **Stumble-into, don't plan**: random suggestions reduce decision friction. The user doesn't need to decide in advance what to do — the system picks for them.

5. **Self-improving**: the Kolb's cycle registry means the routine isn't static. It evolves based on what actually works for this specific person through systematic experimentation.

6. **Pre-evening optimization**: by tracking day tags and correlating them with energy, the system reveals which upstream factors to change — often more impactful than optimizing the evening itself.

---

## Verification Plan

### Manual Testing
1. Open the page on a phone browser — confirm responsive layout and all three views work
2. Complete a full evening flow: context → experiment check → activity → log
3. Create a Kolb's cycle with 2 iterations, mark one as active experiment, verify it surfaces in the daily flow
4. Add items to the content queue via `content.json`, verify suggestions appear at correct energy levels
5. Check localStorage persistence: close and reopen the page, verify all data is retained
6. Test the AI insights button: verify the Cloudflare Worker proxies correctly and returns meaningful analysis
7. Test data export/import: export JSON, clear localStorage, import, verify data restored
8. Add to home screen as PWA: verify it opens full-screen without browser chrome

### Edge Cases
- First-time use with no data: the tool should guide through initial setup (add content, explain the flow)
- No active experiment: Step 3 should be skipped cleanly
- All content in queue completed/skipped: should prompt user to add more
- localStorage near capacity: should warn and suggest export
