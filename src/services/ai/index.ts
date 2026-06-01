import type { StoryGenerator } from './types';
import { LocalStoryGenerator } from './localStoryGenerator';
import { ClaudeStoryGenerator } from './claudeStoryGenerator';

export * from './types';
export { LocalStoryGenerator } from './localStoryGenerator';
export { ClaudeStoryGenerator } from './claudeStoryGenerator';

let instance: StoryGenerator | null = null;

/**
 * Returns the active story generator. Uses Claude when an API key is provided
 * via the EXPO_PUBLIC_ANTHROPIC_API_KEY env var (prototyping) — otherwise the
 * zero-cost on-device generator, so the app always works offline and key-free.
 */
export function getStoryGenerator(): StoryGenerator {
  if (instance) return instance;
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  instance = key ? new ClaudeStoryGenerator(key) : new LocalStoryGenerator();
  return instance;
}
