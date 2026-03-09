import type { ComponentType } from './types'

/** A component tree node without IDs — IDs are assigned at drop time via assignIds() */
export interface PresetNode {
  type: ComponentType
  properties: Record<string, string>
  children?: PresetNode[]
}

export interface PalettePreset {
  id: string
  label: string
  description: string
  rootType: ComponentType
  createTree: () => PresetNode
}

function n(type: ComponentType, properties: Record<string, string>, children?: PresetNode[]): PresetNode {
  return { type, properties, children }
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'sign-in-form',
    label: 'Sign In Form',
    description: 'Email, password, and sign-in button',
    rootType: 'Card',
    createTree: () =>
      n('Card', { Style: 'Outlined', Padding: '24' }, [
        n('TextBlock', { Text: 'Sign in', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
        n('TextBox', { Header: 'Email', PlaceholderText: 'name@company.com' }),
        n('PasswordBox', { Header: 'Password', PlaceholderText: 'Enter password...' }),
        n('Button', { Content: 'Sign in', Style: 'Filled' }),
        n('Button', { Content: 'Forgot password?', Style: 'Text' }),
      ]),
  },
  {
    id: 'dialog',
    label: 'Dialog',
    description: 'Title, message, and action buttons',
    rootType: 'Card',
    createTree: () =>
      n('Card', { Style: 'Elevated', Padding: '24' }, [
        n('TextBlock', { Text: 'Confirm action', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
        n('TextBlock', { Text: 'Are you sure you would like to proceed? This action cannot be undone.', Style: 'BodyMedium', Foreground: '#49454F' }),
        n('StackPanel', { Orientation: 'Horizontal', Spacing: '8', HorizontalAlignment: 'Right' }, [
          n('Button', { Content: 'Cancel', Style: 'Outlined' }),
          n('Button', { Content: 'Confirm', Style: 'Filled' }),
        ]),
      ]),
  },
  {
    id: 'search-bar',
    label: 'Search Bar',
    description: 'Search icon with text field',
    rootType: 'StackPanel',
    createTree: () =>
      n('StackPanel', { Orientation: 'Horizontal', Spacing: '8', Padding: '8' }, [
        n('Icon', { Glyph: 'Search', FontSize: '22', Foreground: '#49454F' }),
        n('TextBox', { PlaceholderText: 'Search...', Header: '' }),
      ]),
  },
  {
    id: 'stepper',
    label: 'Stepper',
    description: 'Minus, value, and plus buttons',
    rootType: 'StackPanel',
    createTree: () =>
      n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '8' }, [
        n('Button', { Content: '-', Style: 'Outlined' }),
        n('TextBlock', { Text: '1', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
        n('Button', { Content: '+', Style: 'Outlined' }),
      ]),
  },
  {
    id: 'list-item',
    label: 'List Item',
    description: 'Avatar, text, and chevron',
    rootType: 'StackPanel',
    createTree: () =>
      n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
        n('PersonPicture', { DisplayName: 'Alex', Width: '40' }),
        n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
          n('TextBlock', { Text: 'Alex Johnson', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
          n('TextBlock', { Text: 'Product Manager', Style: 'BodySmall', Foreground: '#49454F' }),
        ]),
        n('Icon', { Glyph: 'ChevronRight', FontSize: '20', Foreground: '#79747E' }),
      ]),
  },
  {
    id: 'top-app-bar',
    label: 'Top App Bar',
    description: 'Navigation bar with title and actions',
    rootType: 'NavigationBar',
    createTree: () =>
      n('NavigationBar', { Content: 'Dashboard', MainCommand: 'Back' }, [
        n('Icon', { Glyph: 'Search', FontSize: '22' }),
        n('Icon', { Glyph: 'MoreVert', FontSize: '22' }),
      ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   PATTERN PRESETS — Full screen templates from the design system
   ═══════════════════════════════════════════════════════════════ */

export const PATTERN_PRESETS: PalettePreset[] = [
  // ── Authentication ──
  {
    id: 'pattern-sign-in',
    label: 'Sign In Screen',
    description: 'Authentication with email/password',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Sign In', MainCommand: 'None' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '24', Padding: '24' }, [
            n('StackPanel', { Orientation: 'Vertical', Spacing: '8' }, [
              n('TextBlock', { Text: 'Welcome back', Style: 'HeadlineMedium', Foreground: '#1C1B1F' }),
              n('TextBlock', { Text: 'Sign in to continue to your account', Style: 'BodyMedium', Foreground: '#49454F' }),
            ]),
            n('TextBox', { Header: 'Email', PlaceholderText: 'name@company.com' }),
            n('PasswordBox', { Header: 'Password', PlaceholderText: 'Enter password...' }),
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
              n('CheckBox', { Content: 'Remember me' }),
            ]),
            n('Button', { Content: 'Sign In', Style: 'Filled' }),
            n('Button', { Content: 'Forgot password?', Style: 'Text' }),
          ]),
        ]),
      ]),
  },

  // ── Core Screens ──
  {
    id: 'pattern-reservation-list',
    label: 'Reservation List',
    description: 'List view with filtering and FAB',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Reservations', MainCommand: 'None' }, [
          n('Icon', { Glyph: 'Search', FontSize: '22' }),
          n('Icon', { Glyph: 'FilterList', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0', Padding: '0' }, [
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8', Padding: '16' }, [
              n('Chip', { Content: 'All', Style: 'Filter' }),
              n('Chip', { Content: 'Active', Style: 'Filter' }),
              n('Chip', { Content: 'Pending', Style: 'Filter' }),
              n('Chip', { Content: 'Completed', Style: 'Filter' }),
            ]),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '16' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'RES-2024-001', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Metro Construction Site', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Badge', { Content: 'Active', Style: 'Success' }),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '16' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'RES-2024-002', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Harbor Bridge Project', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Badge', { Content: 'Pending', Style: 'Warning' }),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '16' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'RES-2024-003', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Downtown Office Renovation', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Badge', { Content: 'Completed', Style: 'Info' }),
              ]),
            ]),
          ]),
        ]),
        n('FloatingActionButton', { Content: 'Plus', Style: 'Primary' }),
        n('BottomNavigationBar', {}, [
          n('NavigationViewItem', { Content: 'Home', Icon: 'Home', IsSelected: 'True' }),
          n('NavigationViewItem', { Content: 'Orders', Icon: 'Assignment' }),
          n('NavigationViewItem', { Content: 'Inventory', Icon: 'Inventory' }),
          n('NavigationViewItem', { Content: 'Profile', Icon: 'Person' }),
        ]),
      ]),
  },
  {
    id: 'pattern-reservation-detail',
    label: 'Reservation Detail',
    description: 'Detail view with status and actions',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'RES-2024-001', MainCommand: 'Back' }, [
          n('Icon', { Glyph: 'Edit', FontSize: '22' }),
          n('Icon', { Glyph: 'MoreVert', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                n('TextBlock', { Text: 'Metro Construction Site', Style: 'TitleLarge', Foreground: '#1C1B1F' }),
                n('Badge', { Content: 'Active', Style: 'Success' }),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Vertical', Spacing: '8' }, [
                n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                  n('Icon', { Glyph: 'CalendarToday', FontSize: '16', Foreground: '#49454F' }),
                  n('TextBlock', { Text: 'Mar 15 — Apr 20, 2024', Style: 'BodyMedium', Foreground: '#49454F' }),
                ]),
                n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                  n('Icon', { Glyph: 'Place', FontSize: '16', Foreground: '#49454F' }),
                  n('TextBlock', { Text: '123 Main St, New York, NY', Style: 'BodyMedium', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
            n('TextBlock', { Text: 'Equipment', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
                n('TextBlock', { Text: 'Frame scaffolding', Style: 'BodyLarge', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: 'x 24', Style: 'BodyMedium', Foreground: '#49454F' }),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
                n('TextBlock', { Text: 'Platform boards', Style: 'BodyLarge', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: 'x 48', Style: 'BodyMedium', Foreground: '#49454F' }),
              ]),
            ]),
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
              n('Button', { Content: 'Ship Equipment', Style: 'Filled' }),
              n('Button', { Content: 'Edit', Style: 'Outlined' }),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-ship-reservation',
    label: 'Ship Reservation',
    description: 'Multi-step form with progress',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Ship Equipment', MainCommand: 'Close' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('ProgressBar', { Value: '33' }),
            n('TextBlock', { Text: 'Step 1 of 3', Style: 'LabelMedium', Foreground: '#49454F' }),
            n('TextBlock', { Text: 'Select Items', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Frame scaffolding', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Available: 120', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Stepper', { Header: 'Qty', Value: '24', Min: '1', Max: '120', Step: '1' }),
              ]),
            ]),
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Platform boards', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Available: 200', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Stepper', { Header: 'Qty', Value: '48', Min: '1', Max: '200', Step: '1' }),
              ]),
            ]),
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
              n('Button', { Content: 'Cancel', Style: 'Outlined' }),
              n('Button', { Content: 'Next', Style: 'Filled' }),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-equipment-detail',
    label: 'Equipment Detail',
    description: 'Tabbed detail with specs and stock',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Equipment', MainCommand: 'Back' }, [
          n('Icon', { Glyph: 'Edit', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0' }, [
            n('Image', { Width: '100%', Height: '180' }),
            n('Tabs', {}, [
              n('NavigationViewItem', { Content: 'Details', Icon: 'Info', IsSelected: 'True' }),
              n('NavigationViewItem', { Content: 'Stock', Icon: 'Inventory' }),
              n('NavigationViewItem', { Content: 'Activity', Icon: 'AccessTime' }),
            ]),
            n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
              n('TextBlock', { Text: 'Frame Scaffolding 1.5m', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
              n('TextBlock', { Text: 'Standard tubular steel frame scaffolding for construction sites.', Style: 'BodyMedium', Foreground: '#49454F' }),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '16' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Total', Style: 'LabelMedium', Foreground: '#49454F' }),
                  n('TextBlock', { Text: '240', Style: 'TitleLarge', Foreground: '#1C1B1F' }),
                ]),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Available', Style: 'LabelMedium', Foreground: '#49454F' }),
                  n('TextBlock', { Text: '120', Style: 'TitleLarge', Foreground: '#22C55E' }),
                ]),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Reserved', Style: 'LabelMedium', Foreground: '#49454F' }),
                  n('TextBlock', { Text: '96', Style: 'TitleLarge', Foreground: '#0A3EFF' }),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
  },

  // ── Field Operations ──
  {
    id: 'pattern-equipment-scanner',
    label: 'Equipment Scanner',
    description: 'Barcode scanner for check-in/out',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Scanner', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('SegmentedButton', {}, [
              n('Button', { Content: 'Check Out', Style: 'Tonal' }),
              n('Button', { Content: 'Check In', Style: 'Outlined' }),
            ]),
            n('Card', { Style: 'Filled', Padding: '24' }, [
              n('StackPanel', { Orientation: 'Vertical', Spacing: '12' }, [
                n('Icon', { Glyph: 'Search', FontSize: '48', Foreground: '#0A3EFF' }),
                n('TextBlock', { Text: 'Point camera at barcode', Style: 'BodyLarge', Foreground: '#49454F' }),
              ]),
            ]),
            n('TextBlock', { Text: 'Recently Scanned', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
                n('Icon', { Glyph: 'Check', FontSize: '18', Foreground: '#22C55E' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Frame scaffolding #SF-001', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Checked out — 2 min ago', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-delivery-tracking',
    label: 'Delivery Tracking',
    description: 'Timeline with driver info',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Delivery Tracking', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                n('Icon', { Glyph: 'LocalShipping', FontSize: '20', Foreground: '#0A3EFF' }),
                n('TextBlock', { Text: 'In Transit', Style: 'TitleMedium', Foreground: '#0A3EFF' }),
              ]),
              n('TextBlock', { Text: 'Estimated arrival: 2:30 PM', Style: 'BodyMedium', Foreground: '#49454F' }),
            ]),
            n('TextBlock', { Text: 'Timeline', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '8' }, [
                n('Icon', { Glyph: 'Check', FontSize: '16', Foreground: '#22C55E' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Order confirmed', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: '9:00 AM', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '8' }, [
                n('Icon', { Glyph: 'Check', FontSize: '16', Foreground: '#22C55E' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Loaded at warehouse', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: '10:15 AM', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '8' }, [
                n('Icon', { Glyph: 'LocalShipping', FontSize: '16', Foreground: '#0A3EFF' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'In transit', Style: 'BodyMedium', Foreground: '#0A3EFF' }),
                  n('TextBlock', { Text: 'Now', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
            n('Card', { Style: 'Outlined', Padding: '12' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12' }, [
                n('PersonPicture', { DisplayName: 'Mike', Width: '40' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Mike Rodriguez', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Driver', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('IconButton', { Glyph: 'Phone', Style: 'Filled' }),
              ]),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-return-inspection',
    label: 'Return Inspection',
    description: 'Equipment inspection checklist',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Return Inspection', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('ProgressBar', { Value: '60' }),
            n('TextBlock', { Text: 'Condition Assessment', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('TextBlock', { Text: 'Frame scaffolding #SF-001', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                n('Chip', { Content: 'Good', Style: 'Filter' }),
                n('Chip', { Content: 'Fair', Style: 'Filter' }),
                n('Chip', { Content: 'Damaged', Style: 'Filter' }),
              ]),
              n('TextBox', { Header: 'Notes', PlaceholderText: 'Add inspection notes...' }),
            ]),
            n('Button', { Content: 'Submit Inspection', Style: 'Filled' }),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-quote-builder',
    label: 'Quote Builder',
    description: 'Line items with pricing summary',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'New Quote', MainCommand: 'Close' }, [
          n('Icon', { Glyph: 'Save', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('Card', { Style: 'Outlined', Padding: '16' }, [
              n('TextBlock', { Text: 'Client', Style: 'LabelMedium', Foreground: '#49454F' }),
              n('TextBlock', { Text: 'Metro Construction LLC', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            ]),
            n('TextBlock', { Text: 'Line Items', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('Card', { Style: 'Outlined', Padding: '12' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12' }, [
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Frame scaffolding', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: '$12.50/day', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
                n('Stepper', { Header: 'Qty', Value: '24', Min: '1', Max: '999', Step: '1' }),
              ]),
            ]),
            n('Button', { Content: 'Add Line Item', Style: 'Outlined' }),
            n('Divider', {}),
            n('Card', { Style: 'Filled', Padding: '16' }, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                n('TextBlock', { Text: 'Total', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: '$4,200.00', Style: 'HeadlineSmall', Foreground: '#0A3EFF' }),
              ]),
            ]),
            n('Button', { Content: 'Send Quote', Style: 'Filled' }),
          ]),
        ]),
      ]),
  },

  // ── Dispatch & Planning ──
  {
    id: 'pattern-crew-schedule',
    label: 'Crew Schedule',
    description: 'Dispatcher view with time-based jobs',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Schedule', MainCommand: 'None' }, [
          n('Icon', { Glyph: 'CalendarToday', FontSize: '22' }),
          n('Icon', { Glyph: 'FilterList', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0' }, [
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '4', Padding: '16' }, [
              n('Chip', { Content: 'Mon', Style: 'Filter' }),
              n('Chip', { Content: 'Tue', Style: 'Filter' }),
              n('Chip', { Content: 'Wed', Style: 'Filter' }),
              n('Chip', { Content: 'Thu', Style: 'Filter' }),
              n('Chip', { Content: 'Fri', Style: 'Filter' }),
            ]),
            n('StackPanel', { Orientation: 'Vertical', Spacing: '12', Padding: '16' }, [
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                  n('TextBlock', { Text: '8:00 AM', Style: 'LabelMedium', Foreground: '#49454F' }),
                  n('Badge', { Content: 'Delivery', Style: 'Info' }),
                ]),
                n('TextBlock', { Text: 'Metro Construction Site', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: 'Mike Rodriguez — Truck #3', Style: 'BodySmall', Foreground: '#49454F' }),
              ]),
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
                  n('TextBlock', { Text: '10:30 AM', Style: 'LabelMedium', Foreground: '#49454F' }),
                  n('Badge', { Content: 'Pickup', Style: 'Warning' }),
                ]),
                n('TextBlock', { Text: 'Harbor Bridge Project', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: 'Sarah Chen — Truck #1', Style: 'BodySmall', Foreground: '#49454F' }),
              ]),
            ]),
          ]),
        ]),
        n('FloatingActionButton', { Content: 'Plus', Style: 'Primary' }),
      ]),
  },
  {
    id: 'pattern-notifications',
    label: 'Notifications',
    description: 'Alert center with filtering',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Notifications', MainCommand: 'Back' }, [
          n('Icon', { Glyph: 'Settings', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0' }, [
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8', Padding: '16' }, [
              n('Chip', { Content: 'All', Style: 'Filter' }),
              n('Chip', { Content: 'Unread', Style: 'Filter' }),
              n('Chip', { Content: 'Alerts', Style: 'Filter' }),
            ]),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '16' }, [
                n('Icon', { Glyph: 'LocalShipping', FontSize: '20', Foreground: '#0A3EFF' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Delivery completed', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'RES-2024-001 delivered to Metro Construction', Style: 'BodySmall', Foreground: '#49454F' }),
                  n('TextBlock', { Text: '2 hours ago', Style: 'BodySmall', Foreground: '#79747E' }),
                ]),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '16' }, [
                n('Icon', { Glyph: 'Warning', FontSize: '20', Foreground: '#F9A825' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Low stock alert', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Platform boards below minimum threshold', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-report',
    label: 'Report',
    description: 'Analytics with KPIs and charts',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Reports', MainCommand: 'None' }, [
          n('Icon', { Glyph: 'FileDownload', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('Grid', { ColumnSpacing: '12', RowSpacing: '12', Padding: '0' }, [
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Revenue', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '$148,200', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: '+12%', Style: 'BodySmall', Foreground: '#22C55E' }),
              ]),
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Orders', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '47', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
              ]),
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Utilization', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '78%', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
                n('ProgressBar', { Value: '78' }),
              ]),
            ]),
          ]),
        ]),
        n('BottomNavigationBar', {}, [
          n('NavigationViewItem', { Content: 'Home', Icon: 'Home' }),
          n('NavigationViewItem', { Content: 'Reports', Icon: 'BarChart', IsSelected: 'True' }),
          n('NavigationViewItem', { Content: 'Profile', Icon: 'Person' }),
        ]),
      ]),
  },

  // ── Utilities ──
  {
    id: 'pattern-inventory',
    label: 'Inventory',
    description: 'Equipment with stock levels',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Inventory', MainCommand: 'None' }, [
          n('Icon', { Glyph: 'Search', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0' }, [
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8', Padding: '16' }, [
              n('Chip', { Content: 'All', Style: 'Filter' }),
              n('Chip', { Content: 'Scaffolding', Style: 'Filter' }),
              n('Chip', { Content: 'Safety', Style: 'Filter' }),
            ]),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Vertical', Spacing: '4', Padding: '16' }, [
                n('TextBlock', { Text: 'Frame scaffolding', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: '120 / 240 available', Style: 'BodySmall', Foreground: '#49454F' }),
                n('ProgressBar', { Value: '50' }),
              ]),
              n('Divider', {}),
              n('StackPanel', { Orientation: 'Vertical', Spacing: '4', Padding: '16' }, [
                n('TextBlock', { Text: 'Safety harness', Style: 'TitleSmall', Foreground: '#1C1B1F' }),
                n('TextBlock', { Text: '8 / 50 available', Style: 'BodySmall', Foreground: '#F9A825' }),
                n('ProgressBar', { Value: '16' }),
              ]),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-search',
    label: 'Search Screen',
    description: 'Search with recent queries',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Search', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('AutoSuggestBox', { Header: '', PlaceholderText: 'Search equipment, orders...' }),
            n('TextBlock', { Text: 'Recent', Style: 'LabelMedium', Foreground: '#49454F' }),
            n('StackPanel', { Orientation: 'Horizontal', Spacing: '8' }, [
              n('Chip', { Content: 'scaffolding', Style: 'Suggestion' }),
              n('Chip', { Content: 'harness', Style: 'Suggestion' }),
            ]),
            n('Divider', {}),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
                n('Icon', { Glyph: 'Inventory', FontSize: '20', Foreground: '#0A3EFF' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Frame scaffolding 1.5m', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: 'Equipment — 120 available', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-settings',
    label: 'Settings',
    description: 'Preferences with toggles',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Settings', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '0', Padding: '16' }, [
            n('ToggleSwitch', { Header: 'Push notifications', IsOn: 'True' }),
            n('Divider', {}),
            n('ToggleSwitch', { Header: 'Email alerts', IsOn: 'True' }),
            n('Divider', {}),
            n('ToggleSwitch', { Header: 'Dark mode', IsOn: 'False' }),
            n('Divider', {}),
            n('TextBox', { Header: 'Default warehouse', PlaceholderText: 'Select warehouse...' }),
            n('Divider', {}),
            n('TextBlock', { Text: 'About', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('TextBlock', { Text: 'Quantify v2.4.1', Style: 'BodyMedium', Foreground: '#49454F' }),
            n('Button', { Content: 'Sign Out', Style: 'Outlined' }),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-dashboard',
    label: 'Dashboard',
    description: 'Overview with metrics and activity',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Dashboard', MainCommand: 'None' }, [
          n('Icon', { Glyph: 'Notifications', FontSize: '22' }),
          n('Icon', { Glyph: 'Settings', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('Grid', { ColumnSpacing: '12', RowSpacing: '12', Padding: '0' }, [
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Active', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '23', Style: 'HeadlineMedium', Foreground: '#0A3EFF' }),
              ]),
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Pending', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '8', Style: 'HeadlineMedium', Foreground: '#F9A825' }),
              ]),
              n('Card', { Style: 'Outlined', Padding: '12' }, [
                n('TextBlock', { Text: 'Done', Style: 'LabelMedium', Foreground: '#49454F' }),
                n('TextBlock', { Text: '156', Style: 'HeadlineMedium', Foreground: '#22C55E' }),
              ]),
            ]),
            n('TextBlock', { Text: 'Recent Activity', Style: 'TitleMedium', Foreground: '#1C1B1F' }),
            n('ListView', {}, [
              n('StackPanel', { Orientation: 'Horizontal', Spacing: '12', Padding: '12' }, [
                n('PersonPicture', { DisplayName: 'Sarah', Width: '36' }),
                n('StackPanel', { Orientation: 'Vertical', Spacing: '2' }, [
                  n('TextBlock', { Text: 'Sarah shipped RES-2024-004', Style: 'BodyMedium', Foreground: '#1C1B1F' }),
                  n('TextBlock', { Text: '15 min ago', Style: 'BodySmall', Foreground: '#49454F' }),
                ]),
              ]),
            ]),
          ]),
        ]),
        n('BottomNavigationBar', {}, [
          n('NavigationViewItem', { Content: 'Home', Icon: 'Home', IsSelected: 'True' }),
          n('NavigationViewItem', { Content: 'Orders', Icon: 'Assignment' }),
          n('NavigationViewItem', { Content: 'Inventory', Icon: 'Inventory' }),
          n('NavigationViewItem', { Content: 'Profile', Icon: 'Person' }),
        ]),
      ]),
  },
  {
    id: 'pattern-connection-settings',
    label: 'Connection Settings',
    description: 'Server config with test',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Connection', MainCommand: 'Back' }, [
          n('Icon', { Glyph: 'Save', FontSize: '22' }),
        ]),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '16' }, [
            n('TextBox', { Header: 'Server URL', PlaceholderText: 'https://api.example.com' }),
            n('TextBox', { Header: 'Port', PlaceholderText: '443' }),
            n('ToggleSwitch', { Header: 'Use SSL', IsOn: 'True' }),
            n('Divider', {}),
            n('Button', { Content: 'Test Connection', Style: 'Outlined' }),
            n('InfoBar', { Content: 'Connection successful', Style: 'Success' }),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-about',
    label: 'About',
    description: 'App info and legal links',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'About', MainCommand: 'Back' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '24' }, [
            n('Icon', { Glyph: 'Build', FontSize: '48', Foreground: '#0A3EFF' }),
            n('TextBlock', { Text: 'Quantify', Style: 'HeadlineMedium', Foreground: '#1C1B1F' }),
            n('Badge', { Content: 'v2.4.1', Style: 'Info' }),
            n('TextBlock', { Text: 'Scaffold & equipment management for modern teams.', Style: 'BodyMedium', Foreground: '#49454F' }),
            n('Divider', {}),
            n('TextBlock', { Text: '\u00A9 2024 Avontus Software', Style: 'BodySmall', Foreground: '#79747E' }),
            n('Button', { Content: 'Terms of Service', Style: 'Text' }),
            n('Button', { Content: 'Privacy Policy', Style: 'Text' }),
          ]),
        ]),
      ]),
  },
  {
    id: 'pattern-empty-state',
    label: 'Empty State',
    description: 'No data with CTA',
    rootType: 'Page',
    createTree: () =>
      n('Page', { Background: '#FFFFFF' }, [
        n('NavigationBar', { Content: 'Reservations', MainCommand: 'None' }),
        n('ScrollViewer', {}, [
          n('StackPanel', { Orientation: 'Vertical', Spacing: '16', Padding: '48' }, [
            n('Icon', { Glyph: 'Assignment', FontSize: '64', Foreground: '#CAC4D0' }),
            n('TextBlock', { Text: 'No reservations yet', Style: 'HeadlineSmall', Foreground: '#1C1B1F' }),
            n('TextBlock', { Text: 'Create your first reservation to start managing equipment rentals.', Style: 'BodyMedium', Foreground: '#49454F' }),
            n('Button', { Content: 'Create Reservation', Style: 'Filled' }),
          ]),
        ]),
      ]),
  },
]
