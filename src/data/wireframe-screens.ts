import type { ComponentNode } from '../types'

export interface WireframeScreen {
  id: string
  label: string
  category: 'core' | 'jobsite' | 'settings' | 'patterns'
  description: string
  tree: ComponentNode
}

// ─── 1. SIGN IN ─────────────────────────────────────────────
const signInScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'login-content', type: 'StackPanel', properties: { HorizontalAlignment: 'Center', Padding: '32', Spacing: '24', VerticalAlignment: 'Center' }, children: [
      { id: 'login-logo', type: 'Image', properties: { Width: '180', Height: '70' } },
      { id: 'login-title', type: 'TextBlock', properties: { Text: 'Quantify', Style: 'HeadlineMedium', HorizontalAlignment: 'Center' } },
      { id: 'login-fields', type: 'StackPanel', properties: { Spacing: '12' }, children: [
        { id: 'login-username', type: 'TextBox', properties: { Header: 'Username', PlaceholderText: 'Enter username' } },
        { id: 'login-password', type: 'PasswordBox', properties: { Header: 'Password', PlaceholderText: 'Enter password' } },
      ]},
      { id: 'login-buttons', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16', HorizontalAlignment: 'Center' }, children: [
        { id: 'login-connection-btn', type: 'Button', properties: { Content: 'Connection...', Style: 'Outlined' } },
        { id: 'login-signin-btn', type: 'Button', properties: { Content: 'Sign in', Style: 'Filled' } },
      ]},
      { id: 'login-footer', type: 'StackPanel', properties: { Spacing: '4', HorizontalAlignment: 'Center' }, children: [
        { id: 'login-version', type: 'TextBlock', properties: { Text: 'Version x.yz', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
        { id: 'login-copyright', type: 'TextBlock', properties: { Text: '\u00a9 2008-2025 Avontus Software Corporation.', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
        { id: 'login-rights', type: 'TextBlock', properties: { Text: 'All rights reserved.', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
        { id: 'login-about-btn', type: 'Button', properties: { Content: 'About Quantify...', Style: 'Text', HorizontalAlignment: 'Center' } },
      ]},
    ]}
  ]
}

// ─── 2. CONNECTION SETTINGS ─────────────────────────────────
const connectionSettingsScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'conn-toolbar', type: 'NavigationBar', properties: { Content: 'Connection settings', MainCommand: 'Close' }, children: [
      { id: 'conn-warning-icon', type: 'Icon', properties: { Glyph: 'AlertTriangle', Foreground: '#F9A825', FontSize: '20' } },
      { id: 'conn-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'conn-content', type: 'ScrollViewer', properties: {}, children: [
      { id: 'conn-form', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'conn-server-url', type: 'TextBox', properties: { Header: 'Remote server', PlaceholderText: 'https://myinstance.mycompany.com', Text: '' } },
        { id: 'conn-ssl-toggle', type: 'ToggleSwitch', properties: { Header: 'Use SSL', IsOn: 'True' } },
        { id: 'conn-test-btn', type: 'Button', properties: { Content: 'Test Connection', Style: 'Outlined', HorizontalAlignment: 'Right' } },
        { id: 'conn-divider', type: 'Divider', properties: {} },
        { id: 'conn-validation-card', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
          { id: 'conn-validation-title', type: 'TextBlock', properties: { Text: 'Validation', Style: 'TitleSmall' } },
          { id: 'conn-val-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'conn-val-icon', type: 'Icon', properties: { Glyph: 'AlertTriangle', Foreground: '#F9A825', FontSize: '18' } },
            { id: 'conn-val-msg', type: 'TextBlock', properties: { Text: 'Unable to connect to server', Style: 'BodyMedium' } },
          ]},
        ]},
      ]}
    ]}
  ]
}

