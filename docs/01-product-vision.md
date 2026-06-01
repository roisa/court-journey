# Phase 1 — Product Vision

## Mission statement

> **Court Journey helps amateur tennis and padel players remember why they love the game — by turning every match into a memory, every loss into a lesson, and every year into a story worth re-reading.**

We are not in the statistics business. We are in the **meaning** business.

---

## The assumption we challenge first (and hardest)

The brief says "build a personal sports story over many years." Beautiful goal. But here is the trap that kills every app like this:

**Amateurs don't play enough tournaments to sustain a habit.** A realistic weekend warrior plays **3–8 tournaments per year**. If the app only wakes up around tournaments, it gets opened ~8 times a year, the user forgets it exists between events, and it's deleted in the first phone cleanup.

So the brief contains a hidden contradiction:
- It wants **weekly habit** (Duolingo cadence), but
- The headline unit (the tournament) happens **monthly at best.**

**Resolution — the core reframing of this entire product:**

> The tournament is the *headline*. The **match and the moment** are the *product*.
> The habit loop runs on matches, memories, and resurfaced nostalgia — not tournaments.

This single decision shapes everything downstream: the data model (matches are first-class, not buried under tournaments), the home screen (a memory feed, not a tournament list), and the engagement engine (memories resurface; tournaments are rare).

---

## User problems (what actually hurts)

| # | Problem | Emotional cost |
|---|---------|----------------|
| P1 | "I can't remember the name of the tournament where I had my best win." | Loss of identity & pride |
| P2 | "I keep making the same mistakes and I don't even notice the pattern." | Stagnation, frustration |
| P3 | "I felt amazing after that comeback — and now that feeling is gone forever." | Lost joy |
| P4 | "I show up to tournaments unprepared and anxious." | Fear, self-doubt |
| P5 | "I have 4,000 photos and not one tells the story of my tennis." | Memories trapped, unusable |
| P6 | "After a loss I spiral; I have no way to process it constructively." | Discouragement → quitting |
| P7 | "I don't feel like I'm getting better, even though I probably am." | Demotivation |
| P8 | "Logging anything is a chore, so I never do it." | Friction kills the habit |

P8 is the meta-problem. **Any solution that requires discipline will fail.** Capture must be nearly involuntary.

---

## User motivations (why they'd want this)

- **Pride** — "I want proof of how far I've come."
- **Nostalgia** — "I want to relive the good days."
- **Mastery** — "I want to actually improve, not just play."
- **Belonging / identity** — "I am becoming a tennis player, not just someone who plays tennis."
- **Reassurance** — "I want to walk on court calm and ready."
- **Closure** — "I want to make peace with losses and learn from them."

Note what's *not* here: "I want detailed stats." Amateurs almost never wake up wanting analytics. They want **feelings** and **growth**. Stats are a means, never the motivation.

---

## Emotional Jobs-To-Be-Done

> When I _________, I want to _________, so I can feel _________.

| Trigger | Functional job | Emotional payoff |
|---------|----------------|------------------|
| Just finished an emotional match | Capture how it felt in seconds | **Relief** — the moment is safe now |
| Lost a tough match | Make sense of it without spiraling | **Acceptance & control** |
| Have a tournament next week | Know I've done everything to prepare | **Calm confidence** |
| It's been a long season | See how far I've come | **Pride** |
| Feeling unmotivated | Be reminded why I love this | **Reignited passion** |
| A year has passed | Relive my journey like a highlight reel | **Joy & identity** |

The product's secret weapon: it converts **anxiety → confidence** (Prepare) and **disappointment → growth** (Reflect). Those two transformations are the emotional core.

---

## Why users return *weekly* (the hard part)

Tournaments are too rare to anchor weekly retention. So weekly engagement comes from **four lighter loops**:

1. **Match capture** — players practice/play casual matches weekly. One-tap "I played today" + a feeling + a voice note. (See Phase 5.)
2. **Memories resurface** — "On this day," "1 month ago," "Your best win this month." Push notifications that feel like a friend, not a nag.
3. **Lessons & micro-coaching** — a weekly nudge: "Last 3 matches your serve was on your mind. Want a 60-sec drill?" (See Phase 8.)
4. **Streaks that respect reality** — not "play every day" (toxic for a body that needs rest) but "reflect on every match you play" and "weekly check-in." (See Phase 9.)

> **Design rule:** Never punish the user for not playing. The streak is about *reflection consistency*, never *play frequency*. We must never make someone feel guilty for resting an injury.

---

## Why users keep using it for *years* (the moat)

This is where Court Journey becomes un-deletable. The value **compounds**:

- **Data gravity** — 3 years of memories can't be re-created elsewhere. Switching cost is emotional, not technical.
- **The recap gets better every year** — Year 1 recap is nice; Year 3 recap is *moving*. (See Phase 10.)
- **Pattern insight deepens** — the Improvement Engine needs history to be magical. (See Phase 8.)
- **Identity anchor** — the app becomes the canonical record of "who I am as a player." Deleting it feels like deleting a piece of yourself.

The strategic insight: **early value is emotional capture; long-term value is the archive itself.** We must front-load delight (so people stay long enough to accumulate) and let the archive's gravity take over by year two.

---

## Positioning statement

> For amateur tennis and padel players who want more than a scoreboard, Court Journey is a personal sports journal that captures the memories, lessons, and emotions of your playing life. Unlike stats trackers and league apps, Court Journey is built around feeling and story — so 3 years from now you'll re-read it and smile, not audit a spreadsheet.

---

## The product in one loop

```
        PREPARE  →  PLAY  →  CAPTURE (≤30s)  →  AI makes it beautiful
           ↑                                            │
           │                                            ▼
        CONFIDENCE  ←  INSIGHTS & MEMORIES  ←  RELIVE / LEARN
```

Confidence in, memory out, insight compounding. That's the whole machine.
