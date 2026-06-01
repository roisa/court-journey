# Phase 6 — Tournament Reflection Flow

The post-match moment is emotionally raw — elation or heartbreak. That's exactly when the gold is available, and exactly when the user has the *least* patience for a form. Design imperative: **fewest possible questions, maximum emotional and learning yield.**

---

## Approaches explored

### Approach 1 — The Questionnaire (rejected)
8–10 questions: rate your serve, rate your return, rate your mental game, what went well, what to improve, opponent strength... Thorough, coach-grade. Also: nobody fills this out after losing a 3-setter. It feels like homework at the worst possible moment. Rejected.

### Approach 2 — One Big Open Voice Note (good, but)
"How did it go?" → hold to talk. Beautifully simple, captures emotion. But undirected rambling sometimes misses the *learning* signal, and some users freeze when asked an open question. Great as the *core*, needs gentle scaffolding.

### Approach 3 — The 3-Tap + Optional Voice (winner)
A micro-flow that gets 90% of the value in 3 taps, with voice as the depth option.

### Approach 4 — Mood-First Single Slider (too thin)
Just "how do you feel?" 1 tap. Captures emotion but loses the lesson entirely. Good for casual matches, too thin for tournaments.

---

## The chosen flow: **"Three taps, one voice, done."**

The genius is *progressive depth* — the user can bail after tap 1 and still have a valid memory, or go deep if they have something to say. Every step is optional after the first.

```
SCREEN 1 — Outcome (1 tap)
   "How'd it go?"
   [ Won 🎉 ]  [ Lost 😞 ]  [ Just played 🎾 ]
        (score optional, single field, can skip)

SCREEN 2 — Feeling (1 tap)
   "How do you feel right now?"
   😤 frustrated  😕 flat  😐 okay  🙂 good  🤩 on fire
        (a single emotional pulse — this is what you'll
         re-read in 3 years, not the score)

SCREEN 3 — The one question that matters (1 tap OR voice)
   "What's the one thing to remember?"
   Quick chips:  [ My X felt great ]  [ Got tight on big points ]
                 [ Great comeback ]   [ Tactics worked ]  [ + voice ]
        → tapping a chip = done.
        → 🎙 hold to say more (this becomes the rich entry + lesson)

   [ Save ]  ← appears from Screen 1 onward; nothing below is required
```

**Total time:** 8–15 seconds for the fast path. The voice option adds depth without adding *required* steps.

---

## Why only these three?

We reverse-engineered from the four north stars:

| The question | Serves which JTBD |
|--------------|-------------------|
| **Outcome** | The factual anchor (needed for recaps, rivalries, milestones) |
| **Feeling** | The emotional payload — *the thing you re-read* |
| **One thing to remember** | The growth thread — feeds Improvement Engine + Prepare |

Everything a coach would ask (serve %, unforced errors, tactical breakdown) is either (a) something the *voice note* captures naturally when it mattered, or (b) noise. We trust that **if it mattered, the player will mention it.** We don't interrogate.

---

## Smart behaviors that make it feel effortless

- **Outcome-adaptive copy & tone.**
  - After a **loss**, Screen 3 leads with compassion: *"Tough one. What's one thing you'll take from it?"* — never *"What did you do wrong?"* (We turn disappointment into growth, not shame.)
  - After a **win**, it leads with celebration: *"Let's bottle this — what worked?"*
- **Chip suggestions are personalized** — drawn from the user's recurring themes (Phase 8). A player who often mentions their second serve sees that chip first.
- **Defer-friendly:** "Reflect later tonight?" If they dismiss, a gentle evening nudge: *"Got 20 seconds to remember today's match?"*
- **Voice is always one thumb away** but never demanded.
- **The AI closes the loop:** after saving, it shows the freshly-written memory (Phase 5) so the user immediately feels the payoff — *"that took 12 seconds and I got something beautiful."* This instant reward is what builds the habit.

---

## Tournament-level reflection (the wrapper)

A tournament is several matches. We do **not** ask a separate big questionnaire at the end. Instead:

- When a tournament ends (detected via dates/last match), one optional prompt: *"Wrap up [Tournament]? One line on how the whole thing felt."* (voice or text, optional).
- AI stitches the individual match reflections into a **tournament chapter** automatically. The user doesn't re-enter anything — the chapter writes itself from the matches already captured.

> **Principle:** the user reflects on *matches* (small, fresh, frequent). The *tournament* story is assembled by AI for free. We never make the user summarize what they already told us.
