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
  partNumber?: string    // Brian: "Part number is missing"
  name: string
  subtitle: string
  weightEach?: string    // Brian: "as well as weight each" — kg per piece
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
  weight: string | null         // e.g. "4,200 kg" — Brian: "Weight is also very important"
  salesperson: string | null    // Brian: "How about adding Salesperson here also"
  truckLabel: string
  items: ShipmentItem[]
  pcsTotal: number              // total pieces for card display
  discrepancy?: {
    expected: number
    counted: number
    lines: { name: string; partNumber?: string; expected: number; counted: number }[]
  }
}

// ─── Locations ────────────────────────────────────────────────────────────────

export interface Location {
  id: string
  name: string
  type: 'branch' | 'jobsite' | 'laydown'
  city: string
  parentId?: string  // set for sub-locations under a branch
}

export const LOCATIONS: Location[] = [
  // New York branch + sub-locations
  { id: 'ny-branch', name: 'New York', type: 'branch', city: 'New York, NY' },
  { id: 'newark-laydown', name: 'Newark Laydown', type: 'laydown', city: 'Newark, NJ', parentId: 'ny-branch' },
  { id: 'bayonne-staging', name: 'Bayonne Staging', type: 'laydown', city: 'Bayonne, NJ', parentId: 'ny-branch' },
  // New Jersey branch + sub-locations
  { id: 'nj-branch', name: 'New Jersey', type: 'branch', city: 'Elizabeth, NJ' },
  { id: 'elizabeth-laydown', name: 'Elizabeth Laydown', type: 'laydown', city: 'Elizabeth, NJ', parentId: 'nj-branch' },
  // Connecticut branch + sub-locations
  { id: 'ct-branch', name: 'Connecticut', type: 'branch', city: 'Bridgeport, CT' },
  { id: 'bridgeport-laydown', name: 'Bridgeport Laydown', type: 'laydown', city: 'Bridgeport, CT', parentId: 'ct-branch' },
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
    date: 'Planned Apr 8',
    weight: '3,800 kg',
    salesperson: 'Sarah Chen',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 583,
    items: [
      { id: 'r0a', partNumber: 'CUP-STD-20', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', weightEach: '7.2', expected: 48, counted: 41, flag: null },
      { id: 'r0b', partNumber: 'CUP-LED-25', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', weightEach: '4.8', expected: 96, counted: 93, flag: null },
      { id: 'r0c', partNumber: 'LVL-PLK-25', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', weightEach: '8.6', expected: 24, counted: 22, flag: null },
      { id: 'r0d', partNumber: 'STB-TOE-25', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel', weightEach: '3.2', expected: 48, counted: 48, flag: null },
      { id: 'r0e', partNumber: 'BAS-JCK-06', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', weightEach: '2.8', expected: 72, counted: 72, flag: null },
      { id: 'r0f', partNumber: 'DIA-BRC-20', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', weightEach: '3.6', expected: 120, counted: 120, flag: null },
      { id: 'r0g', partNumber: 'SWV-CUP-48', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', weightEach: '0.9', expected: 48, counted: 48, flag: null },
      { id: 'r0h', partNumber: 'SPG-PIN-17', name: 'Spigot Pin', subtitle: '17mm galvanized', weightEach: '0.2', expected: 127, counted: 127, flag: null },
    ],
    discrepancy: {
      expected: 595,
      counted: 583,
      lines: [
        { name: 'Cuplok Standard 2.0m', partNumber: 'CUP-STD-20', expected: 48, counted: 41 },
        { name: 'Cuplok Ledger 2.5m', partNumber: 'CUP-LED-25', expected: 96, counted: 93 },
        { name: 'LVL Plank 2.5m', partNumber: 'LVL-PLK-25', expected: 24, counted: 22 },
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
    date: 'Planned Apr 11',
    weight: '5,100 kg',
    salesperson: 'David Park',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 589,
    items: [
      { id: 'd1a', partNumber: 'RLK-STD-30', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', weightEach: '10.2', expected: 80, counted: null, flag: null },
      { id: 'd1b', partNumber: 'RLK-LED-24', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', weightEach: '5.8', expected: 120, counted: null, flag: null },
      { id: 'd1c', partNumber: 'STL-PLK-24', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', weightEach: '12.4', expected: 60, counted: null, flag: null },
      { id: 'd1d', partNumber: 'STR-UNT-24', name: 'Stairway Unit 2.4m', subtitle: 'Access stair module', weightEach: '45.0', expected: 4, counted: null, flag: null },
      { id: 'd1e', partNumber: 'GRD-PST-10', name: 'Guardrail Post 1.0m', subtitle: 'Safety rail · vertical', weightEach: '2.2', expected: 40, counted: null, flag: null },
      { id: 'd1f', partNumber: 'DIA-BRC-20', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', weightEach: '3.6', expected: 48, counted: null, flag: null },
      { id: 'd1g', partNumber: 'BAS-JCK-06', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', weightEach: '2.8', expected: 24, counted: null, flag: null },
      { id: 'd1h', partNumber: 'SWV-CUP-48', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', weightEach: '0.9', expected: 96, counted: null, flag: null },
      { id: 'd1i', partNumber: 'SPG-PIN-17', name: 'Spigot Pin', subtitle: '17mm galvanized', weightEach: '0.2', expected: 117, counted: null, flag: null },
    ],
  },
  {
    id: 'RET-1892',
    type: 'PRE-RETURN',
    status: 'PRE-RETURN',
    jobsite: 'Downtown Tower Demo',
    jobsiteId: 'JS-2014',
    location: 'Manhattan, NY',
    date: 'Planned Apr 14',
    weight: null,
    salesperson: 'Sarah Chen',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 0,
    items: [],
  },
  {
    id: 'DEL-2401',
    type: 'DELIVERY',
    status: 'NEEDS-COUNT',
    jobsite: 'Phillips 66 Bayway Refinery',
    jobsiteId: 'JS-1247',
    location: 'Linden, NJ',
    date: 'Planned Apr 14',
    weight: '4,200 kg',
    salesperson: 'Mike Torres',
    truckLabel: 'Truck 1 of 2',
    pcsTotal: 342,
    items: [
      { id: 'i1', partNumber: 'CUP-STD-20', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', weightEach: '7.2', expected: 48, counted: null, flag: null },
      { id: 'i2', partNumber: 'CUP-LED-25', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', weightEach: '4.8', expected: 96, counted: null, flag: null },
      { id: 'i3', partNumber: 'CUP-TRN-13', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted', weightEach: '2.4', expected: 48, counted: null, flag: null },
      { id: 'i4', partNumber: 'LVL-PLK-25', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', weightEach: '8.6', expected: 60, counted: null, flag: null },
      { id: 'i5', partNumber: 'STB-TOE-25', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel', weightEach: '3.2', expected: 12, counted: null, flag: null },
      { id: 'i6', partNumber: 'BAS-JCK-06', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base', weightEach: '2.8', expected: 36, counted: null, flag: null },
      { id: 'i7', partNumber: 'DIA-BRC-20', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized', weightEach: '3.6', expected: 42, counted: null, flag: null },
      { id: 'i8', partNumber: 'SWV-CUP-48', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm', weightEach: '0.9', expected: 24, counted: null, flag: null },
    ],
  },
  {
    id: 'DEL-2402',
    type: 'DELIVERY',
    status: 'RESERVED',
    jobsite: 'Hudson Yards Construction',
    jobsiteId: 'JS-1860',
    location: 'Manhattan, NY',
    date: 'Planned Apr 17',
    weight: '3,200 kg',
    salesperson: 'Mike Torres',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 187,
    items: [
      { id: 'j1', partNumber: 'RLK-STD-30', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', weightEach: '10.2', expected: 60, counted: null, flag: null },
      { id: 'j2', partNumber: 'RLK-LED-24', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', weightEach: '5.8', expected: 80, counted: null, flag: null },
      { id: 'j3', partNumber: 'STL-PLK-24', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', weightEach: '12.4', expected: 24, counted: null, flag: null },
      { id: 'j4', partNumber: 'GRD-PST-10', name: 'Guardrail Post 1.0m', subtitle: 'Safety rail · vertical', weightEach: '2.2', expected: 23, counted: null, flag: null },
    ],
  },
  {
    id: 'DEL-00802',
    type: 'DELIVERY',
    status: 'IN-TRANSIT',
    jobsite: 'BlueRidge Fabrication',
    jobsiteId: 'JS-0744',
    location: 'Brooklyn, NY',
    date: 'Planned Apr 18',
    weight: '6,800 kg',
    salesperson: 'David Park',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 612,
    items: [
      { id: 'k1', partNumber: 'CUP-STD-20', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded', weightEach: '7.2', expected: 200, counted: 200, flag: null },
      { id: 'k2', partNumber: 'CUP-LED-25', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized', weightEach: '4.8', expected: 180, counted: 180, flag: null },
      { id: 'k3', partNumber: 'LVL-PLK-25', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber', weightEach: '8.6', expected: 120, counted: 120, flag: null },
      { id: 'k4', partNumber: 'CUP-TRN-13', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted', weightEach: '2.4', expected: 112, counted: 112, flag: null },
    ],
  },
  {
    id: 'DEL-3341',
    type: 'DELIVERY',
    status: 'RESERVED',
    jobsite: 'Battery Park Tower',
    jobsiteId: 'JS-2188',
    location: 'Manhattan, NY',
    date: 'Planned Apr 24',
    weight: '4,500 kg',
    salesperson: 'Mike Torres',
    truckLabel: 'Truck 1 of 1',
    pcsTotal: 312,
    items: [
      { id: 'l1', partNumber: 'RLK-STD-30', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', weightEach: '10.2', expected: 100, counted: null, flag: null },
      { id: 'l2', partNumber: 'RLK-LED-24', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', weightEach: '5.8', expected: 130, counted: null, flag: null },
      { id: 'l3', partNumber: 'STL-PLK-24', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', weightEach: '12.4', expected: 82, counted: null, flag: null },
    ],
  },
]

// ─── Catalog (for Add Item Picker) ───────────────────────────────────────────

export interface CatalogItem {
  id: string
  partNumber: string
  name: string
  subtitle: string
  category: string
  available: number
  isLow?: boolean
}

export const CATALOG: CatalogItem[] = [
  { id: 'cat-cs20', partNumber: 'CUP-STD-20', name: 'Cuplok Standard 2.0m', subtitle: 'Vertical · 4 cup welded · Cuplok', category: 'Cuplok', available: 144 },
  { id: 'cat-cl25', partNumber: 'CUP-LED-25', name: 'Cuplok Ledger 2.5m', subtitle: 'Horizontal · galvanized · Cuplok', category: 'Cuplok', available: 208 },
  { id: 'cat-ct13', partNumber: 'CUP-TRN-13', name: 'Cuplok Transom 1.3m', subtitle: 'Cross member · painted · Cuplok', category: 'Cuplok', available: 12, isLow: true },
  { id: 'cat-lvl25', partNumber: 'LVL-PLK-25', name: 'LVL Plank 2.5m', subtitle: 'Laminated veneer lumber · Boards', category: 'Boards', available: 84 },
  { id: 'cat-stb25', partNumber: 'STB-TOE-25', name: 'Steel Toe Board 2.5m', subtitle: 'Edge protection · steel · Boards', category: 'Boards', available: 32 },
  { id: 'cat-bj06', partNumber: 'BAS-JCK-06', name: 'Base Jack 0.6m', subtitle: 'Adjustable screw base · Accessories', category: 'Accessories', available: 96 },
  { id: 'cat-db20', partNumber: 'DIA-BRC-20', name: 'Diagonal Brace 2.0m', subtitle: 'Face brace · galvanized · Accessories', category: 'Accessories', available: 72 },
  { id: 'cat-sc', partNumber: 'SWV-CUP-48', name: 'Swivel Coupler', subtitle: 'Forged steel · 48mm · Accessories', category: 'Accessories', available: 200 },
  { id: 'cat-rs30', partNumber: 'RLK-STD-30', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv · Ringlock', category: 'Ringlock', available: 55 },
  { id: 'cat-rl24', partNumber: 'RLK-LED-24', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized · Ringlock', category: 'Ringlock', available: 88 },
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
    case 'NEEDS-COUNT': return { bg: '#FEF3C7', text: '#92400E' }
    case 'PRE-RETURN': return { bg: '#FEF3C7', text: '#D97706' }
    case 'DISCREPANCY': return { bg: '#FEE2E2', text: '#DC2626' }
    case 'IN-TRANSIT': return { bg: '#E0F2FE', text: '#0369A1' }
    case 'TO-BE-RECEIVED': return { bg: '#F0FDF4', text: '#15803D' }
    case 'RESERVED': return { bg: '#E5ECFF', text: '#1E3FFF' }
  }
}
