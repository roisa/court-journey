/**
 * Court Journey design tokens.
 *
 * Visual language (per docs/11-ux-screens.md): warm and editorial, like a
 * beautiful journal — NOT a dashboard. Deep court-green, warm clay accents,
 * soft cream paper backgrounds, generous whitespace.
 */

export const colors = {
  // Brand
  court: '#0E5C4A', // deep court green
  courtDark: '#0A4438',
  clay: '#C8654A', // warm clay accent
  clayLight: '#E8A78E',

  // Paper / surfaces
  paper: '#FBF7F0', // warm cream background
  surface: '#FFFFFF',
  surfaceAlt: '#F3EEE4',

  // Ink / text
  ink: '#22201C',
  inkSoft: '#5C574E',
  inkFaint: '#938C7F',

  // Feedback
  win: '#1F8A5B',
  loss: '#B4543A',
  neutralPlay: '#5C574E',

  // Lines
  hairline: '#E7E0D3',

  // On-dark
  onCourt: '#F6F2E9',
  onCourtSoft: '#BFD6CD',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 19, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyStrong: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  // Used for AI-written journal prose — slightly larger, airy line-height.
  prose: { fontSize: 17, fontWeight: '400' as const, lineHeight: 27 },
  label: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.4 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#3A2E1E',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#0A4438',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radii, typography, shadow };
export type Theme = typeof theme;
