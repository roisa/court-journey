# Phase 12 — Data Model

Designed around the Phase 1/3 reframing: **Match is first-class and does NOT require a Tournament.** Memories are flexible (a memory may attach to a match, a tournament, or stand alone). Insights and achievements are derived/append-only.

Conventions: `uuid` PKs, `timestamptz` for times, soft-delete via `deleted_at`, every user-owned row carries `user_id` for row-level security.

---

## Entity relationship overview

```
                         ┌──────────┐
                         │  users   │
                         └────┬─────┘
            ┌─────────────────┼───────────────────┬──────────────┐
            │                 │                   │              │
      ┌─────▼──────┐   ┌──────▼──────┐     ┌──────▼──────┐  ┌────▼─────┐
      │tournaments │   │   matches   │     │ achievements│  │checklists│
      └─────┬──────┘   └──────┬──────┘     │ (_unlocked) │  └────┬─────┘
            │                 │            └─────────────┘       │
            │ 1      0..1 ┌────┘                            ┌─────▼──────┐
            └────────────►│  (match.tournament_id NULLABLE)│checklist_  │
                          │                                │  items     │
                    ┌─────▼──────┐                         └────────────┘
                    │  memories  │◄── attach to match OR tournament OR neither
                    └─────┬──────┘
          ┌───────────────┼────────────────┐
    ┌─────▼────┐   ┌───────▼─────┐   ┌──────▼─────┐
    │  photos  │   │ voice_notes │   │  lessons   │
    └──────────┘   └─────────────┘   └─────┬──────┘
                                           │ (themes feed)
                                    ┌──────▼──────┐
                                    │  insights   │ (AI-derived)
                                    └─────────────┘
```

Relationship summary:
- `users` 1—N `tournaments`, `matches`, `memories`, `checklists`, `achievements_unlocked`, `insights`
- `tournaments` 1—N `matches` (a match's `tournament_id` is **nullable** — casual/practice matches have none)
- `matches` 1—N `memories`; `tournaments` 1—N `memories`; a `memory` can also have neither (standalone)
- `memories` 1—N `photos`, `voice_notes`, `lessons` *(or these attach directly to a match — see note)*
- `lessons` & reflection themes → aggregated into `insights`
- `checklists` 1—N `checklist_items`

> **Modeling note:** to keep MVP simple, photos/voice/lessons can attach directly to a `match` via `memory_id` *or* `match_id`. The cleanest model routes everything through `memories` (a match auto-creates a "match memory"). We adopt the memory-centric model below for long-term flexibility.

---

## Tables

### users
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| email | text unique | |
| display_name | text | |
| avatar_url | text | |
| primary_sport | enum(tennis,padel) | |
| skill_level | text | plain-language, self-described |
| home_venue | text | |
| intents | text[] | why they're here (remember/improve/prepare) |
| experience_tier | enum(beginner,intermediate,veteran) | derived from tournament count; drives adaptive prep |
| created_at | timestamptz | "Day One" |

### tournaments
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| name | text | |
| venue | text | |
| city | text | for "Road Warrior" / travel insights |
| sport | enum | |
| stakes | enum(casual,regular,high) | drives Prepare layer |
| surface | text | clay/hard/indoor/padel-glass etc. |
| start_date / end_date | date | |
| placement | text | nullable ("Semifinalist","Champion") |
| chapter_summary | text | AI-written, nullable |
| created_at | timestamptz | |

### matches  ← first-class, tournament optional
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| **tournament_id** | uuid FK **NULLABLE** | NULL = casual/practice |
| sport | enum | |
| opponent_name | text | nullable; autocompletes from history → rivalries |
| result | enum(won,lost,played) | |
| score | text | **optional**, single free-text field (e.g. "6-4 3-6 7-5"). No game-by-game. |
| played_at | timestamptz | |
| venue / city | text | |
| time_of_day | enum(morning,afternoon,evening) | derived; powers situational insights |
| duration_min | int | optional |
| created_at | timestamptz | |

### memories  ← the heart; flexible attachment
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| match_id | uuid FK NULLABLE | |
| tournament_id | uuid FK NULLABLE | |
| kind | enum(match,moment,standalone,milestone) | |
| feeling | enum(frustrated,flat,okay,good,onfire) | the emotional pulse |
| raw_note | text | what the user typed, if any |
| ai_title | text | memorable title |
| ai_story | text | the generated narrative (editable) |
| ai_story_edited | bool | did user edit it |
| occurred_at | timestamptz | |
| created_at | timestamptz | |

### photos
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id, memory_id | uuid FK | |
| storage_url / thumb_url | text | object storage |
| taken_at | timestamptz | from EXIF (powers auto-memory) |
| lat/lng | float | nullable; venue detection |

### voice_notes
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id, memory_id | uuid FK | |
| storage_url | text | the precious raw audio |
| duration_sec | int | |
| transcript | text | from STT |
| recorded_at | timestamptz | |

### lessons
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| memory_id / match_id | uuid FK NULLABLE | |
| text | text | the lesson ("slow feet on big points") |
| theme | text | normalized tag (e.g. "second_serve","tightness","footwork") |
| polarity | enum(strength,weakness,neutral) | what worked vs. didn't |
| created_at | timestamptz | |

### insights  ← AI-derived, the Improvement Engine output
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| type | enum(strength,weakness,mental,routine,situational,rivalry) | |
| narrative | text | the warm sentence shown to user |
| evidence_refs | jsonb | match/lesson ids supporting it |
| confidence | float | gates display; hedged below threshold |
| status | enum(active,confirmed,dismissed) | user 👍/👎 feedback |
| surfaced_at | timestamptz | nullable |
| created_at | timestamptz | |

### achievements (catalog) & achievements_unlocked
**achievements** (static catalog): `id`, `code`, `category`, `title`, `description`, `criteria` (jsonb), `tier`.
**achievements_unlocked**: `id`, `user_id`, `achievement_id`, `unlocked_at`, `context` (jsonb — e.g. which match), `shared` (bool). One row per user per achievement = a dated memory.

### checklists & checklist_items
**checklists**: `id`, `user_id`, `tournament_id` (nullable for templates), `type` (first/regular/high/custom), `name`, `is_template` (bool).
**checklist_items**: `id`, `checklist_id`, `text`, `why` (text), `is_checked` (bool), `is_auto_hidden` (bool — learned "always packed"), `sort_order`, `is_custom` (bool).

### insights & engagement support (V2+)
- **resurfacing_log**: `user_id`, `memory_id`, `kind` (on_this_day/anniversary/weekly), `shown_at`, `engaged` (bool) — prevents repeats, tunes timing.
- **recaps**: `user_id`, `period` (year/season), `payload` (jsonb), `media_url` (recap video), `generated_at`.

---

## Why this model honors the principles

- **Match-without-tournament** is enforced at the schema level (`tournament_id` nullable) — the technical guarantee that the app lives between tournaments.
- **No game/point tables.** Score is one optional text field. The "spreadsheet" is structurally impossible to build by accident.
- **Memory is the hub**, with photos/voice/lessons as facets — matching the Phase 5 mental model.
- **Insights are derived & append-only** with confidence + user feedback baked in — supports the honest, kind Improvement Engine.
- **Lessons carry `theme` + `polarity`** — the entire Improvement Engine runs off aggregating these two columns over time. That's the whole "analytics" layer, and it's just `GROUP BY theme`.
- **Achievements unlocked are dated rows** → they double as timeline memories.
