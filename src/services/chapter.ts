/**
 * The self-writing tournament chapter (docs/06 & docs/10 #18).
 * Stitches a tournament's individual match reflections into one narrative —
 * the user never has to summarise what they already told us.
 */
import type { Match, Memory, Tournament } from '@/types/models';

export function buildChapterSummary(
  tournament: Tournament,
  matches: Match[],
  memories: Memory[],
): string {
  if (matches.length === 0) {
    return `Your ${tournament.name} chapter is just beginning. Capture a match to start the story.`;
  }

  const wins = matches.filter((m) => m.result === 'won').length;
  const losses = matches.filter((m) => m.result === 'lost').length;
  const sorted = [...matches].sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime(),
  );

  const parts: string[] = [];
  const venue = tournament.venue ? ` at ${tournament.venue}` : '';
  parts.push(
    `${tournament.name}${venue}: ${matches.length} ${plural(matches.length, 'match', 'matches')}, ${wins}–${losses}.`,
  );

  // The arc, in one line.
  const arc = sorted.map((m) => (m.result === 'won' ? 'W' : m.result === 'lost' ? 'L' : '·')).join(' → ');
  parts.push(`How it went: ${arc}.`);

  // Pull a feeling and a lesson from the captured memories, in the player's spirit.
  const feels = memories.map((m) => m.feeling).filter(Boolean);
  if (feels.length) {
    const high = feels.includes('onfire') || feels.includes('good');
    parts.push(
      high
        ? 'There were moments out there that felt fantastic — the kind you came back for.'
        : 'Not every moment was easy, but you kept showing up. That matters.',
    );
  }

  if (tournament.placement) {
    parts.push(`Final result: ${tournament.placement}.`);
  }

  parts.push('A chapter saved — re-read it in a year and feel how far you’ve come.');
  return parts.join(' ');
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
