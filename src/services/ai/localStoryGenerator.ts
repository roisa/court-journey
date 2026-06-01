import { REFLECTION_CHIPS, themeLabel } from '@/data/tags';
import type { ExtractedLesson, StoryGenerator, StoryInput, StoryOutput } from './types';

/**
 * On-device, zero-cost story generator.
 *
 * It is intentionally heuristic, not a real LLM — but it honours the rules from
 * docs/05 & docs/08: warm second-person voice, tone calibrated to the outcome,
 * never invents facts the user didn't supply, and the original words are kept
 * verbatim (the caller preserves `transcript`). It also extracts lesson themes
 * so the Improvement Engine has data from day one. Swap in the Claude generator
 * for richer prose by providing an API key (see ./index.ts).
 */
export class LocalStoryGenerator implements StoryGenerator {
  readonly id = 'local';

  async generate(input: StoryInput): Promise<StoryOutput> {
    const lessons = mergeLessons(input.chips, extractThemes(input.transcript));
    const title = makeTitle(input, lessons);
    const story = makeStory(input, lessons);
    return { title, story, lessons };
  }
}

/** Detect known themes mentioned in free text by keyword. */
function extractThemes(text?: string): ExtractedLesson[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const keywords: Record<string, string[]> = {
    forehand: ['forehand'],
    serve: ['serve', 'serving', 'ace'],
    second_serve: ['second serve', 'double fault', 'double-fault'],
    composure: ['calm', 'composed', 'relaxed'],
    resilience: ['comeback', 'came back', 'fought back', 'down a set', 'turned it around'],
    tactics: ['tactic', 'game plan', 'strategy', 'pattern'],
    net_play: ['net', 'volley', 'volleys'],
    tightness: ['tight', 'nervous', 'choked', 'tense'],
    rushing: ['rushed', 'rushing', 'hurried'],
    footwork: ['footwork', 'feet', 'movement'],
    focus: ['lost focus', 'distracted', 'switched off', 'unfocused'],
    slow_start: ['slow start', 'started slow', 'came out flat'],
  };
  const found: ExtractedLesson[] = [];
  for (const [theme, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      const chip = REFLECTION_CHIPS.find((c) => c.theme === theme);
      found.push({
        theme,
        polarity: chip?.polarity ?? 'neutral',
        text: chip?.label ?? themeLabel(theme),
      });
    }
  }
  return found;
}

function mergeLessons(a: ExtractedLesson[], b: ExtractedLesson[]): ExtractedLesson[] {
  const seen = new Set<string>();
  const out: ExtractedLesson[] = [];
  for (const l of [...a, ...b]) {
    if (!seen.has(l.theme)) {
      seen.add(l.theme);
      out.push(l);
    }
  }
  return out;
}

function makeTitle(input: StoryInput, lessons: ExtractedLesson[]): string {
  const place = input.venue ? ` at ${input.venue}` : '';
  if (input.result === 'won') {
    const strength = lessons.find((l) => l.polarity === 'strength');
    if (strength) return `${capitalize(themeLabel(strength.theme))} carried the win${place}`;
    return input.opponentName ? `A win over ${input.opponentName}${place}` : `A win${place}`;
  }
  if (input.result === 'lost') {
    const strength = lessons.find((l) => l.polarity === 'strength');
    if (strength) return `Came up short — but the ${themeLabel(strength.theme)} showed up`;
    return `A tough one${place}`;
  }
  const strength = lessons.find((l) => l.polarity === 'strength');
  if (strength) return `${capitalize(themeLabel(strength.theme))} was working today`;
  return `On court${place}`;
}

function makeStory(input: StoryInput, lessons: ExtractedLesson[]): string {
  const parts: string[] = [];

  // Opening, calibrated to outcome (compassion for losses, celebration for wins).
  const opp = input.opponentName ? ` against ${input.opponentName}` : '';
  const score = input.score ? ` (${input.score})` : '';
  if (input.result === 'won') {
    parts.push(`A good day on court${opp}${score}. Let's bottle this one.`);
  } else if (input.result === 'lost') {
    parts.push(`A tough result${opp}${score} — it stings, and that's okay. It means you cared.`);
  } else {
    parts.push(`You got out there${opp}${score}. Showing up is half of it.`);
  }

  // Weave the user's own words in, lightly.
  if (input.transcript && input.transcript.trim()) {
    parts.push(`In your words: “${input.transcript.trim()}”`);
  }

  // Strengths to celebrate / build on.
  const strengths = lessons.filter((l) => l.polarity === 'strength');
  if (strengths.length) {
    const list = humanList(strengths.map((l) => themeLabel(l.theme)));
    parts.push(
      input.result === 'won'
        ? `What worked: your ${list}. That's becoming part of who you are out there.`
        : `Hold onto this: your ${list} was there today. The pieces are coming together.`,
    );
  }

  // Weaknesses framed with a path forward (never just "you were bad at X").
  const weaknesses = lessons.filter((l) => l.polarity === 'weakness');
  if (weaknesses.length) {
    const list = humanList(weaknesses.map((l) => themeLabel(l.theme)));
    parts.push(
      `The lesson is sitting right there: ${list}. Not a flaw — just the next thing to work on. You've got a cue for next time now.`,
    );
  }

  // Close.
  if (input.result === 'lost') {
    parts.push(`You didn't lose because you're not good enough. Those moments are learnable.`);
  } else if (input.result === 'won') {
    parts.push(`Remember how this felt the next time you walk on court.`);
  } else {
    parts.push(`Every match is a page in the story. This one's saved now.`);
  }

  return parts.join('\n\n');
}

function humanList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
