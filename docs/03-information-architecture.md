# Phase 3 — Information Architecture

The IA decision *is* the product strategy. Where we put "capture" and what the home screen shows declares what we believe the app is for.

We evaluate three navigation options against the north stars (speed, nostalgia, emotion, growth) and — critically — against the **Phase 1 reframing**: matches & memories are the product; tournaments are the headline.

---

## Option A — "Tournament-Centric" (the obvious one)

```
[ Tournaments ]  [ Prepare ]  [ Stats ]  [ Profile ]
```

Home = a list of tournaments. Tap one to drill into matches.

- ✅ Familiar; mirrors how leagues/draws work.
- ❌ **Fatal flaw:** the home screen is empty 90% of the year (3–8 tournaments). Opening the app feels like opening a filing cabinet.
- ❌ Pushes "Stats" into the nav — directly violates the "no spreadsheet" principle.
- ❌ Buries memories. Nostalgia is the retention engine, and it's two taps deep.

**Verdict:** This is the trap the brief warns against. Rejected.

---

## Option B — "Memory-Feed-Centric" (Strava/Instagram-style)

```
[ Journey ]  [ Capture ⚡ ]  [ Prepare ]  [ Profile ]
   (feed)      (center FAB)
```

Home = a reverse-chronological **feed of memories** (matches, moments, photos, milestones, resurfaced "on this day"). A big center capture button. Tournaments are *views/filters* within the Journey, not the primary axis.

- ✅ Home is **alive every day** — even between tournaments, there are resurfaced memories and casual matches.
- ✅ Capture is the literal center of the app (one thumb-tap). Honors the 30-second rule.
- ✅ Nostalgia is the default state, not a destination.
- ✅ Tournaments still exist as rich grouped entries inside the feed and as a filter.
- ⚠️ "Prepare" and "Learn" must coexist; risk of cramming. Solved by making **Prepare** time-aware (only prominent when a tournament is near) and folding **Learn/Insights** into Profile + proactive cards in the feed.

**Verdict:** Strongest. Matches the Phase 1 reframing exactly.

---

## Option C — "Mode-Switch / Hub" (contextual)

```
Top toggle:  [ Remember ]   [ Improve ]   [ Prepare ]
Plus a persistent Capture button.
```

Three "modes" the user switches between depending on intent.

- ✅ Conceptually clean — maps to the three emotional jobs.
- ✅ Each mode can be deep without cluttering others.
- ❌ Mode-switching adds a decision before every action ("which mode am I in?") — costs precious seconds and cognitive load.
- ❌ "Improve" as a standalone tab invites stat-creep over time.
- ❌ Less discoverable; users may never find a whole third of the app.

**Verdict:** Good mental model, worse ergonomics. We *borrow* its three-jobs framing but not its navigation.

---

## Decision: **Option B**, enriched with B's three-jobs thinking baked into one feed

### Final navigation (4 tabs + center capture)

```
┌─────────────────────────────────────────────┐
│                                               │
│                JOURNEY (feed)                 │
│                                               │
├───────┬───────┬─────────┬───────┬────────────┤
│Journey│ Learn │ ⚡Capture│Prepare│  Profile   │
│ (home)│       │ (center)│       │            │
└───────┴───────┴─────────┴───────┴────────────┘
```

- **Journey** (home) — the living memory feed. Matches, moments, tournament cards, resurfaced memories, milestone celebrations, proactive insight cards. Filterable to "Tournaments only," "By rival," "By year."
- **Learn** — the Improvement Engine surface: your patterns, strengths/weaknesses, lessons library, micro-drills. Calm, narrative, never a dashboard. *(Promoted to a tab only because growth is a core JTBD; if testing shows low use, it folds into Profile and we go to 3 tabs.)*
- **⚡ Capture** (center) — the single most important button. Opens the ≤30s capture/reflection flow (Phase 5 & 6). Context-aware: knows if you have a live tournament.
- **Prepare** — checklists + confidence cards. **Time-aware:** dormant/quiet when no tournament is near; lights up with a countdown when one is.
- **Profile** — identity, achievements, yearly recaps, the deep timeline, settings.

### Why this wins

1. **Speed:** capture is one tap from anywhere, dead center.
2. **Nostalgia:** the home screen *is* the memories — the retention engine is the default view.
3. **Emotion:** the feed feels like a story, not a database.
4. **Growth:** Learn + proactive insight cards keep improvement present without a spreadsheet.
5. **Solves the empty-home problem:** between tournaments, resurfaced memories + casual matches keep the feed warm.

### Information hierarchy (entities)

```
User
 └── Journey (the feed = chronological union of...)
       ├── Tournaments  ──┐ (group/headline)
       │     └── Matches ─┤
       ├── Matches  ──────┤ (can exist WITHOUT a tournament — casual/practice)
       │     └── Memories─┤ (photos, voice notes, moments, lessons)
       ├── Standalone Memories
       ├── Milestones / Achievements
       └── Insights (AI cards)
```

**The defining structural choice:** a Match does **not** require a Tournament. This is what lets the app live between tournaments and is the technical expression of the Phase 1 reframing. (See Phase 12.)
