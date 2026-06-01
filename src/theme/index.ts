/**
 * Court Journey design tokens — "Wimbledon" theme.
 *
 * Visual language: the elegance of Wimbledon (deep grass green, cream, a touch
 * of championship purple) expressed through latest-iOS UI patterns — large
 * titles, inset-grouped surfaces, capsule controls, hairline separators over
 * heavy shadow, and a 17pt body. Calm, premium, familiar.
 */

export const colors = {
  // Brand — Wimbledon grass green + championship purple accent
  court: '#00703C', // Wimbledon green
  courtDark: '#00532B',
  courtTint: '#E2EFE7', // selected / filled-light green
  clay: '#C2663B', // warm accent (used for "weakness" semantics)
  clayLight: '#E5B79C',
  accent: '#4E2A84', // Wimbledon purple
  accentTint: '#ECE6F3',

  // Backgrounds — iOS grouped layering, lightly grass-tinted
  paper: '#EEF2EC', // systemGroupedBackground
  surface: '#FFFFFF', // card / elevated
  surfaceAlt: '#E8EEE7', // secondary fill (chips, inputs)

  // Ink / text — iOS label hierarchy
  ink: '#15201A',
  inkSoft: '#586059',
  inkFaint: '#9AA39B',

  // Feedback
  win: '#1E8E4E',
  loss: '#D14338',
  neutralPlay: '#6B7570',

  // Lines
  hairline: '#DCE4DB',
  separator: '#DCE4DB',

  // On-green surfaces
  onCourt: '#FFFFFF',
  onCourtSoft: '#BFD8C8',
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
  sm: 10,
  md: 16,
  lg: 22, // iOS continuous-corner card
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  // iOS large title
  display: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.6, lineHeight: 41 },
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.4, lineHeight: 32 },
  heading: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 25 },
  body: { fontSize: 17, fontWeight: '400' as const, lineHeight: 24 },
  bodyStrong: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  // AI-written journal prose — airy line-height.
  prose: { fontSize: 17, fontWeight: '400' as const, lineHeight: 28 },
  label: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.8 },
} as const;

export const shadow = {
  // iOS leans on fills + hairlines, not heavy shadow. Keep it whisper-soft.
  card: {
    shadowColor: '#0A2418',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  floating: {
    shadowColor: '#00532B',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radii, typography, shadow };
export type Theme = typeof theme;
