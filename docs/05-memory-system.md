# Phase 5 — Memory System

This is the heart of the product. If capture isn't effortless and the output isn't beautiful, nothing else matters.

**Design tension:** capture must be *fast* (≤30s, ideally ≤10s) but the result must be *rich* (something to treasure in 3 years). These pull in opposite directions. The resolution: **capture is a seed; AI grows it into a story.** The user gives 10 seconds of raw emotion; the AI does the gardening.

---

## Concept exploration

### Concept 1 — "The Form" (rejected)
Structured fields: opponent, score, surface, what went well, what went wrong, rating. Thorough, but it's a tax form. Takes 2–3 minutes, feels like work, and produces something nobody re-reads. **Violates everything.** Rejected.

### Concept 2 — "Voice-First Brain Dump" (strong)
One button. Hold to talk. The player rambles for 20 seconds the way they'd tell a friend: *"Ugh, lost 6–4 in the third but honestly my forehand was unreal today, I just got tight on the big points again..."* AI transcribes, extracts feeling + lessons + result, and writes a polished journal entry. **Zero typing. Maximum emotion.** The way humans actually process a match.

### Concept 3 — "Tap-the-Feeling" (strong, complementary)
For when you can't talk (locker room, public). 3 taps: **result** (won/lost/just played), **how it felt** (emoji/word scale), **one tag** (e.g. "comeback," "served great," "got tight"). Optional photo. Done in 10 seconds. AI can still spin a short entry.

### Concept 4 — "The Moment Marker" (complementary)
A single tap *during* play to bookmark "something just happened." No detail required. Fill in later, or the app prompts you that evening. Captures the lightning before it fades.

### Winner: **a layered system, not one concept**

> **Capture should meet the user at their available energy level.** Sometimes they have 20 seconds and a lot to say; sometimes 5 seconds and one thumb. We support both, and AI unifies the output.

```
        ⚡ CAPTURE
   ┌────────┴─────────┐
 Hold to talk     Tap to log
 (Voice-first)   (Feeling+tag)
        └────────┬─────────┘
                 ▼
        AI transformation
                 ▼
   A warm, narrative memory
   (+ photo, + extracted lesson,
    + feeling, auto-filed)
```

---

## How users save a memory in **under 30 seconds**

The fastest path (the default we optimize):

1. Tap **⚡** (center, always reachable) — *1s*
2. **Hold and talk** for ~15s, OR tap result + feeling + one tag — *5–15s*
3. (Optional) snap/attach a photo — *5s*
4. Tap done. **AI handles the rest.** — *1s*

The user never types a sentence unless they want to. **The mantra: the user supplies the emotion; the AI supplies the prose.**

Friction killers:
- **No required fields.** Ever. A memory can be just a feeling. Just a photo. Just a voice note.
- **Smart defaults:** date = now, location = GPS-detected venue, sport = their default, opponent = autocomplete from history.
- **Capture now, enrich later:** every memory can be a seed; the evening "want to add to today's match?" nudge lets them expand at leisure.

---

## How AI transforms notes into meaningful stories

The AI pipeline (see Phase 13 for the stack):

1. **Transcribe** voice → text (on-device or cheap API).
2. **Extract** structured signal from the ramble: result, emotion(s), what worked, what didn't, opponent, key moment, lesson. *(This structured extraction is also what feeds the Improvement Engine — see Phase 8. Capture and insight share one pipeline.)*
3. **Generate** a short narrative in a **warm, second-person, human voice** — never clinical. Tone calibrated to outcome (celebratory for wins, compassionate + constructive for losses).
4. **Title** it memorably ("The Comeback at Riverside," not "Match vs. Marco").
5. **Tag** it for resurfacing and pattern-finding.

> **Guardrails:** AI never invents facts the user didn't say. It polishes and frames; it doesn't fabricate scores or events. Always show the raw voice note alongside the AI story — the user's actual voice is the most precious artifact. The AI story is editable with one tap; the original is sacred.

Example transformation:

> **Input (voice):** *"Lost 6–4 in the third, gutted, but my forehand was unreal, I just got tight serving for it at 5–4."*
>
> **Output (journal entry):**
> ### Came up just short — but the forehand has arrived 🔥
> *A tight one today — lost 6–4 in the deciding set. It stings, because for two sets your forehand was the best it's been all year. The lesson is sitting right there: at 5–4, serving it out, the nerves crept in. You've felt this before. Next time, the cue is simple — slow the feet, trust the swing. You didn't lose because you're not good enough. You lost a moment. Those are learnable.*
>
> *Feeling: gutted but proud · Lesson saved: "Closing out — slow feet on big points" · Strength spotted: forehand*

---

## How users relive old tournaments

- **Tournament cards** in the feed expand into a mini-story: the arc across matches, the photos, the highs and lows, the lesson learned. A *chapter*, not a results table.
- **Re-open ritual:** tapping an old tournament plays its memories like a small reel — photos, your voice notes (hearing your *own past voice* is devastatingly emotional), the AI-written chapter summary.
- **"Take me back"** button on any old entry → immersive full-screen replay.

---

## How yearly memories work

- **Year in Review** (Phase 10): an auto-generated, scrollable + playable recap — best win, toughest loss, biggest improvement, funniest moment, most-used word in your voice notes, cities played, people met.
- Delivered as an *event* (push notification, a date to look forward to — like Spotify Wrapped), not buried in a menu.
- Each year compounds; the Year 3 recap can reference Year 1 ("Remember when this serve terrified you?").

---

## How photos, voice notes, and lessons work together

They are **three facets of one Memory object**, not separate features:

```
        ┌─────────── MEMORY ───────────┐
        │                              │
     PHOTO          VOICE NOTE      LESSON
   (what it       (how it felt,   (what I'll
    looked like)   your real       carry
                   voice)          forward)
        │             │              │
        └─────► AI STORY ◄───────────┘
         (weaves all three into prose,
          tags it, files it, resurfaces it)
```

- **Photo** = the visual trigger (most powerful for nostalgia).
- **Voice note** = the emotional truth (your own voice = time machine).
- **Lesson** = the growth thread (feeds Phase 8 + Prepare confidence cards).

A memory needs only *one* of these to exist. The richest memories have all three. The AI story is the connective tissue that turns three fragments into something you'll re-read in 2029 and feel your throat tighten.
