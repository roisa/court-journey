/**
 * Achievement catalog (docs/09-motivation-system.md).
 *
 * Philosophy: anti-gamification. Each celebrates something a player would
 * actually text a friend about. The MVP ships a meaningful, fully-functional
 * subset; every entry here has a real `check`. More unlock as the data layer
 * grows (insights, recaps).
 */
import type { AppState } from '@/types/models';

export type AchievementCategory =
  | 'Milestones & Firsts'
  | 'Comebacks & Courage'
  | 'Performance & Skill'
  | 'Growth & Self-Awareness'
  | 'Consistency & Devotion'
  | 'Exploration & Story';

/** Derived stats — computed once, then every check reads from it. */
export interface AchievementStats {
  hasUser: boolean;
  matchCount: number;
  winCount: number;
  tournamentCount: number;
  tournamentWinCount: number;
  reflectionCount: number;
  lossReflectionCount: number;
  voiceCount: number;
  photoCount: number;
  lessonCount: number;
  distinctCities: number;
  maxOpponentRepeat: number;
  reflectionStreak: number;
  hasComeback: boolean;
  yearsOnCourt: number;
}

export interface Achievement {
  code: string;
  category: AchievementCategory;
  title: string;
  description: string;
  /** Returns true when earned. */
  check: (s: AchievementStats) => boolean;
  /** Optional progress hint for "in progress" display. */
  progress?: (s: AchievementStats) => { current: number; target: number };
}

export const ACHIEVEMENTS: Achievement[] = [
  // 🌱 Milestones & Firsts
  {
    code: 'day_one',
    category: 'Milestones & Firsts',
    title: 'Day One',
    description: 'You created your journey. You showed up.',
    check: (s) => s.hasUser,
  },
  {
    code: 'first_match',
    category: 'Milestones & Firsts',
    title: 'First Match Logged',
    description: 'The story begins.',
    check: (s) => s.matchCount >= 1,
  },
  {
    code: 'first_tournament',
    category: 'Milestones & Firsts',
    title: 'First Tournament',
    description: 'You entered the arena.',
    check: (s) => s.tournamentCount >= 1,
  },
  {
    code: 'first_reflection',
    category: 'Milestones & Firsts',
    title: 'First Reflection',
    description: 'You looked back to move forward.',
    check: (s) => s.reflectionCount >= 1,
  },
  {
    code: 'first_voice',
    category: 'Milestones & Firsts',
    title: 'First Voice Note',
    description: 'Captured the feeling, not just the facts.',
    check: (s) => s.voiceCount >= 1,
  },
  {
    code: 'first_photo',
    category: 'Milestones & Firsts',
    title: 'First Photo Memory',
    description: 'A picture worth a thousand rallies.',
    check: (s) => s.photoCount >= 1,
  },
  {
    code: 'first_win',
    category: 'Milestones & Firsts',
    title: 'First Win',
    description: 'The one you’ll never forget.',
    check: (s) => s.winCount >= 1,
  },
  {
    code: 'first_tournament_win',
    category: 'Milestones & Firsts',
    title: 'First Tournament Match Win',
    description: 'Won when it counted.',
    check: (s) => s.tournamentWinCount >= 1,
  },

  // 🔥 Comebacks & Courage
  {
    code: 'the_comeback',
    category: 'Comebacks & Courage',
    title: 'The Comeback',
    description: 'You logged a comeback. That takes heart.',
    check: (s) => s.hasComeback,
  },
  {
    code: 'honest_mirror',
    category: 'Comebacks & Courage',
    title: 'The Honest Mirror',
    description: 'Reflected on 3 losses. The hard ones count most.',
    check: (s) => s.lossReflectionCount >= 3,
    progress: (s) => ({ current: s.lossReflectionCount, target: 3 }),
  },

  // 🏆 Performance & Skill
  {
    code: 'the_rivalry',
    category: 'Performance & Skill',
    title: 'The Rivalry',
    description: 'Played the same opponent 3+ times.',
    check: (s) => s.maxOpponentRepeat >= 3,
    progress: (s) => ({ current: s.maxOpponentRepeat, target: 3 }),
  },

  // 🧠 Growth & Self-Awareness
  {
    code: 'lesson_learner',
    category: 'Growth & Self-Awareness',
    title: 'Lesson Learner',
    description: 'Saved 10 lessons.',
    check: (s) => s.lessonCount >= 10,
    progress: (s) => ({ current: s.lessonCount, target: 10 }),
  },
  {
    code: 'student_of_the_game',
    category: 'Growth & Self-Awareness',
    title: 'Student of the Game',
    description: 'Completed 25 reflections.',
    check: (s) => s.reflectionCount >= 25,
    progress: (s) => ({ current: s.reflectionCount, target: 25 }),
  },

  // 📅 Consistency & Devotion
  {
    code: 'reflection_streak_5',
    category: 'Consistency & Devotion',
    title: 'Reflection Streak: 5',
    description: 'Reflected on 5 matches in a row.',
    check: (s) => s.reflectionStreak >= 5,
    progress: (s) => ({ current: s.reflectionStreak, target: 5 }),
  },
  {
    code: 'the_regular',
    category: 'Consistency & Devotion',
    title: 'The Regular',
    description: 'Played 50 matches.',
    check: (s) => s.matchCount >= 50,
    progress: (s) => ({ current: s.matchCount, target: 50 }),
  },
  {
    code: 'century',
    category: 'Consistency & Devotion',
    title: 'Century',
    description: '100 matches logged. A real body of work.',
    check: (s) => s.matchCount >= 100,
    progress: (s) => ({ current: s.matchCount, target: 100 }),
  },
  {
    code: 'one_year',
    category: 'Consistency & Devotion',
    title: 'One Year on Court',
    description: '365 days since Day One.',
    check: (s) => s.yearsOnCourt >= 1,
  },

  // 🗺 Exploration & Story
  {
    code: 'road_warrior',
    category: 'Exploration & Story',
    title: 'Road Warrior',
    description: 'Played in 3+ different cities.',
    check: (s) => s.distinctCities >= 3,
    progress: (s) => ({ current: s.distinctCities, target: 3 }),
  },
];

