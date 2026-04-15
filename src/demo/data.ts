// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentType = 'DELIVERY' | 'PRE-RETURN'

export type ShipmentStatus =
  | 'NEEDS-COUNT'       // yard worker must count now
  | 'RESERVED'          // scheduled, not yet ready
  | 'IN-TRANSIT'        // truck en route
  | 'TO-BE-RECEIVED'    // counted, awaiting office confirmation
  | 'DISCREPANCY'       // office flagged a mismatch
  | 'PRE-RETURN'        // return scheduled, needs count

export interface DeliveryFlag {
  good: number        // going to job site (= counted, shown read-only)
  damaged: number     // returnable for repair / inspection
  scrapped: number    // write-off — beyond repair
  lostMissing: number // customer may be charged
}

export interface ConditionFlag {
  good: number
  needsService: number  // To Be Serviced
  damaged: number
  scrapped: number
  lost: number
}

export type ItemFlag =
  | { kind: 'shortfall'; data: DeliveryFlag }
  | { kind: 'condition'; data: ConditionFlag }

export interface ShipmentItem {
  id: string
  name: string
  subtitle: string
  expected: number
  counted: number | null
  flag: ItemFlag | null
}

export interface Shipment {
  id: string
  type: ShipmentType
  status: ShipmentStatus
  jobsite: string
  jobsiteId: string
  location: string
  date: string
  time: string
  driver: string | null
  vehicle: string | null
  truckLabel: string
  items: ShipmentItem[]
  discrepancy?: {
    expected: number
    counted: number
    lines: { name: string; expected: number; counted: number }[]
  }
}

// ─── Locations ────────────────────────────────────────────────────────────────

export interface Location {
  id: string
  name: string
  type: 'branch' | 'jobsite' | 'laydown'
  city: string
}

export const LOCATIONS: Location[] = [
  { id: 'ny-branch', name: 'New York Branch Office', type: 'branch', city: 'New York' },
  { id: 'eastgate', name: 'Eastgate Distribution Hub', type: 'jobsite', city: 'New York' },
  { id: 'northwind', name: 'Northwind Logistics Terminal', type: 'jobsite', city: 'New York' },
  { id: 'jersey-laydown', name: 'Jersey City Laydown Yard', type: 'laydown', city: 'New York' },
  { id: 'queens-staging', name: 'Queens Staging Area', type: 'laydown', city: 'New York' },
  { id: 'ohio-branch', name: 'Ohio', type: 'branch', city: 'Columbus' },
  { id: 'texas-branch', name: 'Texas', type: 'branch', city: 'Houston' },
  { id: 'punta-cana', name: 'Punta Cana', type: 'laydown', city: 'Punta Cana' },
  { id: 'constantine', name: 'Constantine', type: 'laydown', city: 'Constantine' },
]

// ─── Shipments ────────────────────────────────────────────────────────────────

