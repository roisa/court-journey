# Final Recommendations

*The synthesis. If you read one document, read this one.*

---

## 1. Final Product Vision

> **Court Journey is a personal sports journal for amateur tennis and padel players — a memory keeper, a gentle coach, and the story of your years on court.**

It turns the 30 seconds after a match into a lifetime of memories, lessons, and motivation. It is **not** a stats tracker; it is in the *meaning* business. Its core loop:

```
PREPARE (anxiety→confidence) → PLAY → CAPTURE (≤30s, voice-first) →
AI makes it beautiful → RELIVE & LEARN → patterns & memories compound → back to PREPARE
```

The product grows up with the user: **hold my hand** (first tournament) → **coach me** (fifth) → **remember me** (twentieth). Early value is effortless emotional capture; long-term value is an irreplaceable archive whose gravity makes the app un-deletable.

---

## 2. Final MVP Scope

A 4-week, single-loop MVP (Phase 14). The whole bet:

- **Capture a match in ≤30s** (3 taps + optional voice/photo), tournament *optional*.
- **AI returns a beautiful, warm journal entry** (title, story, feeling, lesson) — the moment that sells the app.
- **A living Journey feed** where memories resurface ("On This Day").
- **Optional tournament grouping** with a *self-writing* chapter.
- **Adaptive Prepare checklist** (3 presets) for pre-event confidence.
- **~10 meaningful achievements** + a warm Profile.
- Built on **Expo + Supabase + Claude**, offline-first, near-zero fixed cost.

Everything else — Improvement Engine, 50 achievements, recaps, documentaries, rivalries, predictive prep — is V2+. Prove the loop first.

---

## 3. Features to Remove (the ruthless cuts)

These sound reasonable and would each quietly kill the product:

- ❌ **Point-by-point / game-by-game scoring** — the #1 cut. Violates ≤30s and the no-spreadsheet soul. Result + a feeling is enough.
- ❌ **Statistics dashboards, charts, win %** — we deliver insight as *sentences*, never graphs.
- ❌ **Leaderboards / public ranking / percentiles** — toxic comparison that demotivates the beginner who is our core user.
- ❌ **Daily-play streaks** — punish rest and injury. (Gentle *reflection* streaks only.)
- ❌ **Opponent scouting databases, coach tools** — that's a different product/persona.
- ❌ **In-app social network / messaging** — scope and moderation black hole; off-mission.
- ❌ **Wearables / fitness / calorie tracking** — Strava & Apple Health own it.

> Killing these *is* the product design. The discipline of the four north stars (≤30s · re-read in 3 years · emotional · improves) is what keeps Court Journey from drifting into the very category it's meant to escape.

---

## 4. Biggest Risks

1. **The frequency problem (existential).** Amateurs play 3–8 tournaments/year — too rare for a habit. *Mitigation:* matches & memories (not tournaments) are the unit; resurfacing + insights keep the feed alive between events. This must be validated early — watch weekly active use between tournaments like a hawk.
2. **Capture friction.** If logging ever feels like work, the whole thing collapses. *Mitigation:* obsessive ≤30s, voice-first, zero required fields, AI does the writing. Measure capture-completion rate as the #1 KPI.
3. **AI quality & tone.** A robotic or wrong "memory" feels creepy and breaks trust; a wrong insight is worse. *Mitigation:* warm second-person voice, never fabricate facts, preserve raw voice, hedge low-confidence insights, let users edit/confirm.
4. **Cost of AI at scale.** Tokens are the one real variable cost. *Mitigation:* model tiering, batching, prompt caching, on-device STT.
5. **"Empty journal" cold start.** New users have nothing to relive. *Mitigation:* front-load delight (first entry is beautiful, Day One achievement), teaser empty states, capture a *past* match in onboarding.
6. **Retention beyond novelty.** *Mitigation:* the compounding archive + recaps + insights that *get better with time* — value that grows rather than fades.

---

## 5. Biggest Opportunities

1. **Own an unclaimed category.** Everyone builds stat trackers and league apps. *Nobody* owns "the emotional memory of amateur racquet sports." Category-defining whitespace.
2. **The compounding moat.** Years of memories can't be re-created elsewhere; switching cost is emotional. The longer someone uses it, the more impossible it is to leave.
3. **AI as story & coach, not gimmick.** Turning rambled voice notes into treasured prose *and* into pattern insights — from the *same* pipeline — is a genuinely novel, defensible experience.
4. **The "wow, it knows me" wedge.** Magic Moments (Phase 10) are intensely shareable and word-of-mouth-friendly — organic growth from delight.
5. **Expansion paths.** Once PMF in tennis/padel: pickleball, squash, badminton, then any amateur competitive pursuit. Same emotional engine, new sports.
6. **Natural premium tier.** AI stories, recaps/documentaries, deep insights, unlimited media = a clear, value-aligned subscription (via RevenueCat) without paywalling the emotional core.

---

## 6. Recommended Next Step

**Don't build the full app yet. Validate the single riskiest assumption first — in 1–2 weeks, not 4.**

> Build a **capture-loop prototype**: a player finishes a match, taps ⚡, talks for 15 seconds, and receives a beautiful AI-written memory with their photo and voice. Nothing else — no tournaments, no achievements, no feed polish.

Put it in front of **10–15 real amateur players** for two weeks and watch one thing:

**Do they capture a second, third, fourth match *unprompted* — and does receiving the AI memory make them smile?**

- If **yes** → the core loop works; proceed to the full 4-week MVP (Phase 14) with confidence.
- If **no** → fix capture friction or AI quality *before* building anything else. Everything in this spec rests on that one loop being delightful.

Then, in parallel, **answer the frequency question**: instrument whether those testers open the app between matches at all. That single behavior determines whether Court Journey is a beloved daily companion or an app opened 8 times a year. Build the rest only once both answers are green.

---

### The one-line summary

> Build the smallest thing that makes a player smile after a match. Everything else in this spec is just scaling that smile across a lifetime.
