import type { Feeling, LessonPolarity, Outcome, Sport } from '@/types/models';

export interface ExtractedLesson {
  text: string;
  theme: string;
  polarity: LessonPolarity;
}

/** Raw material captured in the ≤30s flow (docs/05 & docs/06). */
export interface StoryInput {
  result: Outcome;
  feeling?: Feeling;
  sport: Sport;
  /** Voice transcript or typed note — the user's own words. */
  transcript?: string;
  /** Themes from quick-tap chips. */
  chips: ExtractedLesson[];
  opponentName?: string;
  score?: string;
  venue?: string;
}

/** The beautiful memory we hand back to the user. */
export interface StoryOutput {
  title: string;
  story: string;
  lessons: ExtractedLesson[];
}

export interface StoryGenerator {
  readonly id: string;
  generate(input: StoryInput): Promise<StoryOutput>;
}
