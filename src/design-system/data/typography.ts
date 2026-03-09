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
  // Display
  {
    name: 'Display Large',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '57px',
    lineHeight: '64px',
    letterSpacing: '-0.25px',
    sample: 'Display Large',
  },
  {
    name: 'Display Medium',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '45px',
    lineHeight: '52px',
    letterSpacing: '0px',
    sample: 'Display Medium',
  },
  {
    name: 'Display Small',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '36px',
    lineHeight: '44px',
    letterSpacing: '0px',
    sample: 'Display Small',
  },

  // Headline
  {
    name: 'Headline Large',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '0px',
    sample: 'Headline Large',
  },
  {
    name: 'Headline Medium',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '28px',
    lineHeight: '36px',
    letterSpacing: '0px',
    sample: 'Headline Medium',
  },
  {
    name: 'Headline Small',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '0px',
    sample: 'Headline Small',
  },

  // Title
  {
    name: 'Title Large',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: '28px',
    letterSpacing: '0px',
    sample: 'Title Large',
  },
  {
    name: 'Title Medium',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    sample: 'Title Medium',
  },
  {
    name: 'Title Small',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    sample: 'Title Small',
  },

  // Body
  {
    name: 'Body Large',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.5px',
    sample: 'Body Large - The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'Body Medium',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    sample: 'Body Medium - The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'Body Small',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    sample: 'Body Small - The quick brown fox jumps over the lazy dog.',
  },

  // Label
  {
    name: 'Label Large',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    sample: 'Label Large',
  },
  {
    name: 'Label Medium',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    sample: 'Label Medium',
  },
  {
    name: 'Label Small',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    sample: 'Label Small',
  },
]

/** Group the type scale by category */
export const TYPE_CATEGORIES = [
  { label: 'Display', styles: TYPE_SCALE.filter(s => s.name.startsWith('Display')) },
  { label: 'Headline', styles: TYPE_SCALE.filter(s => s.name.startsWith('Headline')) },
  { label: 'Title', styles: TYPE_SCALE.filter(s => s.name.startsWith('Title')) },
  { label: 'Body', styles: TYPE_SCALE.filter(s => s.name.startsWith('Body')) },
  { label: 'Label', styles: TYPE_SCALE.filter(s => s.name.startsWith('Label')) },
]

/** Font families used in the design system */
export const FONT_FAMILIES = {
  primary: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', monospace",
}