// ─── 3. RESERVATIONS LIST ───────────────────────────────────
const reservationsListScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'list-toolbar', type: 'NavigationBar', properties: { Content: 'RESERVATIONS', MainCommand: 'Back' }, children: [] },
    { id: 'list-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'list-content', type: 'StackPanel', properties: { Spacing: '8', Padding: '16' }, children: [
        { id: 'list-branch-label', type: 'TextBlock', properties: { Text: 'BRANCH OFFICE', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: 'list-branch-dropdown', type: 'Button', properties: { Content: 'New York', Style: 'Outlined', HorizontalAlignment: 'Stretch' } },
        { id: 'list-divider-1', type: 'Divider', properties: {} },
        { id: 'list-items', type: 'ListView', properties: {}, children: [
          { id: 'res-card-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'res-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'res-1-id', type: 'TextBlock', properties: { Text: 'DEL-00756', Style: 'TitleMedium' } },
              { id: 'res-1-date', type: 'TextBlock', properties: { Text: '7/5/2025', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'res-1-company', type: 'TextBlock', properties: { Text: 'Titan Apex Industrial Services', Style: 'BodyMedium' } },
            { id: 'res-1-location', type: 'TextBlock', properties: { Text: 'Eastgate Distribution Hub', Style: 'BodyMedium' } },
            { id: 'res-1-address', type: 'TextBlock', properties: { Text: '741 Stuart Way, Nordison, OH', Style: 'BodySmall', Foreground: '#0005EE' } },
            { id: 'res-1-summary', type: 'TextBlock', properties: { Text: 'Pieces: 274  Weight: 5,723.4', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'res-card-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'res-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'res-2-id', type: 'TextBlock', properties: { Text: 'DEL-00802', Style: 'TitleMedium' } },
              { id: 'res-2-date', type: 'TextBlock', properties: { Text: '7/9/2025', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'res-2-company', type: 'TextBlock', properties: { Text: 'BlueRidge Fabrication & Erection', Style: 'BodyMedium' } },
            { id: 'res-2-location', type: 'TextBlock', properties: { Text: 'Northwind Logistics Terminal', Style: 'BodyMedium' } },
            { id: 'res-2-address', type: 'TextBlock', properties: { Text: '8907 Maple Ridge Court, Akron, OH 44312', Style: 'BodySmall', Foreground: '#0005EE' } },
            { id: 'res-2-summary', type: 'TextBlock', properties: { Text: 'Pieces: 616  Weight: 3,824.6', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'res-card-3', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'res-3-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'res-3-id', type: 'TextBlock', properties: { Text: 'DEL-00914', Style: 'TitleMedium' } },
              { id: 'res-3-date', type: 'TextBlock', properties: { Text: '7/11/2025', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'res-3-company', type: 'TextBlock', properties: { Text: 'Titan Apex Industrial Services', Style: 'BodyMedium' } },
            { id: 'res-3-location', type: 'TextBlock', properties: { Text: 'Eastgate Distribution Hub', Style: 'BodyMedium' } },
            { id: 'res-3-address', type: 'TextBlock', properties: { Text: '741 Stuart Way, Nordison, OH', Style: 'BodySmall', Foreground: '#0005EE' } },
            { id: 'res-3-summary', type: 'TextBlock', properties: { Text: 'Pieces: 591  Weight: 3,218.5', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'res-card-4', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'res-4-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'res-4-id', type: 'TextBlock', properties: { Text: 'DEL-00747', Style: 'TitleMedium' } },
              { id: 'res-4-date', type: 'TextBlock', properties: { Text: '7/15/2025', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'res-4-company', type: 'TextBlock', properties: { Text: 'Ironcrest Solutions Group', Style: 'BodyMedium' } },
            { id: 'res-4-location', type: 'TextBlock', properties: { Text: 'Falcon Ridge Wind Farm', Style: 'BodyMedium' } },
            { id: 'res-4-address', type: 'TextBlock', properties: { Text: '152 Westbrook Avenue, Cincinnati, OH 45231', Style: 'BodySmall', Foreground: '#0005EE' } },
            { id: 'res-4-summary', type: 'TextBlock', properties: { Text: 'Pieces: 418  Weight: 3,415.7', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'res-card-5', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'res-5-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'res-5-id', type: 'TextBlock', properties: { Text: 'DEL-00829', Style: 'TitleMedium' } },
              { id: 'res-5-date', type: 'TextBlock', properties: { Text: '7/24/2025', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'res-5-company', type: 'TextBlock', properties: { Text: 'Vanguard Plant Systems', Style: 'BodyMedium' } },
            { id: 'res-5-location', type: 'TextBlock', properties: { Text: 'Harborview Tank Farm', Style: 'BodyMedium' } },
            { id: 'res-5-address', type: 'TextBlock', properties: { Text: '371 Willow Creek Lane, Toledo, OH 43615', Style: 'BodySmall', Foreground: '#0005EE' } },
            { id: 'res-5-summary', type: 'TextBlock', properties: { Text: 'Pieces: 583  Weight: 3,028.6', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
      ]}
    ]}
  ]
}

// ─── 4. VIEW RESERVATION (DEL-00756) ────────────────────────
const viewReservationScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'view-toolbar', type: 'NavigationBar', properties: { Content: 'DEL-00756', MainCommand: 'Back' }, children: [] },
    { id: 'view-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'view-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'view-meta', type: 'StackPanel', properties: { Spacing: '4' }, children: [
          { id: 'view-ship-date', type: 'TextBlock', properties: { Text: 'Planned ship: 7/5/2025', Style: 'BodyMedium' } },
          { id: 'view-total-weight', type: 'TextBlock', properties: { Text: 'Total weight: 5,723.4', Style: 'BodyMedium', Foreground: '#49454F' } },
          { id: 'view-company', type: 'TextBlock', properties: { Text: 'Titan Apex Industrial Services', Style: 'BodyMedium' } },
          { id: 'view-location', type: 'TextBlock', properties: { Text: 'Eastgate Distribution Hub', Style: 'BodyMedium' } },
          { id: 'view-address', type: 'TextBlock', properties: { Text: '741 Stuart Way, Nordison, OH', Style: 'BodySmall', Foreground: '#0005EE' } },
          { id: 'view-pieces', type: 'TextBlock', properties: { Text: 'Pieces: 482  Weight: 3,157.8', Style: 'BodySmall', Foreground: '#49454F' } },
        ]},
        { id: 'view-send-btn', type: 'Button', properties: { Content: 'Send Reservation', Style: 'Filled', HorizontalAlignment: 'Center' } },
        { id: 'view-divider', type: 'Divider', properties: {} },
        { id: 'view-products-label', type: 'TextBlock', properties: { Text: 'PRODUCTS', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: 'view-products', type: 'ListView', properties: {}, children: [
          { id: 'vp-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-1-code', type: 'TextBlock', properties: { Text: '151150', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-1-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 62', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-1-name', type: 'TextBlock', properties: { Text: '4\'11" Vertical', Style: 'BodyMedium' } },
            { id: 'vp-1-weight', type: 'TextBlock', properties: { Text: 'Weight each: 16.0', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'vp-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-2-code', type: 'TextBlock', properties: { Text: '156850', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-2-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 38', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-2-name', type: 'TextBlock', properties: { Text: '5\' Safety-Grip Plank (10" wide)', Style: 'BodyMedium' } },
            { id: 'vp-2-weight', type: 'TextBlock', properties: { Text: 'Weight each: 25.0  Total weight: 950.0', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'vp-3', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-3-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-3-code', type: 'TextBlock', properties: { Text: '115103', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-3-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 55', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-3-name', type: 'TextBlock', properties: { Text: '3\' Ladder', Style: 'BodyMedium' } },
            { id: 'vp-3-weight', type: 'TextBlock', properties: { Text: 'Weight each: 17.0  Total weight: 935.0', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'vp-4', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-4-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-4-code', type: 'TextBlock', properties: { Text: '153700', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-4-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 27', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-4-name', type: 'TextBlock', properties: { Text: '7\' Double Ledger', Style: 'BodyMedium' } },
            { id: 'vp-4-weight', type: 'TextBlock', properties: { Text: 'Weight each: 35.0  Total weight: 945.0', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'vp-5', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-5-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-5-code', type: 'TextBlock', properties: { Text: '157860', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-5-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 25', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-5-name', type: 'TextBlock', properties: { Text: '6\' Safety-Grip Plank (12" wide)', Style: 'BodyMedium' } },
            { id: 'vp-5-weight', type: 'TextBlock', properties: { Text: 'Weight each: 38.0  Total weight: 950.0', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'vp-6', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'vp-6-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'vp-6-code', type: 'TextBlock', properties: { Text: '152500', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'vp-6-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 67', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'vp-6-name', type: 'TextBlock', properties: { Text: '5\'2" Horizontal Ledger', Style: 'BodyMedium' } },
            { id: 'vp-6-weight', type: 'TextBlock', properties: { Text: 'Weight each: 14.2  Total weight: 951.4', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
      ]}
    ]}
  ]
}

// ─── 5. SHIP RESERVATION (Edit Mode) ────────────────────────
const shipReservationScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'ship-toolbar', type: 'NavigationBar', properties: { Content: 'DEL-00756', MainCommand: 'Close' }, children: [
      { id: 'ship-error-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '20' } },
      { id: 'ship-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'ship-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'ship-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'ship-meta', type: 'StackPanel', properties: { Spacing: '4' }, children: [
          { id: 'ship-date-weight', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'ship-date', type: 'TextBlock', properties: { Text: 'Planned ship: 7/5/2025', Style: 'BodyMedium' } },
            { id: 'ship-total-weight', type: 'TextBlock', properties: { Text: 'Total weight: xxx', Style: 'BodyMedium', Foreground: '#49454F' } },
          ]},
          { id: 'ship-company', type: 'TextBlock', properties: { Text: 'Titan Apex Industrial Services', Style: 'BodyMedium' } },
          { id: 'ship-location', type: 'TextBlock', properties: { Text: 'Eastgate Distribution Hub', Style: 'BodyMedium' } },
          { id: 'ship-address', type: 'TextBlock', properties: { Text: '741 Stuart Way, Nordison, OH', Style: 'BodySmall', Foreground: '#0005EE' } },
          { id: 'ship-pieces', type: 'TextBlock', properties: { Text: 'Pieces: 482  Weight: 3,157.8', Style: 'BodySmall', Foreground: '#49454F' } },
        ]},
        { id: 'ship-shortage-toggle', type: 'ToggleSwitch', properties: { Header: 'Create new reservation with shortages', IsOn: 'False' } },
        { id: 'ship-all-btn', type: 'Button', properties: { Content: 'Ship All', Style: 'Tonal', HorizontalAlignment: 'Left' } },
        { id: 'ship-divider', type: 'Divider', properties: {} },
        { id: 'ship-products-label', type: 'TextBlock', properties: { Text: 'PRODUCTS', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: 'ship-products', type: 'ListView', properties: {}, children: [
          { id: 'sp-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'sp-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-1-code', type: 'TextBlock', properties: { Text: '151150', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'sp-1-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 62', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'sp-1-name', type: 'TextBlock', properties: { Text: '4\'11" Vertical', Style: 'BodyMedium' } },
            { id: 'sp-1-weight', type: 'TextBlock', properties: { Text: 'Weight each: 16.0', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'sp-1-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-1-label', type: 'TextBlock', properties: { Text: 'Total weight:', Style: 'BodySmall', Foreground: '#49454F' } },
              { id: 'sp-1-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
              { id: 'sp-1-qty', type: 'TextBox', properties: { Text: '62' } },
              { id: 'sp-1-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
            ]},
          ]},
          { id: 'sp-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'sp-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-2-code', type: 'TextBlock', properties: { Text: '156850', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'sp-2-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 38', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'sp-2-name', type: 'TextBlock', properties: { Text: '5\' Safety-Grip Plank (10" wide)', Style: 'BodyMedium' } },
            { id: 'sp-2-weight', type: 'TextBlock', properties: { Text: 'Weight each: 25.0', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'sp-2-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-2-label', type: 'TextBlock', properties: { Text: 'Total weight:', Style: 'BodySmall', Foreground: '#49454F' } },
              { id: 'sp-2-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
              { id: 'sp-2-qty', type: 'TextBox', properties: { Text: '38' } },
              { id: 'sp-2-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
            ]},
          ]},
          { id: 'sp-3', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'sp-3-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-3-code', type: 'TextBlock', properties: { Text: '115103', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'sp-3-reserved', type: 'TextBlock', properties: { Text: 'Reserved: 55', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'sp-3-name', type: 'TextBlock', properties: { Text: '3\' Ladder', Style: 'BodyMedium' } },
            { id: 'sp-3-weight', type: 'TextBlock', properties: { Text: 'Weight each: 17.0', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'sp-3-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'sp-3-label', type: 'TextBlock', properties: { Text: 'Total weight:', Style: 'BodySmall', Foreground: '#49454F' } },
              { id: 'sp-3-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
              { id: 'sp-3-qty', type: 'TextBox', properties: { Text: '55' } },
              { id: 'sp-3-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
            ]},
          ]},
        ]},
      ]}
    ]}
  ]
}

// ─── 6. JOBSITE SCREEN ──────────────────────────────────────
const jobsiteScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'job-toolbar', type: 'NavigationBar', properties: { Content: 'JOBSITE 1', MainCommand: 'Close' }, children: [
      { id: 'job-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'job-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
      { id: 'job-info-card', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
        { id: 'job-info-title', type: 'TextBlock', properties: { Text: 'JOBSITE 1', Style: 'TitleMedium' } },
        { id: 'job-info-notes', type: 'TextBlock', properties: { Text: 'Notes', Style: 'BodyMedium', Foreground: '#49454F' } },
        { id: 'job-info-other', type: 'TextBlock', properties: { Text: 'Other information', Style: 'BodyMedium', Foreground: '#49454F' } },
      ]},
      { id: 'job-scan-instructions', type: 'TextBlock', properties: { Text: 'Scan employee badge or serial number from tool', Style: 'BodyMedium', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
      { id: 'job-scan-btn', type: 'Button', properties: { Content: 'Scan', Style: 'Outlined', HorizontalAlignment: 'Center' } },
    ]}
  ]
}

// ─── 7. CHECK IN ─────────────────────────────────────────────
const checkInScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'checkin-toolbar', type: 'NavigationBar', properties: { Content: 'CHECK IN', MainCommand: 'Close' }, children: [
      { id: 'checkin-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'checkin-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'checkin-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'checkin-employee', type: 'StackPanel', properties: { Spacing: '4' }, children: [
          { id: 'checkin-name', type: 'TextBlock', properties: { Text: 'John Smith', Style: 'TitleMedium' } },
          { id: 'checkin-company', type: 'TextBlock', properties: { Text: 'ExxonMobil Baton Rouge', Style: 'BodyMedium', Foreground: '#49454F' } },
        ]},
        { id: 'checkin-actions', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
          { id: 'checkin-scan-btn', type: 'Button', properties: { Content: 'Scan', Style: 'Outlined' } },
          { id: 'checkin-return-btn', type: 'Button', properties: { Content: 'Return All', Style: 'Outlined' } },
        ]},
        { id: 'checkin-divider', type: 'Divider', properties: {} },
        { id: 'checkin-tools-label', type: 'TextBlock', properties: { Text: 'TOOLS CHECKED OUT', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: 'checkin-tools', type: 'ListView', properties: {}, children: [
          { id: 'ct-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'ct-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'ct-1-code', type: 'TextBlock', properties: { Text: '0SRL', Style: 'TitleSmall' } },
              { id: 'ct-1-count', type: 'TextBlock', properties: { Text: 'Checked out 2', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'ct-1-name', type: 'TextBlock', properties: { Text: 'Self-retracting lifeline', Style: 'BodyMedium' } },
            { id: 'ct-1-weight', type: 'TextBlock', properties: { Text: 'Weight: 10.0', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'ct-1-serials', type: 'TextBlock', properties: { Text: '00441, 00224', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'ct-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'ct-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'ct-2-code', type: 'TextBlock', properties: { Text: 'SCU8', Style: 'TitleSmall' } },
              { id: 'ct-2-count', type: 'TextBlock', properties: { Text: 'Checked out 4', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'ct-2-name', type: 'TextBlock', properties: { Text: '8" Urethane Caster with holding...', Style: 'BodyMedium' } },
            { id: 'ct-2-weight', type: 'TextBlock', properties: { Text: 'Weight: 10.8', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
      ]}
    ]}
  ]
}

// ─── 8. NAVIGATION DRAWER ────────────────────────────────────
const navigationDrawerScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'drawer-header', type: 'Border', properties: { Background: '#E0E0E0', Padding: '16' }, children: [
      { id: 'drawer-user', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '12' }, children: [
        { id: 'drawer-avatar', type: 'PersonPicture', properties: { DisplayName: 'William Smith', Width: '40' } },
        { id: 'drawer-name', type: 'TextBlock', properties: { Text: 'William Smith', Style: 'TitleMedium' } },
      ]},
    ]},
    { id: 'drawer-items', type: 'StackPanel', properties: { Spacing: '0' }, children: [
      { id: 'drawer-notifications', type: 'NavigationViewItem', properties: { Content: 'Notifications', Icon: '\ud83d\udce2' } },
      { id: 'drawer-settings', type: 'NavigationViewItem', properties: { Content: 'My Settings', Icon: '\u2699\ufe0f' } },
      { id: 'drawer-scan', type: 'NavigationViewItem', properties: { Content: 'Scan QR Code', Icon: '\ud83d\udcf7' } },
      { id: 'drawer-about', type: 'NavigationViewItem', properties: { Content: 'About', Icon: '\u2139\ufe0f' } },
    ]},
    { id: 'drawer-spacer', type: 'StackPanel', properties: { Spacing: '0' }, children: [] },
    { id: 'drawer-signout-section', type: 'Border', properties: { Background: '#E0E0E0', Padding: '12' }, children: [
      { id: 'drawer-signout', type: 'Button', properties: { Content: 'Sign Out', Style: 'Tonal', HorizontalAlignment: 'Stretch' } },
    ]},
  ]
}

// ─── 9. WHO AM I ─────────────────────────────────────────────
const whoAmIScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'whoami-toolbar', type: 'NavigationBar', properties: { Content: 'Who Am I', MainCommand: 'Back' }, children: [
      { id: 'whoami-done-btn', type: 'Button', properties: { Content: 'Done', Style: 'Text' } },
    ]},
    { id: 'whoami-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '12' }, children: [
      { id: 'whoami-username', type: 'TextBlock', properties: { Text: 'Username: first.last', Style: 'BodyMedium' } },
      { id: 'whoami-email', type: 'TextBlock', properties: { Text: 'Email: first.last@company.com', Style: 'BodyMedium' } },
      { id: 'whoami-role', type: 'TextBlock', properties: { Text: 'Role:', Style: 'BodyMedium' } },
      { id: 'whoami-permissions', type: 'TextBlock', properties: { Text: 'Permissions:', Style: 'BodyMedium' } },
      { id: 'whoami-offices-label', type: 'TextBlock', properties: { Text: 'Assigned to branch offices:', Style: 'BodyMedium' } },
      { id: 'whoami-offices', type: 'StackPanel', properties: { Spacing: '4', Padding: '16,0,0,0' }, children: [
        { id: 'whoami-office-1', type: 'TextBlock', properties: { Text: 'Portland', Style: 'BodyMedium', Foreground: '#49454F' } },
        { id: 'whoami-office-2', type: 'TextBlock', properties: { Text: 'Chicago', Style: 'BodyMedium', Foreground: '#49454F' } },
        { id: 'whoami-office-3', type: 'TextBlock', properties: { Text: 'Salt Lake City', Style: 'BodyMedium', Foreground: '#49454F' } },
      ]},
    ]}
  ]
}

