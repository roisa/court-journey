# Court Journey 🎾

**A personal sports journal for amateur tennis & padel players.**
Not a stats tracker. A memory keeper, a coach in your pocket, and a story of your years on court.

> Think *Apple Journal + Strava Memories + Duolingo Progress + Sports Diary* — built for the weekend warrior, not the data nerd.

---

## The one-sentence pitch

Court Journey turns the 30 seconds after a match into a lifetime of memories, lessons, and motivation — so amateur players capture the moments they'd otherwise forget, learn from every win and loss, and feel ready every time they step on court.

---

## Design north stars

Every feature must pass all four tests, or it gets cut:

1. **Speed** — Can the user complete it in under 30 seconds?
2. **Nostalgia** — Will they enjoy reading it again in 3 years?
3. **Emotion** — Does it create emotional value?
4. **Growth** — Does it help them improve?

We always choose: *simpler over complex · emotion over statistics · memories over data entry · long-term engagement over novelty · delight over feature count.*

---

## The app (MVP, in this repo)

A working, mobile-first MVP of the core loop — **capture a match in ≤30s → AI turns it into a beautiful memory → it lives in your Journey and resurfaces.** Built with the Phase 13 stack.

```bash
npm install
npm run start      # Expo dev server — open in Expo Go (iOS/Android) or press 'w' for web
npm run web        # web preview
npm run typecheck  # tsc --noEmit
```

**Stack:** Expo SDK 56 · React Native · TypeScript · Expo Router · Reanimated.
**Architecture:** local-first (AsyncStorage), offline-capable, zero secrets required. The AI story generator ships with an on-device heuristic and a Claude-ready implementation that activates via `EXPO_PUBLIC_ANTHROPIC_API_KEY` (in production the key belongs in a Supabase Edge Function — see Phase 13).

| Layer | Where |
|-------|-------|
| Screens (Expo Router) | `app/` — onboarding, tabs (Journey/Learn/Prepare/Profile), `capture`, `memory/[id]`, `tournament/[id]`, `achievements` |
| State + persistence | `src/store/AppStore.tsx`, `src/services/storage.ts` |
| AI story generation | `src/services/ai/` (swappable: local + Claude) |
| Improvement Engine | `src/services/insights.ts` |
| Memory resurfacing | `src/services/resurfacing.ts` |
| Self-writing chapters | `src/services/chapter.ts` |
| Achievements & checklists | `src/data/` |
| Domain models | `src/types/models.ts` (match-first, tournament-optional) |
| Design tokens | `src/theme/` |

What's implemented: onboarding · Journey feed · ≤30s capture (3-tap + voice note + photos) · AI memory generation · editable memory detail with voice playback · tournaments with auto-written chapters · adaptive prep checklists · language-based insights · ~18 working achievements with celebration · "On This Day" resurfacing. See Phase 14 for the build plan this follows.

---

## The design spec (read in order)

| # | Phase | Document |
|---|-------|----------|
| 1 | Product Vision | [docs/01-product-vision.md](docs/01-product-vision.md) |
| 2 | User Journey Mapping | [docs/02-user-journeys.md](docs/02-user-journeys.md) |
| 3 | Information Architecture | [docs/03-information-architecture.md](docs/03-information-architecture.md) |
| 4 | Feature Prioritization | [docs/04-feature-prioritization.md](docs/04-feature-prioritization.md) |
| 5 | Memory System | [docs/05-memory-system.md](docs/05-memory-system.md) |
| 6 | Tournament Reflection Flow | [docs/06-reflection-flow.md](docs/06-reflection-flow.md) |
| 7 | Tournament Preparation System | [docs/07-preparation-system.md](docs/07-preparation-system.md) |
| 8 | Improvement Engine | [docs/08-improvement-engine.md](docs/08-improvement-engine.md) |
| 9 | Motivation System (50 achievements) | [docs/09-motivation-system.md](docs/09-motivation-system.md) |
| 10 | Magic Moments (20 features) | [docs/10-magic-moments.md](docs/10-magic-moments.md) |
| 11 | UX Screens | [docs/11-ux-screens.md](docs/11-ux-screens.md) |
| 12 | Data Model | [docs/12-data-model.md](docs/12-data-model.md) |
| 13 | Technical Architecture | [docs/13-technical-architecture.md](docs/13-technical-architecture.md) |
| 14 | Build Plan (4 weeks) | [docs/14-build-plan.md](docs/14-build-plan.md) |
| — | **Final Recommendations** | [docs/15-final-recommendations.md](docs/15-final-recommendations.md) |

**If you read only one document, read [15 — Final Recommendations](docs/15-final-recommendations.md).**

---

## The biggest assumption we challenge

Most "sports apps" assume engagement comes from *data*. It doesn't — not for amateurs. Amateurs play **3–8 tournaments a year**. A tournament-only app would be opened 8 times a year and deleted.

Court Journey's real job is **emotional memory**, and its real cadence is the **match and the moment**, not the tournament. The tournament is the headline; the memories are the product. See [Phase 1](docs/01-product-vision.md) and [Final Recommendations](docs/15-final-recommendations.md) for how we resolve this tension.
