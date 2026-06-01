import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type {
  AppState,
  Checklist,
  ChecklistItem,
  ExperienceTier,
  Feeling,
  Intent,
  Lesson,
  Match,
  MatchContext,
  Memory,
  Outcome,
  Photo,
  Sport,
  Tournament,
  User,
  VoiceNote,
} from '@/types/models';
import { emptyState, loadState, saveState, clearState } from '@/services/storage';
import { getStoryGenerator } from '@/services/ai';
import { chipByLabel } from '@/data/tags';
import { buildPreset } from '@/data/checklists';
import { buildChapterSummary } from '@/services/chapter';
import { ACHIEVEMENTS, computeStats } from '@/data/achievements';
import { uid } from '@/lib/id';
import { nowIso } from '@/lib/date';

// ---------------------------------------------------------------------------
// Action / input shapes
// ---------------------------------------------------------------------------

export interface OnboardingInput {
  displayName: string;
  primarySport: Sport;
  skillLevel: string;
  homeVenue?: string;
  intents: Intent[];
}

export interface CaptureInput {
  result: Outcome;
  feeling?: Feeling;
  sport: Sport;
  context?: MatchContext;
  opponentName?: string;
  score?: string;
  venue?: string;
  city?: string;
  tournamentId?: string;
  playedAt?: string;
  transcript?: string;
  chipLabels: string[];
  photoUris: string[];
  voice?: { uri?: string; durationSec?: number; transcript?: string };
}

export interface CreateTournamentInput {
  name: string;
  venue?: string;
  city?: string;
  sport: Sport;
  stakes: 'casual' | 'regular' | 'high';
  surface?: string;
  startDate?: string;
}

interface CapturePayload {
  match: Match;
  memory: Memory;
  lessons: Lesson[];
  photos: Photo[];
  voiceNotes: VoiceNote[];
}

