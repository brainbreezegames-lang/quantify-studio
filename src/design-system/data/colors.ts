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
  { name: 'Blue Main', value: '#0A3EFF', textColor: '#FFFFFF' },
  { name: 'Blue Medium', value: '#6F9DFF', textColor: '#10296E' },
  { name: 'Blue Dark', value: '#10296E', textColor: '#FFFFFF' },
  { name: 'Light Black', value: '#202020', textColor: '#FFFFFF' },
  { name: 'Tinted White', value: '#F8F8F8', textColor: '#202020' },
  { name: 'Pure White', value: '#FFFFFF', textColor: '#202020' },
]

// ── Blue Scale ──
export const BLUE_SCALE: ColorScale = {
  name: 'Blue',
  description: 'Primary brand blue scale — monochromatic progression',
  steps: [
    { label: 'Lightest', value: '#E8EEFF', textColor: '#10296E' },
    { label: 'Light', value: '#6F9DFF', textColor: '#10296E' },
    { label: 'Main', value: '#0A3EFF', textColor: '#FFFFFF' },
    { label: 'Dark', value: '#10296E', textColor: '#FFFFFF' },
    { label: 'Darkest', value: '#0A1A4A', textColor: '#FFFFFF' },
  ],
}

// ── Gray Scale ──
export const GRAY_SCALE: ColorScale = {
  name: 'Gray',
  description: 'Neutral gray scale from pure white to light black',
  steps: [
    { label: 'White', value: '#FFFFFF', textColor: '#202020' },
    { label: '50', value: '#F8F8F8', textColor: '#202020' },
    { label: '100', value: '#EEEEEE', textColor: '#202020' },
    { label: '200', value: '#D4D4D4', textColor: '#202020' },
    { label: '300', value: '#ABABAB', textColor: '#202020' },
    { label: '400', value: '#787878', textColor: '#FFFFFF' },
    { label: '500', value: '#545454', textColor: '#FFFFFF' },
    { label: '600', value: '#363636', textColor: '#FFFFFF' },
    { label: '700', value: '#202020', textColor: '#FFFFFF' },
  ],
}

// ── All Color Scales ──
export const COLOR_SCALES: ColorScale[] = [
  BLUE_SCALE,
  GRAY_SCALE,
]

// ── Surface Colors ──
export const SURFACE_COLORS: ColorSwatch[] = [
  { name: 'Background', value: '#FFFFFF', textColor: '#202020' },
  { name: 'Surface', value: '#F8F8F8', textColor: '#202020' },
  { name: 'Surface 2', value: '#EEEEEE', textColor: '#202020' },
  { name: 'Surface 3', value: '#D4D4D4', textColor: '#202020' },
  { name: 'On Surface', value: '#202020', textColor: '#FFFFFF' },
  { name: 'On Surface Variant', value: '#545454', textColor: '#FFFFFF' },
  { name: 'Outline', value: '#ABABAB', textColor: '#FFFFFF' },
  { name: 'Outline Variant', value: '#D4D4D4', textColor: '#202020' },
]

// ── Semantic Colors ──
export const SEMANTIC_COLORS: SemanticColor[] = [
  {
    name: 'Error',
    role: 'Destructive actions, errors, and critical alerts',
    value: '#E64059',
    containerValue: '#FFE5E9',
    onContainerColor: '#5F1422',
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
    value: '#0A3EFF',
    containerValue: '#E8EEFF',
    onContainerColor: '#10296E',
  },
  {
    name: 'Success',
    role: 'Positive outcomes, confirmations, and completion',
    value: '#22C55E',
    containerValue: '#DCFCE7',
    onContainerColor: '#14532D',
  },
]