// ─── 10. EDIT FORM (Parent pattern) ──────────────────────────
const editFormScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'form-toolbar', type: 'NavigationBar', properties: { Content: 'Parent', MainCommand: 'Close' }, children: [
      { id: 'form-error-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '20' } },
      { id: 'form-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'form-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'form-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'form-alpha', type: 'TextBox', properties: { Header: 'Alphanumeric (required)', PlaceholderText: 'Enter value' } },
        { id: 'form-files-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
          { id: 'form-files-label', type: 'TextBlock', properties: { Text: 'Files and pictures', Style: 'BodyMedium' } },
          { id: 'form-files-count', type: 'TextBlock', properties: { Text: '(6)', Style: 'BodyMedium', Foreground: '#49454F' } },
          { id: 'form-files-arrow', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '16' } },
        ]},
        { id: 'form-toggle-true', type: 'ToggleSwitch', properties: { Header: 'Must be turned true', IsOn: 'False' } },
        { id: 'form-toggle-false', type: 'ToggleSwitch', properties: { Header: 'Must be turned false', IsOn: 'True' } },
        { id: 'form-combobox-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
          { id: 'form-combo-label', type: 'TextBlock', properties: { Text: 'Combobox? Select widget (required)', Style: 'BodyMedium' } },
          { id: 'form-combo-arrow', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '16' } },
        ]},
        { id: 'form-divider-1', type: 'Divider', properties: {} },
        { id: 'form-min-date-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
          { id: 'form-min-date', type: 'TextBlock', properties: { Text: 'Minimum date (required)', Style: 'BodyMedium' } },
          { id: 'form-min-date-arrow', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '16' } },
          { id: 'form-min-date-error', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '16' } },
        ]},
        { id: 'form-max-date-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
          { id: 'form-max-date', type: 'TextBlock', properties: { Text: 'Maximum date (required)', Style: 'BodyMedium' } },
          { id: 'form-max-date-arrow', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '16' } },
          { id: 'form-max-date-error', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '16' } },
        ]},
        { id: 'form-divider-2', type: 'Divider', properties: {} },
        { id: 'form-numeric', type: 'TextBox', properties: { Header: 'Numeric value (nullable - required)', PlaceholderText: '0' } },
        { id: 'form-currency', type: 'TextBox', properties: { Header: 'Currency numeric (null - required)', PlaceholderText: '$0.00' } },
        { id: 'form-result', type: 'TextBlock', properties: { Text: 'Result of numeric * currency   $0', Style: 'BodyMedium', Foreground: '#49454F' } },
      ]}
    ]}
  ]
}

