import type { ExtractedLesson, StoryGenerator, StoryInput, StoryOutput } from './types';
import { LocalStoryGenerator } from './localStoryGenerator';

/**
 * Claude-backed story generator (docs/13).
 *
 * Produces richer prose than the local heuristic. It is gated on an API key so
 * the app runs with zero secrets by default. In production the API key should
 * NOT live on the client — these calls belong in a Supabase Edge Function
 * (docs/13). This class is the client-side seam: point `endpoint` at that
 * function, or (for local prototyping only) hit the Anthropic API directly.
 *
 * Falls back to the local generator on any error so capture never fails.
 */
export class ClaudeStoryGenerator implements StoryGenerator {
  readonly id = 'claude';
  private fallback = new LocalStoryGenerator();

  constructor(
    private readonly apiKey: string,
    private readonly model = 'claude-haiku-4-5-20251001',
    private readonly endpoint = 'https://api.anthropic.com/v1/messages',
  ) {}

  async generate(input: StoryInput): Promise<StoryOutput> {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserPrompt(input) }],
        }),
      });
      if (!res.ok) throw new Error(`Claude API ${res.status}`);
      const json = (await res.json()) as { content?: { text?: string }[] };
      const text = json.content?.map((c) => c.text ?? '').join('') ?? '';
      return parseStoryJson(text, input);
    } catch {
      // Never let the magic layer break the core loop.
      return this.fallback.generate(input);
    }
  }
}

const SYSTEM_PROMPT = `You are the journaling voice of Court Journey, an app for amateur tennis and padel players.
Write a short journal entry about a match in a warm, second-person voice — like a wise, kind friend.
Rules:
- Tone follows the result: celebratory for wins, compassionate AND constructive for losses, encouraging for casual play.
- NEVER invent facts the player did not provide (no made-up scores, opponents, or events).
- Frame any weakness with a path forward, never as shame.
- 2–4 short paragraphs. No hashtags, no emojis in the body.
Return ONLY valid JSON: {"title": string, "story": string, "lessons": [{"text": string, "theme": string, "polarity": "strength"|"weakness"|"neutral"}]}.`;

function buildUserPrompt(input: StoryInput): string {
  return JSON.stringify({
    sport: input.sport,
    result: input.result,
    feeling: input.feeling ?? null,
    opponent: input.opponentName ?? null,
    score: input.score ?? null,
    venue: input.venue ?? null,
    playerWords: input.transcript ?? null,
    quickTags: input.chips.map((c) => ({ theme: c.theme, polarity: c.polarity })),
  });
}

function parseStoryJson(text: string, input: StoryInput): StoryOutput {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in model output');
  const parsed = JSON.parse(match[0]) as {
    title?: string;
    story?: string;
    lessons?: ExtractedLesson[];
  };
  if (!parsed.title || !parsed.story) throw new Error('Incomplete model output');
  return {
    title: parsed.title,
    story: parsed.story,
    lessons: Array.isArray(parsed.lessons) ? parsed.lessons : input.chips,
  };
}
