import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import MD3Renderer from '../src/md3/Renderer'
import { AVONTUS_TOKENS, normalizeDesignTokens, type ComponentNode } from '../src/types'
import { generateXaml, generateXamlReport } from '../src/services/xaml'
import { extractJsonObject, repairComponentTree, validateTreeStrict } from '../server/tree-schema.js'
import { createEmptyPage, normalizeVoiceTranscript, protectVoiceTreeProgress, resolveVoiceCommand } from '../server/voice-command-utils.js'
import { CORE_SYSTEM_SPEC } from '../server/prompt-layers/core-system-spec.js'
import { SCREEN_ARCHETYPE_LAYERS, detectArchetypeLayer } from '../server/prompt-layers/screen-archetypes.js'
import { COMPONENT_RULES } from '../server/prompt-layers/component-rules.js'
import { CRITIQUE_CHECKLIST_COMPACT, DESIGN_CRITIQUE_CHECKLIST } from '../server/prompt-layers/design-critique-checklist.js'
import { SCREEN_ARCHETYPES, detectArchetype } from '../server/screen-archetypes.js'

type TestCase = {
  name: string
  run: () => void
}

function validateXmlWithXmllint(name: string, xml: string): void {
  const dir = mkdtempSync(path.join(tmpdir(), 'uno-studio-xaml-'))
  const file = path.join(dir, `${name}.xaml`)
  writeFileSync(file, xml, 'utf8')

  try {
    const result = spawnSync('xmllint', ['--noout', file], { encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr || result.stdout || 'xmllint validation failed')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function normalizeSnapshotText(text: string): string {
  return text.replace(/\r\n/g, '\n').trim()
}

function hashText(text: string): string {
  return createHash('sha256').update(normalizeSnapshotText(text)).digest('hex')
}

function loadFixtureTree(name: string): ComponentNode {
  const fixturePath = path.resolve(process.cwd(), 'tests', 'fixtures', `${name}.tree.json`)
  const raw = readFileSync(fixturePath, 'utf8')
  return JSON.parse(raw) as ComponentNode
}

function wrapGeneratedPageForUno(xaml: string): string {
  if (!xaml.startsWith('<Page ')) {
    assert.fail('Uno smoke fixture expects generated XAML to have a Page root')
  }

  return xaml.replace('<Page ', '<Page x:Class="UnoSmoke.GeneratedPage" ')
}

function optionalUnoCompileSmoke(xaml: string): void {
  const required = process.env.UNO_SMOKE_REQUIRED === '1'
  const dotnet = spawnSync('dotnet', ['--version'], { encoding: 'utf8' })
  if (dotnet.status !== 0) {
    if (required) {
      assert.fail('Uno compile smoke required but dotnet is not available')
    }
    console.log('SKIP optional Uno compile smoke: dotnet not available')
    return
  }

  const fixtureDir = path.resolve(process.cwd(), 'tests', 'uno-smoke')
  const fixture = path.join(fixtureDir, 'UnoSmoke.csproj')
  if (!existsSync(fixture)) {
    const message = `Uno compile smoke fixture missing at ${fixture}`
    if (required) {
      assert.fail(message)
    }
    console.log(`SKIP optional Uno compile smoke: ${message}`)
    return
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), 'uno-smoke-fixture-'))
  cpSync(fixtureDir, tempDir, { recursive: true })
  writeFileSync(path.join(tempDir, 'GeneratedPage.xaml'), wrapGeneratedPageForUno(xaml), 'utf8')
  writeFileSync(
    path.join(tempDir, 'GeneratedPage.xaml.cs'),
    `using Microsoft.UI.Xaml.Controls;

namespace UnoSmoke;

public sealed partial class GeneratedPage : Page
{
    public GeneratedPage()
    {
        InitializeComponent();
    }
}
`,
    'utf8',
  )

  const objDir = path.join(tempDir, '.artifacts', 'obj')
  const binDir = path.join(tempDir, '.artifacts', 'bin')
  const build = spawnSync(
    'dotnet',
    [
      'build',
      'UnoSmoke.csproj',
      '-c',
      'Release',
      '-p:TargetFramework=net9.0-desktop',
      `-p:BaseIntermediateOutputPath=${objDir}${path.sep}`,
      `-p:OutputPath=${binDir}${path.sep}`,
      '-nologo',
    ],
    {
      cwd: tempDir,
      encoding: 'utf8',
    },
  )

  try {
    assert.equal(
      build.status,
      0,
      build.stderr || build.stdout || 'Uno compile smoke build failed',
    )
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

const modelResponse = `\`\`\`json
{
  "id": "ROOT PAGE",
  "type": "UnknownRoot",
  "properties": {
    "Background": "#FAFAFA",
    "Debug": {
      "bad": true
    }
  },
  "children": [
    {
      "id": "CTA",
      "type": "Button",
      "properties": {
        "Content": "Save & Ship",
        "IsEnabled": true,
        "Style": "Filled"
      }
    },
    {
      "id": "CTA",
      "type": "MysteryBox",
      "properties": {
        "Spacing": 16,
        "Custom": 9
      },
      "children": [
        {
          "id": "slider",
          "type": "Slider",
          "properties": {
            "Minimum": 5,
            "Maximum": 5,
            "Value": 5
          }
        }
      ]
    }
  ]
}
\`\`\``

const tests: TestCase[] = [
  {
    name: 'voice heuristics seed an ecommerce detail wireframe',
    run: () => {
      const result = resolveVoiceCommand({
        transcript: 'Let us make an ecommerce app with a big thumbnail image on top, full width.',
        currentTree: null,
        previousTree: null,
      })

      assert.equal(result.locallyHandled, true)
      const scroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      const hero = stack?.children?.find((child) => child.type === 'Image')
      assert.ok(hero)
      assert.equal(hero?.properties.Width, 'Fill')
      assert.equal(hero?.properties.HorizontalAlignment, 'Stretch')
      assert.ok(!result.tree.children?.some((child) => child.type === 'BottomNavigationBar'))
    },
  },
  {
    name: 'voice heuristics honor correction-heavy layout edits',
    run: () => {
      const base = createEmptyPage()
      base.children?.push({
        id: 'bottom-nav',
        type: 'BottomNavigationBar',
        properties: {},
        children: [],
      })
      const result = resolveVoiceCommand({
        transcript: 'Full width image on top. Remove the nav bar at the bottom. Add the close button on the top right. Left aligned description. Remove the blue button.',
        currentTree: base,
        previousTree: null,
      })

      assert.equal(result.locallyHandled, true)
      assert.ok(!result.tree.children?.some((child) => child.type === 'BottomNavigationBar'))
      const scroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      const header = stack?.children?.find((child) => child.id === 'header-actions')
      const hero = stack?.children?.find((child) => child.type === 'Image')
      const description = stack?.children?.find((child) => child.id === 'product-description')
      assert.equal(header?.properties.HorizontalAlignment, 'Right')
      assert.equal(hero?.properties.Width, 'Fill')
      assert.equal(description?.properties.HorizontalAlignment, 'Left')
    },
  },
  {
    name: 'voice heuristics undo to previous tree instantly',
    run: () => {
      const previous = createEmptyPage()
      const result = resolveVoiceCommand({
        transcript: 'No no, not that. You did not do what I asked.',
        currentTree: createEmptyPage(),
        previousTree: previous,
      })

      assert.equal(result.locallyHandled, true)
      assert.deepEqual(result.tree, previous)
      assert.ok(normalizeVoiceTranscript('Full width. Full width.').toLowerCase().includes('full width'))
    },
  },
  {
    name: 'voice progress guard blocks destructive rewrites for ambiguous edits',
    run: () => {
      const current = resolveVoiceCommand({
        transcript: 'Create an ecommerce app with a big thumbnail image on top, full width, title, subtitle, description, ratings, and reviews.',
        currentTree: null,
        previousTree: null,
      }).tree

      const candidate = createEmptyPage()
      const protectedResult = protectVoiceTreeProgress({
        currentTree: current,
        candidateTree: candidate,
        transcript: 'Change that',
        previousTree: null,
      })

      assert.equal(protectedResult.prevented, true)
      assert.deepEqual(protectedResult.tree, current)
    },
  },
  {
    name: 'voice progress guard allows explicit keep-only destructive edits',
    run: () => {
      const current = resolveVoiceCommand({
        transcript: 'Create an ecommerce app with a big thumbnail image on top, full width, title, subtitle, description, ratings, and reviews.',
        currentTree: null,
        previousTree: null,
      }).tree

      const candidate = createEmptyPage()
      const protectedResult = protectVoiceTreeProgress({
        currentTree: current,
        candidateTree: candidate,
        transcript: 'Keep only the image',
        previousTree: null,
      })

      assert.equal(protectedResult.prevented, false)
      assert.deepEqual(protectedResult.tree, candidate)
    },
  },
  {
    name: 'voice target memory removes the last targeted element',
    run: () => {
      const current = resolveVoiceCommand({
        transcript: 'Create an ecommerce app with title, description, ratings, and reviews.',
        currentTree: null,
        previousTree: null,
      }).tree

      const result = resolveVoiceCommand({
        transcript: 'Remove that',
        currentTree: current,
        previousTree: null,
        lastTargetIds: ['reviews-list'],
      })

      assert.equal(result.locallyHandled, true)
      const reviews = result.tree.children?.flatMap((child) => child.children || []).find((child) => child.id === 'reviews-list')
      assert.equal(reviews, undefined)
    },
  },
  {
    name: 'voice target memory resizes the last targeted element',
    run: () => {
      const current = resolveVoiceCommand({
        transcript: 'Create an ecommerce app with a big thumbnail image on top, full width.',
        currentTree: null,
        previousTree: null,
      }).tree

      const result = resolveVoiceCommand({
        transcript: 'Make that smaller',
        currentTree: current,
        previousTree: null,
        lastTargetIds: ['hero-image'],
      })

      assert.equal(result.locallyHandled, true)
      const scroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      const hero = stack?.children?.find((child) => child.id === 'hero-image')
      assert.ok(hero)
      assert.equal(hero?.properties.Height, '225')
    },
  },
  {
    name: 'voice heuristics build a realistic dashboard table from spoken constraints',
    run: () => {
      const result = resolveVoiceCommand({
        transcript: 'Make a mobile dashboard with a really complex table. Ten rows and five columns. Use real fake data, make it scrollable, remove the picture, and remove the bottom navigation.',
        currentTree: null,
        previousTree: null,
      })

      assert.equal(result.locallyHandled, true)
      const scroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      const table = stack?.children?.find((child) => child.id === 'dashboard-data-table')
      assert.ok(table)
      assert.equal(table?.type, 'DataTable')
      assert.equal(table?.properties.Scrollable, 'True')
      assert.equal(table?.children?.length, 5)
      const rows = JSON.parse(table?.properties.RowsJson || '[]')
      assert.equal(rows.length, 10)
      assert.match(String(rows[0]?.Order || ''), /^ORD-\d+/)
      assert.ok(!stack?.children?.some((child) => child.type === 'Image'))
      assert.ok(!result.tree.children?.some((child) => child.type === 'BottomNavigationBar'))
      assert.deepEqual(result.targetIds, ['dashboard-data-table'])
    },
  },
  {
    name: 'data table preview renders stored rows instead of placeholder row labels',
    run: () => {
      const tree = resolveVoiceCommand({
        transcript: 'Make a mobile dashboard with a really complex table. Ten rows and five columns. Use real fake data and make it scrollable.',
        currentTree: null,
        previousTree: null,
      }).tree

      const html = renderToStaticMarkup(
        React.createElement(MD3Renderer, {
          node: tree,
          tokens: normalizeDesignTokens(AVONTUS_TOKENS),
          selectedId: null,
          onSelect: () => {},
        }),
      )

      assert.ok(html.includes('ORD-2048'))
      assert.ok(html.includes('West Harbor'))
      assert.ok(!html.includes('Row 1'))
    },
  },
  {
    name: 'voice heuristics build a structured paywall with cards, gallery, reviews, stats, about, and bottom nav',
    run: () => {
      const result = resolveVoiceCommand({
        transcript: 'Let us make a complex paywall. We have three packages with price comparison. No table needed, only cards. The pro package needs to stand out. We need a huge description, a gallery of pictures below it, reviews below that, big stats below the reviews, an about section, and a bottom navigation with five tabs.',
        currentTree: null,
        previousTree: null,
      })

      assert.equal(result.locallyHandled, true)
      const scroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      assert.ok(stack)
      const childIds = (stack?.children || []).map((child) => child.id)
      assert.ok(childIds.includes('paywall-pricing-section'))
      assert.ok(childIds.includes('paywall-description'))
      assert.ok(childIds.includes('paywall-gallery'))
      assert.ok(childIds.includes('reviews-list'))
      assert.ok(childIds.includes('paywall-stats'))
      assert.ok(childIds.includes('paywall-about'))
      const pricing = stack?.children?.find((child) => child.id === 'paywall-pricing-section')
      const proCard = pricing?.children?.find((child) => child.id === 'paywall-pro-card')
      assert.ok(proCard)
      assert.equal(proCard?.properties.Highlighted, 'True')
      assert.equal(proCard?.properties.BorderBrush, '#0005EE')
      assert.ok(!stack?.children?.some((child) => child.type === 'DataTable'))
      const bottomNav = result.tree.children?.find((child) => child.id === 'bottom-nav')
      assert.ok(bottomNav)
      assert.equal(bottomNav?.children?.length, 5)
      const stats = stack?.children?.find((child) => child.id === 'paywall-stats')
      const firstStat = stats?.children?.[0]
      assert.equal(firstStat?.properties.Height, '150')
    },
  },
  {
    name: 'voice target memory can move the paywall close button back to the right',
    run: () => {
      const current = resolveVoiceCommand({
        transcript: 'Create a paywall with a close button on the top right.',
        currentTree: null,
        previousTree: null,
      }).tree

      const scroll = current.children?.find((child) => child.type === 'ScrollViewer')
      const stack = scroll?.children?.find((child) => child.type === 'StackPanel')
      const header = stack?.children?.find((child) => child.id === 'header-actions')
      if (header) header.properties = { ...header.properties, HorizontalAlignment: 'Left' }

      const result = resolveVoiceCommand({
        transcript: 'Move it to the right.',
        currentTree: current,
        previousTree: null,
        lastTargetIds: ['header-actions', 'close-button'],
      })

      const resultScroll = result.tree.children?.find((child) => child.type === 'ScrollViewer')
      const resultStack = resultScroll?.children?.find((child) => child.type === 'StackPanel')
      const movedHeader = resultStack?.children?.find((child) => child.id === 'header-actions')
      assert.equal(movedHeader?.properties.HorizontalAlignment, 'Right')
    },
  },
  {
    name: 'repairs malformed model output into strict tree schema',
    run: () => {
      const parsed = extractJsonObject(modelResponse)
      const repaired = repairComponentTree(parsed)
      validateTreeStrict(repaired.tree)

      assert.equal(repaired.tree.type, 'Page')
      assert.equal(repaired.tree.id, 'page-root')
      assert.equal(repaired.tree.properties.Background, '#FAFAFA')
      assert.equal(repaired.tree.children?.[0].properties.IsEnabled, 'True')
      assert.equal(repaired.tree.children?.[1].type, 'StackPanel')
      assert.ok((repaired.tree.children?.[1].id || '').startsWith('cta-'))
      assert.ok(repaired.repairs.length > 0)
    },
  },
  {
    name: 'applies material defaults for sparse trees',
    run: () => {
      const sparse = {
        id: 'page-root',
        type: 'Page',
        properties: {},
        children: [
          {
            id: 'container',
            type: 'StackPanel',
            properties: {},
            children: [
              { id: 'title', type: 'TextBlock', properties: { Text: 'Reservation details' } },
              { id: 'action', type: 'Button', properties: { Content: 'Create reservation' } },
              { id: 'card-1', type: 'Card', properties: {}, children: [] },
            ],
          },
        ],
      }

      const repaired = repairComponentTree(sparse)
      validateTreeStrict(repaired.tree)

      const container = repaired.tree.children?.[0]
      assert.ok(container)
      assert.equal(container?.properties.Spacing, '12')
      assert.equal(container?.properties.Padding, '24')
      assert.equal(container?.children?.[0].properties.Style, 'BodyLarge')
      assert.equal(container?.children?.[1].properties.Style, 'Filled')
      assert.equal(container?.children?.[2].properties.Style, 'Elevated')
      assert.equal(container?.children?.[2].properties.Padding, '16')
    },
  },
  {
    name: 'normalizes quantity stepper rows to horizontal material controls',
    run: () => {
      const stepperTree = {
        id: 'page-root',
        type: 'Page',
        properties: {},
        children: [
          {
            id: 'stepper-row',
            type: 'StackPanel',
            properties: {},
            children: [
              { id: 'minus', type: 'Button', properties: { Content: '-' } },
              { id: 'qty', type: 'TextBox', properties: { Text: '8', Header: 'Shortage quantity' } },
              { id: 'plus', type: 'Button', properties: { Content: '+' } },
            ],
          },
        ],
      }

      const repaired = repairComponentTree(stepperTree)
      validateTreeStrict(repaired.tree)
      const row = repaired.tree.children?.[0]

      assert.ok(row)
      assert.equal(row?.properties.Orientation, 'Horizontal')
      assert.equal(row?.children?.[0].properties.Width, '36')
      assert.equal(row?.children?.[2].properties.Width, '36')
      assert.equal(row?.children?.[1].properties.Width, '76')
    },
  },
  {
    name: 'renders repaired tree without NaN or Infinity values',
    run: () => {
      const parsed = extractJsonObject(modelResponse)
      const { tree } = repairComponentTree(parsed)
      validateTreeStrict(tree)

      const tokens = normalizeDesignTokens(AVONTUS_TOKENS)
      const html = renderToStaticMarkup(
        React.createElement(MD3Renderer, {
          node: tree,
          tokens,
          selectedId: null,
          onSelect: () => {},
        }),
      )

      assert.ok(html.includes('data-component-id="page-root"'))
      assert.ok(html.includes('Save &amp; Ship'))
      assert.equal(html.includes('NaN'), false)
      assert.equal(html.includes('Infinity'), false)
    },
  },
  {
    name: 'exports root properties and escapes XAML attributes',
    run: () => {
      const tree: ComponentNode = {
        id: 'page-root',
        type: 'Page',
        properties: { Background: '#FFFFFF' },
        children: [
          {
            id: 'title',
            type: 'TextBlock',
            properties: {
              Text: 'A & B "C"',
              Style: 'TitleMedium',
            },
          },
        ],
      }

      const xaml = generateXaml(tree, AVONTUS_TOKENS)
      assert.ok(xaml.startsWith('<Page '))
      assert.ok(xaml.includes('xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"'))
      assert.ok(xaml.includes('Background="#FFFFFF"'))
      assert.ok(xaml.includes('Text="A &amp; B &quot;C&quot;"'))
      assert.ok(xaml.includes('<Page.Resources>'))
      assert.ok(xaml.includes('x:Name="PageRoot"'))
      assert.ok(xaml.includes('AutomationProperties.AutomationId="page-root"'))
      validateXmlWithXmllint('root-export', xaml)
    },
  },
  {
    name: 'emits token resources and production hooks for action controls',
    run: () => {
      const tree: ComponentNode = {
        id: 'page-root',
        type: 'Page',
        properties: { Background: '#FFFFFF' },
        children: [
          {
            id: 'save-button',
            type: 'Button',
            properties: {
              Content: 'Save order',
              Style: 'Filled',
            },
          },
        ],
      }

      const report = generateXamlReport(tree, AVONTUS_TOKENS)
      assert.ok(report.xaml.includes('SolidColorBrush x:Key="PrimaryBrush"'))
      assert.ok(report.xaml.includes('<x:Double x:Key="TouchTargetSize">48</x:Double>'))
      assert.ok(report.xaml.includes('Style x:Key="FilledButtonStyle"'))
      assert.ok(report.xaml.includes('x:Uid="save-button"'))
      assert.ok(report.xaml.includes('AutomationProperties.AutomationId="save-button"'))
      assert.ok(report.xaml.includes('Command="{Binding SaveOrderCommand}"'))
      assert.ok(report.bindingHints.some((hint) => hint.path === 'SaveOrderCommand'))
      validateXmlWithXmllint('token-resources', report.xaml)
    },
  },
  {
    name: 'emits control-aware navigation and list scaffolding',
    run: () => {
      const tree: ComponentNode = {
        id: 'page-root',
        type: 'Page',
        properties: { Background: '#FFFFFF' },
        children: [
          {
            id: 'screen-toolbar',
            type: 'NavigationBar',
            properties: { Content: 'Ship reservation', MainCommand: 'Close' },
            children: [
              { id: 'toolbar-warning', type: 'Icon', properties: { Glyph: 'AlertTriangle' } },
              { id: 'toolbar-save', type: 'Icon', properties: { Glyph: 'Check' } },
            ],
          },
          {
            id: 'list',
            type: 'ListView',
            properties: {},
            children: [
              {
                id: 'card-1',
                type: 'Card',
                properties: { Style: 'Outlined', Padding: '16' },
                children: [
                  { id: 'card-title', type: 'TextBlock', properties: { Text: 'Products to ship', Style: 'TitleMedium' } },
                  { id: 'card-copy', type: 'TextBlock', properties: { Text: 'Standard Frame 48x24', Style: 'BodyMedium' } },
                ],
              },
            ],
          },
          {
            id: 'bottom-nav',
            type: 'BottomNavigationBar',
            properties: {},
            children: [
              { id: 'home-tab', type: 'NavigationViewItem', properties: { Content: 'Home', Icon: 'Home', IsSelected: 'True' } },
              { id: 'orders-tab', type: 'NavigationViewItem', properties: { Content: 'Orders', Icon: 'ShoppingCart' } },
            ],
          },
        ],
      }

      const xaml = generateXaml(tree, AVONTUS_TOKENS)
      assert.ok(xaml.includes('Grid.RowDefinitions'))
      assert.ok(xaml.includes('Ship reservation'))
      assert.ok(xaml.includes('GeneratedOutlinedCardBorderStyle'))
      assert.ok(xaml.includes('<ListView '))
      assert.ok(xaml.includes('BottomNavigationBar') === false)
      assert.ok(xaml.includes('Products to ship'))
      validateXmlWithXmllint('navigation-list', xaml)
    },
  },
  {
    name: 'reports explicit conversion diagnostics for degraded surfaces',
    run: () => {
      const tree: ComponentNode = {
        id: 'page-root',
        type: 'Page',
        properties: { Background: '#FFFFFF' },
        children: [
          {
            id: 'legacy-surface',
            type: 'Border',
            properties: {
              _OriginalType: 'MysteryPanel',
              _FallbackReason: 'unsupported-component-type',
            },
            children: [
              { id: 'legacy-copy', type: 'TextBlock', properties: { Text: 'Recovered content', Style: 'BodyMedium' } },
            ],
          },
          {
            id: 'dialog-surface',
            type: 'Dialog',
            properties: { Title: 'Delete item', Padding: '24' },
            children: [
              { id: 'dialog-copy', type: 'TextBlock', properties: { Text: 'Are you sure?', Style: 'BodyMedium' } },
            ],
          },
        ],
      }

      const report = generateXamlReport(tree, AVONTUS_TOKENS)
      assert.ok(report.diagnostics.some((diagnostic) => diagnostic.code === 'XAML001'))
      assert.ok(report.diagnostics.some((diagnostic) => diagnostic.code === 'XAML201'))
      assert.ok(report.xaml.includes('<!-- Uno Studio XAML diagnostics -->'))
      validateXmlWithXmllint('diagnostics', report.xaml)
    },
  },
  {
    name: 'preserves key content across html preview and xaml export',
    run: () => {
      const tree: ComponentNode = {
        id: 'page-root',
        type: 'Page',
        properties: {},
        children: [
          {
            id: 'ship-toolbar',
            type: 'NavigationBar',
            properties: { Content: 'Ship reservation', MainCommand: 'Close' },
            children: [],
          },
          {
            id: 'ship-content',
            type: 'StackPanel',
            properties: { Padding: '16', Spacing: '16' },
            children: [
              { id: 'ship-action', type: 'Button', properties: { Content: 'Ship all', Style: 'Tonal' } },
              { id: 'ship-title', type: 'TextBlock', properties: { Text: 'Products to ship', Style: 'TitleMedium' } },
            ],
          },
        ],
      }

      const tokens = normalizeDesignTokens(AVONTUS_TOKENS)
      const html = renderToStaticMarkup(
        React.createElement(MD3Renderer, {
          node: tree,
          tokens,
          selectedId: null,
          onSelect: () => {},
        }),
      )
      const xaml = generateXaml(tree, tokens)

      for (const phrase of ['Ship reservation', 'Ship all', 'Products to ship']) {
        assert.ok(html.includes(phrase), `HTML missing phrase: ${phrase}`)
        assert.ok(xaml.includes(phrase), `XAML missing phrase: ${phrase}`)
      }

      validateXmlWithXmllint('html-xaml-parity', xaml)
    },
  },
  {
    name: 'golden shipping workflow export remains stable',
    run: () => {
      const tree = loadFixtureTree('golden-shipping-workflow')
      const tokens = normalizeDesignTokens(AVONTUS_TOKENS)
      const html = renderToStaticMarkup(
        React.createElement(MD3Renderer, {
          node: tree,
          tokens,
          selectedId: null,
          onSelect: () => {},
        }),
      )
      const report = generateXamlReport(tree, tokens)

      assert.deepEqual(
        report.diagnostics.map(({ code, severity, nodeId }) => ({ code, severity, nodeId })),
        [],
      )
      assert.ok(report.xaml.includes('Ship reservation'))
      assert.ok(report.xaml.includes('Products to ship'))
      assert.ok(report.xaml.includes('Command="{Binding ShipAllCommand}"'))
      assert.ok(report.xaml.includes('Command="{Binding NextCommand}"'))
      assert.ok(report.xaml.includes('GeneratedFilledCardBorderStyle'))
      assert.ok(report.xaml.includes('GeneratedOutlinedCardBorderStyle'))
      validateXmlWithXmllint('golden-shipping-workflow', report.xaml)

      assert.equal(
        hashText(html),
        'c6c9394a174b24e53e58564e27e46a8f489c4d6e2b65c1be73afbd2385804340',
        'Golden HTML snapshot drifted for shipping workflow fixture',
      )
      assert.equal(
        hashText(report.xaml),
        'c5ffb64d5af72b7346e478a8bdb3adab5c9655c600d5cc446d26da983fbfc7e7',
        'Golden XAML snapshot drifted for shipping workflow fixture',
      )
    },
  },
  {
    name: 'pipeline prompt->tree->preview->xaml remains functional',
    run: () => {
      const parsed = extractJsonObject(modelResponse)
      const repaired = repairComponentTree(parsed)
      validateTreeStrict(repaired.tree)

      const tokens = normalizeDesignTokens(AVONTUS_TOKENS)
      const html = renderToStaticMarkup(
        React.createElement(MD3Renderer, {
          node: repaired.tree,
          tokens,
          selectedId: repaired.tree.children?.[0].id || null,
          onSelect: () => {},
        }),
      )
      const xaml = generateXaml(repaired.tree, tokens)

      assert.ok(html.includes('data-component-id='))
      assert.ok(xaml.includes('<Page '))
      assert.ok(xaml.includes('<Button'))
      validateXmlWithXmllint('pipeline', xaml)
      optionalUnoCompileSmoke(xaml)
    },
  },

  // ─── Prompt Layer Snapshot Tests ───────────────────────────────

  {
    name: 'archetype detection covers all 8 screen types',
    run: () => {
      const cases: Array<[string, string]> = [
        ['Show me a login screen', 'login'],
        ['Create a sign in page', 'login'],
        ['Build an empty state for no reservations', 'empty-state'],
        ['Design a settings page with toggles', 'settings'],
        ['Create a dashboard with KPIs', 'dashboard'],
        ['Show operations overview', 'dashboard'],
        ['Build a reservation detail view', 'detail-view'],
        ['Create a new reservation form', 'form-input'],
        ['Add a booking form', 'form-input'],
        ['Show a list of reservations', 'list-browse'],
        ['Browse equipment inventory', 'list-browse'],
        ['Multi-step wizard for checkout', 'workflow'],
      ]

      for (const [prompt, expected] of cases) {
        const result = detectArchetypeLayer(prompt)
        assert.equal(result, expected, `detectArchetypeLayer("${prompt}") = "${result}", expected "${expected}"`)
      }
    },
  },
  {
    name: 'old archetype detector agrees with new layer detector on shared keys',
    run: () => {
      const prompts = [
        'login screen',
        'empty state page',
        'settings preferences',
        'dashboard overview',
        'detail view',
        'create new form',
        'list of orders',
      ]

      for (const prompt of prompts) {
        const oldResult = detectArchetype(prompt)
        const newResult = detectArchetypeLayer(prompt)
        assert.equal(oldResult, newResult, `Archetype mismatch for "${prompt}": old="${oldResult}" vs new="${newResult}"`)
      }
    },
  },
  {
    name: 'archetype detection returns null for generic prompts',
    run: () => {
      assert.equal(detectArchetypeLayer('Make something cool'), null)
      assert.equal(detectArchetypeLayer('Design a beautiful UI'), null)
      assert.equal(detectArchetypeLayer(''), null)
      assert.equal(detectArchetypeLayer(null as any), null)
    },
  },
  {
    name: 'all 8 archetype layers exist and have content',
    run: () => {
      const expectedKeys = ['login', 'empty-state', 'settings', 'dashboard', 'detail-view', 'form-input', 'list-browse', 'workflow']
      for (const key of expectedKeys) {
        const layer = SCREEN_ARCHETYPE_LAYERS[key]
        assert.ok(layer, `Missing archetype layer: ${key}`)
        assert.ok(layer.length > 50, `Archetype layer "${key}" is too short (${layer.length} chars)`)
      }
    },
  },
  {
    name: 'core prompt layers have stable content hashes',
    run: () => {
      // Hardcoded snapshot hashes — these catch unintended drift in prompt content.
      // If you intentionally change a layer, run the test, read the "actual" hash
      // from the failure message, and update the expected hash here.
      assert.equal(
        hashText(CORE_SYSTEM_SPEC),
        'ccdc4c3eef79c6c4871cec7767d912e9fefbaa8b817109ce3d6ad0c58f823820',
        'Core system spec hash changed — update snapshot if intentional'
      )
      assert.equal(
        hashText(COMPONENT_RULES),
        '73927285b96d47e198da2e7b39f867ca11bdad0dd3e4757fe247a627b068d94d',
        'Component rules hash changed — update snapshot if intentional'
      )
      assert.equal(
        hashText(CRITIQUE_CHECKLIST_COMPACT),
        '974197bda0587cd13b069ae28df73ef85fef78f395288b9b1ddaa2ecd80eef08',
        'Critique checklist hash changed — update snapshot if intentional'
      )

      // Verify layers are non-empty
      assert.ok(CORE_SYSTEM_SPEC.length > 100, 'Core system spec is too short')
      assert.ok(COMPONENT_RULES.length > 100, 'Component rules are too short')
      assert.ok(CRITIQUE_CHECKLIST_COMPACT.length > 100, 'Critique checklist is too short')
      assert.ok(DESIGN_CRITIQUE_CHECKLIST.length > 100, 'Full design critique is too short')
    },
  },
  {
    name: 'prompt layers contain required brand elements',
    run: () => {
      // Core system spec must reference brand color and font
      assert.ok(CORE_SYSTEM_SPEC.includes('#0005EE'), 'Core spec missing primary brand color')
      assert.ok(CORE_SYSTEM_SPEC.includes('DM Sans'), 'Core spec missing brand font')
      assert.ok(CORE_SYSTEM_SPEC.includes('4px'), 'Core spec missing spacing grid')
      assert.ok(CORE_SYSTEM_SPEC.includes('Sentence case'), 'Core spec missing sentence case rule')

      // Component rules must cover key components
      assert.ok(COMPONENT_RULES.includes('btn-filled'), 'Component rules missing btn-filled')
      assert.ok(COMPONENT_RULES.includes('.field'), 'Component rules missing field wrapper')
      assert.ok(COMPONENT_RULES.includes('.msi'), 'Component rules missing icon class')

      // Critique checklist must have self-check items
      assert.ok(CRITIQUE_CHECKLIST_COMPACT.includes('SELF-CHECK'), 'Critique missing SELF-CHECK header')
      assert.ok(CRITIQUE_CHECKLIST_COMPACT.includes('VISUAL BUG CHECK'), 'Critique missing VISUAL BUG CHECK')
    },
  },
  {
    name: 'screen archetype layers contain layout skeletons and anti-patterns',
    run: () => {
      const keysWithAntiPatterns = ['dashboard', 'list-browse', 'form-input', 'detail-view', 'login']
      for (const key of keysWithAntiPatterns) {
        const layer = SCREEN_ARCHETYPE_LAYERS[key]
        assert.ok(layer.includes('ANTI-PATTERNS'), `Archetype "${key}" missing ANTI-PATTERNS section`)
      }

      // All archetypes should have layout skeleton
      const allKeys = Object.keys(SCREEN_ARCHETYPE_LAYERS)
      for (const key of allKeys) {
        const layer = SCREEN_ARCHETYPE_LAYERS[key]
        assert.ok(
          layer.includes('Layout skeleton') || layer.includes('layout skeleton'),
          `Archetype "${key}" missing layout skeleton`
        )
      }
    },
  },
  {
    name: 'old archetype system has matching keys for all new archetype keys',
    run: () => {
      // The old SCREEN_ARCHETYPES should have entries for the same keys the new system uses
      // (except 'workflow' which was added in the new system)
      const sharedKeys = ['dashboard', 'list-browse', 'form-input', 'detail-view', 'settings', 'login', 'empty-state']
      for (const key of sharedKeys) {
        assert.ok(SCREEN_ARCHETYPES[key], `Old SCREEN_ARCHETYPES missing key: ${key}`)
        assert.ok(SCREEN_ARCHETYPE_LAYERS[key], `New SCREEN_ARCHETYPE_LAYERS missing key: ${key}`)
      }
    },
  },
  {
    name: 'web design prompt assembles all 4 layers for dashboard prompt',
    run: () => {
      // Simulate what generateWebDesign does for prompt assembly
      const prompt = 'Create a dashboard with KPIs and activity feed'
      const archetypeKey = detectArchetypeLayer(prompt)
      assert.equal(archetypeKey, 'dashboard')

      // Build user message the same way the real code does
      let userMsg = ''
      userMsg += CORE_SYSTEM_SPEC + '\n\n'
      if (archetypeKey) userMsg += SCREEN_ARCHETYPE_LAYERS[archetypeKey] + '\n\n'
      userMsg += COMPONENT_RULES + '\n\n'
      userMsg += `Create the most beautiful, production-quality design for this screen: ${prompt}`
      userMsg += '\n' + CRITIQUE_CHECKLIST_COMPACT

      // Verify all 4 layers present
      assert.ok(userMsg.includes('DM Sans'), 'Assembled prompt missing Layer 1 (core spec)')
      assert.ok(userMsg.includes('Dashboard-specific'), 'Assembled prompt missing Layer 2 (archetype)')
      assert.ok(userMsg.includes('btn-filled'), 'Assembled prompt missing Layer 3 (component rules)')
      assert.ok(userMsg.includes('SELF-CHECK'), 'Assembled prompt missing Layer 4 (critique)')
    },
  },
  {
    name: 'web design prompt skips archetype layer for generic prompt',
    run: () => {
      const prompt = 'Design a beautiful screen for my app'
      const archetypeKey = detectArchetypeLayer(prompt)
      assert.equal(archetypeKey, null)

      let userMsg = ''
      userMsg += CORE_SYSTEM_SPEC + '\n\n'
      if (archetypeKey) userMsg += SCREEN_ARCHETYPE_LAYERS[archetypeKey] + '\n\n'
      userMsg += COMPONENT_RULES + '\n\n'
      userMsg += `Create the most beautiful, production-quality design for this screen: ${prompt}`
      userMsg += '\n' + CRITIQUE_CHECKLIST_COMPACT

      // Layer 1, 3, 4 present; Layer 2 absent
      assert.ok(userMsg.includes('DM Sans'), 'Missing Layer 1')
      assert.ok(!userMsg.includes('Dashboard-specific'), 'Should NOT have dashboard archetype')
      assert.ok(!userMsg.includes('Forms and lists-specific'), 'Should NOT have form archetype')
      assert.ok(userMsg.includes('btn-filled'), 'Missing Layer 3')
      assert.ok(userMsg.includes('SELF-CHECK'), 'Missing Layer 4')
    },
  },
  {
    name: 'prompt assembly for all screen types produces unique archetype content',
    run: () => {
      const testPrompts: Array<[string, string]> = [
        ['Show me a login screen', 'login'],
        ['Build an empty state', 'empty-state'],
        ['Design a settings page', 'settings'],
        ['Create a dashboard', 'dashboard'],
        ['Show reservation details', 'detail-view'],
        ['Create a new reservation form', 'form-input'],
        ['Browse reservations list', 'list-browse'],
        ['Multi-step checkout wizard', 'workflow'],
      ]

      const assembledPrompts: string[] = []
      for (const [prompt, expectedKey] of testPrompts) {
        const key = detectArchetypeLayer(prompt)
        assert.equal(key, expectedKey, `Wrong archetype for "${prompt}"`)

        let userMsg = CORE_SYSTEM_SPEC + '\n\n'
        if (key) userMsg += SCREEN_ARCHETYPE_LAYERS[key] + '\n\n'
        userMsg += COMPONENT_RULES + '\n\n'
        userMsg += prompt
        userMsg += '\n' + CRITIQUE_CHECKLIST_COMPACT

        assembledPrompts.push(userMsg)
      }

      // Each assembled prompt should be unique (different archetype layer)
      const hashes = assembledPrompts.map(hashText)
      const uniqueHashes = new Set(hashes)
      assert.equal(uniqueHashes.size, assembledPrompts.length, 'Some screen type prompts produced identical content')
    },
  },
]

let passed = 0

for (const test of tests) {
  try {
    test.run()
    passed += 1
    console.log(`PASS ${test.name}`)
  } catch (error) {
    console.error(`FAIL ${test.name}`)
    throw error
  }
}

console.log(`\n${passed}/${tests.length} regression tests passed.`)
