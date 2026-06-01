# Phase 11 — UX Screens

Mobile-first, thumb-reachable, calm. Visual language: warm and editorial (like a beautiful journal), **not** dashboard-y. Generous whitespace, large emotional imagery, soft motion. The aesthetic itself signals "memories, not metrics."

For each screen: **Purpose · Components · Hierarchy · Empty State · First-Time Experience · Returning User Experience.**

---

## 1. Onboarding

- **Purpose:** earn trust and the first memory in ≤90s; set the emotional frame ("this is your story, not a stat tracker").
- **Components:** 3–4 swipeable value cards (memory / learn / prepare); sport picker (tennis/padel); plain-language level ("I rally fine but matches scare me"); *why are you here?* (multi-select intent); sign-in (Apple/Google); permission primers (notifications "for your memories," not "marketing").
- **Hierarchy:** emotional promise → minimal setup → immediate first action ("Log your most recent match" or "We'll capture your first one together").
- **Empty State:** N/A (this *is* the empty state of the app).
- **First-Time:** warm, aspirational, fast. Ends by depositing the user into a feed that already has *one* thing (their first match or a welcome card) so it's never blank.
- **Returning:** skipped (or a 2-tap re-auth). Never re-onboard.

---

## 2. Home — Journey (feed)

- **Purpose:** the living memory feed; the retention engine; home base.
- **Components:** chronological cards — match memories (photo + AI title + feeling), tournament chapter cards, resurfaced "On This Day," milestone/achievement cards, proactive insight & confidence cards. Filter chips (All · Tournaments · By rival · By year). Persistent **⚡ Capture** (center tab).
- **Hierarchy:** top = anything *time-sensitive* (resurfaced memory, upcoming-tournament prompt), then reverse-chronological story. Imagery-forward; text minimal per card.
- **Empty State:** a single warm prompt — *"Your journey starts with one match. 🎾 Tap ⚡ to capture it."* Plus a faint preview of what a filled feed will feel like.
- **First-Time:** maybe one seeded card + a gentle pointer to ⚡. Celebrate the first real capture immediately.
- **Returning:** feed leads with fresh resurfacing & insights so there's *always* something new even if they haven't played. This is what makes daily opening rewarding.

---

## 3. Tournament Detail

- **Purpose:** relive a tournament as a *chapter*, not a results table.
- **Components:** hero image + tournament title/venue/date; the AI-written chapter summary; horizontal match timeline (W/L dots, tappable); photo strip; voice notes; lesson(s) learned; "Take me back" reel button; outcome/placement (subtle, not the star).
- **Hierarchy:** story & emotion first (hero + narrative), facts second (results), photos/voice as rich texture.
- **Empty State:** *during* a live tournament — *"In progress. Capture moments as you go."* with a quick-add. Before any matches: prep entry point.
- **First-Time:** guided "wrap up your first tournament?" → shows the auto-written chapter (the payoff moment).
- **Returning (old tournament):** immersive nostalgia; emphasizes "X years ago" and replay.

---

## 4. Memory Timeline

- **Purpose:** the deep scroll through your whole playing life; the archive that becomes irreplaceable.
- **Components:** vertical timeline grouped by year/season; year headers with mini-recap entry points; density toggle (all / highlights only); jump-to-year; search by feeling/rival/venue.
- **Hierarchy:** years as chapters → standout memories surface larger; ordinary ones compact.
- **Empty State:** *"Every match you capture becomes part of your story here. It grows more precious every year."*
- **First-Time:** essentially empty but framed as a promise; shows a faux future-state teaser.
- **Returning:** the emotional crown jewel — scrolling years of growth. Anchors the "I could never delete this" feeling.

---

## 5. Prepare

- **Purpose:** convert pre-tournament anxiety → calm confidence.
- **Components:** **time-aware** — dormant when no event near; when a tournament is upcoming: countdown, adaptive checklist (Phase 7), confidence card (Phase 8 lesson), venue/rivalry recall, pre-match calm card, "I'm ready" completion.
- **Hierarchy:** the *next* event and its readiness dominate; calm reassurance copy throughout.
- **Empty State (no event):** *"No tournament on the horizon. When you've got one, come here and we'll get you ready."* + a "Plan a tournament" CTA.
- **First-Time:** the reassuring First-Tournament Checklist + expectation reset.
- **Returning:** shorter, smarter, personalized list that visibly shrinks as they grow — proof of progress.

---

## 6. Learn

- **Purpose:** the Improvement Engine surface — patterns, strengths/weaknesses, lessons, micro-drills. Narrative, never a dashboard.
- **Components:** insight cards (strengths, patterns, mental notes) as sentences; lessons library (searchable); "your winning formula"; optional 60-sec drill suggestions; 👍/👎 on insights.
- **Hierarchy:** most surprising/actionable insight first; strengths framed to build confidence; weaknesses framed with a path forward.
- **Empty State:** *"Keep reflecting — after a few more matches we'll start spotting your patterns. Here's what we'll be able to tell you…"* (teaser).
- **First-Time:** mostly teaser; sets the expectation of compounding value.
- **Returning:** sharper, deeper insights over time; the "how did it know that?" moments live here.

---

## 7. Profile

- **Purpose:** identity, journey-at-a-glance, recaps, settings.
- **Components:** player identity (name, sport(s), since-date, home club); headline emotional stats *as story chips* ("47 matches · 4 cities · 2 years"), **never a stats grid**; Year-in-Review entry points; achievements entry; deep timeline entry; settings/export/backup.
- **Hierarchy:** identity & story → recaps/achievements → utilities.
- **Empty State:** minimal identity + "your story is just beginning."
- **First-Time:** prompts a photo/name; otherwise sparse.
- **Returning:** a proud personal "home wall"; recaps and milestones feel like trophies.

---

## 8. Achievements

- **Purpose:** celebrate real milestones (Phase 9); a wall of meaningful moments.
- **Components:** category sections (Milestones, Comebacks, Performance, Growth, Consistency, Exploration, Story); earned vs. in-progress; each unlocked one shows its *date & story* and a share action; a few "in progress" with gentle progress hints.
- **Hierarchy:** recently earned + near-completion surface first; locked ones are subtle (intrigue, not pressure).
- **Empty State:** "Day One" already earned on signup, so never truly empty — *"You've started. The rest you'll earn on court."*
- **First-Time:** shows the one or two already earned (Day One, First Match) — instant reward.
- **Returning:** a growing trophy wall tied to real memories; tapping one jumps to that moment in the journey.

---

## Cross-screen UX principles

- **⚡ Capture is reachable from everywhere** — center tab, one thumb.
- **Tone is a feature:** warm, second-person, compassionate after losses, celebratory after wins.
- **No raw stat grids anywhere.** Numbers appear only inside sentences/story chips.
- **Motion is gentle** (memory reveals fade/slide, never flashy).
- **Offline-first capture:** you can always log a match with no signal; sync later. Memories must *never* feel at risk.
