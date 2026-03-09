export interface ColorSwatch {
  name: string
  value: string
  textColor: string // for display on the swatch
}

export interface ColorScale {
  name: string
  description: string
  steps: { label: string; value: string; textColor: string }[]
}

export interface SemanticColor {
  name: string
  role: string
  value: string
  containerValue: string
  onContainerColor: string
}

// ── Primary Brand Colors ──
export const BRAND_COLORS: ColorSwatch[] = [
  { name: 'Avontus Blue', value: '#0005EE', textColor: '#FFFFFF' },
  { name: 'Navy', value: '#062175', textColor: '#FFFFFF' },
  { name: 'Light Blue', value: '#40ABFF', textColor: '#FFFFFF' },
  { name: 'Teal', value: '#009B86', textColor: '#FFFFFF' },
  { name: 'Green', value: '#6BE09E', textColor: '#062175' },
  { name: 'Yellow', value: '#FFD91A', textColor: '#062175' },
]

// ── Blue Scale ──
export const BLUE_SCALE: ColorScale = {
  name: 'Blue',
  description: 'Primary brand blue scale from lightest tint to deepest shade',
  steps: [
    { label: '50', value: '#E8E9FD', textColor: '#000377' },
    { label: '100', value: '#C5C7FA', textColor: '#000377' },
    { label: '200', value: '#9EA1F7', textColor: '#000377' },
    { label: '300', value: '#678DF4', textColor: '#FFFFFF' },
    { label: '400', value: '#3344F1', textColor: '#FFFFFF' },
    { label: '500', value: '#0005EE', textColor: '#FFFFFF' },
    { label: '600', value: '#0004D6', textColor: '#FFFFFF' },
    { label: '700', value: '#0004B3', textColor: '#FFFFFF' },
    { label: '800', value: '#000390', textColor: '#FFFFFF' },
    { label: '900', value: '#000377', textColor: '#FFFFFF' },
  ],
}

// ── Navy Scale ──
export const NAVY_SCALE: ColorScale = {
  name: 'Navy',
  description: 'Secondary brand navy for deep contrast and authority',
  steps: [
    { label: 'Light', value: '#384D91', textColor: '#FFFFFF' },
    { label: 'Base', value: '#062175', textColor: '#FFFFFF' },
    { label: 'Dark', value: '#03113B', textColor: '#FFFFFF' },
  ],
}

// ── Light Blue Scale ──
export const LIGHT_BLUE_SCALE: ColorScale = {
  name: 'Light Blue',
  description: 'Bright accent blue for interactive elements and highlights',
  steps: [
    { label: 'Light', value: '#8CCDFF', textColor: '#062175' },
    { label: 'Base', value: '#40ABFF', textColor: '#FFFFFF' },
    { label: 'Dark', value: '#205680', textColor: '#FFFFFF' },
  ],
}

// ── Teal Scale ──
export const TEAL_SCALE: ColorScale = {
  name: 'Teal',
  description: 'Used for success states and secondary accents',
  steps: [
    { label: 'Light', value: '#66C3B6', textColor: '#062175' },
    { label: 'Base', value: '#009B86', textColor: '#FFFFFF' },
    { label: 'Dark', value: '#004E43', textColor: '#FFFFFF' },
  ],
}

// ── Green Scale ──
export const GREEN_SCALE: ColorScale = {
  name: 'Green',
  description: 'Positive and growth-oriented accent color',
  steps: [
    { label: 'Light', value: '#A6ECC5', textColor: '#062175' },
    { label: 'Base', value: '#6BE09E', textColor: '#062175' },
    { label: 'Dark', value: '#36704F', textColor: '#FFFFFF' },
  ],
}

// ── All Color Scales ──
export const COLOR_SCALES: ColorScale[] = [
  BLUE_SCALE,
  NAVY_SCALE,
  LIGHT_BLUE_SCALE,
  TEAL_SCALE,
  GREEN_SCALE,
]

// ── Surface Colors ──
export const SURFACE_COLORS: ColorSwatch[] = [
  { name: 'Background', value: '#FFFFFF', textColor: '#1C1B1F' },
  { name: 'Surface', value: '#FAFBFF', textColor: '#1C1B1F' },
  { name: 'Surface 2', value: '#F0F3FF', textColor: '#1C1B1F' },
  { name: 'Surface 3', value: '#E3E8F9', textColor: '#1C1B1F' },
  { name: 'On Surface', value: '#1C1B1F', textColor: '#FFFFFF' },
  { name: 'On Surface Variant', value: '#49454F', textColor: '#FFFFFF' },
  { name: 'Outline', value: '#79747E', textColor: '#FFFFFF' },
  { name: 'Outline Variant', value: '#CAC4D0', textColor: '#1C1B1F' },
]

// ── Semantic Colors ──
export const SEMANTIC_COLORS: SemanticColor[] = [
  {
    name: 'Error',
    role: 'Destructive actions, errors, and critical alerts',
    value: '#D32F2F',
    containerValue: '#FFDAD6',
    onContainerColor: '#5F1412',
  },
  {
    name: 'Warning',
    role: 'Caution states and non-critical alerts',
    value: '#F9A825',
    containerValue: '#FFF3CD',
    onContainerColor: '#5D4300',
  },
  {
    name: 'Info',
    role: 'Informational messages and neutral highlights',
    value: '#0005EE',
    containerValue: '#E8E9FD',
    onContainerColor: '#000377',
  },
  {
    name: 'Success',
    role: 'Positive outcomes, confirmations, and completion',
    value: '#009B86',
    containerValue: '#C8F5ED',
    onContainerColor: '#004E43',
  },
]