// ─── 11. INSPECTIONS LIST ────────────────────────────────────
const inspectionsListScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'insp-toolbar', type: 'NavigationBar', properties: { Content: 'Inspections', MainCommand: 'Back' }, children: [] },
    { id: 'insp-actions', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8', Padding: '8,8,8,0' }, children: [
      { id: 'insp-add-btn', type: 'Button', properties: { Content: '+ Add', Style: 'Outlined' } },
      { id: 'insp-edit-btn', type: 'Button', properties: { Content: 'Edit', Style: 'Outlined' } },
      { id: 'insp-delete-btn', type: 'Button', properties: { Content: 'Delete', Style: 'Outlined' } },
      { id: 'insp-filter-btn', type: 'Button', properties: { Content: 'Filter', Style: 'Tonal' } },
      { id: 'insp-refresh-btn', type: 'Button', properties: { Content: 'Refresh', Style: 'Outlined' } },
    ]},
    { id: 'insp-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'insp-list', type: 'ListView', properties: {}, children: [
        { id: 'insp-row-1', type: 'Card', properties: { Style: 'Filled', Padding: '12' }, children: [
          { id: 'insp-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'insp-1-name', type: 'TextBlock', properties: { Text: '6 month wood plank inspection', Style: 'BodyMedium' } },
            { id: 'insp-1-type', type: 'TextBlock', properties: { Text: 'Frequency', Style: 'BodySmall', Foreground: '#0005EE' } },
          ]},
        ]},
        { id: 'insp-row-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: 'insp-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'insp-2-name', type: 'TextBlock', properties: { Text: 'Daily Inspection', Style: 'BodyMedium' } },
            { id: 'insp-2-type', type: 'TextBlock', properties: { Text: 'Shift Change', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
        { id: 'insp-row-3', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: 'insp-3-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'insp-3-name', type: 'TextBlock', properties: { Text: 'Galvonic Inspection', Style: 'BodyMedium' } },
            { id: 'insp-3-active', type: 'TextBlock', properties: { Text: 'Yes', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'insp-3-type', type: 'TextBlock', properties: { Text: 'On-Demand', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
        { id: 'insp-row-4', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: 'insp-4-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'insp-4-name', type: 'TextBlock', properties: { Text: 'Swing Gate Validation', Style: 'BodyMedium' } },
            { id: 'insp-4-active', type: 'TextBlock', properties: { Text: 'Yes', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'insp-4-type', type: 'TextBlock', properties: { Text: 'On-Demand', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
        { id: 'insp-row-5', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: 'insp-5-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16' }, children: [
            { id: 'insp-5-name', type: 'TextBlock', properties: { Text: 'Weekly Inspection', Style: 'BodyMedium' } },
            { id: 'insp-5-active', type: 'TextBlock', properties: { Text: 'Yes', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'insp-5-type', type: 'TextBlock', properties: { Text: 'Frequency', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
      ]}
    ]},
    { id: 'insp-close-btn', type: 'Button', properties: { Content: 'Close', Style: 'Outlined', HorizontalAlignment: 'Right' } },
  ]
}

// ─── 12. VALIDATION POPUP ────────────────────────────────────
const validationPopupScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'val-toolbar', type: 'NavigationBar', properties: { Content: 'Settings', MainCommand: 'Close' }, children: [
      { id: 'val-error-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '20' } },
      { id: 'val-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'val-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
      { id: 'val-maps-toggle', type: 'ToggleSwitch', properties: { Header: 'Use Bing Maps', IsOn: 'True' } },
      { id: 'val-maps-key', type: 'TextBox', properties: { Header: 'Bing Maps Key', PlaceholderText: 'Enter API key' } },
      { id: 'val-date-field', type: 'TextBox', properties: { Header: 'Delete date on left', PlaceholderText: 'Select date' } },
      { id: 'val-divider', type: 'Divider', properties: {} },
      { id: 'val-popup', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
        { id: 'val-popup-title', type: 'TextBlock', properties: { Text: 'Validation', Style: 'TitleSmall' } },
        { id: 'val-items', type: 'StackPanel', properties: { Spacing: '8' }, children: [
          { id: 'val-item-1', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'val-item-1-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '18' } },
            { id: 'val-item-1-text', type: 'TextBlock', properties: { Text: 'Date is required', Style: 'BodyMedium' } },
          ]},
          { id: 'val-item-2', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'val-item-2-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '18' } },
            { id: 'val-item-2-text', type: 'TextBlock', properties: { Text: 'Bing Maps Key is required to be able to view satellite maps', Style: 'BodyMedium' } },
          ]},
          { id: 'val-item-3', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'val-item-3-icon', type: 'Icon', properties: { Glyph: 'AlertTriangle', Foreground: '#F9A825', FontSize: '18' } },
            { id: 'val-item-3-text', type: 'TextBlock', properties: { Text: 'This is a warning', Style: 'BodyMedium' } },
          ]},
          { id: 'val-item-4', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'val-item-4-icon', type: 'Icon', properties: { Glyph: 'Info', Foreground: '#1976D2', FontSize: '18' } },
            { id: 'val-item-4-text', type: 'TextBlock', properties: { Text: 'This is an info message', Style: 'BodyMedium' } },
          ]},
        ]},
      ]},
    ]}
  ]
}