export function achievementByCode(code: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.code === code);
}

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  'Milestones & Firsts',
  'Comebacks & Courage',
  'Performance & Skill',
  'Growth & Self-Awareness',
  'Consistency & Devotion',
  'Exploration & Story',
];

/** Compute the derived stats the achievement checks read from. */
export function computeStats(state: AppState): AchievementStats {
  const { user, matches, memories, lessons, tournaments, photos, voiceNotes } = state;

  const reflections = memories.filter(
    (m) => m.feeling != null || (m.rawNote && m.rawNote.trim().length > 0),
  );

  // Reflections attached to a lost match.
  const lostMatchIds = new Set(matches.filter((m) => m.result === 'lost').map((m) => m.id));
  const lossReflectionCount = reflections.filter(
    (m) => m.matchId && lostMatchIds.has(m.matchId),
  ).length;

  // Distinct cities across matches & tournaments.
  const cities = new Set<string>();
  matches.forEach((m) => m.city && cities.add(m.city.trim().toLowerCase()));
  tournaments.forEach((t) => t.city && cities.add(t.city.trim().toLowerCase()));

  // Max repeat against a single opponent.
  const opp: Record<string, number> = {};
  matches.forEach((m) => {
    if (m.opponentName) {
      const k = m.opponentName.trim().toLowerCase();
      opp[k] = (opp[k] ?? 0) + 1;
    }
  });
  const maxOpponentRepeat = Object.values(opp).reduce((a, b) => Math.max(a, b), 0);

  // Reflection streak: walk matches newest→oldest; count consecutive ones
  // that have a reflection memory.
  const matchesByDate = [...matches].sort(
    (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime(),
  );
  const reflectedMatchIds = new Set(reflections.map((m) => m.matchId).filter(Boolean));
  let streak = 0;
  for (const m of matchesByDate) {
    if (reflectedMatchIds.has(m.id)) streak++;
    else break;
  }

  const hasComeback = lessons.some((l) => l.theme === 'resilience');

  const tournamentWinCount = matches.filter(
    (m) => m.result === 'won' && m.tournamentId,
  ).length;

  return {
    hasUser: !!user,
    matchCount: matches.length,
    winCount: matches.filter((m) => m.result === 'won').length,
    tournamentCount: tournaments.length,
    tournamentWinCount,
    reflectionCount: reflections.length,
    lossReflectionCount,
    voiceCount: voiceNotes.length,
    photoCount: photos.length,
    lessonCount: lessons.length,
    distinctCities: cities.size,
    maxOpponentRepeat,
    reflectionStreak: streak,
    hasComeback,
    yearsOnCourt: user
      ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (365.25 * 86_400_000))
      : 0,
  };
}
