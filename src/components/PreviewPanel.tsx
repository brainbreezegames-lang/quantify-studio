import { Smartphone, Monitor, Tablet, Loader2, Undo2, Redo2, Download, Code2 } from 'lucide-react'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import html2canvas from 'html2canvas'
import { createPortal } from 'react-dom'
import { v4 as uuid } from 'uuid'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useAppState, useAppDispatch } from '../store'
import MD3Renderer from '../md3/Renderer'
import { createDefaultComponent, assignIds } from '../types'
import type { DesignTokens, DesignBrief, QualityToggles, WebDesign, ComponentType, ComponentNode } from '../types'
import { generateScreen } from '../services/api'
import { PALETTE_PRESETS, PATTERN_PRESETS } from '../palette-presets'
import { getIframeEditScript } from '../utils/iframe-edit-script'
import { useWebEdit } from '../contexts/WebEditContext'
import type { WebElementInfo } from '../contexts/WebEditContext'

const CONTAINER_TYPES_DROP = new Set([
  'Page', 'StackPanel', 'Grid', 'ScrollViewer', 'Border', 'Card', 'ListView', 'GridView',
])

function findNodeById(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

const ALL_PRESETS = [...PALETTE_PRESETS, ...PATTERN_PRESETS]

type DeviceFrame = 'phone' | 'tablet' | 'desktop'

const DEVICE_SIZES: Record<DeviceFrame, { width: number; height: number }> = {
  phone: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
}

function IsolatedFrame({ children, width, height }: { children: React.ReactNode; width: number; height: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [frameState, setFrameState] = useState<{
    mountNode: HTMLElement
    cache: ReturnType<typeof createCache>
  } | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    doc.open()
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
<style>
html,body,#mount{margin:0;padding:0;width:100%;height:100%;overflow:auto;position:relative;
-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{font-family:"Switzer","Segoe UI",Roboto,system-ui,-apple-system,sans-serif;background:#fff}
</style>
<script type="importmap">
  {
    "imports": {
      "@material/web/": "https://esm.run/@material/web/"
    }
  }
</script>
<script type="module">
  import '@material/web/all.js';
  import {styles as typescaleStyles} from 'https://esm.run/@material/web/typography/md-typescale-styles.js';
  document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
</script>
</head>
<body><div id="mount"></div></body>
</html>`)
    doc.close()

    const mountNode = doc.getElementById('mount')
    if (!mountNode) return

    const cache = createCache({ key: 'mui', container: doc.head, prepend: true })
    setFrameState({ mountNode, cache })
  }, [])

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Material Design Preview"
        style={{ width, height, border: 'none', display: 'block', background: 'white' }}
      />
      {frameState && createPortal(
        <CacheProvider value={frameState.cache}>{children}</CacheProvider>,
        frameState.mountNode,
      )}
    </>
  )
}

function sanitizeHtmlFragment(raw: string): string {
  return String(raw || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe[^>]*\/?\s*>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*\/?\s*>/gi, '')
    // Allow <form> tags — they're harmless in sandboxed iframe and needed for form screens
    .replace(/<base[^>]*\/?\s*>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/<\/?(html|head|body|meta|title|link|style)[^>]*>/gi, '')
    .trim()
}

function sanitizeCss(raw: string): string {
  return String(raw || '')
    .replace(/<style[^>]*>/gi, '')
    .replace(/<\/style>/gi, '')
    .replace(/@import\s+url\([^)]*\);?/gi, '')
    .trim()
}

// All design system CSS classes — always pre-loaded in the design preview iframe.
// The AI only needs to write HTML using these classes; it should NOT redefine them.
const DESIGN_SYSTEM_BASE_CSS = `
*{box-sizing:border-box}
img{max-width:100%;display:block}
img:not([src]),img[src=""],img[src^="http"]{min-height:80px;background:#F4F4F4}
.screen{display:flex;flex-direction:column;min-height:100%;background:#FFFFFF;font-family:"Switzer","Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#202020;letter-spacing:-0.02em}
.app-bar{position:sticky;top:0;z-index:10;height:56px;display:flex;align-items:center;padding:0 4px;background:#FFFFFF;border-bottom:1px solid #E2E2E2;gap:4px;flex-shrink:0}
.app-bar-title{flex:1;font-size:20px;font-weight:500;letter-spacing:-0.02em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 8px}
.content{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.card{background:#fff;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:8px}
.card-elevated{background:#F8F8F8;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:8px}
.card-filled{background:#F4F4F4;border-radius:0;border:none;padding:16px;display:flex;flex-direction:column;gap:8px}
.stat-group{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.stat-card{background:#fff;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:4px}
.stat-value{font-size:32px;font-weight:500;letter-spacing:-0.04em;line-height:1.1;color:#0A3EFF}
.stat-value.success{color:#22C55E}.stat-value.dark{color:#10296E}.stat-value.error{color:#E64059}
.stat-label{font-size:13px;font-weight:400;letter-spacing:-0.01em;color:#878787}
.stat-delta{font-size:12px;font-weight:500;display:inline-flex;align-items:center;gap:3px}
.stat-delta.up{color:#22C55E}.stat-delta.down{color:#E64059}
.section-header{font-size:13px;font-weight:500;letter-spacing:-0.01em;color:#878787;margin:4px 0 0}
.row{display:flex;align-items:center;gap:12px}
.row-between{display:flex;align-items:center;justify-content:space-between}
.col{display:flex;flex-direction:column;gap:4px}
.label-sm{font-size:11px;letter-spacing:-0.01em;color:#878787;font-weight:400}
.body-sm{font-size:13px;color:#878787;line-height:1.3;letter-spacing:-0.01em}
.body-md{font-size:16px;color:#202020;line-height:1.4;letter-spacing:-0.02em}
.title-md{font-size:16px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.title-lg{font-size:25px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.headline{font-size:31px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.display{font-size:39px;font-weight:500;color:#202020;letter-spacing:-0.02em;line-height:1.1}
.title-sm{font-size:14px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.body-lg{font-size:16px;color:#202020;line-height:1.4;letter-spacing:-0.02em}
.label-md{font-size:13px;letter-spacing:-0.01em;color:#878787;font-weight:400}
.label-lg{font-size:16px;letter-spacing:-0.02em;color:#5F5F5F;font-weight:500}
.link{color:#0A3EFF;text-decoration:underline;cursor:pointer}
.code{font-size:11px;font-family:monospace;background:#F4F4F4;color:#202020;padding:2px 6px;border-radius:0;font-weight:500}
.fab{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:0;background:#0A3EFF;color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5}
.fab-extended{position:fixed;bottom:24px;right:24px;height:56px;padding:0 20px;border-radius:0;background:#0A3EFF;color:#fff;border:none;display:flex;align-items:center;gap:8px;font-size:16px;font-weight:500;cursor:pointer;z-index:5}
.tab-bar{display:flex;border-bottom:1px solid #E2E2E2;gap:0}
.tab{flex:1;padding:12px 16px;font-size:16px;font-weight:400;color:#878787;text-align:center;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;letter-spacing:-0.02em}
.tab.active{color:#0A3EFF;border-bottom-color:#0A3EFF;font-weight:500}
.surface-container{background:#F8F8F8;border-radius:0;padding:16px}
.text-primary{color:#202020}.text-secondary{color:#878787}.text-disabled{color:#B5B5B5}.text-on-primary{color:#FFFFFF}.text-error{color:#E64059}.text-success{color:#22C55E}.text-accent{color:#0A3EFF}
button:focus-visible,.field:focus-within{outline:2px solid #0A3EFF;outline-offset:2px}
.btn-filled:focus-visible,.btn-outlined:focus-visible,.btn-tonal:focus-visible,.btn-text:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px}
.icon-btn:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px;border-radius:0}
.chip:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px}
.btn-filled:active{opacity:0.88}.btn-outlined:active{background:rgba(10,62,255,0.08)}.btn-tonal:active{background:rgba(10,62,255,0.12)}.btn-text:active{background:rgba(10,62,255,0.08)}
.badge{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:9999px;font-size:11px;font-weight:500;letter-spacing:-0.01em}
.badge-blue{background:#E8EEFF;color:#0A3EFF}
.badge-success{background:#DCFCE7;color:#14532D}
.badge-error{background:#FFE5E9;color:#5F1422}
.badge-warning{background:#FFF3CD;color:#5D4300}
.badge-gray{background:#F4F4F4;color:#5F5F5F}
.list-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #E2E2E2}
.list-item:last-child{border-bottom:none}
.list-icon{width:40px;height:40px;border-radius:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#F4F4F4;color:#0A3EFF}
.avatar{width:40px;height:40px;border-radius:9999px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#0A3EFF;color:#fff;font-size:14px;font-weight:500}
.bottom-actions{padding:16px;background:#FFFFFF;border-top:1px solid #E2E2E2;display:flex;gap:10px;flex-shrink:0}
.filter-bar{display:flex;align-items:center;gap:8px;padding:8px 0;overflow-x:auto}
.chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:0;font-size:13px;font-weight:400;border:1px solid #E2E2E2;background:#fff;color:#5F5F5F;cursor:pointer;white-space:nowrap;letter-spacing:-0.01em}
.chip.active{background:#E8EEFF;border-color:#0A3EFF;color:#0A3EFF}
button{font-family:inherit;cursor:pointer;transition:opacity .15s;letter-spacing:-0.02em}button:hover{opacity:.85}
.btn-filled{background:#0A3EFF;color:#fff;border:none;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-outlined{background:transparent;color:#0A3EFF;border:1px solid #0A3EFF;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-text{background:transparent;color:#0A3EFF;border:none;border-radius:0;height:40px;padding:0 12px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-tonal{background:rgba(10,62,255,0.08);color:#0A3EFF;border:none;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-sm{height:32px;font-size:13px;padding:0 12px}
.icon-btn{background:transparent;border:none;border-radius:0;width:40px;height:40px;min-width:40px;display:flex;align-items:center;justify-content:center;color:#5F5F5F}
.msi{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size:24px;font-weight:400;line-height:24px;height:24px;width:24px;letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga' 1;font-feature-settings:'liga' 1;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;user-select:none;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;flex-shrink:0;text-align:center;overflow:hidden}
.msi.sm{font-size:18px;line-height:18px;height:18px;width:18px}.msi.lg{font-size:32px;line-height:32px;height:32px;width:32px}
.list-icon .msi{font-size:24px;line-height:24px;height:24px;width:24px}
p .msi,h1 .msi,h2 .msi,h3 .msi,h4 .msi,h5 .msi,h6 .msi,li .msi,label .msi,td .msi,th .msi,blockquote .msi,a .msi,figcaption .msi{display:none}
.switch{display:inline-flex;align-items:center;cursor:pointer}.switch input{display:none}
.sw-track{position:relative;width:52px;height:32px;border-radius:16px;background:#B5B5B5;border:none;transition:.2s;flex-shrink:0}
.switch input:checked+.sw-track{background:#0A3EFF}
.sw-thumb{position:absolute;top:4px;left:4px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:left .2s}
.switch input:checked+.sw-track .sw-thumb{left:24px}
.field{position:relative;border:1px solid #E2E2E2;border-radius:0;height:56px;padding:0 16px;background:#fff;display:flex;align-items:center;transition:border-color .15s;box-sizing:border-box;overflow:visible}
.field.field-error{border-color:#E64059;border-width:2px}
.field.field-warning{border-color:#F9A825;border-width:2px}
.field.field-info{border-color:#0A3EFF;border-width:2px}
.field.field-error .field-label{color:#E64059}
.field.field-warning .field-label{color:#F9A825}
.field.field-info .field-label{color:#0A3EFF}
.field>*:not(.field-label):not(.field-input):not(.msi):not([class*="msi"]):not(.field-validation-icon):not(input):not(select):not(textarea):not(label){position:absolute!important;top:100%!important;left:0!important;right:0!important;padding:4px 16px 0!important;font-size:12px!important;line-height:16px!important;font-weight:400!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block!important;z-index:2;height:auto!important;width:auto!important}
.field.field-error,.field.field-warning,.field.field-info{margin-bottom:22px}
.field:has(>*:not(.field-label):not(.field-input):not(.msi):not([class*="msi"]):not(.field-validation-icon):not(input):not(select):not(textarea):not(label):not(style)){margin-bottom:22px}
.field-helper{display:block;font-size:12px;line-height:16px;padding:4px 16px 0;color:#878787}
.field-helper-error{color:#E64059;font-weight:500}
.field-helper-warning{color:#F9A825;font-weight:500}
.field-helper-info{color:#0A3EFF;font-weight:500}
.field-validation-icon{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:flex;align-items:center;z-index:3}
.field-validation-icon>*:not(.msi):not([class*="msi"]){display:none!important}
.field.field-error .field-validation-icon{color:#E64059}
.field.field-warning .field-validation-icon{color:#F9A825}
.field.field-info .field-validation-icon{color:#0A3EFF}
.validation-popup{position:absolute;top:100%;right:8px;z-index:100;margin-top:4px;border-radius:0;background:#fff;border:1px solid #E2E2E2;overflow:hidden;min-width:260px;max-width:340px}
.validation-popup-header{display:flex;align-items:center;gap:8px;padding:10px 16px;font-size:13px;font-weight:500;color:#fff}
.validation-popup-header.error{background:#E64059}
.validation-popup-header.warning{background:#F9A825;color:#202020}
.validation-popup-header.info{background:#0A3EFF}
.validation-popup-item{display:flex;align-items:flex-start;gap:10px;padding:10px 16px;font-size:13px;line-height:18px;border-bottom:1px solid #F4F4F4}
.validation-popup-item:last-child{border-bottom:none}
[data-validation-absorbed]{display:none!important}
.field-label{position:absolute;top:0;left:12px;transform:translateY(-50%);font-size:12px;font-weight:400;color:#0A3EFF;background:#fff;padding:0 4px;pointer-events:none;z-index:1;letter-spacing:-0.01em}
.field-input{width:100%;border:none;outline:none;background:transparent;font-size:16px;font-family:inherit;color:#202020;display:block;letter-spacing:-0.02em}
select.field-input{-webkit-appearance:none;appearance:none;cursor:pointer;padding-right:20px}
.field:has(select.field-input){background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%23878787'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
textarea.field-input{min-height:80px;resize:vertical;line-height:1.4;padding-top:4px}
.field:has(textarea.field-input){height:auto;min-height:100px;align-items:flex-start;padding-top:24px;overflow:visible}
.field:focus-within{border-color:#0A3EFF}
.search-bar{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #E2E2E2;border-radius:0;padding:0 16px;height:48px}
.search-bar .field-input{font-size:16px}
hr.divider{border:none;border-top:1px solid #E2E2E2;margin:0}
.progress{height:4px;background:#F4F4F4;border-radius:0;overflow:hidden}
.progress-fill{height:100%;background:#0A3EFF;border-radius:0}
.info-bar{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:0;font-size:13px;line-height:1.3;letter-spacing:-0.01em}
.info-bar.error{background:#FFE5E9;color:#5F1422;border:1px solid #E64059}
.info-bar.warning{background:#FFF3CD;color:#5D4300;border:1px solid #F9A825}
.info-bar.info{background:#E8EEFF;color:#10296E;border:1px solid #0A3EFF}
.info-bar.success{background:#DCFCE7;color:#14532D;border:1px solid #22C55E}
`.trim()

function buildWebPreviewDoc(webDesign: WebDesign, tokens: DesignTokens, editMode = false): string {
  const html = sanitizeHtmlFragment(webDesign.html)
  const css = sanitizeCss(webDesign.css)
  const font = tokens.fontFamily || 'Switzer'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
<style>
:root {
  --md-primary: ${tokens.colors.primary};
  --md-on-primary: ${tokens.colors.onPrimary};
  --md-surface: ${tokens.colors.surface};
  --md-on-surface: ${tokens.colors.onSurface};
  --md-tertiary: ${tokens.colors.tertiary};
  --md-primary-container: ${tokens.colors.primaryContainer};
  --md-surface-lowest: ${tokens.colors.surfaceContainerLowest};
  --md-surface-low: ${tokens.colors.surfaceContainerLow};
  --md-surface-high: ${tokens.colors.surfaceContainerHigh};
  --md-outline: ${tokens.colors.outlineVariant};
  --md-inverse-primary: ${tokens.colors.inversePrimary};
  --md-sys-color-primary: ${tokens.colors.primary};
  --md-sys-color-on-primary: ${tokens.colors.onPrimary};
  --md-sys-color-primary-container: ${tokens.colors.primaryContainer};
  --md-sys-color-on-primary-container: ${tokens.colors.onPrimaryContainer};
  --md-sys-color-secondary: ${tokens.colors.secondary};
  --md-sys-color-on-secondary: ${tokens.colors.onSecondary};
  --md-sys-color-secondary-container: ${tokens.colors.secondaryContainer};
  --md-sys-color-on-secondary-container: ${tokens.colors.onSecondaryContainer};
  --md-sys-color-surface: ${tokens.colors.surface};
  --md-sys-color-on-surface: ${tokens.colors.onSurface};
  --md-sys-color-surface-variant: ${tokens.colors.surfaceVariant};
  --md-sys-color-on-surface-variant: ${tokens.colors.onSurfaceVariant};
  --md-sys-color-outline: ${tokens.colors.outline};
  --md-sys-color-outline-variant: ${tokens.colors.outlineVariant};
}
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #FFFFFF;
  color: ${tokens.colors.onSurface};
  font-family: "${font}", "Switzer", "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
}
${DESIGN_SYSTEM_BASE_CSS}
${css}
</style>
<script>
// ── Icon Auto-Fix ────────────────────────────────────────────────────────────
// Only fixes icon containers that have bare text icon names.
// NEVER scans general text nodes — that destroys normal English words.
(function(){
  var ICONS='arrow_back arrow_forward arrow_upward arrow_downward close check more_vert more_horiz more menu add remove search chevron_right chevron_left expand_more expand_less notifications notification_add account_circle person person_outline group business local_shipping inventory_2 assignment schedule calendar_today check_circle cancel warning error info report_problem sync refresh tune filter_list sort edit delete visibility visibility_off upload download place location_on location_off map call phone mail email done done_all clear star star_border home settings dashboard list_alt add_business fitness_center bolt verified flag push_pin help manage_accounts format_list_bulleted navigate_next navigate_before shopping_cart store warehouse layers category label receipt bar_chart pie_chart show_chart trending_up trending_down timeline table_chart grid_view view_list add_task task_alt pending_actions route local_fire_department construction engineering agriculture work_history attach_money payments account_balance description folder_open drive_file_rename_outline swap_horiz swap_vert content_copy print share bookmark favorite thumb_up lock lock_open security admin_panel_settings qr_code barcode battery_charging_full signal_cellular_alt wifi'.split(' ');
  var ICON_SET=new Set(ICONS);
  // Only these containers should have bare icon names converted
  var ICON_CONTAINERS='.icon-btn, .list-icon, .nav-icon, .action-icon, .leading-icon, .trailing-icon, .chip-icon, [data-icon]';
  // Never convert text inside these elements
  var TEXT_TAGS=new Set(['P','H1','H2','H3','H4','H5','H6','LI','LABEL','TD','TH','CAPTION','FIGCAPTION','BLOCKQUOTE','A','SPAN','BUTTON']);

  function fixContainers(root){
    // 1. Fix known icon containers that have bare text instead of <span class="msi">
    root.querySelectorAll(ICON_CONTAINERS).forEach(function(el){
      if(el.classList.contains('msi'))return;
      if(el.querySelector('.msi'))return;
      if(el.childElementCount>0)return;
      var t=el.textContent.trim();
      if(t&&ICON_SET.has(t)){
        var sp=document.createElement('span');sp.className='msi';sp.textContent=t;
        el.textContent='';el.appendChild(sp);
      }
    });
    // 2. Fix small standalone elements (not text containers) that have ONLY a bare icon name
    root.querySelectorAll('div,span').forEach(function(el){
      if(el.classList.contains('msi'))return;
      if(el.querySelector('.msi'))return;
      if(el.childElementCount>0)return;
      if(TEXT_TAGS.has(el.tagName))return;
      // Skip if parent is a text container
      if(el.parentElement&&TEXT_TAGS.has(el.parentElement.tagName))return;
      var t=el.textContent.trim();
      // Only convert if entire text content is exactly one icon name
      if(t&&ICON_SET.has(t)&&t===el.textContent.trim()){
        var sp=document.createElement('span');sp.className='msi';sp.textContent=t;
        el.textContent='';el.appendChild(sp);
      }
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    fixContainers(document.getElementById('app')||document.body);
    document.fonts.ready.then(function(){
      document.querySelectorAll('.msi').forEach(function(el){
        el.style.visibility='hidden';el.offsetHeight;el.style.visibility='';
      });
    });
  });
})();
</script>
<script>
(function(){
  var css=document.createElement('style');
  css.textContent='@keyframes igS{0%{background-position:200% 0}100%{background-position:-200% 0}}.ig-o{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,5,238,.05) 0%,rgba(0,5,238,.12) 50%,rgba(0,5,238,.05) 100%);background-size:200% 100%;animation:igS 1.8s linear infinite;border-radius:inherit;z-index:2;pointer-events:none}';
  document.head.appendChild(css);
  document.addEventListener('DOMContentLoaded',function(){
    var imgs=document.querySelectorAll('[data-generate-image]');
    if(!imgs.length)return;
    imgs.forEach(function(img){
      var prompt=img.getAttribute('data-generate-image');
      if(!prompt)return;
      var wrap=document.createElement('div');
      wrap.style.cssText='position:relative;display:inline-block;width:'+(img.style.width||'100%')+';border-radius:'+(img.style.borderRadius||'12px')+';overflow:hidden';
      img.parentNode.insertBefore(wrap,img);
      wrap.appendChild(img);
      var ov=document.createElement('div');
      ov.className='ig-o';
      wrap.appendChild(ov);
      var reqId='img_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
      function onMsg(ev){
        if(!ev.data||ev.data.source!=='uno-studio'||ev.data.type!=='imageResult'||ev.data.reqId!==reqId)return;
        window.removeEventListener('message',onMsg);
        var d=ev.data.data;
        if(d.images&&d.images[0]){
          img.src=d.images[0].dataUri;
          img.removeAttribute('data-generate-image');
        }
        ov.remove();
        window.parent.postMessage({source:'pencil-edit',type:'htmlUpdated',data:{html:document.getElementById('app').innerHTML}},'*');
      }
      window.addEventListener('message',onMsg);
      window.parent.postMessage({source:'pencil-edit',type:'generateImage',reqId:reqId,data:{prompt:prompt,size:'1K'}},'*');
    });
  });
})();
</script>
<script>
// ── Validation System v3 — class-agnostic ─────────────────────────────────
// Works regardless of what HTML the AI generates. Finds inputs by TAG NAME,
// walks up to find containers, extracts validation text by COLOR/KEYWORD/ICON
// heuristics, and rebuilds everything properly.
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    try{
    var app=document.getElementById('app');if(!app)return;
    var appBar=app.querySelector('.app-bar');if(!appBar)return;
    var content=app.querySelector('.content');if(!content)return;
    var KW=['required','invalid','exceed','error','warning','validation','issue','fix','review','problem','missing','before saving','resolve','cannot','must be','not verified','expires','downgraded','attention','not be empty','is required','must provide','too short','too long','at least','not match','falls on','could not','below recommended'];
    var EC=['D32F2F','d32f2f','B3261E','b3261e','C62828','c62828','FF1744','ff1744','D50000','d50000','E53935','e53935'];
    var WC=['F9A825','f9a825','FF8F00','ff8f00','EF6C00','ef6c00','E65100','e65100','FFA000','ffa000','FF6F00','ff6f00','FFB300','ffb300'];
    var IC=['1976D2','1976d2','0288D1','0288d1','1565C0','1565c0','2196F3','2196f3','42A5F5','42a5f5'];
    var EI=['error','error_outline','cancel','dangerous','gpp_bad','report','block','highlight_off'];
    var WI=['warning','warning_amber','report_problem','priority_high','new_releases'];
    var II=['info','info_outline','help','help_outline','lightbulb'];

    function sevFromCSS(s){if(!s)return null;for(var i=0;i<EC.length;i++)if(s.indexOf(EC[i])>=0)return'error';for(var j=0;j<WC.length;j++)if(s.indexOf(WC[j])>=0)return'warning';for(var k=0;k<IC.length;k++)if(s.indexOf(IC[k])>=0)return'info';return null;}
    function sevFromIcons(el){var ic=el.querySelectorAll('.msi,[class*="msi"]');for(var x=0;x<ic.length;x++){var n=ic[x].textContent.trim();if(EI.indexOf(n)>=0)return'error';if(WI.indexOf(n)>=0)return'warning';if(II.indexOf(n)>=0)return'info';}return null;}
    function hasKW(txt){var t=txt.toLowerCase();for(var i=0;i<KW.length;i++)if(t.indexOf(KW[i])>=0)return true;return false;}
    function stripIcons(el){var c=el.cloneNode(true);var ic=c.querySelectorAll('.msi,[class*="msi"]');for(var i=0;i<ic.length;i++)ic[i].remove();return c.textContent.trim();}

    // ═══ A1: Remove AI-generated validation popups, summaries, banners ═══
    var ep=appBar.querySelector('.validation-popup');if(ep)ep.remove();
    // Nuke any element in content that looks like a validation summary/banner
    // (contains validation keywords + is NOT a form field container)
    var allEls=content.querySelectorAll('*');
    for(var ae=allEls.length-1;ae>=0;ae--){
      var el=allEls[ae];if(!el.parentNode)continue;
      // Skip if it contains an input (it's a field container, not a summary)
      if(el.querySelector('input,select,textarea'))continue;
      // Skip tiny elements (icons, etc)
      var txt=(el.textContent||'').trim();
      if(txt.length<10)continue;
      // Skip section headers (short text, no validation styling)
      if(txt.length<60&&!sevFromCSS(el.outerHTML||'')&&!hasKW(txt))continue;
      // Check: is this a validation summary/banner?
      var isInfoBar=el.classList.contains('info-bar');
      var isSummary=el.classList.contains('validation-popup')||el.classList.contains('validation-summary');
      var htmlStr=el.outerHTML||'';
      var hasSevColor=!!sevFromCSS(htmlStr);
      var kwMatch=hasKW(txt);
      if(isInfoBar&&kwMatch){el.remove();continue;}
      if(isSummary){el.remove();continue;}
      // Heuristic: has validation colors + keywords + doesn't contain inputs = summary/banner
      if(hasSevColor&&kwMatch&&!el.querySelector('input,select,textarea')){
        // But don't remove if it's a field-helper we created or a small helper text
        if(el.classList.contains('field-helper'))continue;
        // Don't remove if parent is a form field container
        var p=el.parentNode;
        if(p&&p.querySelector&&p.querySelector('input,select,textarea')&&p!==content)continue;
        // Check if this is a direct child of content or near the top — likely a banner
        var isDirectChild=(el.parentNode===content);
        var isNearTop=el.getBoundingClientRect&&(el.getBoundingClientRect().top-content.getBoundingClientRect().top<100);
        if(isDirectChild||(isNearTop&&txt.length<200)){el.remove();}
      }
    }

    // ═══ A2: Find ALL inputs and clean up their containers ═══
    var valFields=[];
    var inputs=content.querySelectorAll('input,select,textarea');
    for(var ii=0;ii<inputs.length;ii++){
      var inp=inputs[ii];
      // Skip search inputs, checkboxes, radios, hidden
      var itype=(inp.type||'').toLowerCase();
      if(itype==='checkbox'||itype==='radio'||itype==='hidden'||itype==='submit'||itype==='button')continue;
      if(inp.closest('.search-bar,.filter-bar'))continue;

      // Find the field container: walk up from input to find the bordered wrapper
      // Look for .field class first, then any element with visible border
      var container=inp.closest('.field');
      if(!container){
        // Walk up to find a container with border styling
        var walker=inp.parentNode;
        while(walker&&walker!==content){
          var cs=walker.getAttribute&&walker.getAttribute('style')||'';
          var cls=walker.className||'';
          // Has border styling or form-field-like class
          if(cs.indexOf('border')>=0||cls.indexOf('field')>=0||cls.indexOf('form')>=0||cls.indexOf('input')>=0){
            // Make sure it's not too big (not the content wrapper itself)
            var kids=walker.querySelectorAll('input,select,textarea');
            if(kids.length<=2){container=walker;break;}
          }
          walker=walker.parentNode;
        }
      }
      if(!container)continue;
      // Skip if already processed
      if(container.getAttribute('data-val-done'))continue;
      container.setAttribute('data-val-done','1');

      // Ensure it has .field class for CSS to work
      if(!container.classList.contains('field')){
        container.classList.add('field');
      }

      // Detect severity from the container + its siblings
      var sev=container.classList.contains('field-error')?'error':container.classList.contains('field-warning')?'warning':container.classList.contains('field-info')?'info':null;
      if(!sev){
        sev=sevFromCSS(container.innerHTML)||sevFromIcons(container);
      }
      // Also check adjacent siblings
      if(!sev){
        var nxt=container.nextElementSibling;
        if(nxt&&!nxt.querySelector('input,select,textarea')){
          var nxtHTML=nxt.outerHTML||'';
          var nxtTxt=(nxt.textContent||'').trim();
          if(hasKW(nxtTxt)||sevFromCSS(nxtHTML)){
            sev=sevFromCSS(nxtHTML)||sevFromIcons(nxt)||'error';
          }
        }
      }
      if(!sev)continue; // No validation on this field

      // Apply severity class
      var sevCls=sev==='error'?'field-error':sev==='warning'?'field-warning':'field-info';
      if(!container.classList.contains(sevCls))container.classList.add(sevCls);

      // Find label text
      var label=container.querySelector('.field-label,label');
      var labelTxt=label?label.textContent.trim():'Field';

      // Extract validation text from inside the container
      // Strategy: find ALL elements inside container that have validation colors or keywords,
      // that are NOT the label and NOT the input
      var valTexts=[];
      var toRemove=[];
      var allInner=container.querySelectorAll('*');
      for(var ai=0;ai<allInner.length;ai++){
        var el2=allInner[ai];
        if(el2===inp||el2===label)continue;
        if(el2.tagName==='INPUT'||el2.tagName==='SELECT'||el2.tagName==='TEXTAREA')continue;
        if(el2.tagName==='LABEL'&&el2.classList.contains('field-label'))continue;
        if(el2.classList.contains('field-input'))continue;
        // Check if this element or its style has validation colors
        var elStyle=el2.getAttribute('style')||'';
        var elCls=el2.className||'';
        var elSev=sevFromCSS(elStyle)||sevFromCSS(elCls);
        // Get text content (excluding child icons)
        var elTxt=stripIcons(el2);
        if(!elTxt||elTxt.length<3)continue;
        // Is this validation text? (has colors, keywords, or is inside a validation-colored parent)
        var isValText=!!elSev||hasKW(elTxt);
        // Also check: parent has validation colors
        if(!isValText&&el2.parentNode!==container){
          var pStyle=el2.parentNode.getAttribute&&el2.parentNode.getAttribute('style')||'';
          isValText=!!sevFromCSS(pStyle);
        }
        if(isValText){
          valTexts.push(elTxt);
          // Mark for removal — but find the top-level container inside .field to remove
          var removeTarget=el2;
          while(removeTarget.parentNode!==container&&removeTarget.parentNode)removeTarget=removeTarget.parentNode;
          if(toRemove.indexOf(removeTarget)<0)toRemove.push(removeTarget);
        }
      }

      // Also check next sibling for validation text
      var nxt2=container.nextElementSibling;
      if(nxt2&&!nxt2.querySelector('input,select,textarea')&&!nxt2.classList.contains('field')){
        var nTxt=(nxt2.textContent||'').trim();
        if((hasKW(nTxt)||sevFromCSS(nxt2.outerHTML||''))&&nTxt.length>2&&nTxt.length<200){
          var cleanNxt=stripIcons(nxt2);
          if(cleanNxt.length>2)valTexts.push(cleanNxt);
          nxt2.remove();
        }
      }

      // Remove validation elements from inside the container
      for(var r=0;r<toRemove.length;r++){
        if(toRemove[r].parentNode)toRemove[r].remove();
      }

      // Add clean .field-validation-icon if not present
      if(!container.querySelector('.field-validation-icon')){
        var vIcon=document.createElement('span');
        vIcon.className='field-validation-icon';
        vIcon.style.color=sev==='error'?'#D32F2F':sev==='warning'?'#F9A825':'#1976D2';
        vIcon.innerHTML='<span class="msi sm">'+(sev==='error'?'error':sev==='warning'?'warning':'info')+'</span>';
        container.appendChild(vIcon);
      }

      // Add clean .field-helper below container
      var helperMsg=valTexts.length>0?valTexts[0]:(labelTxt+' has an issue');
      // Check if helper already exists
      var existingHelper=container.nextElementSibling;
      if(!existingHelper||!existingHelper.classList.contains('field-helper')){
        var helper=document.createElement('span');
        helper.className='field-helper field-helper-'+(sev==='error'?'error':sev==='warning'?'warning':'info');
        helper.textContent=helperMsg;
        container.parentNode.insertBefore(helper,container.nextSibling);
      }

      valFields.push({sev:sev,name:labelTxt,msg:helperMsg});
    }

    if(valFields.length===0)return;
    var hasErrors=valFields.some(function(v){return v.sev==='error';});
    var hasWarnings=valFields.some(function(v){return v.sev==='warning';});
    var worstSev=hasErrors?'error':hasWarnings?'warning':'info';

    // ═══ A3: Fix toolbar — close + [title] + severity-icon + check ═══
    var iconBtns=appBar.querySelectorAll('.icon-btn');
    var hasClose=false,hasCheck=false,overflowBtn=null,existingSevBtn=null;
    var SEV_ICONS=['error','warning','info','report_problem','cancel','dangerous','error_outline','warning_amber','priority_high','gpp_bad','new_releases','report'];
    for(var bi=0;bi<iconBtns.length;bi++){
      var bm=iconBtns[bi].querySelector('.msi');
      if(!bm)continue;
      var bn=bm.textContent.trim();
      if(bn==='close'||bn==='arrow_back')hasClose=true;
      if(bn==='check'||bn==='done'||bn==='save')hasCheck=true;
      if(bn==='more_vert'||bn==='more_horiz')overflowBtn=iconBtns[bi];
      if(SEV_ICONS.indexOf(bn)>=0){
        var bStyle=iconBtns[bi].getAttribute('style')||'';
        if(sevFromCSS(bStyle)||bn==='error'||bn==='warning'||bn==='info')existingSevBtn=iconBtns[bi];
      }
    }
    // Add check button if missing
    if(hasClose&&!hasCheck){
      var ck=document.createElement('button');
      ck.className='icon-btn';
      ck.innerHTML='<span class="msi">check</span>';
      appBar.appendChild(ck);
      hasCheck=true;
      if(overflowBtn)overflowBtn.remove();
    }
    // Remove bottom-actions on modal forms
    if(hasClose){
      var ba=app.querySelector('.bottom-actions');if(ba)ba.remove();
    }

    // ═══ B: Create severity icon + popup ═══
    var severityBtn=existingSevBtn;
    if(!severityBtn){
      severityBtn=document.createElement('button');
      severityBtn.className='icon-btn';
      severityBtn.style.color=worstSev==='error'?'#D32F2F':worstSev==='warning'?'#F9A825':'#1976D2';
      severityBtn.innerHTML='<span class="msi">'+(worstSev==='error'?'error':worstSev==='warning'?'warning':'info')+'</span>';
      // Insert before check button
      var checkBtn=null;
      var btns=appBar.querySelectorAll('.icon-btn');
      for(var cb=0;cb<btns.length;cb++){
        var cbm=btns[cb].querySelector('.msi');
        if(cbm&&['check','done','save'].indexOf(cbm.textContent.trim())>=0){checkBtn=btns[cb];break;}
      }
      if(checkBtn)appBar.insertBefore(severityBtn,checkBtn);
      else appBar.appendChild(severityBtn);
    }

    // Build popup
    appBar.style.position='relative';
    var popup=document.createElement('div');
    popup.className='validation-popup';
    var hdr=document.createElement('div');
    hdr.className='validation-popup-header '+worstSev;
    hdr.innerHTML='<span class="msi sm" style="color:'+(worstSev==='warning'?'#1C1B1F':'#fff')+'">'+worstSev+'</span><span>'+valFields.length+' issue'+(valFields.length>1?'s':'')+'</span>';
    popup.appendChild(hdr);
    for(var pi=0;pi<valFields.length;pi++){
      var item=document.createElement('div');
      item.className='validation-popup-item';
      var ic=valFields[pi].sev==='error'?'#D32F2F':valFields[pi].sev==='warning'?'#F9A825':'#1976D2';
      item.innerHTML='<span class="msi sm" style="color:'+ic+'">'+valFields[pi].sev+'</span><span>'+valFields[pi].msg+'</span>';
      popup.appendChild(item);
    }
    appBar.appendChild(popup);

    // Toggle popup on click
    popup.style.display='none';
    severityBtn.style.cursor='pointer';
    severityBtn.addEventListener('click',function(e){
      e.stopPropagation();
      popup.style.display=popup.style.display==='none'?'block':'none';
    });
    document.addEventListener('click',function(){popup.style.display='none';});
    popup.addEventListener('click',function(e){e.stopPropagation();});

    }catch(err){console.error('Validation system error:',err);}
  });
})();
</script>

</head>
<body>
  <div id="app">${html}</div>
  ${editMode ? '<script>' + getIframeEditScript() + '<\/script>' : ''}
</body>
</html>`
}

const GENERATION_STEPS = [
  { message: 'Understanding your request', detail: 'Parsing prompt and design brief' },
  { message: 'Designing component structure', detail: 'Building the layout tree' },
  { message: 'Applying design tokens', detail: 'Colors, typography, spacing' },
  { message: 'Generating web preview', detail: 'Creating high-fidelity HTML/CSS' },
  { message: 'Polishing details', detail: 'Final layout adjustments' },
]

function GeneratingOverlay() {
  const [step, setStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, GENERATION_STEPS.length - 1))
    }, 3000)
    const tickTimer = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)
    return () => { clearInterval(stepTimer); clearInterval(tickTimer) }
  }, [])

  return (
    <div className="absolute inset-0 bg-studio-bg/80 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-studio-surface border border-studio-border rounded-2xl p-6 max-w-xs w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-studio-accent/15 flex items-center justify-center flex-shrink-0">
            <Loader2 size={20} className="text-studio-accent animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-studio-text">Generating design</p>
            <p className="text-[11px] text-studio-text-dim">{elapsed}s elapsed</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {GENERATION_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300 ${i < step ? 'bg-studio-accent' :
                  i === step ? 'bg-studio-accent/20 ring-2 ring-studio-accent' :
                    'bg-studio-surface-3'
                }`}>
                {i < step && (
                  <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {i === step && (
                  <div className="w-1.5 h-1.5 rounded-full bg-studio-accent animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium transition-colors ${i <= step ? 'text-studio-text' : 'text-studio-text-dim'
                  }`}>
                  {s.message}
                </p>
                {i === step && (
                  <p className="text-[10px] text-studio-text-dim mt-0.5">{s.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PreviewPanel() {
  const { currentTree, currentWebDesign, previousWebDesign, improveDecisions, showingBefore, designTokens, designBrief, qualityToggles, selectedComponentId, isGenerating, canUndo, canRedo, improveHistory, originalWebDesign, viewingImproveIndex, currentImageDataUri } = useAppState()
  const dispatch = useAppDispatch()
  const [device, setDevice] = useState<DeviceFrame>('phone')
  const [scale, setScale] = useState(0.75)
  const [previewMode, setPreviewMode] = useState<'design' | 'edit'>('edit')
  const [isDragOver, setIsDragOver] = useState(false)
  const [dropLineY, setDropLineY] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const deviceFrameRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUploadId = useRef<string | null>(null)

  const { width, height } = DEVICE_SIZES[device]
  const hasPreview = Boolean(currentTree || currentWebDesign?.html)
  const canUseWeb = Boolean(currentWebDesign?.html)
  const effectiveMode: 'design' | 'edit' = hasPreview ? previewMode : 'edit'
  const displayedWebDesign = viewingImproveIndex === -1
    ? originalWebDesign
    : viewingImproveIndex !== null && improveHistory[viewingImproveIndex]
    ? improveHistory[viewingImproveIndex].webDesign
    : showingBefore ? previousWebDesign : currentWebDesign
  const webSrcDoc = useMemo(
    () => (displayedWebDesign?.html ? buildWebPreviewDoc(displayedWebDesign, designTokens) : ''),
    [displayedWebDesign, designTokens],
  )
  // Track a stable "generation ID" — only changes when a genuinely new design arrives
  // (not when the iframe sends back inline edits via htmlUpdated)
  const editGenIdRef = useRef(0)
  const iframeEditingRef = useRef(false)
  const editSrcDocRef = useRef('')

  // Detect new designs: only regenerate editSrcDoc when the design changes externally
  const designHtmlLen = displayedWebDesign?.html?.length ?? 0
  const designCssLen = displayedWebDesign?.css?.length ?? 0
  const designFingerprint = `${designHtmlLen}-${designCssLen}`
  const lastFingerprintRef = useRef('')
  if (designFingerprint !== lastFingerprintRef.current && !iframeEditingRef.current) {
    lastFingerprintRef.current = designFingerprint
    editGenIdRef.current++
    editSrcDocRef.current = displayedWebDesign?.html ? buildWebPreviewDoc(displayedWebDesign, designTokens, true) : ''
  }
  const editSrcDoc = editSrcDocRef.current
  const editIframeKey = `edit-${editGenIdRef.current}`

  // ─── Web design editing (shared via context) ───
  const { editIframeRef, setSelectedWebElement } = useWebEdit()

  // Listen for messages from the edit iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || e.data.source !== 'pencil-edit') return
      const { type, data } = e.data
      if (type === 'select') {
        setSelectedWebElement(data as WebElementInfo | null)
      } else if (type === 'generateImage') {
        // Proxy image generation fetch from iframe to avoid CORS with srcdoc null origin
        const reqId = e.data.reqId
        const iframeWindow = editIframeRef?.current?.contentWindow || (e.source as Window)
        fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then(r => r.json())
          .then(result => {
            iframeWindow?.postMessage({ source: 'uno-studio', type: 'imageResult', reqId, data: result }, '*')
          })
          .catch(err => {
            iframeWindow?.postMessage({ source: 'uno-studio', type: 'imageResult', reqId, data: { error: err.message } }, '*')
          })
      } else if (type === 'htmlUpdated' && data?.html && currentWebDesign) {
        // Mark that this HTML change came from the iframe — don't regenerate editSrcDoc
        iframeEditingRef.current = true
        dispatch({ type: 'UPDATE_WEB_DESIGN', html: data.html, css: currentWebDesign.css })
        // Reset after React processes the update
        requestAnimationFrame(() => { iframeEditingRef.current = false })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [dispatch, currentWebDesign])

  // Clear web element selection when switching modes
  useEffect(() => {
    if (effectiveMode !== 'edit') setSelectedWebElement(null)
  }, [effectiveMode])

  useEffect(() => {
    if (!hasPreview && previewMode !== 'edit') {
      setPreviewMode('edit')
    }
  }, [hasPreview, previewMode])

  // Auto-switch to design (clean view) after first generation
  const prevTreeRef = useRef<typeof currentTree>(null)
  useEffect(() => {
    if (currentTree && !prevTreeRef.current) {
      setPreviewMode('design')
    }
    prevTreeRef.current = currentTree
  }, [currentTree])

  // ─── Keyboard shortcuts ───

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

      const isMeta = e.metaKey || e.ctrlKey

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        e.preventDefault()
        dispatch({ type: 'DELETE_COMPONENT', id: selectedComponentId })
      } else if (e.key === 'Escape') {
        dispatch({ type: 'SELECT_COMPONENT', id: null })
      } else if (isMeta && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      } else if (isMeta && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, selectedComponentId])

  const handleSelect = useCallback((id: string) => {
    dispatch({ type: 'SELECT_COMPONENT', id })
  }, [dispatch])

  const handleMove = useCallback((id: string, left: number, top: number) => {
    dispatch({ type: 'MOVE_COMPONENT', id, left, top })
  }, [dispatch])

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COMPONENT', id })
  }, [dispatch])

  const handleDuplicate = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_COMPONENT', id })
  }, [dispatch])

  const handleMoveUp = useCallback((id: string) => {
    if (!currentTree) return
    // Find parent and current index, then reorder
    const findParentNode = (node: typeof currentTree, targetId: string): typeof currentTree | null => {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === targetId) return node
          const found = findParentNode(child, targetId)
          if (found) return found
        }
      }
      return null
    }
    const parent = findParentNode(currentTree, id)
    if (!parent || !parent.children) return
    const idx = parent.children.findIndex(c => c.id === id)
    if (idx <= 0) return
    dispatch({ type: 'REORDER_CHILDREN', parentId: parent.id, fromIndex: idx, toIndex: idx - 1 })
  }, [dispatch, currentTree])

  const handleMoveDown = useCallback((id: string) => {
    if (!currentTree) return
    const findParentNode = (node: typeof currentTree, targetId: string): typeof currentTree | null => {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === targetId) return node
          const found = findParentNode(child, targetId)
          if (found) return found
        }
      }
      return null
    }
    const parent = findParentNode(currentTree, id)
    if (!parent || !parent.children) return
    const idx = parent.children.findIndex(c => c.id === id)
    if (idx < 0 || idx >= parent.children.length - 1) return
    dispatch({ type: 'REORDER_CHILDREN', parentId: parent.id, fromIndex: idx, toIndex: idx + 1 })
  }, [dispatch, currentTree])

  // ─── Image upload from desktop ───

  const handleImageUpload = useCallback((id: string) => {
    pendingUploadId.current = id
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = pendingUploadId.current
    if (!file || !id) return
    // Reset so the same file can be re-selected
    e.target.value = ''
    pendingUploadId.current = null

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (!dataUrl) return
      dispatch({ type: 'UPDATE_COMPONENT', id, properties: { Source: dataUrl } })
    }
    reader.readAsDataURL(file)
  }, [dispatch])

  // ─── Drop handling for component palette ───

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-uno-component') || e.dataTransfer.types.includes('application/x-uno-preset')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsDragOver(true)
      // Calculate insertion line Y position relative to the device frame
      if (deviceFrameRef.current) {
        const rect = deviceFrameRef.current.getBoundingClientRect()
        const relativeY = e.clientY - rect.top
        setDropLineY(relativeY)
      }
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setDropLineY(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDropLineY(null)

    // Handle preset drops
    const presetId = e.dataTransfer.getData('application/x-uno-preset')
    if (presetId) {
      const preset = ALL_PRESETS.find((p) => p.id === presetId)
      if (!preset) return
      const tree = preset.createTree()
      const newNode = assignIds(tree as unknown as Record<string, unknown>)
      if (preset.rootType === 'Page') {
        dispatch({ type: 'SET_TREE', tree: newNode, prompt: preset.label, webDesign: null })
        setPreviewMode('design')
      } else {
        // If a container is selected, drop into it
        if (selectedComponentId && currentTree) {
          const sel = findNodeById(currentTree, selectedComponentId)
          if (sel && CONTAINER_TYPES_DROP.has(sel.type)) {
            dispatch({ type: 'ADD_CHILD', parentId: selectedComponentId, child: newNode })
            setPreviewMode('edit')
            return
          }
        }
        dispatch({ type: 'DROP_COMPONENT_ON_CANVAS', child: newNode })
        setPreviewMode('edit')
      }
      return
    }

    // Handle component drops — supports variant JSON or plain type string
    const raw = e.dataTransfer.getData('application/x-uno-component')
    if (!raw) return

    let type: ComponentType
    let variantProps: Record<string, string> | undefined
    try {
      const parsed = JSON.parse(raw)
      type = parsed.type as ComponentType
      variantProps = parsed.props
    } catch {
      type = raw as ComponentType
    }

    const defaults = createDefaultComponent(type)
    if (variantProps) {
      Object.assign(defaults.properties, variantProps)
    }
    const newNode = { id: uuid(), ...defaults }

    // If a container is selected, drop into it
    if (selectedComponentId && currentTree) {
      const sel = findNodeById(currentTree, selectedComponentId)
      if (sel && CONTAINER_TYPES_DROP.has(sel.type)) {
        dispatch({ type: 'ADD_CHILD', parentId: selectedComponentId, child: newNode })
        setPreviewMode('edit')
        return
      }
    }

    dispatch({ type: 'DROP_COMPONENT_ON_CANVAS', child: newNode })
    setPreviewMode('edit')
  }, [dispatch, selectedComponentId, currentTree])

  // ─── Drop on empty state (no device frame yet) ───

  const handleEmptyDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-uno-component') || e.dataTransfer.types.includes('application/x-uno-preset')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsDragOver(true)
    }
  }, [])

  const handleEmptyDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDropLineY(null)

    // Handle preset drops on empty canvas
    const presetId = e.dataTransfer.getData('application/x-uno-preset')
    if (presetId) {
      const preset = ALL_PRESETS.find((p) => p.id === presetId)
      if (!preset) return
      const tree = preset.createTree()
      const newNode = assignIds(tree as unknown as Record<string, unknown>)
      if (preset.rootType === 'Page') {
        dispatch({ type: 'SET_TREE', tree: newNode, prompt: preset.label, webDesign: null })
        setPreviewMode('design')
      } else {
        dispatch({ type: 'DROP_COMPONENT_ON_CANVAS', child: newNode })
        setPreviewMode('edit')
      }
      return
    }

    // Handle component drops — supports variant JSON or plain type string
    const raw = e.dataTransfer.getData('application/x-uno-component')
    if (!raw) return

    let type: ComponentType
    let variantProps: Record<string, string> | undefined
    try {
      const parsed = JSON.parse(raw)
      type = parsed.type as ComponentType
      variantProps = parsed.props
    } catch {
      type = raw as ComponentType
    }

    const defaults = createDefaultComponent(type)
    if (variantProps) {
      Object.assign(defaults.properties, variantProps)
    }
    const newNode = { id: uuid(), ...defaults }

    dispatch({ type: 'DROP_COMPONENT_ON_CANVAS', child: newNode })
    setPreviewMode('edit')
  }, [dispatch])

  // Cache inlined font CSS for exports (fetched once, reused)
  const inlinedFontCSS = useRef<string | null>(null)
  const getInlinedFontCSS = useCallback(async () => {
    if (inlinedFontCSS.current) return inlinedFontCSS.current
    try {
      // Fetch the Google Fonts CSS (returns @font-face with woff2 URL)
      const cssResp = await fetch('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } // Ensure woff2 format
      })
      let css = await cssResp.text()
      // Extract all url() references and convert to base64 data URIs
      const urlMatches = css.match(/url\([^)]+\)/g) || []
      for (const urlMatch of urlMatches) {
        const url = urlMatch.replace(/url\((['"]?)(.*?)\1\)/, '$2')
        if (!url.startsWith('http')) continue
        try {
          const fontResp = await fetch(url)
          const blob = await fontResp.blob()
          const base64 = await new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
          css = css.replace(url, base64)
        } catch (_) {}
      }
      // Also fetch Switzer
      try {
        const dmResp = await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap', {
          headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }
        })
        let dmCss = await dmResp.text()
        const dmUrls = dmCss.match(/url\([^)]+\)/g) || []
        for (const urlMatch of dmUrls) {
          const url = urlMatch.replace(/url\((['"]?)(.*?)\1\)/, '$2')
          if (!url.startsWith('http')) continue
          try {
            const fontResp = await fetch(url)
            const blob = await fontResp.blob()
            const base64 = await new Promise<string>(resolve => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            dmCss = dmCss.replace(url, base64)
          } catch (_) {}
        }
        css += '\n' + dmCss
      } catch (_) {}
      inlinedFontCSS.current = css
      return css
    } catch (_) {
      return ''
    }
  }, [])

  const handleExportImage = useCallback(async () => {
    if (!deviceFrameRef.current || isExporting) return
    setIsExporting(true)
    try {
      // Image mode: download the raw generated image directly (no html2canvas)
      if (currentImageDataUri || currentWebDesign?.html?.includes('img-screen')) {
        let rawImageUri = currentImageDataUri
        // Extract data URI from HTML using indexOf (regex can choke on MB-sized base64)
        if (!rawImageUri && currentWebDesign?.html) {
          const marker = 'src="data:'
          const start = currentWebDesign.html.indexOf(marker)
          if (start !== -1) {
            const uriStart = start + 5 // skip 'src="'
            const uriEnd = currentWebDesign.html.indexOf('"', uriStart)
            if (uriEnd !== -1) {
              rawImageUri = currentWebDesign.html.substring(uriStart, uriEnd)
            }
          }
        }
        if (rawImageUri) {
          const link = document.createElement('a')
          link.download = `uno-studio-${device}-${Date.now()}.png`
          link.href = rawImageUri
          link.click()
          setIsExporting(false)
          return
        }
      }

      let captureDoc: Document | null = null

      // Pre-fetch and inline fonts for reliable rendering
      const fontCSS = await getInlinedFontCSS()

      if (effectiveMode === 'design' && webSrcDoc) {
        // Inject inlined fonts into the srcdoc before creating capture iframe
        let exportSrcDoc = webSrcDoc
        if (fontCSS) {
          // Remove the Google Fonts <link> tags and inject inline @font-face instead
          exportSrcDoc = exportSrcDoc
            .replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/g, '')
            .replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/g, '')
            .replace('</head>', `<style>${fontCSS}</style></head>`)
        }

        const captureFrame = document.createElement('iframe')
        captureFrame.setAttribute('sandbox', 'allow-scripts allow-same-origin')
        captureFrame.style.cssText = `position:fixed;top:-99999px;left:-99999px;width:${width}px;height:10000px;border:none;visibility:hidden`
        captureFrame.srcdoc = exportSrcDoc
        document.body.appendChild(captureFrame)
        await new Promise<void>(resolve => {
          captureFrame.onload = () => resolve()
          setTimeout(resolve, 3000)
        })
        captureDoc = captureFrame.contentDocument

        // Wait for fonts to be ready
        try { await (captureDoc as any).fonts?.ready } catch(_){}
        await new Promise(r => setTimeout(r, 300))

        // Measure full content height for long designs
        const fullHeight = Math.max(
          captureDoc!.body.scrollHeight,
          captureDoc!.documentElement.scrollHeight,
          height
        )
        captureFrame.style.height = fullHeight + 'px'
        await new Promise(r => setTimeout(r, 100))

        const canvas = await html2canvas(captureDoc!.body, {
          scale: 3, useCORS: true, allowTaint: true,
          width, height: fullHeight, windowWidth: width, windowHeight: fullHeight,
          backgroundColor: '#ffffff',
        })
        document.body.removeChild(captureFrame)

        const link = document.createElement('a')
        link.download = `uno-studio-${device}-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        return
      }

      // Edit mode — IsolatedFrame has accessible contentDocument
      const iframe = deviceFrameRef.current.querySelector('iframe') as HTMLIFrameElement | null
      captureDoc = iframe?.contentDocument ?? null
      if (!captureDoc?.body) throw new Error('No preview content to export')

      // Inject inlined fonts into the edit iframe for capture
      if (fontCSS && captureDoc) {
        const style = captureDoc.createElement('style')
        style.textContent = fontCSS
        captureDoc.head.appendChild(style)
      }

      await new Promise(r => setTimeout(r, 300))

      // Measure full content height for long designs
      const fullEditHeight = Math.max(
        captureDoc.body.scrollHeight,
        captureDoc.documentElement.scrollHeight,
        height
      )

      const canvas = await html2canvas(captureDoc.body, {
        scale: 3, useCORS: true, allowTaint: true,
        width, height: fullEditHeight, windowWidth: width, windowHeight: fullEditHeight,
        backgroundColor: '#ffffff',
      })

      const link = document.createElement('a')
      link.download = `uno-studio-${device}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
      alert('Could not export — please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [device, width, height, isExporting, effectiveMode, webSrcDoc, getInlinedFontCSS, currentImageDataUri, currentWebDesign])

  // Image mode detection
  const isImageMode = Boolean(currentImageDataUri) || Boolean(currentWebDesign?.html?.includes('img-screen'))

  const handleConvertToCode = useCallback(async () => {
    if (!isImageMode || isGenerating || isConverting) return
    // Extract image URI using indexOf (regex chokes on MB-sized base64)
    let imageUri = currentImageDataUri
    if (!imageUri && currentWebDesign?.html) {
      const marker = 'src="data:'
      const start = currentWebDesign.html.indexOf(marker)
      if (start !== -1) {
        const uriStart = start + 5
        const uriEnd = currentWebDesign.html.indexOf('"', uriStart)
        if (uriEnd !== -1) imageUri = currentWebDesign.html.substring(uriStart, uriEnd)
      }
    }
    if (!imageUri) return

    // Downscale image to fit within Vercel's 4.5MB body limit
    // Vision models only need ~800px width to understand UI structure
    const downscale = (dataUri: string, maxW = 800): Promise<string> =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          const ratio = Math.min(maxW / img.width, 1)
          const canvas = document.createElement('canvas')
          canvas.width = img.width * ratio
          canvas.height = img.height * ratio
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        }
        img.onerror = () => resolve(dataUri) // fallback to original
        img.src = dataUri
      })

    setIsConverting(true)
    dispatch({ type: 'SET_GENERATING', value: true })
    try {
      const smallImage = await downscale(imageUri)
      const result = await generateScreen({
        prompt: 'Convert this design image into editable HTML/CSS code. Recreate the exact same UI layout, colors, typography, spacing, and visual hierarchy. Make it production-ready and pixel-perfect to the original image.',
        designTokens,
        designBrief,
        currentTree: null,
        imageUrl: smallImage,
        qualityToggles,
      })
      dispatch({ type: 'SET_TREE', tree: result.tree, webDesign: result.webDesign ?? null, prompt: 'Image converted to code' })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Conversion failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
      setIsConverting(false)
    }
  }, [isImageMode, isGenerating, isConverting, currentImageDataUri, currentWebDesign, designTokens, designBrief, qualityToggles, dispatch])

  const dropTargetNode = selectedComponentId && currentTree ? findNodeById(currentTree, selectedComponentId) : null
  const dropContainerLabel = dropTargetNode && CONTAINER_TYPES_DROP.has(dropTargetNode.type) && dropTargetNode.type !== 'Page'
    ? dropTargetNode.type
    : null

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1 border-b border-studio-border flex items-center justify-center gap-2">
        {/* Mode toggle */}
        <div className="flex items-center rounded-md bg-studio-surface-3/50 p-0.5 gap-px">
          <button
            onClick={() => setPreviewMode('design')}
            disabled={!hasPreview}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${effectiveMode === 'design'
              ? 'bg-studio-surface text-studio-text shadow-sm'
              : 'text-studio-text-dim hover:text-studio-text-muted'
              } ${!hasPreview ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={hasPreview ? 'Clean preview' : 'Generate a screen first'}
          >
            Design
          </button>
          <button
            onClick={() => setPreviewMode('edit')}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${effectiveMode === 'edit'
              ? 'bg-studio-surface text-studio-text shadow-sm'
              : 'text-studio-text-dim hover:text-studio-text-muted'
              }`}
            title="Select and edit components"
          >
            Edit
          </button>
        </div>

        {/* Version navigator — prominent when browsing past versions, subtle at latest */}
        {improveHistory.length > 0 && (() => {
          const isViewingOriginal = viewingImproveIndex === -1
          const isViewingLatest = viewingImproveIndex === null
          const activeIdx = viewingImproveIndex ?? improveHistory.length - 1
          const isBrowsingPast = !isViewingLatest

          return (
            <nav
              className={`flex items-center rounded-md overflow-hidden transition-all ${
                isBrowsingPast
                  ? 'bg-studio-accent/[0.06] border border-studio-accent/20'
                  : 'border border-studio-border'
              }`}
              aria-label="Design version"
            >
              <button
                onClick={() => {
                  if (isViewingOriginal) return
                  if (activeIdx <= 0) dispatch({ type: 'VIEW_IMPROVE_VERSION', index: -1 })
                  else dispatch({ type: 'VIEW_IMPROVE_VERSION', index: activeIdx - 1 })
                }}
                disabled={isViewingOriginal}
                className="px-1.5 py-1 text-studio-text-dim hover:text-studio-text disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[28px] flex items-center justify-center"
                aria-label="Previous version"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                onClick={() => dispatch({ type: 'VIEW_IMPROVE_VERSION', index: null })}
                className={`px-2 py-1 text-[10px] font-medium transition-colors min-w-[52px] text-center ${
                  isViewingLatest
                    ? 'text-studio-accent'
                    : 'text-studio-text-muted hover:text-studio-accent'
                }`}
                aria-label={
                  isViewingOriginal
                    ? 'Viewing original design. Press to see latest.'
                    : isViewingLatest
                    ? `Showing round ${improveHistory.length}, the latest`
                    : `Showing round ${activeIdx + 1} of ${improveHistory.length}. Press for latest.`
                }
                aria-live="polite"
              >
                {isViewingOriginal ? 'Original' : isViewingLatest ? `${improveHistory.length}/${improveHistory.length}` : `${activeIdx + 1}/${improveHistory.length}`}
              </button>
              <button
                onClick={() => {
                  if (isViewingLatest) return
                  if (isViewingOriginal) dispatch({ type: 'VIEW_IMPROVE_VERSION', index: 0 })
                  else if (activeIdx >= improveHistory.length - 1) dispatch({ type: 'VIEW_IMPROVE_VERSION', index: null })
                  else dispatch({ type: 'VIEW_IMPROVE_VERSION', index: activeIdx + 1 })
                }}
                disabled={isViewingLatest}
                className="px-1.5 py-1 text-studio-text-dim hover:text-studio-text disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[28px] flex items-center justify-center"
                aria-label="Next version"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </nav>
          )
        })()}

        {/* Device selector */}
        <div className="flex items-center gap-0.5">
          {([
            ['phone', Smartphone],
            ['tablet', Tablet],
            ['desktop', Monitor],
          ] as const).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`p-1 rounded transition-colors flex items-center justify-center ${device === key
                ? 'text-studio-text bg-studio-surface-3'
                : 'text-studio-text-dim hover:text-studio-text-muted'
                }`}
              aria-label={`${key.charAt(0).toUpperCase() + key.slice(1)} preview`}
              aria-pressed={device === key}
            >
              <Icon size={13} aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* Zoom */}
        <label className="sr-only" htmlFor="preview-scale">Zoom level</label>
        <select
          id="preview-scale"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="bg-transparent border border-studio-border rounded text-[10px] text-studio-text-dim px-1.5 py-0.5 cursor-pointer hover:text-studio-text-muted transition-colors"
        >
          <option value={0.5}>50%</option>
          <option value={0.65}>65%</option>
          <option value={0.75}>75%</option>
          <option value={1}>100%</option>
        </select>

        {/* Undo/Redo */}
        <div className="flex items-center gap-px">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            className={`p-1 rounded transition-colors flex items-center justify-center ${
              canUndo
                ? 'text-studio-text-dim hover:text-studio-text'
                : 'text-studio-text-dim/20 cursor-not-allowed'
            }`}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={12} aria-hidden="true" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            className={`p-1 rounded transition-colors flex items-center justify-center ${
              canRedo
                ? 'text-studio-text-dim hover:text-studio-text'
                : 'text-studio-text-dim/20 cursor-not-allowed'
            }`}
            aria-label="Redo"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={12} aria-hidden="true" />
          </button>
        </div>

        {/* Export */}
        <button
          onClick={handleExportImage}
          disabled={!hasPreview || isExporting}
          className={`p-1 rounded transition-colors flex items-center justify-center ${
            hasPreview && !isExporting
              ? 'text-studio-text-dim hover:text-studio-text'
              : 'text-studio-text-dim/20 cursor-not-allowed'
          }`}
          aria-label="Export as PNG"
          title="Export high-res PNG"
        >
          {isExporting ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : (
            <Download size={13} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-studio-bg relative" style={{ backgroundImage: 'radial-gradient(circle, rgb(var(--studio-border) / 0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        {isGenerating && <GeneratingOverlay />}
        {hasPreview ? (
          <div className="min-h-full flex items-center justify-center p-8">
          <div
            ref={deviceFrameRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative bg-white overflow-hidden flex-shrink-0"
            style={{
              width: width * scale,
              height: height * scale,
              borderRadius: device === 'phone' ? 36 * scale : device === 'tablet' ? 16 * scale : 6 * scale,
              border: `${Math.max(1, 3 * scale)}px solid rgba(0,0,0,0.15)`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Drop indicator overlay with insertion line */}
            {isDragOver && (
              <>
                <div
                  className="absolute inset-0 z-30 pointer-events-none border-2 border-dashed border-blue-400 bg-blue-400/5"
                  style={{ borderRadius: 'inherit' }}
                />
                {dropContainerLabel && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center gap-1.5 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="1.5" stroke="white" strokeWidth="1.5"/><path d="M5 3.5V6.5M3.5 5H6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Drop into {dropContainerLabel}
                  </div>
                )}
                {dropLineY !== null && (
                  <div
                    className="absolute z-40 pointer-events-none"
                    style={{
                      left: 12,
                      right: 12,
                      top: dropLineY,
                      height: 2,
                      background: '#3b82f6',
                      borderRadius: 1,
                      boxShadow: '0 0 6px rgba(59,130,246,0.5)',
                    }}
                  >
                    {/* Left dot */}
                    <div style={{
                      position: 'absolute',
                      left: -3,
                      top: -3,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#3b82f6',
                    }} />
                    {/* Right dot */}
                    <div style={{
                      position: 'absolute',
                      right: -3,
                      top: -3,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#3b82f6',
                    }} />
                  </div>
                )}
              </>
            )}
            {/* Convert to Code overlay is rendered outside this container */}
            <div
              style={{
                width,
                height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {canUseWeb && effectiveMode === 'design' ? (
                <iframe
                  key={webSrcDoc}
                  srcDoc={webSrcDoc}
                  title="Web design preview"
                  style={{ width, height, border: 'none', display: 'block' }}
                  sandbox="allow-scripts"
                />
              ) : canUseWeb && effectiveMode === 'edit' ? (
                <iframe
                  ref={editIframeRef}
                  key={editIframeKey}
                  srcDoc={editSrcDoc}
                  title="Web design editor"
                  style={{ width, height, border: 'none', display: 'block' }}
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : currentTree ? (
                <IsolatedFrame width={width} height={height}>
                  {device === 'phone' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 44,
                      backgroundColor: designTokens.surfaceColor,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: 12,
                    }}>
                      <div style={{ width: 80, height: 5, borderRadius: 3, backgroundColor: '#1C1B1F' }} />
                    </div>
                  )}
                  <div style={{
                    height: '100%',
                    paddingTop: device === 'phone' ? 44 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    position: 'relative',
                  }}>
                    <MD3Renderer
                      node={currentTree}
                      tokens={designTokens}
                      selectedId={null}
                      onSelect={handleSelect}
                      onMove={handleMove}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onImageUpload={handleImageUpload}
                      previewMode="design"
                    />
                  </div>
                </IsolatedFrame>
              ) : null}
            </div>
          </div>
          {/* Convert to Code — positioned outside device frame to avoid overflow clip */}
          {isImageMode && !isGenerating && !isConverting && (
            <button
              onClick={handleConvertToCode}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold bg-studio-accent text-white shadow-lg hover:bg-studio-accent-hover active:scale-[0.98] transition-all"
            >
              <Code2 size={14} />
              Convert to Code
            </button>
          )}
          {isConverting && (
            <div className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold bg-studio-surface text-studio-text shadow-lg border border-studio-border">
              <Loader2 size={14} className="animate-spin" />
              Converting to editable code...
            </div>
          )}
          </div>
        ) : (
          <div className="min-h-full flex items-center justify-center p-8">
          <div
            className={`text-center transition-colors ${isDragOver ? 'opacity-70' : ''}`}
            onDragOver={handleEmptyDragOver}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleEmptyDrop}
          >
            {/* Device mockup with animated gradient */}
            <div className={`relative mx-auto mb-5 transition-all duration-300 ${isDragOver ? 'scale-105' : ''}`}>
              <div
                className="w-[140px] h-[280px] rounded-[28px] mx-auto relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgb(var(--studio-surface-3)), rgb(var(--studio-bg)))',
                  border: '2px solid rgb(var(--studio-border) / 0.4)',
                  boxShadow: '0 0 0 1px rgb(var(--studio-border) / 0.1), 0 8px 32px rgb(0 0 0 / 0.2), 0 2px 8px rgb(0 0 0 / 0.1), inset 0 1px 0 rgb(255 255 255 / 0.03)',
                }}
              >
                {/* Status bar */}
                <div className="h-5 flex items-center justify-center">
                  <div className="w-12 h-[3px] rounded-full mt-1.5" style={{ background: 'rgb(var(--studio-border) / 0.3)' }} />
                </div>
                {/* Screen content placeholder lines */}
                <div className="px-4 pt-4 space-y-3">
                  {/* App bar placeholder */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ background: 'rgb(var(--studio-accent) / 0.12)' }} />
                    <div className="h-2 rounded-full flex-1" style={{ background: 'rgb(var(--studio-border) / 0.2)' }} />
                  </div>
                  {/* Card placeholder */}
                  <div
                    className="rounded-lg p-2.5 space-y-2"
                    style={{ background: 'rgb(var(--studio-border) / 0.06)', border: '1px solid rgb(var(--studio-border) / 0.08)' }}
                  >
                    <div className="h-1.5 rounded-full w-3/4" style={{ background: 'rgb(var(--studio-border) / 0.15)' }} />
                    <div className="h-1.5 rounded-full w-1/2" style={{ background: 'rgb(var(--studio-border) / 0.1)' }} />
                  </div>
                  {/* List items */}
                  {[0.7, 0.5, 0.6].map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `rgb(var(--studio-accent) / ${0.08 + i * 0.03})` }} />
                      <div className="h-1.5 rounded-full" style={{ width: `${w * 100}%`, background: 'rgb(var(--studio-border) / 0.12)' }} />
                    </div>
                  ))}
                  {/* FAB placeholder */}
                  <div className="flex justify-end pt-2">
                    <div className="w-6 h-6 rounded-lg" style={{ background: 'rgb(var(--studio-accent) / 0.1)' }} />
                  </div>
                </div>
                {/* Bottom nav placeholder */}
                <div className="absolute bottom-0 inset-x-0 h-7 flex items-center justify-around px-6" style={{ borderTop: '1px solid rgb(var(--studio-border) / 0.08)' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgb(var(--studio-border) / ${i === 1 ? 0.2 : 0.08})` }} />
                  ))}
                </div>
                {/* Subtle animated shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgb(var(--studio-accent) / 0.03) 50%, transparent 60%)',
                    animation: 'emptyShimmer 4s ease-in-out infinite',
                  }}
                />
              </div>
              {/* Reflection / glow under device */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full blur-xl"
                style={{ background: 'rgb(var(--studio-accent) / 0.06)' }}
              />
            </div>
            <p className="text-[13px] font-medium text-studio-text-muted mb-1">
              {isDragOver ? 'Drop to place component' : 'Ready to design'}
            </p>
            <p className="text-[11px] text-studio-text-dim leading-relaxed max-w-[200px] mx-auto">
              {isDragOver ? '' : 'Describe a screen or drop a component to begin'}
            </p>
            <style>{`
              @keyframes emptyShimmer {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
              }
            `}</style>
          </div>
          </div>
        )}
      </div>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  )
}
