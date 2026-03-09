import type { ComponentType } from '../types'

// Avontus Design System colors
const C = {
  brand: '#0005EE',
  brandDim: '#678DF4',
  navy: '#062175',
  teal: '#009B86',
  lightBlue: '#40ABFF',
  error: '#D32F2F',
  warning: '#F9A825',
  onSurface: '#1C1B1F',
  onSurfaceVar: '#49454F',
  outline: '#79747E',
  outlineVar: '#CAC4D0',
  surface: '#FAFBFF',
  surface2: '#F0F3FF',
  surface3: '#E3E8F9',
  white: '#FFFFFF',
  blue50: '#E8E9FD',
}

const W = 56
const H = 36

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}

const thumbnails: Record<ComponentType, () => React.ReactNode> = {
  Page: () => null,

  Button: () => (
    <Svg>
      <rect x="4" y="8" width="48" height="20" rx="10" fill={C.brand} />
      <text x="28" y="21" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.white} fontFamily="sans-serif">Button</text>
    </Svg>
  ),

  TextBlock: () => (
    <Svg>
      <rect x="4" y="8" width="32" height="4" rx="2" fill={C.onSurface} />
      <rect x="4" y="16" width="48" height="2.5" rx="1" fill={C.outlineVar} />
      <rect x="4" y="22" width="40" height="2.5" rx="1" fill={C.outlineVar} />
      <rect x="4" y="28" width="28" height="2.5" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  TextBox: () => (
    <Svg>
      <rect x="3" y="6" width="50" height="24" rx="4" stroke={C.outlineVar} strokeWidth="1.2" fill="none" />
      <rect x="8" y="2" width="20" height="8" rx="1" fill={C.white} />
      <text x="18" y="9" fontSize="6" fontWeight="500" fill={C.brand} fontFamily="sans-serif">Label</text>
      <text x="10" y="22" fontSize="7" fill={C.onSurfaceVar} fontFamily="sans-serif">Input text</text>
    </Svg>
  ),

  PasswordBox: () => (
    <Svg>
      <rect x="3" y="6" width="50" height="24" rx="4" stroke={C.outlineVar} strokeWidth="1.2" fill="none" />
      <rect x="8" y="2" width="30" height="8" rx="1" fill={C.white} />
      <text x="23" y="9" fontSize="6" fontWeight="500" fill={C.brand} fontFamily="sans-serif">Password</text>
      <circle cx="12" cy="20" r="2.5" fill={C.onSurface} />
      <circle cx="20" cy="20" r="2.5" fill={C.onSurface} />
      <circle cx="28" cy="20" r="2.5" fill={C.onSurface} />
      <circle cx="36" cy="20" r="2.5" fill={C.onSurface} />
    </Svg>
  ),

  Card: () => (
    <Svg>
      <rect x="4" y="3" width="48" height="30" rx="6" stroke={C.outlineVar} strokeWidth="1" fill={C.surface} />
      <rect x="9" y="8" width="22" height="3" rx="1.5" fill={C.onSurface} />
      <rect x="9" y="14" width="38" height="2" rx="1" fill={C.outlineVar} />
      <rect x="9" y="19" width="32" height="2" rx="1" fill={C.outlineVar} />
      <rect x="9" y="25" width="18" height="5" rx="2.5" fill={C.brand} />
    </Svg>
  ),

  StackPanel: () => (
    <Svg>
      <rect x="6" y="4" width="44" height="7" rx="2" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="6" y="14" width="44" height="7" rx="2" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="6" y="24" width="44" height="7" rx="2" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
    </Svg>
  ),

  Grid: () => (
    <Svg>
      <rect x="4" y="3" width="22" height="14" rx="3" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="30" y="3" width="22" height="14" rx="3" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="4" y="19" width="22" height="14" rx="3" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="30" y="19" width="22" height="14" rx="3" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.5" />
    </Svg>
  ),

  CheckBox: () => (
    <Svg>
      <rect x="6" y="10" width="16" height="16" rx="3" fill={C.brand} />
      <polyline points="10,18 14,22 20,14" stroke={C.white} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="26" y="14" width="24" height="3" rx="1.5" fill={C.onSurface} />
      <rect x="26" y="20" width="16" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  RadioButton: () => (
    <Svg>
      <circle cx="14" cy="18" r="8" stroke={C.brand} strokeWidth="2" fill="none" />
      <circle cx="14" cy="18" r="4" fill={C.brand} />
      <rect x="26" y="14" width="24" height="3" rx="1.5" fill={C.onSurface} />
      <rect x="26" y="20" width="16" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  ToggleSwitch: () => (
    <Svg>
      <rect x="4" y="10" width="28" height="16" rx="8" fill={C.brand} />
      <circle cx="24" cy="18" r="5" fill={C.white} />
      <rect x="36" y="13" width="16" height="3" rx="1.5" fill={C.onSurface} />
      <rect x="36" y="19" width="12" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  Slider: () => (
    <Svg>
      <rect x="4" y="17" width="48" height="3" rx="1.5" fill={C.outlineVar} />
      <rect x="4" y="17" width="28" height="3" rx="1.5" fill={C.brand} />
      <circle cx="32" cy="18.5" r="6" fill={C.brand} />
      <circle cx="32" cy="18.5" r="2.5" fill={C.white} />
    </Svg>
  ),

  Icon: () => (
    <Svg>
      <polygon
        points="28,5 31,13 39,13 32.5,18 35,26 28,21 21,26 23.5,18 17,13 25,13"
        fill={C.brand}
      />
    </Svg>
  ),

  Image: () => (
    <Svg>
      <rect x="4" y="4" width="48" height="28" rx="6" fill={C.surface2} stroke={C.outlineVar} strokeWidth="0.8" />
      <circle cx="16" cy="14" r="4" fill={C.brandDim} opacity="0.4" />
      <polygon points="10,28 22,16 32,24 38,18 48,28" fill={C.brandDim} opacity="0.25" />
    </Svg>
  ),

  PersonPicture: () => (
    <Svg>
      <circle cx="28" cy="18" r="14" fill={`${C.brand}1A`} />
      <circle cx="28" cy="18" r="14" stroke={C.brand} strokeWidth="1" fill="none" />
      <text x="28" y="23" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.brand} fontFamily="sans-serif">JD</text>
    </Svg>
  ),

  Divider: () => (
    <Svg>
      <line x1="4" y1="18" x2="52" y2="18" stroke={C.outlineVar} strokeWidth="1.5" />
    </Svg>
  ),

  ProgressBar: () => (
    <Svg>
      <rect x="4" y="14" width="48" height="8" rx="4" fill={C.blue50} />
      <rect x="4" y="14" width="28" height="8" rx="4" fill={C.brand} />
    </Svg>
  ),

  ProgressRing: () => (
    <Svg>
      <circle cx="28" cy="18" r="12" stroke={C.blue50} strokeWidth="3" fill="none" />
      <path d="M 28 6 A 12 12 0 1 1 16.56 24" stroke={C.brand} strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  ),

  FloatingActionButton: () => (
    <Svg>
      <rect x="12" y="3" width="32" height="30" rx="10" fill={C.brand} />
      <line x1="28" y1="12" x2="28" y2="24" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="18" x2="34" y2="18" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  ),

  Chip: () => (
    <Svg>
      <rect x="6" y="9" width="44" height="18" rx="4" stroke={C.outline} strokeWidth="1" fill="none" />
      <text x="28" y="21.5" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.onSurface} fontFamily="sans-serif">Chip</text>
    </Svg>
  ),

  NavigationBar: () => (
    <Svg>
      <rect x="2" y="5" width="52" height="26" rx="4" fill={C.surface} stroke={C.outlineVar} strokeWidth="0.8" />
      <path d="M8,15 L12,18 L8,21" stroke={C.onSurface} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="28" y="20" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.onSurface} fontFamily="sans-serif">Title</text>
      <circle cx="46" cy="18" r="1.2" fill={C.onSurface} />
      <circle cx="46" cy="14" r="1.2" fill={C.onSurface} />
      <circle cx="46" cy="22" r="1.2" fill={C.onSurface} />
    </Svg>
  ),

  BottomNavigationBar: () => (
    <Svg>
      <rect x="2" y="5" width="52" height="26" rx="4" fill={C.surface} stroke={C.outlineVar} strokeWidth="0.8" />
      {/* Active item with indicator */}
      <rect x="6" y="10" width="14" height="8" rx="4" fill={C.blue50} />
      <rect x="9" y="13" width="8" height="2" rx="1" fill={C.brand} />
      <text x="13" y="24" textAnchor="middle" fontSize="5" fontWeight="600" fill={C.brand} fontFamily="sans-serif">Home</text>
      {/* Inactive items */}
      <rect x="24" y="13" width="8" height="2" rx="1" fill={C.outline} />
      <text x="28" y="24" textAnchor="middle" fontSize="5" fill={C.outline} fontFamily="sans-serif">Search</text>
      <rect x="39" y="13" width="8" height="2" rx="1" fill={C.outline} />
      <text x="43" y="24" textAnchor="middle" fontSize="5" fill={C.outline} fontFamily="sans-serif">Profile</text>
    </Svg>
  ),

  NavigationViewItem: () => (
    <Svg>
      <rect x="4" y="8" width="48" height="20" rx="10" fill={C.blue50} />
      <rect x="10" y="14" width="8" height="8" rx="2" fill={C.brand} opacity="0.3" />
      <rect x="22" y="15" width="24" height="3" rx="1.5" fill={C.brand} />
      <rect x="22" y="20" width="16" height="2" rx="1" fill={C.brandDim} />
    </Svg>
  ),

  ScrollViewer: () => (
    <Svg>
      <rect x="4" y="3" width="48" height="30" rx="4" stroke={C.outlineVar} strokeWidth="1" fill="none" strokeDasharray="3 2" />
      <rect x="49" y="7" width="2.5" height="12" rx="1.25" fill={C.outlineVar} />
      <rect x="8" y="7" width="36" height="2.5" rx="1" fill={C.outlineVar} opacity="0.5" />
      <rect x="8" y="13" width="36" height="2.5" rx="1" fill={C.outlineVar} opacity="0.5" />
      <rect x="8" y="19" width="36" height="2.5" rx="1" fill={C.outlineVar} opacity="0.5" />
      <rect x="8" y="25" width="24" height="2.5" rx="1" fill={C.outlineVar} opacity="0.5" />
    </Svg>
  ),

  Border: () => (
    <Svg>
      <rect x="4" y="3" width="48" height="30" rx="6" stroke={C.outlineVar} strokeWidth="1.2" fill={C.surface} strokeDasharray="4 2" />
      <rect x="12" y="10" width="32" height="16" rx="4" fill={C.surface2} />
    </Svg>
  ),

  ListView: () => (
    <Svg>
      <rect x="4" y="3" width="48" height="8" rx="2" fill={C.surface2} />
      <rect x="8" y="5.5" width="20" height="3" rx="1.5" fill={C.onSurface} />
      <line x1="4" y1="11" x2="52" y2="11" stroke={C.surface3} strokeWidth="0.5" />
      <rect x="4" y="12" width="48" height="8" rx="2" fill={C.surface2} />
      <rect x="8" y="14.5" width="20" height="3" rx="1.5" fill={C.onSurface} />
      <line x1="4" y1="20" x2="52" y2="20" stroke={C.surface3} strokeWidth="0.5" />
      <rect x="4" y="21" width="48" height="8" rx="2" fill={C.surface2} />
      <rect x="8" y="23.5" width="20" height="3" rx="1.5" fill={C.onSurface} />
    </Svg>
  ),

  GridView: () => (
    <Svg>
      <rect x="3" y="3" width="24" height="14" rx="4" stroke={C.outlineVar} strokeWidth="0.8" fill={C.surface} />
      <rect x="7" y="7" width="14" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="7" y="12" width="16" height="2" rx="1" fill={C.outlineVar} />
      <rect x="29" y="3" width="24" height="14" rx="4" stroke={C.outlineVar} strokeWidth="0.8" fill={C.surface} />
      <rect x="33" y="7" width="14" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="33" y="12" width="16" height="2" rx="1" fill={C.outlineVar} />
      <rect x="3" y="19" width="24" height="14" rx="4" stroke={C.outlineVar} strokeWidth="0.8" fill={C.surface} />
      <rect x="7" y="23" width="14" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="29" y="19" width="24" height="14" rx="4" stroke={C.outlineVar} strokeWidth="0.8" fill={C.surface} />
      <rect x="33" y="23" width="14" height="2.5" rx="1" fill={C.onSurface} />
    </Svg>
  ),

  // ─── New component types ───

  Select: () => (
    <Svg>
      <rect x="3" y="6" width="50" height="24" rx="4" stroke={C.outlineVar} strokeWidth="1.2" fill="none" />
      <rect x="8" y="2" width="22" height="8" rx="1" fill={C.white} />
      <text x="19" y="9" fontSize="6" fontWeight="500" fill={C.brand} fontFamily="sans-serif">Select</text>
      <text x="10" y="22" fontSize="7" fill={C.onSurfaceVar} fontFamily="sans-serif">Choose...</text>
      <path d="M44,16 L47,20 L41,20 Z" fill={C.onSurfaceVar} />
    </Svg>
  ),

  DatePicker: () => (
    <Svg>
      <rect x="3" y="6" width="50" height="24" rx="4" stroke={C.outlineVar} strokeWidth="1.2" fill="none" />
      <rect x="8" y="2" width="16" height="8" rx="1" fill={C.white} />
      <text x="16" y="9" fontSize="6" fontWeight="500" fill={C.brand} fontFamily="sans-serif">Date</text>
      <text x="10" y="22" fontSize="7" fill={C.onSurfaceVar} fontFamily="sans-serif">mm/dd/yy</text>
      <rect x="40" y="14" width="8" height="8" rx="1" fill="none" stroke={C.onSurfaceVar} strokeWidth="0.8" />
      <line x1="40" y1="16" x2="48" y2="16" stroke={C.onSurfaceVar} strokeWidth="0.8" />
      <rect x="42" y="18" width="2" height="2" rx="0.5" fill={C.brand} />
    </Svg>
  ),

  IconButton: () => (
    <Svg>
      <circle cx="28" cy="18" r="14" fill={`${C.brand}1A`} />
      <rect x="22" y="10" width="2" height="8" rx="1" fill={C.brand} />
      <circle cx="23" cy="22" r="1.2" fill={C.brand} />
      <circle cx="23" cy="12.5" r="3" fill="none" stroke={C.brand} strokeWidth="1.2" />
      <rect x="28" y="14" width="8" height="1.5" rx="0.75" fill={C.brand} />
      <rect x="28" y="18" width="6" height="1.5" rx="0.75" fill={C.brand} />
      <rect x="28" y="22" width="7" height="1.5" rx="0.75" fill={C.brand} />
    </Svg>
  ),

  SegmentedButton: () => (
    <Svg>
      <rect x="2" y="8" width="52" height="20" rx="10" stroke={C.outline} strokeWidth="1" fill="none" />
      <rect x="3" y="9" width="18" height="18" rx="9" fill={C.blue50} />
      <text x="12" y="21" textAnchor="middle" fontSize="6.5" fontWeight="600" fill={C.brand} fontFamily="sans-serif">Day</text>
      <line x1="20" y1="12" x2="20" y2="24" stroke={C.outline} strokeWidth="0.5" />
      <text x="29" y="21" textAnchor="middle" fontSize="6.5" fontWeight="500" fill={C.onSurface} fontFamily="sans-serif">Week</text>
      <line x1="38" y1="12" x2="38" y2="24" stroke={C.outline} strokeWidth="0.5" />
      <text x="46" y="21" textAnchor="middle" fontSize="6.5" fontWeight="500" fill={C.onSurface} fontFamily="sans-serif">Mon</text>
    </Svg>
  ),

  Tabs: () => (
    <Svg>
      <line x1="2" y1="30" x2="54" y2="30" stroke={C.outlineVar} strokeWidth="0.8" />
      {/* Active tab */}
      <text x="14" y="20" textAnchor="middle" fontSize="7" fontWeight="600" fill={C.brand} fontFamily="sans-serif">Tab 1</text>
      <rect x="4" y="27" width="20" height="3" rx="1.5" fill={C.brand} />
      {/* Inactive tabs */}
      <text x="36" y="20" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.onSurfaceVar} fontFamily="sans-serif">Tab 2</text>
      <text x="50" y="20" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.onSurfaceVar} fontFamily="sans-serif">Tab 3</text>
    </Svg>
  ),

  Snackbar: () => (
    <Svg>
      <rect x="2" y="9" width="52" height="18" rx="4" fill="#323232" />
      <text x="8" y="21" fontSize="6.5" fill={C.white} fontFamily="sans-serif">Changes saved</text>
      <text x="46" y="21" fontSize="6.5" fontWeight="600" fill={C.lightBlue} fontFamily="sans-serif">Undo</text>
    </Svg>
  ),

  Badge: () => (
    <Svg>
      <circle cx="28" cy="18" r="10" fill={C.error} />
      <text x="28" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.white} fontFamily="sans-serif">3</text>
    </Svg>
  ),

  Dialog: () => (
    <Svg>
      <rect x="4" y="2" width="48" height="32" rx="8" fill={C.white} />
      <rect x="4" y="2" width="48" height="32" rx="8" stroke={C.outlineVar} strokeWidth="0.5" fill="none" />
      <rect x="10" y="7" width="24" height="3" rx="1.5" fill={C.onSurface} />
      <rect x="10" y="13" width="36" height="2" rx="1" fill={C.outlineVar} />
      <rect x="10" y="17" width="30" height="2" rx="1" fill={C.outlineVar} />
      <rect x="22" y="24" width="12" height="6" rx="3" stroke={C.outline} strokeWidth="0.8" fill="none" />
      <rect x="36" y="24" width="12" height="6" rx="3" fill={C.brand} />
    </Svg>
  ),

  BottomSheet: () => (
    <Svg>
      <rect x="4" y="10" width="48" height="26" rx="8" fill={C.surface} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="4" y="32" width="48" height="4" fill={C.surface} />
      <rect x="22" y="13" width="12" height="3" rx="1.5" fill={C.outlineVar} />
      <rect x="10" y="20" width="20" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="10" y="26" width="36" height="2" rx="1" fill={C.outlineVar} />
      <rect x="10" y="31" width="28" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  InfoBar: () => (
    <Svg>
      <rect x="2" y="8" width="52" height="20" rx="4" fill={C.blue50} />
      <rect x="2" y="8" width="3" height="20" rx="1.5" fill={C.brand} />
      <circle cx="12" cy="18" r="4" fill={C.brand} />
      <text x="12" y="20" textAnchor="middle" fontSize="5" fontWeight="700" fill={C.white} fontFamily="sans-serif">i</text>
      <rect x="20" y="15" width="28" height="2.5" rx="1" fill={C.navy} />
      <rect x="20" y="20" width="20" height="2" rx="1" fill={C.navy} opacity="0.5" />
    </Svg>
  ),

  // ─── New component types ───

  DataTable: () => (
    <Svg>
      {/* Header row */}
      <rect x="2" y="4" width="52" height="7" rx="2" fill={C.surface2} />
      <rect x="5" y="6.5" width="12" height="2" rx="1" fill={C.onSurfaceVar} />
      <rect x="22" y="6.5" width="10" height="2" rx="1" fill={C.onSurfaceVar} />
      <rect x="38" y="6.5" width="12" height="2" rx="1" fill={C.onSurfaceVar} />
      {/* Data rows */}
      <rect x="2" y="12" width="52" height="6" rx="0" fill={C.blue50} />
      <rect x="5" y="14" width="14" height="2" rx="1" fill={C.onSurface} />
      <rect x="22" y="14" width="8" height="2" rx="1" fill={C.teal} />
      <rect x="40" y="14" width="8" height="2" rx="1" fill={C.onSurface} />
      <line x1="2" y1="18.5" x2="54" y2="18.5" stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="5" y="20.5" width="14" height="2" rx="1" fill={C.onSurface} />
      <rect x="22" y="20.5" width="8" height="2" rx="1" fill={C.outline} />
      <rect x="40" y="20.5" width="8" height="2" rx="1" fill={C.onSurface} />
      <line x1="2" y1="24.5" x2="54" y2="24.5" stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="5" y="26.5" width="14" height="2" rx="1" fill={C.onSurface} />
      <rect x="22" y="26.5" width="8" height="2" rx="1" fill={C.outline} />
      <rect x="40" y="26.5" width="8" height="2" rx="1" fill={C.onSurface} />
      {/* Border */}
      <rect x="2" y="4" width="52" height="28" rx="2" stroke={C.outlineVar} strokeWidth="0.5" fill="none" />
    </Svg>
  ),

  Stepper: () => (
    <Svg>
      {/* Minus button */}
      <rect x="8" y="10" width="12" height="16" rx="3" stroke={C.outlineVar} strokeWidth="1" fill="none" />
      <rect x="11" y="17" width="6" height="2" rx="1" fill={C.brand} />
      {/* Value */}
      <text x="28" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.onSurface} fontFamily="sans-serif">5</text>
      {/* Plus button */}
      <rect x="36" y="10" width="12" height="16" rx="3" stroke={C.outlineVar} strokeWidth="1" fill="none" />
      <rect x="39" y="17" width="6" height="2" rx="1" fill={C.brand} />
      <rect x="41" y="14" width="2" height="8" rx="1" fill={C.brand} />
    </Svg>
  ),

  Tooltip: () => (
    <Svg>
      {/* Tooltip bubble */}
      <rect x="8" y="6" width="40" height="16" rx="4" fill={C.onSurface} />
      <text x="28" y="17" textAnchor="middle" fontSize="7" fill={C.white} fontFamily="sans-serif">Tooltip</text>
      {/* Arrow */}
      <polygon points="24,22 28,27 32,22" fill={C.onSurface} />
      {/* Trigger element below */}
      <rect x="20" y="28" width="16" height="4" rx="2" fill={C.outlineVar} />
    </Svg>
  ),

  TimePicker: () => (
    <Svg>
      {/* Field outline */}
      <rect x="4" y="8" width="48" height="22" rx="4" stroke={C.outlineVar} strokeWidth="1" fill="none" />
      {/* Floating label */}
      <rect x="10" y="5" width="16" height="6" rx="1" fill={C.white} />
      <text x="18" y="10" textAnchor="middle" fontSize="5" fill={C.brand} fontFamily="sans-serif">Time</text>
      {/* Value */}
      <text x="16" y="23" textAnchor="start" fontSize="8" fill={C.onSurface} fontFamily="sans-serif">10:30</text>
      {/* Clock icon */}
      <circle cx="44" cy="19" r="5" stroke={C.onSurfaceVar} strokeWidth="0.8" fill="none" />
      <line x1="44" y1="19" x2="44" y2="16" stroke={C.onSurfaceVar} strokeWidth="0.8" />
      <line x1="44" y1="19" x2="46" y2="19" stroke={C.onSurfaceVar} strokeWidth="0.8" />
    </Svg>
  ),

  AutoSuggestBox: () => (
    <Svg>
      {/* Search field */}
      <rect x="4" y="6" width="48" height="18" rx="4" stroke={C.outlineVar} strokeWidth="1" fill="none" />
      {/* Search icon */}
      <circle cx="14" cy="15" r="4" stroke={C.onSurfaceVar} strokeWidth="0.8" fill="none" />
      <line x1="17" y1="18" x2="19" y2="20" stroke={C.onSurfaceVar} strokeWidth="0.8" />
      {/* Placeholder text */}
      <rect x="22" y="13" width="24" height="2.5" rx="1" fill={C.outline} />
      {/* Dropdown suggestion */}
      <rect x="4" y="25" width="48" height="7" rx="2" fill={C.surface2} />
      <rect x="8" y="27.5" width="20" height="2" rx="1" fill={C.onSurface} />
    </Svg>
  ),

  NavigationRail: () => (
    <Svg>
      {/* Rail bg */}
      <rect x="2" y="2" width="16" height="32" rx="2" fill={C.surface2} />
      {/* Menu icon at top */}
      <rect x="5" y="5" width="10" height="2" rx="1" fill={C.brand} />
      <rect x="5" y="8.5" width="10" height="2" rx="1" fill={C.brand} />
      {/* Nav items */}
      <rect x="4" y="14" width="12" height="6" rx="3" fill={C.blue50} />
      <circle cx="10" cy="17" r="1.5" fill={C.brand} />
      <rect x="5" y="23" width="10" height="2" rx="1" fill={C.outline} />
      <rect x="5" y="28" width="10" height="2" rx="1" fill={C.outline} />
      {/* Content area */}
      <rect x="20" y="2" width="34" height="32" rx="2" fill={C.white} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="24" y="6" width="20" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="24" y="12" width="26" height="2" rx="1" fill={C.outlineVar} />
      <rect x="24" y="16" width="22" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),

  NavigationDrawer: () => (
    <Svg>
      {/* Drawer bg */}
      <rect x="2" y="2" width="22" height="32" rx="2" fill={C.surface2} />
      {/* App title */}
      <rect x="5" y="5" width="16" height="3" rx="1" fill={C.onSurface} />
      {/* Nav items */}
      <rect x="4" y="12" width="18" height="5" rx="2.5" fill={C.blue50} />
      <circle cx="8" cy="14.5" r="1.5" fill={C.brand} />
      <rect x="12" y="13.5" width="8" height="2" rx="1" fill={C.brand} />
      <rect x="6" y="20" width="14" height="2" rx="1" fill={C.outline} />
      <rect x="6" y="25" width="12" height="2" rx="1" fill={C.outline} />
      <rect x="6" y="30" width="10" height="2" rx="1" fill={C.outline} />
      {/* Content area */}
      <rect x="26" y="2" width="28" height="32" rx="2" fill={C.white} stroke={C.outlineVar} strokeWidth="0.5" />
      <rect x="30" y="6" width="18" height="2.5" rx="1" fill={C.onSurface} />
      <rect x="30" y="12" width="20" height="2" rx="1" fill={C.outlineVar} />
    </Svg>
  ),
  ValidationSummary: () => (
    <Svg>
      {/* Card */}
      <rect x="4" y="2" width="48" height="32" rx="4" fill={C.white} stroke={C.outlineVar} strokeWidth="0.5" />
      {/* Header bar */}
      <rect x="4" y="2" width="48" height="9" rx="4" fill="#FFDAD6" />
      <circle cx="10" cy="6.5" r="2.5" fill="#D32F2F" />
      <rect x="15" y="5" width="18" height="3" rx="1" fill={C.onSurface} />
      {/* Error item */}
      <circle cx="10" cy="15" r="1.5" fill="#D32F2F" />
      <rect x="15" y="14" width="30" height="2" rx="1" fill={C.onSurface} />
      {/* Warning item */}
      <polygon points="10,20 11.5,23 8.5,23" fill="#F9A825" />
      <rect x="15" y="20.5" width="25" height="2" rx="1" fill={C.onSurface} />
      {/* Info item */}
      <circle cx="10" cy="28" r="1.5" fill="#1976D2" />
      <rect x="15" y="27" width="28" height="2" rx="1" fill={C.onSurface} />
    </Svg>
  ),
}

export default function ComponentThumbnail({ type, variant }: { type: ComponentType; variant?: Record<string, string> }) {
  const render = thumbnails[type]
  if (!render) return null
  const content = render()
  if (!content) return null
  return <div className="flex items-center justify-center">{content}</div>
}