export const SHIPMENTS: Shipment[] = [
  {
    id: 'RET-00829',
    type: 'PRE-RETURN',
    status: 'DISCREPANCY',
    jobsite: 'Vanguard Plant Systems',
    jobsiteId: 'JS-0942',
    location: 'Bayonne, NJ',
    date: 'Tue, Apr 8, 2026',
    time: '8:00 AM',
    driver: 'Tony Silva',
    vehicle: 'NJ-3310-KL',
    truckLabel: 'Truck 1 of 1',
    items: [
      { id: 'r0a', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', expected: 48, counted: 41, flag: null },
      { id: 'r0b', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', expected: 96, counted: 93, flag: null },
      { id: 'r0c', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', expected: 24, counted: 22, flag: null },
      { id: 'r0d', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel', expected: 48, counted: 48, flag: null },
      { id: 'r0e', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', expected: 72, counted: 72, flag: null },
      { id: 'r0f', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', expected: 120, counted: 120, flag: null },
      { id: 'r0g', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', expected: 48, counted: 48, flag: null },
      { id: 'r0h', name: 'Spigot Pin', subtitle: '17mm galvanized', expected: 127, counted: 127, flag: null },
    ],
    discrepancy: {
      expected: 595,
      counted: 583,
      lines: [
        { name: 'Cuplok Standard 2.0m', expected: 48, counted: 41 },
        { name: 'Cuplok Ledger 2.5m', expected: 96, counted: 93 },
        { name: 'LVL Plank 2.5m', expected: 24, counted: 22 },
      ],
    },
  },
  {
    id: 'DEL-00791',
    type: 'DELIVERY',
    status: 'NEEDS-COUNT',
    jobsite: 'Titan Apex Industrial Services',
    jobsiteId: 'JS-1247',
    location: 'Newark, NJ',
    date: 'Thu, Apr 11, 2026',
    time: '7:30 AM',
    driver: 'Marcus Webb',
    vehicle: 'NJ-5502-AA',
    truckLabel: 'Truck 1 of 1',
    items: [
      { id: 'd1a', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', expected: 80, counted: null, flag: null },
      { id: 'd1b', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', expected: 120, counted: null, flag: null },
      { id: 'd1c', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', expected: 60, counted: null, flag: null },
      { id: 'd1d', name: 'Stairway Unit 2.4m', subtitle: 'Access stair module', expected: 4, counted: null, flag: null },
      { id: 'd1e', name: 'Guardrail Post 1.0m', subtitle: 'Safety rail · vertical', expected: 40, counted: null, flag: null },
      { id: 'd1f', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', expected: 48, counted: null, flag: null },
      { id: 'd1g', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', expected: 24, counted: null, flag: null },
      { id: 'd1h', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', expected: 96, counted: null, flag: null },
      { id: 'd1i', name: 'Spigot Pin', subtitle: '17mm galvanized', expected: 117, counted: null, flag: null },
    ],
  },
  {
    id: 'RET-1892',
    type: 'PRE-RETURN',
    status: 'NEEDS-COUNT',
    jobsite: 'Downtown Tower Demo',
    jobsiteId: 'JS-2014',
    location: 'Manhattan, NY',
    date: 'Tue, Apr 14, 2026',
    time: '2:15 PM',
    driver: null,
    vehicle: null,
    truckLabel: 'Truck 1 of 1',
    items: [],  // Empty BOM — items added as they come off truck
  },
  {
    id: 'DEL-2401',
    type: 'DELIVERY',
    status: 'NEEDS-COUNT',
    jobsite: 'Phillips 66 Bayway Refinery',
    jobsiteId: 'JS-1247',
    location: 'Linden, NJ',
    date: 'Tue, Apr 14, 2026',
    time: '9:42 AM',
    driver: 'Mike Johnson',
    vehicle: 'NJ-4821-HB',
    truckLabel: 'Truck 1 of 2',
    items: [
      { id: 'i1', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', expected: 48, counted: null, flag: null },
      { id: 'i2', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', expected: 96, counted: null, flag: null },
      { id: 'i3', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted', expected: 24, counted: null, flag: null },
      { id: 'i4', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', expected: 60, counted: null, flag: null },
      { id: 'i5', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel', expected: 12, counted: null, flag: null },
      { id: 'i6', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', expected: 36, counted: null, flag: null },
      { id: 'i7', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', expected: 42, counted: null, flag: null },
      { id: 'i8', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', expected: 24, counted: null, flag: null },
    ],
  },
  {
    id: 'DEL-2402',
    type: 'DELIVERY',
    status: 'RESERVED',
    jobsite: 'Hudson Yards Construction',
    jobsiteId: 'JS-1860',
    location: 'Manhattan, NY',
    date: 'Fri, Apr 17, 2026',
    time: '8:00 AM',
    driver: null,
    vehicle: null,
    truckLabel: 'Truck 1 of 1',
    items: [
      { id: 'j1', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', expected: 60, counted: null, flag: null },
      { id: 'j2', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', expected: 80, counted: null, flag: null },
      { id: 'j3', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', expected: 24, counted: null, flag: null },
      { id: 'j4', name: 'Guardrail Post 1.0m', subtitle: 'Safety rail · vertical', expected: 23, counted: null, flag: null },
    ],
  },
  {
    id: 'DEL-00802',
    type: 'DELIVERY',
    status: 'IN-TRANSIT',
    jobsite: 'BlueRidge Fabrication',
    jobsiteId: 'JS-0744',
    location: 'Brooklyn, NY',
    date: 'Sat, Apr 18, 2026',
    time: '9:00 AM',
    driver: 'Carlos Reyes',
    vehicle: 'NY-8834-FT',
    truckLabel: 'Truck 1 of 1',
    items: [
      { id: 'k1', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', expected: 200, counted: 200, flag: null },
      { id: 'k2', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', expected: 180, counted: 180, flag: null },
      { id: 'k3', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', expected: 120, counted: 120, flag: null },
      { id: 'k4', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted', expected: 112, counted: 112, flag: null },
    ],
  },
  {
    id: 'RSV-3341',
    type: 'DELIVERY',
    status: 'RESERVED',
    jobsite: 'Battery Park Tower',
    jobsiteId: 'JS-2188',
    location: 'Manhattan, NY',
    date: 'Thu, Apr 24, 2026',
    time: '7:00 AM',
    driver: null,
    vehicle: null,
    truckLabel: 'Truck 1 of 1',
    items: [
      { id: 'l1', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', expected: 100, counted: null, flag: null },
      { id: 'l2', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', expected: 130, counted: null, flag: null },
      { id: 'l3', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', expected: 82, counted: null, flag: null },
    ],
  },
]

// ─── Catalog (for Add Item Picker) ───────────────────────────────────────────

export interface CatalogItem {
  id: string
  name: string
  subtitle: string
  category: string
  available: number
  isLow?: boolean
}

export const CATALOG: CatalogItem[] = [
  { id: 'cat-cs20', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded · Cuplok', category: 'Cuplok', available: 144 },
  { id: 'cat-cl25', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized · Cuplok', category: 'Cuplok', available: 208 },
  { id: 'cat-ct13', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted · Cuplok', category: 'Cuplok', available: 12, isLow: true },
  { id: 'cat-lvl25', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber · Boards', category: 'Boards', available: 84 },
  { id: 'cat-stb25', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel · Boards', category: 'Boards', available: 32 },
  { id: 'cat-bj06', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base · Accessories', category: 'Accessories', available: 96 },
  { id: 'cat-db20', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized · Accessories', category: 'Accessories', available: 72 },
  { id: 'cat-sc', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm · Accessories', category: 'Accessories', available: 200 },
  { id: 'cat-rs30', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv · Ringlock', category: 'Ringlock', available: 55 },
  { id: 'cat-rl24', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized · Ringlock', category: 'Ringlock', available: 88 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function totalExpected(items: ShipmentItem[]): number {
  return items.reduce((s, i) => s + i.expected, 0)
}

export function countedItems(items: ShipmentItem[]): number {
  return items.filter(i => i.counted !== null).length
}

export function countedUnits(items: ShipmentItem[]): number {
  return items.reduce((s, i) => s + (i.counted ?? 0), 0)
}

export function shortfall(item: ShipmentItem): number {
  if (item.counted === null) return 0
  return Math.max(0, item.expected - item.counted)
}

export function isShort(item: ShipmentItem): boolean {
  return shortfall(item) > 0
}

export function isExplained(item: ShipmentItem): boolean {
  if (!item.flag) return false
  if (item.flag.kind === 'shortfall') {
    const d = item.flag.data
    return d.damaged + d.scrapped + d.lostMissing === shortfall(item)
  }
  if (item.flag.kind === 'condition') {
    const d = item.flag.data
    return d.good + d.needsService + d.damaged + d.scrapped + d.lost === item.expected
  }
  return false
}

export function flagBadge(item: ShipmentItem): { label: string; color: 'amber' | 'red' | 'green' } | null {
  if (!item.flag) return null
  if (item.flag.kind === 'shortfall') {
    const d = item.flag.data
    const parts: string[] = []
    if (d.damaged > 0) parts.push(`${d.damaged} damaged`)
    if (d.scrapped > 0) parts.push(`${d.scrapped} scrapped`)
    if (d.lostMissing > 0) parts.push(`${d.lostMissing} missing`)
    return parts.length ? { label: parts[0], color: 'amber' } : null
  }
  if (item.flag.kind === 'condition') {
    const d = item.flag.data
    if (d.damaged > 0 || d.scrapped > 0 || d.lost > 0) {
      const parts: string[] = []
      if (d.damaged > 0) parts.push(`${d.damaged} damaged`)
      if (d.scrapped > 0) parts.push(`${d.scrapped} scrapped`)
      if (d.lost > 0) parts.push(`${d.lost} lost`)
      return { label: parts[0], color: 'red' }
    }
    if (d.needsService > 0) return { label: `${d.needsService} need service`, color: 'amber' }
    return { label: 'Checked', color: 'green' }
  }
  return null
}

export function statusLabel(s: ShipmentStatus): string {
  switch (s) {
    case 'NEEDS-COUNT': return 'NEEDS COUNT'
    case 'RESERVED': return 'RESERVED'
    case 'IN-TRANSIT': return 'IN TRANSIT'
    case 'TO-BE-RECEIVED': return 'TO BE RECEIVED'
    case 'DISCREPANCY': return 'DISCREPANCY'
    case 'PRE-RETURN': return 'PRE-RETURN'
  }
}

export function statusColors(s: ShipmentStatus): { bg: string; text: string } {
  switch (s) {
    case 'NEEDS-COUNT': return { bg: '#EEF2FF', text: '#1E3FFF' }
    case 'PRE-RETURN': return { bg: '#FEF3C7', text: '#D97706' }
    case 'DISCREPANCY': return { bg: '#FEE2E2', text: '#DC2626' }
    case 'IN-TRANSIT': return { bg: '#F0F9FF', text: '#0369A1' }
    case 'TO-BE-RECEIVED': return { bg: '#F0FDF4', text: '#15803D' }
    case 'RESERVED': return { bg: '#F5F5F5', text: '#525252' }
  }
}
