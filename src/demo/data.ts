// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentType = 'DELIVERY' | 'PRE-RETURN'

export interface DeliveryFlag {
  // good = item.counted (auto, not stored here)
  damaged: number
  broken: number   // irreparable / scrap
  missing: number  // can't find them
}

export interface ConditionFlag {
  good: number
  needsService: number  // Quantify: "To Be Serviced"
  damaged: number
  scrapped: number
  lost: number          // Quantify: "Lost" — customer is charged
}

export type ItemFlag = { kind: 'shortfall'; data: DeliveryFlag } | { kind: 'condition'; data: ConditionFlag }

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
  jobsite: string
  location: string
  date: string
  time: string
  driver: string
  vehicle: string
  items: ShipmentItem[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SHIPMENTS: Shipment[] = [
  {
    id: 'DEL-2401',
    type: 'DELIVERY',
    jobsite: 'Phillips 66 Bayway Refinery',
    location: 'Linden, NJ',
    date: 'Tue, Apr 14, 2026',
    time: '9:42 AM',
    driver: 'Mike Johnson',
    vehicle: 'NJ-4621-HB',
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
    id: 'RET-1892',
    type: 'PRE-RETURN',
    jobsite: 'Downtown Tower Demo',
    location: 'Manhattan, NY',
    date: 'Tue, Apr 14, 2026',
    time: '2:15 PM',
    driver: 'Carlos Reyes',
    vehicle: 'NY-8834-FT',
    items: [
      { id: 'r1', name: 'Ringlock Standard 3.0m', subtitle: 'Vertical · hot-dip galv', expected: 120, counted: null, flag: null },
      { id: 'r2', name: 'Ringlock Ledger 2.4m', subtitle: 'Horizontal · galvanized', expected: 80, counted: null, flag: null },
      { id: 'r3', name: 'Steel Plank 2.4m', subtitle: 'Perforated deck plate', expected: 45, counted: null, flag: null },
      { id: 'r4', name: 'Stairway Unit 2.4m', subtitle: 'Access stair module', expected: 8, counted: null, flag: null },
      { id: 'r5', name: 'Guardrail Post 1.0m', subtitle: 'Safety rail · vertical', expected: 60, counted: null, flag: null },
    ],
  },
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
    return d.damaged + d.broken + d.missing === shortfall(item)
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
    if (d.broken > 0) parts.push(`${d.broken} broken`)
    if (d.missing > 0) parts.push(`${d.missing} missing`)
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
