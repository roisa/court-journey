# Phase 13 — Technical Architecture

Optimized for a **solo founder**: lowest possible cost, fastest time-to-launch, minimal ops, and a clean path to scale if it takes off. The guiding rule: **buy/rent infrastructure, build only the product.** Every hour on DevOps is an hour not spent on the memory experience.

---

## Recommended stack (the opinionated pick)

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | **React Native + Expo** (TypeScript) | One codebase → iOS + Android. Mobile-first is mandatory. Expo handles builds, OTA updates, push, camera, audio, location — exactly our needs — with near-zero native config. Huge ecosystem; fast for a solo dev. |
| **Backend** | **Supabase** (managed Postgres + Auth + Storage + Edge Functions) | A backend-as-a-service that gives DB + auth + file storage + serverless functions + realtime in one product. Eliminates ~80% of backend work. Generous free tier; scales to paid smoothly. |
| **Database** | **Postgres** (via Supabase) | Relational fits our model (Phase 12) perfectly; `jsonb` covers flexible fields. Row-Level Security enforces per-user data isolation declaratively. |
| **Auth** | **Supabase Auth** (Apple + Google sign-in) | Social sign-in = lowest friction onboarding. No password management. Apple sign-in required for iOS anyway. |
| **Storage** | **Supabase Storage** (S3-compatible) for photos & voice notes; on-device cache | Cheap object storage with signed URLs + RLS. CDN in front for images. |
| **AI** | **Anthropic Claude API** (Haiku for extraction/transcription cleanup & high-volume tasks; Sonnet for the polished story/recap generation) | Story generation & insight narration are the magic. Tiered models keep cost low: cheap model for frequent extraction, better model for the few high-emotion narrative outputs. |
| **Speech-to-text** | On-device (Expo/native STT) first; cloud STT (e.g. Whisper-class API) as fallback | On-device = free + private + offline. Fallback only when needed. |
| **Background/AI jobs** | **Supabase Edge Functions** (Deno) + a lightweight queue | Story generation, insight detection, recap building run async so capture stays instant. |
| **Push & engagement** | **Expo Push Notifications** | Resurfacing/“On This Day”/prep reminders — the retention engine. Free. |
| **Analytics** | **PostHog** (product analytics + feature flags) | Free tier; understand the funnel (capture completion!), run flags. |
| **Error monitoring** | **Sentry** | Solo dev needs to know when things break. |
| **Payments (later)** | **RevenueCat** over App Store / Play subscriptions | Abstracts both stores' IAP; standard for indie mobile subscriptions. |

---

## Why this combination wins for a solo founder

- **Two products to learn, not ten:** Expo + Supabase cover ~90% of needs. The mental overhead is tiny.
- **No servers to manage:** everything is managed/serverless. No Kubernetes, no provisioning, no 3am pages.
- **Cost at launch ≈ near-zero:** Expo (free dev), Supabase free tier, PostHog/Sentry free tiers. The only real variable cost is **AI tokens**, which we control via model tiering and async batching.
- **Fast iteration:** Expo OTA updates push JS fixes without app-store review. Supabase migrations are simple SQL.
- **Scales gracefully:** Postgres + object storage + serverless scale to hundreds of thousands of users before any re-architecture is needed. If a hotspot emerges (e.g. AI volume), pull just that piece out.

---

## Cost control for the one true variable (AI)

AI is the only thing that costs real money per use, so we engineer it down:

1. **Tier the models:** Haiku for the frequent, cheap work (transcript cleanup, tag extraction, insight aggregation); Sonnet only for the handful of high-emotion outputs (the match story, the yearly recap) where quality is the product.
2. **Batch & defer:** story generation runs async right after capture (user doesn't wait, and we can batch). Insights recompute on a schedule, not on every event.
3. **Cache & template:** prep cards and common insight phrasings use templates with AI only for the variable parts. Use **prompt caching** for the stable system/context prefix to cut input cost.
4. **On-device first** for STT to avoid per-minute transcription fees.
5. **Hard rate limits** per user to cap abuse/runaway cost.

---

## Architecture diagram

```
┌──────────────────────────────────────────────────┐
│  React Native + Expo app (iOS / Android)           │
│  • Offline-first capture (local store, sync later) │
│  • On-device STT, camera, location                 │
└───────────────┬───────────────────────────────────┘
                │ HTTPS / Supabase client
                ▼
┌──────────────────────────────────────────────────┐
│  Supabase                                          │
│  ├─ Auth (Apple/Google)                            │
│  ├─ Postgres + Row-Level Security  (Phase 12)      │
│  ├─ Storage (photos, voice notes)                  │
│  └─ Edge Functions (async jobs) ──────┐            │
└───────────────────────────────────────┼───────────┘
                                         ▼
                          ┌───────────────────────────┐
                          │  Claude API (Haiku/Sonnet) │
                          │  • story generation        │
                          │  • tag extraction          │
                          │  • insight narration        │
                          │  • recap generation         │
                          └───────────────────────────┘
   Expo Push ◄── scheduled jobs (resurfacing, prep, insights)
   PostHog (analytics) · Sentry (errors) · RevenueCat (IAP, later)
```

---

## Key tradeoffs (named honestly)

| Decision | Upside | Tradeoff / risk | Mitigation |
|----------|--------|-----------------|------------|
| **Supabase BaaS** | Massive speed; tiny ops | Vendor lock-in; less control | It's open-source Postgres underneath → portable; revisit only at scale |
| **React Native/Expo** | One codebase, fast | Heavy native/perf features harder than pure native | Our app is content/media + light compute — well within RN's comfort zone |
| **Claude for AI** | Best-in-class narrative quality (the product's soul) | Per-token cost; external dependency | Model tiering, batching, caching, on-device STT; abstract the AI layer so a provider could be swapped |
| **Async story generation** | Instant capture UX | Story appears a moment later, not instantly | Show an optimistic "writing your memory…" state; usually <2s |
| **No custom backend (yet)** | Fewer moving parts | Complex business logic in Edge Functions can get awkward | Fine for MVP; extract a small service only if/when needed |
| **On-device STT** | Free, private, offline | Quality varies by device | Cloud STT fallback for low-confidence transcripts |

---

## Non-negotiables baked in from day one

- **Offline-first capture** — a memory must save with zero signal; sync later. Memories can never feel at risk. *(This is an emotional requirement, not just technical.)*
- **Data portability / export** — users own their story; one-tap export. Builds the trust required for people to pour years into it.
- **Privacy by default** — RLS isolates every user's data; voice notes & photos behind signed URLs; AI calls send only what's needed. The journal is intimate; treat it that way.
- **Backups** — automated Postgres + storage backups. Losing someone's 3-year journey would be unforgivable.
