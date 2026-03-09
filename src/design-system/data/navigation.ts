export interface NavItem {
  id: string
  label: string
  icon: string // icon name from Icons
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Foundations',
    items: [
      { id: 'brand', label: 'Brand Identity', icon: 'shield' },
      { id: 'conventions', label: 'Conventions', icon: 'list' },
      { id: 'colors', label: 'Color System', icon: 'palette' },
      { id: 'typography', label: 'Typography', icon: 'type' },
      { id: 'elevation', label: 'Elevation', icon: 'layers' },
      { id: 'shape', label: 'Shape & Radius', icon: 'box' },
      { id: 'spacing', label: 'Spacing', icon: 'move' },
      { id: 'states', label: 'State Layers', icon: 'eye' },
      { id: 'motion', label: 'Motion', icon: 'play' },
    ]
  },
  {
    label: 'Actions',
    items: [
      { id: 'buttons', label: 'Buttons', icon: 'zap' },
      { id: 'icon-buttons', label: 'Icon Buttons', icon: 'grid' },
      { id: 'fabs', label: 'FABs', icon: 'add' },
      { id: 'segmented', label: 'Segmented Buttons', icon: 'layout' },
    ]
  },
  {
    label: 'Inputs',
    items: [
      { id: 'text-fields', label: 'Text Fields', icon: 'edit' },
      { id: 'select', label: 'Select / Dropdown', icon: 'expandMore' },
      { id: 'date-picker', label: 'Date Picker', icon: 'calendar' },
      { id: 'stepper', label: 'Stepper', icon: 'add' },
      { id: 'slider', label: 'Slider', icon: 'tune' },
    ]
  },
  {
    label: 'Selection',
    items: [
      { id: 'checkbox', label: 'Checkbox', icon: 'check' },
      { id: 'radio', label: 'Radio Button', icon: 'buildCircle' },
      { id: 'switch', label: 'Switch', icon: 'play' },
      { id: 'chips', label: 'Chips', icon: 'filter' },
    ]
  },
  {
    label: 'Containment',
    items: [
      { id: 'cards', label: 'Cards', icon: 'grid' },
      { id: 'dialogs', label: 'Dialogs', icon: 'layout' },
      { id: 'bottom-sheets', label: 'Bottom Sheets', icon: 'expandMore' },
    ]
  },
  {
    label: 'Lists & Data',
    items: [
      { id: 'lists', label: 'Lists', icon: 'list' },
      { id: 'data-tables', label: 'Data Tables', icon: 'grid' },
      { id: 'dividers', label: 'Dividers', icon: 'minus' },
      { id: 'badges', label: 'Badges', icon: 'notification' },
    ]
  },
  {
    label: 'Navigation',
    items: [
      { id: 'toolbars', label: 'Top App Bars', icon: 'layout' },
      { id: 'bottom-nav', label: 'Bottom Navigation', icon: 'menu' },
      { id: 'tabs', label: 'Tabs', icon: 'folder' },
    ]
  },
  {
    label: 'Feedback',
    items: [
      { id: 'progress', label: 'Progress Indicators', icon: 'refresh' },
      { id: 'snackbars', label: 'Snackbars', icon: 'notification' },
      { id: 'tooltips', label: 'Tooltips', icon: 'info' },
      { id: 'validation', label: 'Validation', icon: 'errorIcon' },
    ]
  },
  {
    label: 'Patterns',
    items: [
      { id: 'patterns', label: 'Screen Patterns', icon: 'phone' },
    ]
  },
]

/** Flat list of all nav items for quick lookup */
export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items)

/** Get a nav item by its id */
export const getNavItem = (id: string): NavItem | undefined =>
  ALL_NAV_ITEMS.find(item => item.id === id)
