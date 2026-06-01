/**
 * Domain models for Court Journey.
 * Mirrors docs/12-data-model.md, adapted for a local-first client store.
 *
 * Key design rule (docs/01 & docs/03): a Match is first-class and does NOT
 * require a Tournament. `tournamentId` is therefore optional everywhere.
 */

export type Sport = 'tennis' | 'padel';

export type Outcome = 'won' | 'lost' | 'played';

/** The single emotional pulse captured after a match. Order = intensity scale. */
export type Feeling = 'frustrated' | 'flat' | 'okay' | 'good' | 'onfire';

export type Stakes = 'casual' | 'regular' | 'high';

export type ExperienceTier = 'beginner' | 'intermediate' | 'veteran';

export type Intent = 'remember' | 'improve' | 'prepare';

export type LessonPolarity = 'strength' | 'weakness' | 'neutral';

export interface User {
  id: string;
  displayName: string;
  primarySport: Sport;
  skillLevel: string; // plain-language, self-described
  homeVenue?: string;
  intents: Intent[];
  createdAt: string; // ISO — "Day One"
}

export interface Tournament {
  id: string;
  name: string;
  venue?: string;
  city?: string;
  sport: Sport;
  stakes: Stakes;
  surface?: string;
  startDate: string; // ISO date
  endDate?: string;
  placement?: string;
  chapterSummary?: string; // AI-written
  createdAt: string;
}

export interface Match {
  id: string;
  tournamentId?: string; // NULLABLE — casual/practice matches have none
  sport: Sport;
  opponentName?: string;
  result: Outcome;
  score?: string; // optional, single free-text field. No game-by-game.
  playedAt: string; // ISO
  venue?: string;
  city?: string;
  durationMin?: number;
}

export type MemoryKind = 'match' | 'moment' | 'standalone' | 'milestone';

export interface Memory {
  id: string;
  matchId?: string;
  tournamentId?: string;
  kind: MemoryKind;
  feeling?: Feeling;
  rawNote?: string; // what the user typed/said (transcript)
  aiTitle?: string;
  aiStory?: string;
  aiStoryEdited?: boolean;
  photoIds: string[];
  voiceNoteIds: string[];
  lessonIds: string[];
  occurredAt: string; // ISO
  createdAt: string;
}

export interface Photo {
  id: string;
  memoryId: string;
  uri: string;
  takenAt?: string;
}

export interface VoiceNote {
  id: string;
  memoryId: string;
  uri?: string;
  durationSec?: number;
  transcript?: string;
  recordedAt: string;
}

export interface Lesson {
  id: string;
  memoryId?: string;
  matchId?: string;
  text: string;
  theme: string; // normalized tag, e.g. "second_serve", "tightness"
  polarity: LessonPolarity;
  createdAt: string;
}

export type InsightType =
  | 'strength'
  | 'weakness'
  | 'mental'
  | 'routine'
  | 'situational'
  | 'rivalry';

export interface Insight {
  id: string;
  type: InsightType;
  narrative: string; // the warm sentence shown to the user
  evidenceMatchIds: string[];
  confidence: number; // 0..1, gates display
  status: 'active' | 'confirmed' | 'dismissed';
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  why?: string;
  isChecked: boolean;
  isCustom?: boolean;
}

export type ChecklistType = 'first' | 'regular' | 'high' | 'custom';

export interface Checklist {
  id: string;
  tournamentId?: string;
  type: ChecklistType;
  name: string;
  items: ChecklistItem[];
  createdAt: string;
}

export interface UnlockedAchievement {
  id: string;
  achievementCode: string;
  unlockedAt: string;
  context?: Record<string, unknown>;
}

/** The full persisted application state. */
export interface AppState {
  user: User | null;
  tournaments: Tournament[];
  matches: Match[];
  memories: Memory[];
  photos: Photo[];
  voiceNotes: VoiceNote[];
  lessons: Lesson[];
  insights: Insight[];
  checklists: Checklist[];
  unlocked: UnlockedAchievement[];
  /** ISO timestamps of resurfaced memories already shown, keyed by memoryId. */
  resurfacedLog: Record<string, string>;
}
