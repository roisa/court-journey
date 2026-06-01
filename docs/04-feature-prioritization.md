# Phase 4 — Feature Prioritization

Ruthless rule: a feature ships in MVP only if it's needed to prove the **core loop** — *capture a memory in ≤30s and feel it was worth it.* Everything that's "nice," "engagement-y," or "later magic" waits.

The MVP must answer one question: **will a real amateur player capture a match and come back to do it again?** Nothing else matters yet.

---

## MVP (Weeks 1–4) — the emotional core loop

| Feature | Why it's non-negotiable |
|---------|-------------------------|
| **Frictionless onboarding** (≤90s) | First impression; sets emotional tone |
| **Quick Match Capture** (tap + feeling + optional voice/photo) | THE core loop. Match-first, not tournament-first |
| **AI story generation** (notes/voice → warm narrative) | The "magic" that makes capture feel worth it |
| **Journey feed** (home) | Where memories live & resurface; the retention engine |
| **Post-match Reflection** (≤30s, 3 questions) | Turns play into emotion + the seed for insights |
| **Tournament grouping** (optional wrapper around matches) | The headline unit; needed for recaps & prep |
| **Basic Prepare checklist** (3 presets, adaptive-lite) | Confidence JTBD; cheap to build |
| **Memory detail** (photo + voice + text + feeling) | The artifact users will treasure |
| **Auth + cloud sync** | Memories must feel *safe* forever (table stakes) |
| **A handful of achievements** (~10, milestone-based) | Early delight; "you showed up" |
| **"On this day" resurfacing** | Cheapest, highest-emotion retention hook |

That's the whole MVP. If it's not on this list, it's not in the first month.

---

## V2 (Months 2–4) — deepen the magic

| Feature | Rationale |
|---------|-----------|
| **Improvement Engine v1** (pattern surfacing from reflections) | Needs ~5+ reflections of data to feel real |
| **Full achievement system** (50, multi-category) | Motivation layer once habit exists |
| **Smart/adaptive checklists** (learns what you pack, venue recall) | Prep gets personal |
| **Rivalry tracking** | Emergent delight; low cost on existing data |
| **Voice-first capture polish** (transcription + emotion tagging) | Doubles down on speed |
| **Yearly Recap v1** (slideshow) | First taste of long-term payoff |
| **Confidence cards before tournaments** | Anxiety → confidence transformation |
| **Streaks (reflection-based, gentle)** | Habit reinforcement done humanely |
| **Photo auto-grouping into tournaments** | Removes capture friction |

---

## Future (6+ months) — the moat & the wow

| Feature | Rationale |
|---------|-----------|
| **Personal tournament documentaries** (AI video w/ voice) | Signature wow; expensive; needs rich data |
| **Predictive prep** ("you start slow in morning matches") | Needs lots of history |
| **Social / shareable journey cards** | Growth loop, but only after core value proven |
| **Club / league integrations** (auto-import draws) | Removes data entry; partnership-heavy |
| **Coach view / sharing with a coach** | Adjacent persona; risk of scope creep |
| **Apple Watch / live moment capture** | Convenience; not core |
| **Practice-session structured logging** | Risk of becoming a tracker — gate carefully |
| **Multi-sport expansion (pickleball, squash)** | Market expansion once PMF in tennis/padel |

---

## Things we deliberately CUT (and why)

> Killing features is the most important design work. Each of these *sounds* good and would *quietly* destroy the product.

- ❌ **Point-by-point / game-by-game score entry.** Violates the 30-second rule and the "no spreadsheet" principle. Final result + a feeling is enough. This is the single most important cut.
- ❌ **Advanced statistics dashboards** (win %, surface splits, charts). This is exactly what we're *not*. Insights are delivered as sentences, not graphs.
- ❌ **Manual opponent stat profiles / scouting databases.** That's a coach's tool. Out.
- ❌ **Leaderboards / public ranking.** Toxic comparison; demotivates the beginner who is the core user.
- ❌ **Daily-play streaks.** Punishes rest and injury; emotionally harmful. (Reflection-streaks only, and gently.)
- ❌ **Calorie/fitness/wearable health tracking.** Strava/Apple Health own this. Don't compete.
- ❌ **In-app messaging / social network.** Massive scope, moderation burden, off-mission.
- ❌ **Bracket/tournament management for organizers.** Different product, different customer.

---

## The prioritization test, applied

Every MVP feature passes all four north stars:

| Feature | ≤30s? | Re-read in 3y? | Emotional? | Improves? |
|---------|:--:|:--:|:--:|:--:|
| Quick Match Capture | ✅ | ✅ | ✅ | ✅ |
| AI story | ✅ | ✅ | ✅ | ➖ |
| Reflection | ✅ | ✅ | ✅ | ✅ |
| Prepare checklist | ✅ | ➖ | ✅ | ✅ |
| "On this day" | ✅ | ✅ | ✅ | ➖ |

Anything that scored ❌ on "≤30s" or "emotional" was cut or deferred. That's the whole discipline.
