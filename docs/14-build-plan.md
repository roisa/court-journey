# Phase 14 — Build Plan (4 weeks to launch)

Goal: a launchable MVP in 4 weeks that proves the **core loop** — *capture a match in ≤30s → get a beautiful memory back → come back to do it again.* Everything is sequenced so there's a working, demoable app at the end of **every** week.

Solo-founder assumptions: full-time effort, stack from Phase 13 (Expo + Supabase + Claude), leaning hard on managed services.

---

## Week 1 — Foundation + capture skeleton

**Theme:** "I can log a match and it's saved forever."

- **Screens:** Onboarding (sport, level, intent, sign-in); Home/Journey feed (basic list); ⚡ Capture flow (3-tap reflection — Phase 6); Match memory detail.
- **Components:** tab bar (4 tabs + center ⚡); outcome/feeling/tag pickers; memory card; auth screens; offline-first local store.
- **Database (provision + create):** `users`, `matches`, `memories`, `lessons`. Supabase Auth (Apple/Google), RLS policies.
- **Priorities:** 1) auth working, 2) capture a match → row in DB, 3) it appears in the feed, 4) offline save → sync.
- **End-of-week demo:** sign in, log a match in <30s, see it in the feed. *No AI yet, no photos yet — just the bones of the loop.*

---

## Week 2 — The magic (AI stories + media)

**Theme:** "When I capture, I get something beautiful back."

- **Screens:** enrich Capture with **voice note** (record + on-device STT) and **photo**; Memory detail shows AI story + photo + playable voice note.
- **Components:** hold-to-record voice UI; camera/photo picker; "writing your memory…" optimistic state; editable AI story.
- **Database:** `photos`, `voice_notes`; Supabase Storage buckets + signed URLs.
- **AI (Edge Function):** voice/notes → tag extraction (Haiku) → narrative story (Sonnet) → title + feeling + lesson; write back to `memories`/`lessons`.
- **Priorities:** 1) voice→transcript→story pipeline, 2) photo upload + display, 3) AI tone (warm; loss-compassionate vs. win-celebratory), 4) story is editable, raw voice preserved.
- **End-of-week demo:** talk for 15s after a match → get a titled, warm journal entry with your photo and your voice attached. **This is the moment that sells the app.**

---

## Week 3 — Tournaments + Prepare + first delight

**Theme:** "It groups my story and gets me ready."

- **Screens:** Tournament create/detail (chapter view, match timeline); Prepare (time-aware checklist); plug **"On This Day"** card into the feed.
- **Components:** tournament wrapper (assign matches); adaptive checklist (3 presets + custom — Phase 7); confidence/prep card; tournament chapter card in feed; resurfacing card.
- **Database:** `tournaments`, `checklists`, `checklist_items`; `resurfacing_log`.
- **AI:** auto-assemble tournament `chapter_summary` from its match reflections.
- **Priorities:** 1) match↔tournament linking (nullable, casual matches still work), 2) checklist that adapts to experience tier, 3) the self-writing chapter, 4) "On This Day" resurfacing job + push.
- **End-of-week demo:** create a tournament, log its matches, see an auto-written chapter; prep for an upcoming one; get an "On This Day" memory.

---

## Week 4 — Motivation, polish, launch prep

**Theme:** "It celebrates me, feels finished, and is ready for real users."

- **Screens:** Achievements wall (~10 MVP achievements — Phase 9); Profile (identity + story chips + recap/achievement entry points); empty states & first-time experiences across all screens.
- **Components:** achievement unlock moment/animation; profile identity; export/backup; notification preferences; onboarding polish.
- **Database:** `achievements` (catalog seed ~10), `achievements_unlocked`. (Stub `insights` for V2.)
- **AI:** none new; tune prompts & cost (model tiering, prompt caching).
- **Priorities:** 1) achievement triggers (Day One, First Match, First Win, First Reflection, etc.), 2) all empty/first-time states warm & non-blank, 3) push notification opt-in flow, 4) crash/error pass (Sentry), analytics on the capture funnel (PostHog), 5) TestFlight/Play internal build.
- **End-of-week demo:** full loop end-to-end — onboard → prep → capture (voice+photo+AI) → tournament chapter → achievement → resurfaced memory → profile. **Ship to a private beta.**

---

## What is explicitly NOT in the 4-week MVP

(Deferred to V2/Future per Phase 4 — do not let these creep in:)
- Improvement Engine pattern detection (stub the table; needs data first)
- Full 50 achievements, streaks, rivalries
- Yearly Recap / documentaries / advanced Magic Moments
- Smart venue/rivalry recall, predictive prep
- Any statistics, charts, social features, score-by-game entry

---

## MVP scope at a glance

| Layer | In the 4-week MVP |
|-------|-------------------|
| **Screens** | Onboarding, Journey feed, Capture (3-tap + voice + photo), Memory detail, Tournament detail, Prepare, Achievements, Profile |
| **Core loop** | Capture ≤30s → AI story → feed → resurface |
| **AI** | Tag extraction + story/title/lesson generation + chapter summary |
| **DB tables** | users, matches, memories, photos, voice_notes, lessons, tournaments, checklists, checklist_items, achievements(+unlocked), resurfacing_log |
| **Delight** | On This Day, self-writing chapter, ~10 achievements, warm AI tone |
| **Infra** | Expo app, Supabase (Auth/DB/Storage/Edge Fn), Claude API, Expo Push, PostHog, Sentry |

**The discipline:** if a task doesn't serve the core loop or the first "beautiful memory back" moment, it waits. Launch in 4 weeks, then let real users tell you what's next.