// ─── 13. DELETE CONFIRMATION DIALOG ──────────────────────────
const deleteDialogScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'dialog-toolbar', type: 'NavigationBar', properties: { Content: 'Scaffold Details', MainCommand: 'Back' }, children: [] },
    { id: 'dialog-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '24' }, children: [
      { id: 'dialog-scaffold-info', type: 'TextBlock', properties: { Text: 'Scaffold S-00024 selected', Style: 'BodyLarge' } },
      { id: 'dialog-divider', type: 'Divider', properties: {} },
      { id: 'dialog-cannot-view', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
        { id: 'cv-title', type: 'TextBlock', properties: { Text: 'Cannot View', Style: 'TitleSmall' } },
        { id: 'cv-body', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '12' }, children: [
          { id: 'cv-icon', type: 'Icon', properties: { Glyph: 'Info', Foreground: '#1976D2', FontSize: '24' } },
          { id: 'cv-text', type: 'TextBlock', properties: { Text: 'You do not have permissions to view this item. Please contact your Avontus Site administrator.', Style: 'BodyMedium' } },
        ]},
        { id: 'cv-ok-btn', type: 'Button', properties: { Content: 'OK', Style: 'Filled', HorizontalAlignment: 'Center' } },
      ]},
      { id: 'dialog-delete', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
        { id: 'del-title', type: 'TextBlock', properties: { Text: 'Delete Scaffold', Style: 'TitleSmall' } },
        { id: 'del-body', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '12' }, children: [
          { id: 'del-icon', type: 'Icon', properties: { Glyph: 'AlertCircle', Foreground: '#49454F', FontSize: '24' } },
          { id: 'del-text', type: 'TextBlock', properties: { Text: 'Are you sure you want to delete this scaffold?', Style: 'BodyMedium' } },
        ]},
        { id: 'del-buttons', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16', HorizontalAlignment: 'Center' }, children: [
          { id: 'del-yes-btn', type: 'Button', properties: { Content: 'Yes, Delete', Style: 'Filled' } },
          { id: 'del-no-btn', type: 'Button', properties: { Content: 'No', Style: 'Outlined' } },
        ]},
      ]},
      { id: 'dialog-multi-edit', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
        { id: 'me-title', type: 'TextBlock', properties: { Text: 'Multi-Edit Result', Style: 'TitleSmall' } },
        { id: 'me-items', type: 'ListView', properties: {}, children: [
          { id: 'me-row-1', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'me-1-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F', FontSize: '16' } },
            { id: 'me-1-id', type: 'TextBlock', properties: { Text: 'S-00024', Style: 'BodyMedium' } },
            { id: 'me-1-msg', type: 'TextBlock', properties: { Text: 'Cannot change scaffold. Foreman is required.', Style: 'BodySmall', Foreground: '#D32F2F' } },
          ]},
          { id: 'me-row-2', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'me-2-icon', type: 'Icon', properties: { Glyph: 'Info', Foreground: '#1976D2', FontSize: '16' } },
            { id: 'me-2-id', type: 'TextBlock', properties: { Text: 'S-00026', Style: 'BodyMedium' } },
          ]},
          { id: 'me-row-3', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
            { id: 'me-3-icon', type: 'Icon', properties: { Glyph: 'Info', Foreground: '#1976D2', FontSize: '16' } },
            { id: 'me-3-id', type: 'TextBlock', properties: { Text: 'S-00028', Style: 'BodyMedium' } },
          ]},
        ]},
        { id: 'me-close-btn', type: 'Button', properties: { Content: 'Close', Style: 'Outlined', HorizontalAlignment: 'Right' } },
      ]},
    ]}
  ]
}

