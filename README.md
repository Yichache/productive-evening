# Evening Portal

A single-page web app for building a sustainable evening routine around reading, watching art house films, and writing. Built on Justin Sung's productivity strategies and Kolb's experiential learning cycle.

## The System

This is more than an app — it's a three-layer system:

### Layer 1: The Evening Routine

A six-step flow performed each evening (~10 min overhead):

1. **The Cut** — one physical action signaling work is over (make tea, change clothes, step outside)
2. **Pre-Evening Context** — tag what happened today + rate your energy (1/2/3)
3. **Experiment Check** — if you have an active Kolb's experiment, check in on it
4. **Activity** — the app suggests a random activity from your queue, matched to your energy level. Accept, skip, or pick your own.
5. **Quick Log** — what you did + what struck you (1-2 sentences)
6. **Winddown** — 30 min before bed, screens off (set an Apple Reminder for this)

The energy tiers:

| Energy | Reading | Movies | Writing |
|--------|---------|--------|---------|
| 1 (Empty) | Read 1 page | Short film / one scene | Write 3 sentences |
| 2 (Okay) | A chapter (~20 min) | A full film | Short reflection paragraph |
| 3 (Good) | Extended session | Film + notes | Longer piece or essay |

Even just browsing your queue and bookmarking something counts. There is no failure — only data.

### Layer 2: Kolb's Cycle Registry

Track specific problems through iterative improvement cycles:

1. **Experience** — what happened?
2. **Reflection** — what went well or poorly?
3. **Abstraction** — what pattern or habit does this reveal?
4. **Experiment** — what's one small thing to try next time?

Each cycle targets a specific problem (e.g., "phone distraction while reading") and iterates until the target is met. Max 1-2 active experiments at a time.

Cycles can target:
- **Pre-evening** factors (commute, work schedule, sleep)
- **Routine** issues (transitions, consistency)
- **Activity** improvement (writing quality, reading focus)

### Layer 3: The App

A single HTML file you open as a phone bookmark. No accounts, no backend (except optional AI insights).

## Quick Start

1. Open `index.html` in a browser (or host on GitHub Pages)
2. On first load, choose to import the starter content or start empty
3. Add your own books, films, and writing prompts via the "Add to queue" button
4. Each evening, open the app and follow the guided flow
5. Do a weekly review (Patterns tab) to reflect on your progress

### Add to Phone Home Screen

**iPhone:** Open in Safari > Share > Add to Home Screen
**Android:** Open in Chrome > Menu > Add to Home Screen

## Hosting on GitHub Pages

1. Push this repo to GitHub
2. Go to Settings > Pages > Source: Deploy from branch (main)
3. Your app will be live at `https://yourusername.github.io/productive_evening/`

## AI Insights (Optional)

The app can call a Cloudflare Worker to analyze your logs and suggest patterns via Claude.

### Setup

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Set your API key: `cd worker && wrangler secret put ANTHROPIC_API_KEY`
4. (Optional) Create KV for rate limiting: `wrangler kv namespace create "RATE_LIMIT"` and update `wrangler.toml` with the namespace ID
5. Deploy: `wrangler deploy`
6. In the app, click "Get AI Insights" and enter your Worker URL

Uses Claude Haiku for cost efficiency. Rate-limited to 1 call/day.

## Data

All data is stored in your browser's localStorage. To back up:
- Patterns tab > Export data

To restore on another device:
- Patterns tab > Import data

## Key Principles

- **Or, not And** — one activity per evening, 1-2 experiments at a time
- **Energy as generator** — even tiny engagement creates momentum
- **Win the week, not the day** — protect your sleep; the routine serves you, not the other way around
- **Stumble into it** — random suggestions beat decision paralysis
- **Marginal gains** — every Kolb's iteration makes the routine a little better
