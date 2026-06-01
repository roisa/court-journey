/**
 * Improvement Engine (docs/08-improvement-engine.md).
 *
 * Mines the *language* of reflections (lesson themes), never raw stats. Returns
 * warm, sentence-based insights with a confidence score and honest hedging
 * below a threshold. Computed on demand from current state.
 */
import type { AppState, Insight, Match } from '@/types/models';
import { themeLabel } from '@/data/tags';
import { uid } from '@/lib/id';

const MIN_OCCURRENCES = 3;

export function deriveInsights(state: AppState): Insight[] {
  const insights: Insight[] = [];
  insights.push(...themeInsights(state));
  const bounce = bounceBackInsight(state);
  if (bounce) insights.push(bounce);
  insights.push(...rivalryInsights(state));
  // Most actionable / surprising first: weaknesses & mental, then strengths.
  const order = { weakness: 0, mental: 1, situational: 2, rivalry: 3, strength: 4, routine: 5 };
  return insights.sort((a, b) => (order[a.type] ?? 9) - (order[b.type] ?? 9));
}

/** Aggregate strengths & weaknesses by theme. */
function themeInsights(state: AppState): Insight[] {
  const counts: Record<string, { count: number; polarity: string; matchIds: Set<string> }> = {};
  const lessonMatchId = (memoryId?: string, matchId?: string) => {
    if (matchId) return matchId;
    const mem = state.memories.find((m) => m.id === memoryId);
    return mem?.matchId;
  };

  for (const l of state.lessons) {
    if (l.polarity === 'neutral') continue;
    const entry = (counts[l.theme] ??= { count: 0, polarity: l.polarity, matchIds: new Set() });
    entry.count++;
    const mid = lessonMatchId(l.memoryId, l.matchId);
    if (mid) entry.matchIds.add(mid);
  }

  const out: Insight[] = [];
  for (const [theme, info] of Object.entries(counts)) {
    if (info.count < MIN_OCCURRENCES) continue;
    const label = themeLabel(theme);
    const confidence = Math.min(0.5 + info.count * 0.1, 0.95);
    if (info.polarity === 'strength') {
      out.push(mk('strength', confidence, [...info.matchIds],
        `Your ${label} has come up in ${info.count} reflections. It's becoming a real weapon — build your game around it.`));
    } else {
      out.push(mk('weakness', confidence, [...info.matchIds],
        `In ${info.count} reflections you've mentioned ${label}. This isn't a flaw — it's the next thing to train. Pick one cue and take it into your next match.`));
    }
  }
  return out;
}

/** Mental pattern: do you tend to win the match right after a loss? */
function bounceBackInsight(state: AppState): Insight | null {
  const byDate: Match[] = [...state.matches]
    .filter((m) => m.result !== 'played')
    .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
  let bounces = 0;
  let chances = 0;
  const evidence: string[] = [];
  for (let i = 1; i < byDate.length; i++) {
    if (byDate[i - 1].result === 'lost') {
      chances++;
      if (byDate[i].result === 'won') {
        bounces++;
        evidence.push(byDate[i].id);
      }
    }
  }
  if (chances >= 3 && bounces / chances >= 0.6) {
    return mk('mental', Math.min(0.5 + bounces * 0.1, 0.9), evidence,
      `Here's something you might not have noticed: you bounce back. ${bounces} of your last ${chances} matches after a loss were wins. A tough result tends to wake you up.`);
  }
  return null;
}

/** Rivalry storylines for repeat opponents. */
function rivalryInsights(state: AppState): Insight[] {
  const byOpp: Record<string, Match[]> = {};
  for (const m of state.matches) {
    if (!m.opponentName) continue;
    (byOpp[m.opponentName.trim()] ??= []).push(m);
  }
  const out: Insight[] = [];
  for (const [name, list] of Object.entries(byOpp)) {
    if (list.length < 3) continue;
    const wins = list.filter((m) => m.result === 'won').length;
    const losses = list.filter((m) => m.result === 'lost').length;
    out.push(mk('rivalry', 0.8, list.map((m) => m.id),
      `You and ${name}: ${list.length} matches, ${wins}–${losses}. That's a real rivalry now.`));
  }
  return out;
}

function mk(type: Insight['type'], confidence: number, matchIds: string[], narrative: string): Insight {
  // Honest hedging below high confidence (docs/08).
  const text = confidence < 0.6 ? `Early hunch: ${narrative}` : narrative;
  return {
    id: uid('ins_'),
    type,
    narrative: text,
    evidenceMatchIds: matchIds,
    confidence,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
}