// ─── 14. DELIVERY CHECK-OUT (DEL-00772) ──────────────────────
const deliveryCheckoutScreen: ComponentNode = {
  id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
    { id: 'delco-toolbar', type: 'NavigationBar', properties: { Content: 'DEL-00772', MainCommand: 'Close' }, children: [
      { id: 'delco-save-icon', type: 'Icon', properties: { Glyph: 'Check', FontSize: '20' } },
    ]},
    { id: 'delco-scroll', type: 'ScrollViewer', properties: {}, children: [
      { id: 'delco-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
        { id: 'delco-employee', type: 'StackPanel', properties: { Spacing: '4' }, children: [
          { id: 'delco-name', type: 'TextBlock', properties: { Text: 'John Smith', Style: 'TitleMedium' } },
          { id: 'delco-company', type: 'TextBlock', properties: { Text: 'ExxonMobil Baton Rouge', Style: 'BodyMedium', Foreground: '#49454F' } },
        ]},
        { id: 'delco-products-label', type: 'TextBlock', properties: { Text: 'PRODUCTS', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: 'delco-products', type: 'ListView', properties: {}, children: [
          { id: 'dcp-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'dcp-1-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'dcp-1-code', type: 'TextBlock', properties: { Text: '0SRL', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'dcp-1-reserved', type: 'TextBlock', properties: { Text: 'Reserved 2', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'dcp-1-name', type: 'TextBlock', properties: { Text: 'Self-retracting lifeline', Style: 'BodyMedium' } },
            { id: 'dcp-1-weight', type: 'TextBlock', properties: { Text: 'Weight: 10.0', Style: 'BodySmall', Foreground: '#49454F' } },
            { id: 'dcp-1-serials', type: 'TextBlock', properties: { Text: '00441, 00224', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
          { id: 'dcp-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
            { id: 'dcp-2-header', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
              { id: 'dcp-2-code', type: 'TextBlock', properties: { Text: 'SCU8', Style: 'LabelMedium', Foreground: '#49454F' } },
              { id: 'dcp-2-reserved', type: 'TextBlock', properties: { Text: 'Reserved 42', Style: 'BodySmall', Foreground: '#49454F' } },
            ]},
            { id: 'dcp-2-name', type: 'TextBlock', properties: { Text: '8" Urethane Caster with holding...', Style: 'BodyMedium' } },
            { id: 'dcp-2-weight', type: 'TextBlock', properties: { Text: 'Weight: 10.8', Style: 'BodySmall', Foreground: '#49454F' } },
          ]},
        ]},
        { id: 'delco-consumables-label', type: 'TextBlock', properties: { Text: 'CONSUMABLES', Style: 'LabelMedium', Foreground: '#49454F' } },
      ]}
    ]}
  ]
}

// ─── EXPORT ALL SCREENS ──────────────────────────────────────
export const WIREFRAME_SCREENS: WireframeScreen[] = [
  {
    id: 'sign-in',
    label: 'Sign In',
    category: 'core',
    description: 'Login screen with username, password, connection settings, and copyright footer',
    tree: signInScreen,
  },
  {
    id: 'connection-settings',
    label: 'Connection Settings',
    category: 'core',
    description: 'Modal with remote server URL, SSL toggle, test connection, and validation popup',
    tree: connectionSettingsScreen,
  },
  {
    id: 'reservations-list',
    label: 'Reservations List',
    category: 'core',
    description: 'Branch office grouped list of delivery reservations with details',
    tree: reservationsListScreen,
  },
  {
    id: 'view-reservation',
    label: 'View Reservation',
    category: 'core',
    description: 'Read-only view of DEL-00756 with delivery metadata and products list',
    tree: viewReservationScreen,
  },
  {
    id: 'ship-reservation',
    label: 'Ship Reservation',
    category: 'core',
    description: 'Edit mode ship screen with shortage toggle, Ship All, and quantity steppers',
    tree: shipReservationScreen,
  },
  {
    id: 'jobsite',
    label: 'Jobsite',
    category: 'jobsite',
    description: 'Jobsite info card with badge/tool scanning instructions',
    tree: jobsiteScreen,
  },
  {
    id: 'check-in',
    label: 'Check In',
    category: 'jobsite',
    description: 'Employee check-in with scan, return all, and tools checked out list',
    tree: checkInScreen,
  },
  {
    id: 'delivery-checkout',
    label: 'Delivery Checkout',
    category: 'jobsite',
    description: 'DEL-00772 checkout with products and consumables sections',
    tree: deliveryCheckoutScreen,
  },
  {
    id: 'navigation-drawer',
    label: 'Navigation Drawer',
    category: 'patterns',
    description: 'Side menu with user info, notifications, settings, scan QR, and sign out',
    tree: navigationDrawerScreen,
  },
  {
    id: 'who-am-i',
    label: 'Who Am I',
    category: 'settings',
    description: 'User profile showing username, email, role, permissions, and branch offices',
    tree: whoAmIScreen,
  },
  {
    id: 'edit-form',
    label: 'Edit Form (Parent)',
    category: 'patterns',
    description: 'Complex edit form with text fields, toggles, dates, numeric inputs, and validation',
    tree: editFormScreen,
  },
  {
    id: 'inspections-list',
    label: 'Inspections List',
    category: 'settings',
    description: 'Data grid with Add/Edit/Delete/Filter toolbar and inspection rows',
    tree: inspectionsListScreen,
  },
  {
    id: 'validation-popup',
    label: 'Validation Popup',
    category: 'patterns',
    description: 'Settings form with validation popup showing error, warning, and info messages',
    tree: validationPopupScreen,
  },
  {
    id: 'dialogs',
    label: 'Dialogs & Confirmations',
    category: 'patterns',
    description: 'Permission denied, delete confirmation, and multi-edit result dialogs',
    tree: deleteDialogScreen,
  },
]

export function getScreensByCategory(category: WireframeScreen['category']): WireframeScreen[] {
  return WIREFRAME_SCREENS.filter(s => s.category === category)
}

export function getScreenById(id: string): WireframeScreen | undefined {
  return WIREFRAME_SCREENS.find(s => s.id === id)
}
