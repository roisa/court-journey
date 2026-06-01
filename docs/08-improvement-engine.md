# Phase 8 — Improvement Engine

The promise: deliver the **"Wow, I didn't realize that pattern"** moment — *without* asking the user to enter a single statistic. This is the feature that turns a sentimental journal into a tool that makes you a better player, and it's the hardest to do without becoming a spreadsheet.

**The key trick:** we don't compute patterns from *scores* (we barely collect them). We mine **language** — the words players use in voice notes and reflections — because how players *talk* about their game reveals more than any stat. Amateurs don't track unforced errors, but they *say* "I got tight again." That sentence is the data.

---

## Where the signal comes from (no manual stats)

Every reflection already produces structured tags via the AI extraction pipeline (Phase 5/6):

- **Outcome** (won/lost/played)
- **Emotion** (frustrated → on fire)
- **What worked** (e.g. "forehand," "serve," "stayed calm," "net play")
- **What didn't** (e.g. "got tight," "rushed big points," "footwork," "second serve")
- **Context** (opponent, venue, time of day, indoor/outdoor, tournament stakes)

> The insight engine is just **pattern detection over these tags across time.** No charts. No data entry. The user already gave us everything by talking for 15 seconds.

---

## What the app can detect (and the "wow" it produces)

### 1. Recurring strengths
*"Your forehand has come up in 7 of your last 10 wins. It's becoming your weapon — build points around it."*
→ **Wow:** the player feels their identity forming. Confidence.

### 2. Recurring weaknesses
*"In 4 of your last 5 losses, you mentioned 'getting tight on big points.' This isn't your forehand — it's the moment. Let's work on the moment."*
→ **Wow:** reframes a technical worry as a *mental* pattern they'd never have spotted.

### 3. Mental / emotional patterns
- *"You play your best when you arrive early and relaxed — your 'on fire' matches share that."*
- *"Morning matches: you mention slow starts. Evening matches: you feel sharp."*
- *"After a tough loss, your next match is usually a win. You bounce back."*
→ **Wow:** self-knowledge that no stat sheet could ever surface.

### 4. Successful routines
*"Your 3 best tournaments all started the same way: warm-up playlist, 10-minute hit, banana 30 min before. That's your formula."*
→ Feeds directly into the High-Stakes Prep card (Phase 7).

### 5. Situational tendencies
- *"You're 6–1 in opening matches but struggle in finals — the bigger the stage, the tighter you get."*
- *"You've beaten Marco's playing style 3 times — aggressive baseliners suit you."*

---

## How insights are delivered (tone & timing)

This is as important as the detection. A true insight delivered badly feels like a robot scolding you.

- **As sentences, never charts.** One insight, one card, written in the warm second-person voice. (A chart would betray the "no spreadsheet" promise.)
- **Compassionate framing for weaknesses.** Always paired with a *path*: "...so here's one 60-second drill / one cue for next time." Never just "you're bad at X."
- **Right place, right time:**
  - **Strengths** → surfaced in the feed & before tournaments (confidence).
  - **Weaknesses** → surfaced in **Learn** and in **Prepare** (actionable when it matters), *not* right after a loss (when it would sting).
- **Confidence thresholds.** Never claim a pattern from 1–2 data points. Require a minimum (e.g. 3+ occurrences) and **hedge honestly** ("This is an early hunch...") below high confidence. A wrong insight destroys trust instantly.
- **User can confirm or dismiss.** "Does this ring true?" 👍/👎 — feedback improves future detection *and* makes the user feel heard.

---

## The AI-powered learning system (how it works)

```
 Reflections + voice notes
          │
          ▼
  [1] EXTRACT tags & themes  (LLM extraction — shared w/ capture pipeline)
          │
          ▼
  [2] AGGREGATE over time    (count themes by outcome, context, emotion)
          │
          ▼
  [3] DETECT patterns        (co-occurrence, streaks, situational splits)
          │     (rules + thresholds; LLM for nuance/phrasing)
          ▼
  [4] PRIORITIZE             (most actionable + most surprising first)
          │
          ▼
  [5] NARRATE                (warm sentence + a path forward)
          │
          ▼
  Delivered as a card in feed / Learn / Prepare at the right moment
```

- **Hybrid approach:** cheap deterministic aggregation does the counting; the LLM does the *phrasing* and the *nuanced* pattern-spotting (e.g. linking "tight" + "finals" + "lost"). This keeps cost low and quality high.
- **Cold-start honesty:** with little data, Learn shows *"Keep reflecting — your patterns will appear after a few more matches. Here's what we'll be able to tell you."* (Sets the expectation; teases the payoff.)
- **It compounds:** the more history, the sharper and more predictive the insights. This is a core reason the app gets *better the longer you use it* — and a reason not to leave.

---

## What we deliberately DON'T do

- ❌ No win-percentage dashboards, no shot charts, no heat maps.
- ❌ No comparison to other users ("you're in the 40th percentile" — demotivating poison).
- ❌ No insight that shames without offering a path.
- ❌ No overclaiming from thin data.

> The Improvement Engine succeeds when the user thinks *"how did it know that about me?"* — and fails the moment it feels like a stats report or a wrong robotic guess. We bias toward **fewer, truer, kinder** insights.
