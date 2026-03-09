export interface TypeStyle {
  name: string
  fontFamily: string
  fontWeight: number
  fontSize: string
  lineHeight: string
  letterSpacing: string
  sample: string
}

export const TYPE_SCALE: TypeStyle[] = [
  // Headings
  {
    name: 'H1',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '76px',
    lineHeight: '1.05',
    letterSpacing: '-0.04em',
    sample: 'H1 — Switzer Medium',
  },
  {
    name: 'H2',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '49px',
    lineHeight: '1.1',
    letterSpacing: '-0.04em',
    sample: 'H2 — Switzer Medium',
  },
  {
    name: 'H3',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '39px',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    sample: 'H3 — Switzer Medium',
  },
  {
    name: 'H4',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '31px',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    sample: 'H4 — Switzer Medium',
  },
  {
    name: 'H5',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '25px',
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
    sample: 'H5 — Switzer Medium',
  },
  {
    name: 'H6',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '1.3',
    letterSpacing: '-0.02em',
    sample: 'H6 — Switzer Medium',
  },

  // Body
  {
    name: 'Body',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '-0.02em',
    sample: 'Body — The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'Small',
    fontFamily: "'Switzer', sans-serif",
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '1.45',
    letterSpacing: '-0.01em',
    sample: 'Small — The quick brown fox jumps over the lazy dog.',
  },
]

/** Group the type scale by category */
export const TYPE_CATEGORIES = [
  { label: 'Headings', styles: TYPE_SCALE.filter(s => s.name.startsWith('H')) },
  { label: 'Body', styles: TYPE_SCALE.filter(s => s.name === 'Body' || s.name === 'Small') },
]

/** Font families used in the design system */
export const FONT_FAMILIES = {
  primary: "'Switzer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', monospace",
}