type Action =
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'SET_USER'; user: User }
  | { type: 'ADD_CAPTURE'; payload: CapturePayload }
  | { type: 'UPDATE_MEMORY'; id: string; patch: Partial<Memory> }
  | { type: 'ADD_TOURNAMENT'; tournament: Tournament; checklist: Checklist }
  | { type: 'ATTACH_MATCH'; matchId: string; tournamentId: string }
  | { type: 'SET_CHAPTER'; tournamentId: string; summary: string }
  | { type: 'TOGGLE_ITEM'; checklistId: string; itemId: string }
  | { type: 'ADD_ITEM'; checklistId: string; item: ChecklistItem }
  | { type: 'UNLOCK'; codes: string[] }
  | { type: 'RESET' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'ADD_CAPTURE':
      return {
        ...state,
        matches: [action.payload.match, ...state.matches],
        memories: [action.payload.memory, ...state.memories],
        lessons: [...action.payload.lessons, ...state.lessons],
        photos: [...action.payload.photos, ...state.photos],
        voiceNotes: [...action.payload.voiceNotes, ...state.voiceNotes],
      };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m,
        ),
      };
    case 'ADD_TOURNAMENT':
      return {
        ...state,
        tournaments: [action.tournament, ...state.tournaments],
        checklists: [action.checklist, ...state.checklists],
      };
    case 'ATTACH_MATCH':
      return {
        ...state,
        matches: state.matches.map((m) =>
          m.id === action.matchId ? { ...m, tournamentId: action.tournamentId } : m,
        ),
        memories: state.memories.map((m) =>
          m.matchId === action.matchId ? { ...m, tournamentId: action.tournamentId } : m,
        ),
      };
    case 'SET_CHAPTER':
      return {
        ...state,
        tournaments: state.tournaments.map((t) =>
          t.id === action.tournamentId ? { ...t, chapterSummary: action.summary } : t,
        ),
      };
    case 'TOGGLE_ITEM':
      return {
        ...state,
        checklists: state.checklists.map((c) =>
          c.id === action.checklistId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === action.itemId ? { ...i, isChecked: !i.isChecked } : i,
                ),
              }
            : c,
        ),
      };
    case 'ADD_ITEM':
      return {
        ...state,
        checklists: state.checklists.map((c) =>
          c.id === action.checklistId ? { ...c, items: [...c.items, action.item] } : c,
        ),
      };
    case 'UNLOCK': {
      const have = new Set(state.unlocked.map((u) => u.achievementCode));
      const fresh = action.codes
        .filter((code) => !have.has(code))
        .map((code) => ({ id: uid('ua_'), achievementCode: code, unlockedAt: nowIso() }));
      if (fresh.length === 0) return state;
      return { ...state, unlocked: [...state.unlocked, ...fresh] };
    }
    case 'RESET':
      return emptyState;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  experienceTier: ExperienceTier;
  /** Codes unlocked since last cleared — for the celebration toast. */
  recentlyUnlocked: string[];
  clearRecentlyUnlocked: () => void;
  completeOnboarding: (input: OnboardingInput) => void;
  captureMatch: (input: CaptureInput) => Promise<string>;
  editMemoryStory: (id: string, title: string, story: string) => void;
  createTournament: (input: CreateTournamentInput) => string;
  attachMatchToTournament: (matchId: string, tournamentId: string) => void;
  regenerateChapter: (tournamentId: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  addChecklistItem: (checklistId: string, text: string) => void;
  reset: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([]);
  const knownCodes = useRef<Set<string>>(new Set());

  // Always-fresh state for async callbacks (capture → chapter regeneration).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Hydrate from disk once.
  useEffect(() => {
    let active = true;
    loadState().then((loaded) => {
      if (!active) return;
      knownCodes.current = new Set(loaded.unlocked.map((u) => u.achievementCode));
      dispatch({ type: 'HYDRATE', state: loaded });
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (hydrated) void saveState(state);
  }, [state, hydrated]);

  // Evaluate achievements whenever the underlying data changes.
  useEffect(() => {
    if (!hydrated) return;
    const stats = computeStats(state);
    const earned = ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.code);
    const have = new Set(state.unlocked.map((u) => u.achievementCode));
    const fresh = earned.filter((code) => !have.has(code));
    if (fresh.length > 0) {
      // Celebrate only codes not seen this session (skip the post-hydration flood).
      const toCelebrate = fresh.filter((c) => !knownCodes.current.has(c));
      fresh.forEach((c) => knownCodes.current.add(c));
      dispatch({ type: 'UNLOCK', codes: fresh });
      if (toCelebrate.length) setRecentlyUnlocked((prev) => [...prev, ...toCelebrate]);
    }
  }, [state, hydrated]);

  const experienceTier: ExperienceTier = useMemo(() => {
    const n = state.tournaments.length;
    if (n >= 5) return 'veteran';
    if (n >= 1) return 'intermediate';
    return 'beginner';
  }, [state.tournaments.length]);

  const completeOnboarding = useCallback((input: OnboardingInput) => {
    const user: User = {
      id: uid('usr_'),
      displayName: input.displayName.trim() || 'Player',
      primarySport: input.primarySport,
      skillLevel: input.skillLevel,
      homeVenue: input.homeVenue,
      intents: input.intents,
      createdAt: nowIso(),
    };
    dispatch({ type: 'SET_USER', user });
  }, []);

  // Declared before captureMatch so it can be called after a tournament capture.
  const regenerateChapter = useCallback((tournamentId: string) => {
    const s = stateRef.current;
    const tournament = s.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;
    const matches = s.matches.filter((m) => m.tournamentId === tournamentId);
    const memories = s.memories.filter((m) => m.tournamentId === tournamentId);
    dispatch({
      type: 'SET_CHAPTER',
      tournamentId,
      summary: buildChapterSummary(tournament, matches, memories),
    });
  }, []);

  const captureMatch = useCallback(
    async (input: CaptureInput): Promise<string> => {
      const playedAt = input.playedAt ?? nowIso();
      const matchId = uid('mch_');
      const memoryId = uid('mem_');

      const chips = input.chipLabels
        .map((label) => chipByLabel(label))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => ({ text: c.label, theme: c.theme, polarity: c.polarity }));

      const combinedTranscript =
        input.voice?.transcript?.trim() || input.transcript?.trim() || undefined;

      // The magic layer (docs/05). The generator never throws — it falls back.
      const story = await getStoryGenerator().generate({
        result: input.result,
        feeling: input.feeling,
        sport: input.sport,
        transcript: combinedTranscript,
        chips,
        opponentName: input.opponentName,
        score: input.score,
        venue: input.venue,
      });

      const lessons: Lesson[] = story.lessons.map((l) => ({
        id: uid('les_'),
        matchId,
        memoryId,
        text: l.text,
        theme: l.theme,
        polarity: l.polarity,
        createdAt: nowIso(),
      }));

      const photos: Photo[] = input.photoUris.map((u) => ({
        id: uid('pho_'),
        memoryId,
        uri: u,
        takenAt: playedAt,
      }));

      const voiceNotes: VoiceNote[] = input.voice
        ? [
            {
              id: uid('voc_'),
              memoryId,
              uri: input.voice.uri,
              durationSec: input.voice.durationSec,
              transcript: input.voice.transcript,
              recordedAt: playedAt,
            },
          ]
        : [];

      const match: Match = {
        id: matchId,
        tournamentId: input.tournamentId,
        context: input.context,
        sport: input.sport,
        opponentName: input.opponentName,
        result: input.result,
        score: input.score,
        playedAt,
        venue: input.venue,
        city: input.city,
      };

      const memory: Memory = {
        id: memoryId,
        matchId,
        tournamentId: input.tournamentId,
        kind: 'match',
        feeling: input.feeling,
        rawNote: combinedTranscript,
        aiTitle: story.title,
        aiStory: story.story,
        aiStoryEdited: false,
        photoIds: photos.map((p) => p.id),
        voiceNoteIds: voiceNotes.map((v) => v.id),
        lessonIds: lessons.map((l) => l.id),
        occurredAt: playedAt,
        createdAt: nowIso(),
      };

      dispatch({ type: 'ADD_CAPTURE', payload: { match, memory, lessons, photos, voiceNotes } });

      if (input.tournamentId) {
        const tid = input.tournamentId;
        // Defer so the dispatch above lands in stateRef first.
        setTimeout(() => regenerateChapter(tid), 0);
      }
      return memoryId;
    },
    [regenerateChapter],
  );

  const editMemoryStory = useCallback((id: string, title: string, story: string) => {
    dispatch({
      type: 'UPDATE_MEMORY',
      id,
      patch: { aiTitle: title, aiStory: story, aiStoryEdited: true },
    });
  }, []);

  const createTournament = useCallback((input: CreateTournamentInput): string => {
    const s = stateRef.current;
    const tier: ExperienceTier =
      s.tournaments.length >= 5 ? 'veteran' : s.tournaments.length >= 1 ? 'intermediate' : 'beginner';
    const tournament: Tournament = {
      id: uid('trn_'),
      name: input.name.trim() || 'My tournament',
      venue: input.venue,
      city: input.city,
      sport: input.sport,
      stakes: input.stakes,
      surface: input.surface,
      startDate: input.startDate ?? nowIso(),
      createdAt: nowIso(),
    };
    const preset = buildPreset(tier, input.stakes);
    const checklist: Checklist = {
      id: uid('chk_'),
      tournamentId: tournament.id,
      type: preset.type,
      name: preset.name,
      items: preset.items,
      createdAt: nowIso(),
    };
    dispatch({ type: 'ADD_TOURNAMENT', tournament, checklist });
    return tournament.id;
  }, []);

  const attachMatchToTournament = useCallback(
    (matchId: string, tournamentId: string) => {
      dispatch({ type: 'ATTACH_MATCH', matchId, tournamentId });
      setTimeout(() => regenerateChapter(tournamentId), 0);
    },
    [regenerateChapter],
  );

  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    dispatch({ type: 'TOGGLE_ITEM', checklistId, itemId });
  }, []);

  const addChecklistItem = useCallback((checklistId: string, text: string) => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_ITEM',
      checklistId,
      item: { id: uid('ci_'), text: text.trim(), isChecked: false, isCustom: true },
    });
  }, []);

  const reset = useCallback(async () => {
    await clearState();
    knownCodes.current = new Set();
    setRecentlyUnlocked([]);
    dispatch({ type: 'RESET' });
  }, []);

  const clearRecentlyUnlocked = useCallback(() => setRecentlyUnlocked([]), []);

  const value: AppContextValue = {
    state,
    hydrated,
    experienceTier,
    recentlyUnlocked,
    clearRecentlyUnlocked,
    completeOnboarding,
    captureMatch,
    editMemoryStory,
    createTournament,
    attachMatchToTournament,
    regenerateChapter,
    toggleChecklistItem,
    addChecklistItem,
    reset,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
