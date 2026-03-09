import React, { useMemo } from 'react'
import { ThemeProvider, createTheme, alpha as muiAlpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MuiChip from '@mui/material/Chip'
import MuiDivider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Avatar from '@mui/material/Avatar'
import MuiFab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import StarIcon from '@mui/icons-material/Star'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlaceIcon from '@mui/icons-material/Place'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MenuIcon from '@mui/icons-material/Menu'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ShieldIcon from '@mui/icons-material/Shield'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIcon from '@mui/icons-material/Phone'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ImageIcon from '@mui/icons-material/Image'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FolderIcon from '@mui/icons-material/Folder'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import SaveIcon from '@mui/icons-material/Save'
import BuildIcon from '@mui/icons-material/Build'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TableChartIcon from '@mui/icons-material/TableChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import type { ComponentNode, ComponentType, DesignTokens, TypographyVariant } from '../types'

/* ── Types ────────────────────────────────────────────────────── */
interface RendererProps {
  node: ComponentNode
  tokens: DesignTokens
  selectedId: string | null
  onSelect: (id: string) => void
  onMove?: (id: string, left: number, top: number) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  onImageUpload?: (id: string) => void
  parentType?: ComponentType | null
  previewMode?: 'design' | 'edit'
}

interface RenderContext extends RendererProps {
  renderChildren: () => React.ReactNode
}

type CR = (ctx: RenderContext) => React.ReactElement

/* ── Icon map — real Material icons ───────────────────────────── */
const ICON_MAP: Record<string, React.ReactElement> = {
  ChevronLeft: <ChevronLeftIcon />,
  ChevronRight: <ChevronRightIcon />,
  ChevronDown: <KeyboardArrowDownIcon />,
  ChevronUp: <KeyboardArrowUpIcon />,
  X: <CloseIcon />,
  Close: <CloseIcon />,
  Check: <CheckIcon />,
  CheckCircle: <CheckCircleIcon />,
  AlertCircle: <ErrorOutlineIcon />,
  AlertTriangle: <WarningIcon />,
  Warning: <WarningIcon />,
  Info: <InfoIcon />,
  ArrowUp: <ArrowUpwardIcon />,
  ArrowDown: <ArrowDownwardIcon />,
  ArrowLeft: <ArrowBackIcon />,
  ArrowRight: <ArrowForwardIcon />,
  ArrowForward: <ArrowForwardIcon />,
  ArrowBack: <ArrowBackIcon />,
  Plus: <AddIcon />,
  Add: <AddIcon />,
  Minus: <RemoveIcon />,
  Remove: <RemoveIcon />,
  Search: <SearchIcon />,
  XCircle: <CancelIcon />,
  Cancel: <CancelIcon />,
  Home: <HomeIcon />,
  Settings: <SettingsIcon />,
  User: <PersonIcon />,
  Person: <PersonIcon />,
  Menu: <MenuIcon />,
  Filter: <FilterListIcon />,
  FilterList: <FilterListIcon />,
  Calendar: <CalendarTodayIcon />,
  CalendarToday: <CalendarTodayIcon />,
  MapPin: <PlaceIcon />,
  Place: <PlaceIcon />,
  Lock: <LockIcon />,
  Star: <StarIcon />,
  Trash: <DeleteIcon />,
  Delete: <DeleteIcon />,
  Edit: <EditIcon />,
  Download: <FileDownloadIcon />,
  Upload: <FileUploadIcon />,
  Truck: <LocalShippingIcon />,
  LocalShipping: <LocalShippingIcon />,
  Package: <Inventory2Icon />,
  Inventory: <Inventory2Icon />,
  ClipboardList: <AssignmentIcon />,
  Assignment: <AssignmentIcon />,
  Eye: <VisibilityIcon />,
  Visibility: <VisibilityIcon />,
  MoreVertical: <MoreVertIcon />,
  MoreVert: <MoreVertIcon />,
  Shield: <ShieldIcon />,
  Clock: <AccessTimeIcon />,
  AccessTime: <AccessTimeIcon />,
  Mail: <MailIcon />,
  Phone: <PhoneIcon />,
  Copy: <ContentCopyIcon />,
  Refresh: <RefreshIcon />,
  Image: <ImageIcon />,
  Send: <SendIcon />,
  Notifications: <NotificationsIcon />,
  Folder: <FolderIcon />,
  Print: <PrintIcon />,
  Share: <ShareIcon />,
  Save: <SaveIcon />,
  Build: <BuildIcon />,
  Dashboard: <DashboardIcon />,
  ListAlt: <ListAltIcon />,
  AccountCircle: <AccountCircleIcon />,
  Help: <HelpOutlineIcon />,
  Logout: <LogoutIcon />,
  Table: <TableChartIcon />,
  TableChart: <TableChartIcon />,
  BarChart: <BarChartIcon />,
  ShoppingCart: <ShoppingCartIcon />,
}

function getIcon(glyph: string, props?: { fontSize?: number; htmlColor?: string }): React.ReactElement {
  const icon = ICON_MAP[glyph]
  if (icon) return React.cloneElement(icon, { sx: { fontSize: props?.fontSize || 24 }, htmlColor: props?.htmlColor || undefined })
  return (
    <Box component="span" sx={{
      width: props?.fontSize || 24,
      height: props?.fontSize || 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: Math.max(9, (props?.fontSize || 24) * 0.45),
      fontWeight: 700,
      color: props?.htmlColor || 'inherit',
    }}>
      {glyph.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w[0]).join('').slice(0, 2)}
    </Box>
  )
}

/* ── Helpers ───────────────────────────────────────────────────── */
const AL: Record<string, string> = { Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' }
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const numVal = (v: string | undefined, fb: number) => { if (!v) return fb; const x = Number(v); return Number.isFinite(x) ? x : fb }
const parsePad = (p?: string): string => {
  if (!p) return '0px'
  const parts = (p.includes(',') ? p.split(',') : p.trim().split(/\s+/)).map(s => s.trim()).filter(Boolean)
  return parts.map(s => /^-?\d+(\.\d+)?$/.test(s) ? s + 'px' : s).join(' ') || '0px'
}
const alignSelf = (a?: string, fb = 'stretch') => (a && AL[a]) || fb
const has = (v: string | undefined, q: RegExp) => q.test(String(v || '').toLowerCase())

/* ── Avontus brand constants for inline styles ── */
const AV = {
  blue: '#0005EE',
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
  bg: '#FFFFFF',
  blue50: '#E8E9FD',
  shadow1: '0 1px 3px rgba(0,5,238,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadow2: '0 4px 12px rgba(0,5,238,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  shadow3: '0 8px 24px rgba(0,5,238,0.10), 0 4px 8px rgba(0,0,0,0.05)',
}

/* ── Figma-like selection color ─────────────────────────────── */
const SEL_BLUE = '#0C8CE9'

/* ── Selectable wrapper (with canvas positioning + drag-to-move) ── */
function Sel({ ctx, children, sx }: { ctx: RenderContext; children: React.ReactNode; sx?: Record<string, unknown> }) {
  const isDesign = ctx.previewMode === 'design'
  const on = !isDesign && ctx.selectedId === ctx.node.id
  const p = ctx.node.properties
  const hasCanvasPos = p['Canvas.Left'] !== undefined || p['Canvas.Top'] !== undefined
  const [isHovered, setIsHovered] = React.useState(false)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null)

  React.useEffect(() => {
    if (on && boxRef.current) {
      const { offsetWidth: w, offsetHeight: h } = boxRef.current
      setDims({ w, h })
    } else {
      setDims(null)
    }
  }, [on, ctx.node.id])

  const canvasSx = hasCanvasPos ? {
    position: 'absolute' as const,
    left: numVal(p['Canvas.Left'], 0),
    top: numVal(p['Canvas.Top'], 0),
    zIndex: on ? 10 : 1,
  } : {}

  if (isDesign) {
    return <Box sx={{ ...canvasSx, ...sx }}>{children}</Box>
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasCanvasPos || !ctx.onMove) return
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    ctx.onSelect(ctx.node.id)
    const startX = e.clientX
    const startY = e.clientY
    const startLeft = numVal(p['Canvas.Left'], 0)
    const startTop = numVal(p['Canvas.Top'], 0)
    let rafId: number | null = null
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        ctx.onMove!(ctx.node.id, Math.max(0, startLeft + dx), Math.max(0, startTop + dy))
        rafId = null
      })
    }
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (rafId) cancelAnimationFrame(rafId)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleToolbarClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    e.preventDefault()
    action()
  }

  const isRoot = ctx.node.type === 'Page'

  // 8 handles: 4 corners + 4 edge midpoints (Figma style)
  const HANDLES: Array<{ pos: Record<string, number | string>; cursor: string }> = [
    { pos: { top: -4, left: -4 }, cursor: 'nwse-resize' },
    { pos: { top: -4, right: -4 }, cursor: 'nesw-resize' },
    { pos: { bottom: -4, left: -4 }, cursor: 'nesw-resize' },
    { pos: { bottom: -4, right: -4 }, cursor: 'nwse-resize' },
    { pos: { top: -4, left: '50%', marginLeft: '-4px' }, cursor: 'ns-resize' },
    { pos: { bottom: -4, left: '50%', marginLeft: '-4px' }, cursor: 'ns-resize' },
    { pos: { top: '50%', left: -4, marginTop: '-4px' }, cursor: 'ew-resize' },
    { pos: { top: '50%', right: -4, marginTop: '-4px' }, cursor: 'ew-resize' },
  ]

  return (
    <Box
      ref={boxRef}
      data-component-id={ctx.node.id}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); ctx.onSelect(ctx.node.id) }}
      onMouseDown={hasCanvasPos ? handleMouseDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        // Use boxShadow for selection to avoid double-border with field validation borders
        boxShadow: on
          ? `0 0 0 1.5px ${SEL_BLUE}`
          : (isHovered && !isRoot)
            ? `inset 0 0 0 1px ${muiAlpha(SEL_BLUE, 0.35)}`
            : 'none',
        borderRadius: on ? '2px' : '4px',
        cursor: hasCanvasPos ? (on ? 'move' : 'pointer') : 'pointer',
        transition: 'box-shadow 100ms ease, background-color 100ms ease',
        bgcolor: (isHovered && !on && !isRoot) ? muiAlpha(SEL_BLUE, 0.03) : 'transparent',
        ...canvasSx,
        ...sx,
      }}
    >
      {children}

      {/* ── Hover: type label badge ── */}
      {isHovered && !on && !isRoot && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateY(-100%)',
          bgcolor: SEL_BLUE,
          color: '#fff',
          fontSize: '9px',
          fontWeight: 600,
          fontFamily: '"Inter","DM Sans",system-ui,sans-serif',
          letterSpacing: '0.2px',
          px: '5px',
          py: '1.5px',
          borderRadius: '3px 3px 0 0',
          lineHeight: 1.3,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 20,
        }}>
          {ctx.node.type}
        </Box>
      )}

      {/* ── Selection: 8 resize handles ── */}
      {on && !isRoot && HANDLES.map((h, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          ...h.pos,
          width: 8,
          height: 8,
          bgcolor: '#fff',
          border: `1.5px solid ${SEL_BLUE}`,
          borderRadius: '50%',
          zIndex: 21,
          cursor: h.cursor,
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.08)',
          pointerEvents: 'auto',
        }} />
      ))}

      {/* ── Selection: dimension badge (bottom-center) ── */}
      {on && !isRoot && dims && (
        <Box sx={{
          position: 'absolute',
          bottom: -2,
          left: '50%',
          transform: 'translate(-50%, 100%)',
          bgcolor: SEL_BLUE,
          color: '#fff',
          fontSize: '9px',
          fontWeight: 600,
          fontFamily: '"Inter","DM Sans",monospace',
          letterSpacing: '0.3px',
          px: '6px',
          py: '2px',
          borderRadius: '4px',
          lineHeight: 1.2,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 25,
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          {dims.w} × {dims.h}
        </Box>
      )}

      {/* ── Selection: type label (top-left, replaces hover label) ── */}
      {on && !isRoot && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateY(-100%)',
          bgcolor: SEL_BLUE,
          color: '#fff',
          fontSize: '9px',
          fontWeight: 600,
          fontFamily: '"Inter","DM Sans",system-ui,sans-serif',
          letterSpacing: '0.2px',
          px: '5px',
          py: '1.5px',
          borderRadius: '3px 3px 0 0',
          lineHeight: 1.3,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 20,
        }}>
          {ctx.node.type}
        </Box>
      )}

      {/* ── Floating toolbar above selected element ── */}
      {on && !isRoot && (
        <Box
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1px',
            bgcolor: 'rgba(24,24,27,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            px: '3px',
            py: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.24), 0 0 0 0.5px rgba(255,255,255,0.06)',
            zIndex: 30,
            whiteSpace: 'nowrap',
          }}
        >
          {ctx.onMoveUp && (
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => handleToolbarClick(e, () => ctx.onMoveUp!(ctx.node.id))}
              sx={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.65)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
              }}
              title="Move up"
            >
              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
          {ctx.onMoveDown && (
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => handleToolbarClick(e, () => ctx.onMoveDown!(ctx.node.id))}
              sx={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.65)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
              }}
              title="Move down"
            >
              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
          {ctx.onDuplicate && (
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => handleToolbarClick(e, () => ctx.onDuplicate!(ctx.node.id))}
              sx={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.65)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
              }}
              title="Duplicate"
            >
              <ContentCopyIcon sx={{ fontSize: 13 }} />
            </Box>
          )}
          {ctx.onImageUpload && ctx.node.type === 'Image' && (
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => handleToolbarClick(e, () => ctx.onImageUpload!(ctx.node.id))}
              sx={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.65)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
              }}
              title="Upload image"
            >
              <FileUploadIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
          <Box sx={{ width: '1px', height: 16, bgcolor: 'rgba(255,255,255,0.1)', mx: '1px' }} />
          {ctx.onDelete && (
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => handleToolbarClick(e, () => ctx.onDelete!(ctx.node.id))}
              sx={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.45)',
                '&:hover': { bgcolor: 'rgba(239,68,68,0.15)', color: '#ef4444' },
              }}
              title="Delete"
            >
              <DeleteIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT RENDERERS — Avontus Design System
   ═══════════════════════════════════════════════════════════════ */

const renderPage: CR = ctx => {
  const p = ctx.node.properties
  const t = ctx.tokens
  const isCanvasMode = p.LayoutMode === 'Canvas'
  return (
    <Sel ctx={ctx}>
      <Box sx={{
        minHeight: '100%',
        display: isCanvasMode ? 'block' : 'flex',
        flexDirection: isCanvasMode ? undefined : 'column',
        position: isCanvasMode ? 'relative' : undefined,
        bgcolor: p.Background || t.colors.surfaceContainerLowest,
        backgroundImage: isCanvasMode ? undefined : `
          radial-gradient(1000px 600px at 50% -20%, ${muiAlpha(t.colors.primary, 0.12)}, transparent 80%),
          radial-gradient(800px 400px at 110% -10%, ${muiAlpha(t.colors.tertiary, 0.08)}, transparent 80%),
          linear-gradient(180deg, ${muiAlpha(t.colors.surface, 0.95)} 0%, ${t.colors.surfaceContainerLowest} 100%)
        `,
        color: t.colors.onBackground,
      }}>
        {ctx.renderChildren()}
      </Box>
    </Sel>
  )
}

/* ── Validation absorption — detect TextBlocks that are validation messages ── */
const INPUT_TYPES = new Set(['TextBox', 'PasswordBox', 'DatePicker', 'Select', 'TimePicker', 'AutoSuggestBox'])

const VALIDATION_COLORS: Record<string, string> = {
  // Error reds
  '#D32F2F': 'Error', '#d32f2f': 'Error', '#B3261E': 'Error', '#b3261e': 'Error',
  '#C62828': 'Error', '#c62828': 'Error', '#E53935': 'Error', '#e53935': 'Error',
  '#FF0000': 'Error', '#ff0000': 'Error', '#BA1A1A': 'Error', '#ba1a1a': 'Error',
  'Red': 'Error', 'red': 'Error',
  // Warning yellows/oranges
  '#F9A825': 'Warning', '#f9a825': 'Warning', '#FF8F00': 'Warning', '#ff8f00': 'Warning',
  '#E65100': 'Warning', '#e65100': 'Warning', '#EF6C00': 'Warning', '#ef6c00': 'Warning',
  '#F57C00': 'Warning', '#f57c00': 'Warning', '#FF6F00': 'Warning', '#ff6f00': 'Warning',
  'Orange': 'Warning', 'orange': 'Warning',
  // Info blues
  '#1976D2': 'Info', '#1976d2': 'Info', '#1565C0': 'Info', '#1565c0': 'Info',
  '#2196F3': 'Info', '#2196f3': 'Info', '#1E88E5': 'Info', '#1e88e5': 'Info',
  'Blue': 'Info', 'blue': 'Info',
}

const VALIDATION_TEXT_PATTERNS = /required|invalid|error|must be|cannot be|please enter|too short|too long|not valid|is required|field is|missing/i

function detectValidationSeverity(fg: string | undefined, text?: string, style?: string): string | null {
  if (fg) {
    const match = VALIDATION_COLORS[fg] || VALIDATION_COLORS[fg.toLowerCase()]
    if (match) return match
  }
  // Fallback: detect by text content + small style (avoid absorbing labels/headings)
  const isSmallStyle = !style || style === 'BodySmall' || style === 'LabelSmall' || style === 'LabelMedium'
  if (isSmallStyle && text && VALIDATION_TEXT_PATTERNS.test(text)) return 'Error'
  return null
}

/** Preprocess children: absorb validation TextBlocks into preceding input fields */
function absorbValidationTextBlocks(kids: ComponentNode[]): ComponentNode[] {
  const result: ComponentNode[] = []
  const skip = new Set<string>()

  for (let i = 0; i < kids.length; i++) {
    const child = kids[i]
    if (skip.has(child.id)) continue

    if (INPUT_TYPES.has(child.type) && !child.properties.Validation) {
      // Look ahead for validation TextBlocks (possibly with an Icon in between)
      let nextIdx = i + 1
      // Skip over Icon nodes (AI sometimes puts error icons between input and message)
      while (nextIdx < kids.length && kids[nextIdx].type === 'Icon') nextIdx++

      if (nextIdx < kids.length) {
        const candidate = kids[nextIdx]
        if (candidate.type === 'TextBlock') {
          const severity = detectValidationSeverity(candidate.properties.Foreground, candidate.properties.Text, candidate.properties.Style)
          if (severity) {
            // Absorb: inject validation props into the input node clone
            const enhanced = {
              ...child,
              properties: {
                ...child.properties,
                Validation: severity,
                ValidationMessage: candidate.properties.Text || '',
              },
            }
            result.push(enhanced)
            skip.add(candidate.id)
            // Also skip any Icon nodes we jumped over
            for (let j = i + 1; j < nextIdx; j++) skip.add(kids[j].id)
            continue
          }
        }
      }
    }

    result.push(child)
  }

  return result
}

const renderStackPanel: CR = ctx => {
  const p = ctx.node.properties
  const kids = ctx.node.children || []
  const hasStepperKids =
    kids.some((c) => c.type === 'Button' && ['+', '-'].includes(String(c.properties?.Content || '').trim())) &&
    kids.some((c) => c.type === 'TextBox')
  const h = p.Orientation === 'Horizontal' || hasStepperKids
  const isStepperRow = h && hasStepperKids

  return (
    <Sel ctx={ctx}>
      <Box sx={{
        display: 'flex',
        flexDirection: h ? 'row' : 'column',
        gap: numVal(p.Spacing, isStepperRow ? 8 : h ? 10 : 12) + 'px',
        padding: parsePad(p.Padding),
        alignSelf: alignSelf(p.HorizontalAlignment, h ? 'flex-start' : 'stretch'),
        alignItems: isStepperRow ? 'center' : (h ? 'center' : alignSelf(p.HorizontalAlignment, 'stretch')),
        flexWrap: isStepperRow ? 'nowrap' : (p.Wrap === 'True' ? 'wrap' : 'nowrap'),
      }}>
        {ctx.renderChildren()}
      </Box>
    </Sel>
  )
}

const renderGrid: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <Box sx={{
        display: 'grid',
        gridAutoRows: 'min-content',
        rowGap: numVal(p.RowSpacing, 0) + 'px',
        columnGap: numVal(p.ColumnSpacing, 0) + 'px',
        padding: parsePad(p.Padding),
      }}>
        {ctx.renderChildren()}
      </Box>
    </Sel>
  )
}

const renderScrollViewer: CR = ctx => (
  <Sel ctx={ctx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
    <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
      {ctx.renderChildren()}
    </Box>
  </Sel>
)

/* ── TextBlock ─────────────────────────────────────────────────── */
const renderTextBlock: CR = ctx => {
  const p = ctx.node.properties
  const t = ctx.tokens
  const style = (p.Style || 'BodyMedium') as TypographyVariant
  const typo = t.typography[style] || t.typography.BodyMedium
  const text = p.Text || ''
  const reservationCode = /^[A-Z]{2,5}-\d{3,7}$/.test(text.trim())
  const emphasis = style.startsWith('Headline') || style.startsWith('Title') || reservationCode
  const subtle = style.startsWith('Label') || style === 'BodySmall'
  return (
    <Sel ctx={ctx}>
      <Typography
        sx={{
          fontFamily: `"${t.fontFamily}", "DM Sans", "Segoe UI", Roboto, system-ui, sans-serif`,
          fontSize: typo.fontSize,
          fontWeight: reservationCode ? 700 : (emphasis ? Math.max(typo.fontWeight, 600) : typo.fontWeight),
          lineHeight: typo.lineHeight + 'px',
          letterSpacing: typo.letterSpacing,
          color: p.Foreground || (subtle ? t.colors.onSurfaceVariant : t.colors.onSurface),
          textAlign: (p.HorizontalAlignment || 'Left').toLowerCase(),
          opacity: cl(numVal(p.Opacity, 1), 0, 1),
          wordBreak: 'break-word',
          textTransform: 'none',
        }}
      >
        {text}
      </Typography>
    </Sel>
  )
}

/* ── Button — Avontus pill shape, brand colors ─────────────────── */
const renderButton: CR = ctx => {
  const p = ctx.node.properties
  const style = p.Style || 'Filled'
  const disabled = p.IsEnabled === 'False'
  const content = (p.Content || '').trim()
  const isStepper = content === '+' || content === '-'
  const fullWidth = p.HorizontalAlignment === 'Stretch'
  const w = p.Width ? numVal(p.Width, 120) : undefined

  if (isStepper) {
    return (
      <Sel ctx={ctx}>
        <IconButton
          disabled={disabled}
          sx={{
            width: 40, height: 40,
            border: `1px solid ${AV.outlineVar}`,
            borderRadius: '12px',
            color: AV.onSurface,
            '&:hover': { bgcolor: AV.surface2 },
          }}
        >
          {content === '+' ? <AddIcon /> : <RemoveIcon />}
        </IconButton>
      </Sel>
    )
  }

  const baseStyle = {
    borderRadius: '9999px',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 0.1,
    height: 40,
    padding: '0 24px',
    textTransform: 'none' as const,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    width: fullWidth ? '100%' : (w ? `${w}px` : undefined),
    opacity: disabled ? 0.38 : 1,
    pointerEvents: disabled ? 'none' as const : undefined,
  }

  const variants: Record<string, React.CSSProperties> = {
    Filled: { ...baseStyle, background: AV.blue, color: '#FFFFFF' },
    Outlined: { ...baseStyle, background: 'transparent', color: AV.blue, border: `1px solid ${AV.outline}` },
    Text: { ...baseStyle, background: 'transparent', color: AV.blue, padding: '0 12px' },
    Elevated: { ...baseStyle, background: AV.surface, color: AV.blue, boxShadow: AV.shadow1 },
    Tonal: { ...baseStyle, background: AV.blue50, color: AV.navy },
  }

  return (
    <Sel ctx={ctx}>
      <div style={variants[style] || variants.Filled}>{content}</div>
    </Sel>
  )
}

/* ── Validation severity config ──────────────────────────────── */
const VALIDATION_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactElement }> = {
  Error:   { color: '#D32F2F', bg: '#FFDAD6', icon: <CancelIcon sx={{ fontSize: 18 }} /> },
  Warning: { color: '#F9A825', bg: '#FFF3CD', icon: <WarningIcon sx={{ fontSize: 18 }} /> },
  Info:    { color: '#1976D2', bg: '#E8E9FD', icon: <InfoIcon sx={{ fontSize: 18 }} /> },
}

/* ── Validation wrapper — reusable for any input field ──────── */
function getValidation(p: Record<string, string>) {
  const severity = p.Validation as string | undefined
  const message = p.ValidationMessage as string | undefined
  const config = severity ? VALIDATION_CONFIG[severity] : null
  return { severity, message, config }
}

function ValidationMessage({ config, message }: { config: typeof VALIDATION_CONFIG['Error'] | null; message?: string }) {
  if (!config || !message) return null
  return (
    <div style={{
      fontSize: 12,
      lineHeight: '16px',
      color: config.color,
      marginTop: 4,
      paddingLeft: 16,
      fontWeight: 500,
    }}>
      {message}
    </div>
  )
}

/* ── TextBox / PasswordBox — MD3 Outlined Text Field ─────────── */
function renderTextField(ctx: RenderContext, masked: boolean): React.ReactElement {
  const p = ctx.node.properties
  const value = masked ? '••••••••' : (p.Text || '')
  const label = p.Header || (masked ? 'Password' : '')
  const supportingText = p.PlaceholderText || ''
  const w = p.Width ? numVal(p.Width, 140) : undefined
  const hasValue = Boolean(value)
  const floated = hasValue
  const { config: vConfig, message: validationMsg } = getValidation(p)
  const borderColor = vConfig ? vConfig.color : AV.outlineVar
  const labelColor = vConfig ? vConfig.color : (floated ? AV.blue : AV.onSurfaceVar)

  return (
    <Sel ctx={ctx}>
      <div style={{
        width: w ? `${w}px` : '100%',
        position: 'relative',
        paddingTop: label ? 8 : 0,
        fontFamily: 'inherit',
      }}>
        {label && (
          <div style={{
            position: 'absolute',
            left: 12,
            top: floated ? 0 : 28,
            transform: floated ? 'none' : 'translateY(-50%)',
            fontSize: floated ? 12 : 16,
            lineHeight: '16px',
            fontWeight: 400,
            color: labelColor,
            background: floated ? AV.bg : 'transparent',
            padding: floated ? '0 4px' : 0,
            pointerEvents: 'none',
            zIndex: 1,
            whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
        )}
        <div style={{
          border: `${vConfig ? '2px' : '1px'} solid ${borderColor}`,
          borderRadius: 4,
          height: 56,
          padding: '0 16px',
          paddingRight: vConfig ? 40 : 16,
          fontSize: 16,
          fontFamily: 'inherit',
          color: AV.onSurface,
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {hasValue ? (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{value}</span>
          ) : !label && supportingText ? (
            <span style={{ color: `${AV.onSurfaceVar}80`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{supportingText}</span>
          ) : null}
          {vConfig && (
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: vConfig.color }}>
              {vConfig.icon}
            </div>
          )}
        </div>
        <ValidationMessage config={vConfig} message={validationMsg} />
        {!vConfig && supportingText && (
          <div style={{ fontSize: 12, lineHeight: '16px', color: AV.onSurfaceVar, marginTop: 4, paddingLeft: 16 }}>
            {supportingText}
          </div>
        )}
      </div>
    </Sel>
  )
}

/* ── Image ────────────────────────────────────────────────────── */
const renderImage: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <Paper
        variant="outlined"
        sx={{
          width: p.Width ? numVal(p.Width, 200) : '100%',
          height: p.Height ? numVal(p.Height, 160) : 160,
          borderRadius: '12px',
          bgcolor: AV.surface2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
          gap: 1,
          borderStyle: p.Source ? 'solid' : 'dashed',
          borderColor: AV.outlineVar,
        }}
      >
        {p.Source
          ? <Box component="img" src={p.Source} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <><ImageIcon sx={{ color: AV.outline, fontSize: 32 }} /><Typography variant="caption" sx={{ color: AV.outline }}>Image</Typography></>
        }
      </Paper>
    </Sel>
  )
}

/* ── PersonPicture — Avontus branded avatar ─────────────────── */
const renderPersonPicture: CR = ctx => {
  const p = ctx.node.properties
  const sz = numVal(p.Width || p.Height, 48)
  const initials = (p.DisplayName || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Sel ctx={ctx}>
      <Avatar sx={{
        width: sz, height: sz,
        fontSize: Math.round(sz * 0.38),
        flexShrink: 0,
        bgcolor: `${AV.blue}1A`,
        color: AV.blue,
        fontWeight: 600,
      }}>
        {initials}
      </Avatar>
    </Sel>
  )
}

/* ── ToggleSwitch — Avontus branded ──────────────────────────── */
const renderToggleSwitch: CR = ctx => {
  const p = ctx.node.properties
  const on = p.IsOn === 'True'
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 48, cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: AV.onSurface }}>{p.Header || ''}</span>
        <div style={{
          width: 52, height: 32, borderRadius: 16, position: 'relative',
          background: on ? AV.blue : AV.outlineVar,
          transition: 'background 150ms ease',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            background: '#FFFFFF',
            position: 'absolute',
            top: 4,
            left: on ? 24 : 4,
            transition: 'left 150ms ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }} />
        </div>
      </div>
    </Sel>
  )
}

/* ── CheckBox — Avontus branded ──────────────────────────────── */
const renderCheckBox: CR = ctx => {
  const p = ctx.node.properties
  const on = p.IsChecked === 'True'
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4,
          border: on ? 'none' : `2px solid ${AV.outline}`,
          background: on ? AV.blue : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 150ms ease',
        }}>
          {on && <CheckIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />}
        </div>
        <span style={{ fontWeight: 500, fontSize: 14, color: AV.onSurface }}>{p.Content || ''}</span>
      </div>
    </Sel>
  )
}

/* ── RadioButton — Avontus branded ───────────────────────────── */
const renderRadioButton: CR = ctx => {
  const p = ctx.node.properties
  const on = p.IsChecked === 'True'
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{
          width: 20, height: 20, borderRadius: 10,
          border: `2px solid ${on ? AV.blue : AV.outline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 150ms ease',
        }}>
          {on && <div style={{ width: 10, height: 10, borderRadius: 5, background: AV.blue }} />}
        </div>
        <span style={{ fontWeight: 500, fontSize: 14, color: AV.onSurface }}>{p.Content || ''}</span>
      </div>
    </Sel>
  )
}

/* ── Slider — Avontus branded ────────────────────────────────── */
const renderSlider: CR = ctx => {
  const p = ctx.node.properties
  const lo = Math.min(numVal(p.Minimum, 0), numVal(p.Maximum, 100))
  const rawHi = Math.max(numVal(p.Minimum, 0), numVal(p.Maximum, 100))
  const hi = rawHi <= lo ? lo + 1 : rawHi
  const v = cl(numVal(p.Value, lo), lo, hi)
  const pct = ((v - lo) / (hi - lo)) * 100
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', padding: '4px 0' }}>
        {p.Header && <div style={{ fontSize: 12, fontWeight: 500, color: AV.onSurfaceVar, marginBottom: 8, fontFamily: 'inherit' }}>{p.Header}</div>}
        <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
          {/* Track */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2, background: AV.outlineVar }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 2, background: AV.blue }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
            width: 20, height: 20, borderRadius: 10,
            background: AV.blue,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      </div>
    </Sel>
  )
}

/* ── ProgressBar — Avontus branded ───────────────────────────── */
const renderProgressBar: CR = ctx => {
  const p = ctx.node.properties
  const ind = p.IsIndeterminate === 'True'
  const v = cl(numVal(p.Value, 50), 0, 100)
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', padding: '8px 0' }}>
        <div style={{ width: '100%', height: 4, borderRadius: 2, background: AV.blue50, overflow: 'hidden' }}>
          <div style={{
            width: ind ? '40%' : `${v}%`,
            height: '100%',
            borderRadius: 2,
            background: AV.blue,
            transition: 'width 300ms ease',
          }} />
        </div>
      </div>
    </Sel>
  )
}

const renderProgressRing: CR = ctx => (
  <Sel ctx={ctx}>
    <div style={{ display: 'inline-flex' }}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" fill="none" stroke={AV.blue50} strokeWidth="4" />
        <circle cx="24" cy="24" r="18" fill="none" stroke={AV.blue} strokeWidth="4"
          strokeDasharray="75 113" strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
      </svg>
    </div>
  </Sel>
)

/* ── NavigationBar — Avontus Top App Bar ─────────────────────── */
const renderNavigationBar: CR = ctx => {
  const p = ctx.node.properties
  const cmd = p.MainCommand || 'Back'
  const t = ctx.tokens
  const isEditMode = cmd === 'Close'

  // Validation state icon: shows worst severity icon before action buttons
  const validationState = p.ValidationState as string | undefined
  const vConfig = validationState ? VALIDATION_CONFIG[validationState] : null

  return (
    <Sel ctx={ctx}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: muiAlpha(t.colors.surface, 0.9),
          color: t.colors.onSurface,
          backgroundImage: `linear-gradient(140deg, ${muiAlpha(t.colors.primaryContainer, 0.5)} 0%, ${muiAlpha(t.colors.surface, 0.9)} 100%)`,
          borderBottom: `1px solid ${muiAlpha(t.colors.outlineVariant, 0.4)}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important', px: 1 }}>
          {cmd !== 'None' && (
            <IconButton
              edge="start"
              sx={{
                mr: 0.5,
                color: isEditMode ? t.colors.onPrimaryContainer : t.colors.onSurface,
                bgcolor: muiAlpha(isEditMode ? t.colors.onPrimaryContainer : t.colors.onSurface, 0.08),
                '&:hover': { bgcolor: muiAlpha(isEditMode ? t.colors.onPrimaryContainer : t.colors.onSurface, 0.14) },
              }}
            >
              {cmd === 'Close' ? <CloseIcon /> : <ArrowBackIcon />}
            </IconButton>
          )}
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: 20,
              lineHeight: '26px',
              letterSpacing: 0,
              pr: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            {p.Content || 'Title'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Validation severity icon before action buttons */}
            {vConfig && (
              <IconButton
                size="small"
                sx={{
                  color: vConfig.color,
                  bgcolor: muiAlpha(vConfig.color, 0.1),
                  '&:hover': { bgcolor: muiAlpha(vConfig.color, 0.18) },
                  width: 36,
                  height: 36,
                }}
              >
                {vConfig.icon}
              </IconButton>
            )}
            {ctx.renderChildren()}
          </Box>
        </Toolbar>
      </AppBar>
    </Sel>
  )
}

/* ── BottomNavigationBar ──────────────────────────────────────── */
const renderBottomNav: CR = ctx => {
  const ch = ctx.node.children || []
  const selectedIdx = ch.findIndex(c => c.properties.IsSelected === 'True')
  const t = ctx.tokens
  return (
    <Sel ctx={ctx} sx={{ mt: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderTop: `1px solid ${t.colors.outlineVariant}`,
          bgcolor: AV.surface,
        }}
      >
        <BottomNavigation
          value={selectedIdx >= 0 ? selectedIdx : 0}
          showLabels
          sx={{ bgcolor: 'transparent', minHeight: 80, px: 1 }}
        >
          {ch.map((c, i) => (
            <BottomNavigationAction
              key={c.id}
              label={c.properties.Content || c.properties.Label || 'Tab'}
              icon={getIcon(c.properties.Icon || c.properties.Glyph || 'Home')}
              sx={{
                borderRadius: 3,
                '&.Mui-selected': {
                  color: AV.blue,
                  bgcolor: AV.blue50,
                },
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 600,
                  fontSize: 11,
                  fontFamily: 'inherit',
                },
                minWidth: 64,
                py: 1,
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Sel>
  )
}

/* ── Card — Avontus branded with blue-tinted shadows ─────────── */
const renderCard: CR = ctx => {
  const p = ctx.node.properties
  const v = p.Style || 'Elevated'
  const t = ctx.tokens
  const explicitBackground = p.Background
  const explicitBorder = p.BorderBrush
  const highlighted = p.Highlighted === 'True'
  return (
    <Sel ctx={ctx}>
      <MuiCard
        elevation={0}
        variant={v === 'Outlined' ? 'outlined' : 'elevation'}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          ...(v === 'Elevated' ? {
            bgcolor: AV.surface,
            boxShadow: highlighted ? AV.shadow3 : AV.shadow1,
            border: `1px solid ${muiAlpha(t.colors.outlineVariant, 0.3)}`,
            '&:hover': { boxShadow: AV.shadow2 },
            transition: 'box-shadow 300ms cubic-bezier(0.2, 0, 0, 1)',
          } : v === 'Filled' ? {
            bgcolor: AV.surface2,
            border: 'none',
          } : {
            bgcolor: AV.bg,
            border: `1px solid ${AV.outlineVar}`,
          }),
          ...(explicitBackground ? { bgcolor: explicitBackground } : {}),
          ...(explicitBorder ? { border: `1.5px solid ${explicitBorder}` } : {}),
        }}
      >
        <CardContent sx={{
          p: p.Padding ? parsePad(p.Padding) : '20px',
          '&:last-child': { pb: p.Padding ? parsePad(p.Padding) : '20px' },
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {ctx.renderChildren()}
        </CardContent>
      </MuiCard>
    </Sel>
  )
}

/* ── Divider ──────────────────────────────────────────────────── */
const renderDivider: CR = ctx => (
  <Sel ctx={ctx}><MuiDivider sx={{ my: 0.5, borderColor: AV.outlineVar }} /></Sel>
)

/* ── Icon ─────────────────────────────────────────────────────── */
const renderIcon: CR = ctx => {
  const p = ctx.node.properties
  const color = p.Foreground || undefined
  const size = numVal(p.FontSize, 22)
  const inNav = ctx.parentType === 'NavigationBar'
  return (
    <Sel ctx={ctx}>
      {inNav ? (
        <Box sx={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {getIcon(p.Glyph || 'Info', { fontSize: size, htmlColor: color })}
        </Box>
      ) : (
        <IconButton sx={{ flexShrink: 0 }}>
          {getIcon(p.Glyph || 'Info', { fontSize: size, htmlColor: color })}
        </IconButton>
      )}
    </Sel>
  )
}

/* ── FAB — Avontus branded ───────────────────────────────────── */
const renderFab: CR = ctx => {
  const p = ctx.node.properties
  const colorMap: Record<string, 'primary' | 'secondary' | 'default'> = {
    Primary: 'primary', Secondary: 'secondary', Tertiary: 'secondary', Surface: 'default',
  }
  return (
    <Sel ctx={ctx} sx={{ position: 'absolute', right: 16, bottom: 16, zIndex: 10 }}>
      <MuiFab
        color={colorMap[p.Style || 'Primary'] || 'primary'}
        sx={{
          boxShadow: AV.shadow3,
          borderRadius: '16px',
          width: 56,
          height: 56,
        }}
      >
        {getIcon(p.Content || 'Plus', { fontSize: 24 })}
      </MuiFab>
    </Sel>
  )
}

/* ── Chip — Avontus branded ──────────────────────────────────── */
const renderChip: CR = ctx => {
  const p = ctx.node.properties
  const on = p.Style === 'Filter' || p.IsSelected === 'True'
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        border: `1px solid ${on ? AV.blue : AV.outline}`,
        background: on ? AV.blue50 : 'transparent',
        color: on ? AV.blue : AV.onSurface,
      }}>
        {on && <CheckIcon sx={{ fontSize: 16 }} />}
        {p.Content || 'Chip'}
      </div>
    </Sel>
  )
}

/* ── ListView — Proper list with dividers ─────────────────────── */
const renderListView: CR = ctx => {
  const ch = ctx.node.children || []
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {ch.map((child, i) => (
          <React.Fragment key={child.id}>
            <div style={{
              padding: '12px 16px',
              borderBottom: i < ch.length - 1 ? `1px solid ${AV.surface3}` : 'none',
            }}>
              <RenderNode
                node={child}
                tokens={ctx.tokens}
                selectedId={ctx.selectedId}
                onSelect={ctx.onSelect}
                onMove={ctx.onMove}
                parentType={ctx.node.type}
                previewMode={ctx.previewMode}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </Sel>
  )
}

/* ── GridView — Proper card grid ──────────────────────────────── */
const renderGridView: CR = ctx => (
  <Sel ctx={ctx}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
      {ctx.renderChildren()}
    </Box>
  </Sel>
)

/* ── Border ────────────────────────────────────────────────────── */
const renderBorder: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <Box sx={{
        bgcolor: p.Background || 'transparent',
        borderRadius: numVal(p.CornerRadius, 0) + 'px',
        padding: parsePad(p.Padding),
        border: p.BorderBrush ? `1px solid ${p.BorderBrush}` : undefined,
      }}>
        {ctx.renderChildren()}
      </Box>
    </Sel>
  )
}

/* ── NavigationViewItem ───────────────────────────────────────── */
const renderNavItem: CR = ctx => {
  const p = ctx.node.properties
  const on = p.IsSelected === 'True'
  return (
    <Sel ctx={ctx}>
      <ListItemButton selected={on} sx={{
        borderRadius: '28px', mb: 0.5,
        '&.Mui-selected': { bgcolor: AV.blue50, color: AV.blue },
      }}>
        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
          {getIcon(p.Icon || p.Glyph || 'Home')}
        </ListItemIcon>
        <ListItemText primary={p.Content || 'Item'} primaryTypographyProps={{ fontWeight: 500, fontFamily: 'inherit' }} />
      </ListItemButton>
    </Sel>
  )
}

/* ══════════════════════════════════════════════════════════════
   NEW COMPONENT RENDERERS — Avontus Design System
   ══════════════════════════════════════════════════════════════ */

/* ── Select / Dropdown — Avontus outlined dropdown field ─────── */
const renderSelect: CR = ctx => {
  const p = ctx.node.properties
  const label = p.Header || 'Select'
  const selected = p.SelectedItem || ''
  const placeholder = p.PlaceholderText || 'Choose...'
  const hasValue = Boolean(selected)
  const { config: vConfig, message: validationMsg } = getValidation(p)
  const borderColor = vConfig ? vConfig.color : AV.outlineVar
  const labelColor = vConfig ? vConfig.color : (hasValue ? AV.blue : AV.onSurfaceVar)
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 12, top: hasValue ? -8 : 16,
          fontSize: hasValue ? 12 : 14,
          fontWeight: 500,
          color: labelColor,
          background: hasValue ? AV.bg : 'transparent',
          padding: hasValue ? '0 4px' : 0,
          transition: 'all 150ms ease',
          fontFamily: 'inherit',
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          {label}
        </div>
        <div style={{
          border: `${vConfig ? '2px' : '1px'} solid ${borderColor}`,
          borderRadius: 4,
          padding: '16px 40px 8px 12px',
          fontSize: 14,
          fontFamily: 'inherit',
          color: hasValue ? AV.onSurface : `${AV.onSurfaceVar}99`,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{selected || placeholder}</span>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            {vConfig ? <span style={{ color: vConfig.color }}>{vConfig.icon}</span> : <KeyboardArrowDownIcon sx={{ fontSize: 20, color: AV.onSurfaceVar }} />}
          </div>
        </div>
        <ValidationMessage config={vConfig} message={validationMsg} />
      </div>
    </Sel>
  )
}

/* ── DatePicker — Avontus date input ────────────────────────── */
const renderDatePicker: CR = ctx => {
  const p = ctx.node.properties
  const label = p.Header || 'Date'
  const date = p.Date || ''
  const hasValue = Boolean(date)
  const { config: vConfig, message: validationMsg } = getValidation(p)
  const borderColor = vConfig ? vConfig.color : AV.outlineVar
  const labelColor = vConfig ? vConfig.color : (hasValue ? AV.blue : AV.onSurfaceVar)
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 12, top: hasValue ? -8 : 16,
          fontSize: hasValue ? 12 : 14,
          fontWeight: 500,
          color: labelColor,
          background: hasValue ? AV.bg : 'transparent',
          padding: hasValue ? '0 4px' : 0,
          transition: 'all 150ms ease',
          fontFamily: 'inherit',
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          {label}
        </div>
        <div style={{
          border: `${vConfig ? '2px' : '1px'} solid ${borderColor}`,
          borderRadius: 4,
          padding: '16px 40px 8px 12px',
          fontSize: 14,
          fontFamily: 'inherit',
          color: hasValue ? AV.onSurface : `${AV.onSurfaceVar}99`,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{date || 'mm/dd/yyyy'}</span>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            {vConfig ? <span style={{ color: vConfig.color }}>{vConfig.icon}</span> : <CalendarTodayIcon sx={{ fontSize: 20, color: AV.onSurfaceVar }} />}
          </div>
        </div>
        <ValidationMessage config={vConfig} message={validationMsg} />
      </div>
    </Sel>
  )
}

/* ── IconButton — Avontus branded ────────────────────────────── */
const renderIconButton: CR = ctx => {
  const p = ctx.node.properties
  const style = p.Style || 'Standard'
  const glyph = p.Glyph || 'Settings'
  const variants: Record<string, React.CSSProperties> = {
    Standard: { background: 'transparent', color: AV.onSurfaceVar, border: 'none' },
    Filled: { background: AV.blue, color: '#FFFFFF', border: 'none' },
    FilledTonal: { background: AV.blue50, color: AV.blue, border: 'none' },
    Outlined: { background: 'transparent', color: AV.onSurfaceVar, border: `1px solid ${AV.outline}` },
  }
  return (
    <Sel ctx={ctx}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        ...variants[style],
      }}>
        {getIcon(glyph, { fontSize: 22, htmlColor: variants[style]?.color as string })}
      </div>
    </Sel>
  )
}

/* ── SegmentedButton — Avontus segmented toggle ──────────────── */
const renderSegmentedButton: CR = ctx => {
  const ch = ctx.node.children || []
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'inline-flex',
        borderRadius: 9999,
        border: `1px solid ${AV.outline}`,
        overflow: 'hidden',
      }}>
        {ch.map((child, i) => {
          const isSelected = child.properties.Style === 'Tonal' || child.properties.IsSelected === 'True'
          return (
            <div
              key={child.id}
              style={{
                padding: '0 20px',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                background: isSelected ? AV.blue50 : 'transparent',
                color: isSelected ? AV.blue : AV.onSurface,
                borderRight: i < ch.length - 1 ? `1px solid ${AV.outline}` : 'none',
                gap: 6,
              }}
            >
              {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
              {child.properties.Content || `Segment ${i + 1}`}
            </div>
          )
        })}
      </div>
    </Sel>
  )
}

/* ── Tabs — Avontus tab bar ──────────────────────────────────── */
const renderTabs: CR = ctx => {
  const ch = ctx.node.children || []
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${AV.outlineVar}`,
        width: '100%',
      }}>
        {ch.map((child) => {
          const isSelected = child.properties.IsSelected === 'True'
          return (
            <div
              key={child.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                color: isSelected ? AV.blue : AV.onSurfaceVar,
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                fontFamily: 'inherit',
                position: 'relative',
                gap: 4,
              }}
            >
              {child.properties.Icon && getIcon(child.properties.Icon, { fontSize: 20, htmlColor: isSelected ? AV.blue : AV.onSurfaceVar })}
              {child.properties.Content || 'Tab'}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: AV.blue,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </Sel>
  )
}

/* ── Snackbar — Avontus branded ──────────────────────────────── */
const renderSnackbar: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderRadius: 8,
        background: '#323232',
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'inherit',
        gap: 12,
        boxShadow: AV.shadow2,
        width: '100%',
      }}>
        <span>{p.Content || 'Snackbar message'}</span>
        {p.ActionText && (
          <span style={{ color: AV.lightBlue, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            {p.ActionText}
          </span>
        )}
      </div>
    </Sel>
  )
}

/* ── Badge — Avontus branded ─────────────────────────────────── */
const renderBadge: CR = ctx => {
  const p = ctx.node.properties
  const style = p.Style || 'Error'
  const colorMap: Record<string, { bg: string; text: string }> = {
    Error: { bg: AV.error, text: '#FFFFFF' },
    Info: { bg: AV.blue, text: '#FFFFFF' },
    Success: { bg: AV.teal, text: '#FFFFFF' },
    Warning: { bg: AV.warning, text: AV.navy },
  }
  const colors = colorMap[style] || colorMap.Error
  const content = p.Content || ''
  const isDot = !content
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: isDot ? 8 : 20,
        height: isDot ? 8 : 20,
        borderRadius: 9999,
        background: colors.bg,
        color: colors.text,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'inherit',
        padding: isDot ? 0 : '0 6px',
      }}>
        {content}
      </div>
    </Sel>
  )
}

/* ── Dialog — Avontus branded modal card ─────────────────────── */
const renderDialog: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <div style={{
        borderRadius: 16,
        background: AV.bg,
        boxShadow: AV.shadow3,
        padding: p.Padding ? parsePad(p.Padding) : '24px',
        minWidth: 200,
        maxWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'inherit',
      }}>
        {p.Title && (
          <div style={{ fontSize: 24, fontWeight: 700, color: AV.onSurface, lineHeight: '32px' }}>
            {p.Title}
          </div>
        )}
        {ctx.renderChildren()}
      </div>
    </Sel>
  )
}

/* ── BottomSheet — Avontus branded bottom sheet ──────────────── */
const renderBottomSheet: CR = ctx => {
  const p = ctx.node.properties
  return (
    <Sel ctx={ctx}>
      <div style={{
        borderRadius: '16px 16px 0 0',
        background: AV.surface,
        boxShadow: AV.shadow3,
        padding: p.Padding ? parsePad(p.Padding) : '24px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'inherit',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: AV.outlineVar }} />
        </div>
        {ctx.renderChildren()}
      </div>
    </Sel>
  )
}

/* ── ValidationSummary — popover card listing validation issues ── */
const renderValidationSummary: CR = ctx => {
  const p = ctx.node.properties
  const isOpen = p.IsOpen !== 'False'
  const title = p.Title || 'Validation'
  const children = ctx.node.children || []

  if (!isOpen) return <Sel ctx={ctx}><div /></Sel>

  // Determine worst severity for header color
  const severities = children.map(c => c.properties.Style || c.properties.Severity || 'Info')
  const worstSeverity = severities.includes('Error') ? 'Error' : severities.includes('Warning') ? 'Warning' : 'Info'
  const headerConfig = VALIDATION_CONFIG[worstSeverity] || VALIDATION_CONFIG.Info

  return (
    <Sel ctx={ctx}>
      <div style={{
        borderRadius: 12,
        background: AV.bg,
        border: `1px solid ${AV.outlineVar}`,
        boxShadow: AV.shadow2,
        minWidth: 240,
        maxWidth: 360,
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: headerConfig.bg,
          borderBottom: `1px solid ${AV.outlineVar}`,
        }}>
          <div style={{ color: headerConfig.color, display: 'flex', flexShrink: 0 }}>
            {headerConfig.icon}
          </div>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: AV.onSurface,
            flex: 1,
          }}>
            {title}
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: AV.onSurfaceVar,
            background: AV.surface2,
            borderRadius: 10,
            padding: '1px 8px',
          }}>
            {children.length}
          </span>
        </div>

        {/* Issue list */}
        <div style={{ padding: '4px 0', maxHeight: 240, overflow: 'auto' }}>
          {children.map((child, i) => {
            const severity = child.properties.Style || child.properties.Severity || 'Info'
            const config = VALIDATION_CONFIG[severity] || VALIDATION_CONFIG.Info
            const message = child.properties.Content || child.properties.Text || 'Validation issue'
            return (
              <div key={child.id || i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 16px',
                fontSize: 13,
                lineHeight: '18px',
                color: AV.onSurface,
                cursor: 'pointer',
                borderBottom: i < children.length - 1 ? `1px solid ${AV.surface3}` : 'none',
              }}>
                <div style={{ color: config.color, flexShrink: 0, marginTop: 1, display: 'flex' }}>
                  {config.icon}
                </div>
                <span>{message}</span>
              </div>
            )
          })}
          {children.length === 0 && (
            <div style={{ padding: '12px 16px', fontSize: 13, color: AV.onSurfaceVar, textAlign: 'center' }}>
              No validation issues
            </div>
          )}
        </div>
      </div>
    </Sel>
  )
}

/* ── InfoBar — Avontus branded info/validation bar ───────────── */
const renderInfoBar: CR = ctx => {
  const p = ctx.node.properties
  const style = p.Style || 'Info'
  const configMap: Record<string, { bg: string; border: string; icon: React.ReactElement; color: string }> = {
    Info: { bg: '#E8E9FD', border: AV.blue, icon: <InfoIcon sx={{ fontSize: 20 }} />, color: AV.navy },
    Success: { bg: '#C8F5ED', border: AV.teal, icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: '#004E43' },
    Warning: { bg: '#FFF3CD', border: AV.warning, icon: <WarningIcon sx={{ fontSize: 20 }} />, color: '#5D4300' },
    Error: { bg: '#FFDAD6', border: AV.error, icon: <ErrorOutlineIcon sx={{ fontSize: 20 }} />, color: '#5F1412' },
  }
  const config = configMap[style] || configMap.Info
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        background: config.bg,
        borderLeft: `3px solid ${config.border}`,
        color: config.color,
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'inherit',
        width: '100%',
      }}>
        <div style={{ flexShrink: 0, marginTop: 1, color: config.border }}>{config.icon}</div>
        <span>{p.Content || 'Information message'}</span>
      </div>
    </Sel>
  )
}

/* ── DataTable ── */
const renderDataTable: CR = ctx => {
  const p = ctx.node.properties
  const headersFromProps = String(p.Columns || '')
    .split(',')
    .map(h => h.trim())
    .filter(Boolean)
  const headers = headersFromProps.length > 0 ? headersFromProps : (ctx.node.children || []).map(c => c.properties.Text || 'Column')
  let rows: Array<Record<string, string> | string[]> = []
  try {
    const parsed = JSON.parse(p.RowsJson || p.Rows || '[]')
    if (Array.isArray(parsed)) rows = parsed
  } catch {}
  const fallbackRows = [1, 2, 3].map(row => Object.fromEntries((headers.length > 0 ? headers : ['Name', 'Status', 'Qty']).map((header, index) => {
    if (/status/i.test(header)) return [header, row === 1 ? 'Active' : 'Pending']
    if (/(qty|amount|total|value|count|price)/i.test(header)) return [header, String(row * 12)]
    return [header, `Row ${row}${index === 0 ? '' : `-${index + 1}`}`]
  })))
  const displayRows = rows.length > 0 ? rows : fallbackRows
  const isScrollable = p.Scrollable === 'True'
  const bodyMaxHeight = isScrollable ? numVal(p.Height, 360) : undefined

  const getCellValue = (row: Record<string, string> | string[], header: string, index: number): string => {
    if (Array.isArray(row)) return String(row[index] ?? '')
    return String(row[header] ?? row[header.toLowerCase()] ?? '')
  }

  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', border: `1px solid ${AV.outlineVar}`, borderRadius: 12, overflow: 'hidden', fontFamily: 'inherit' }}>
        {/* Header row */}
        <div style={{ display: 'flex', background: AV.surface2, borderBottom: `1px solid ${AV.outlineVar}`, padding: '10px 16px', gap: 8 }}>
          {headers.length > 0 ? headers.map((h, i) => (
            <div key={i} style={{ flex: 1, fontSize: 12, fontWeight: 600, color: AV.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
          )) : (
            <>
              <div style={{ flex: 2, fontSize: 12, fontWeight: 600, color: AV.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: AV.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: AV.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Qty</div>
            </>
          )}
        </div>
        <div style={{ maxHeight: bodyMaxHeight ? `${bodyMaxHeight}px` : undefined, overflowY: isScrollable ? 'auto' : 'visible' }}>
          {displayRows.map((row, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'flex', padding: '10px 16px', gap: 8,
              borderBottom: rowIndex < displayRows.length - 1 ? `1px solid ${AV.outlineVar}` : undefined,
              background: p.SelectionMode !== 'None' && rowIndex === 0 ? AV.blue50 : 'transparent',
            }}>
              {headers.length > 0 ? headers.map((header, i) => {
                const value = getCellValue(row, header, i)
                const isStatus = /status/i.test(header)
                const isNumeric = /(qty|amount|total|value|count|price)/i.test(header)
                return (
                  <div key={i} style={{ flex: i === 0 ? 1.4 : 1, fontSize: 14, color: AV.onSurface, textAlign: isNumeric ? 'right' : 'left' }}>
                    {isStatus ? (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: /ready|active|shipped|packed/i.test(value) ? '#C8F5ED' : /delay|critical/i.test(value) ? '#FDE7E9' : AV.surface2, color: /ready|active|shipped|packed/i.test(value) ? AV.teal : /delay|critical/i.test(value) ? '#B3261E' : AV.onSurfaceVar }}>
                        {value}
                      </span>
                    ) : value}
                  </div>
                )
              }) : (
              <>
                <div style={{ flex: 2, fontSize: 14, color: AV.onSurface }}>Item {rowIndex + 1}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: rowIndex === 0 ? '#C8F5ED' : AV.surface2, color: rowIndex === 0 ? AV.teal : AV.onSurfaceVar }}>
                    {rowIndex === 0 ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div style={{ flex: 1, fontSize: 14, color: AV.onSurface, textAlign: 'right' }}>{(rowIndex + 1) * 12}</div>
              </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Sel>
  )
}

/* ── Stepper (NumberBox) ── */
const renderStepper: CR = ctx => {
  const p = ctx.node.properties
  const label = p.Header || ''
  const value = p.Value || '1'
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', fontFamily: 'inherit' }}>
        {label && <div style={{ fontSize: 12, color: AV.onSurfaceVar, marginBottom: 4 }}>{label}</div>}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 0,
          border: `1px solid ${AV.outlineVar}`, borderRadius: 8, overflow: 'hidden',
        }}>
          <div style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: AV.blue, borderRight: `1px solid ${AV.outlineVar}`,
          }}>
            <RemoveIcon sx={{ fontSize: 18 }} />
          </div>
          <div style={{
            width: 56, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600, color: AV.onSurface, fontFamily: 'inherit',
          }}>
            {value}
          </div>
          <div style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: AV.blue, borderLeft: `1px solid ${AV.outlineVar}`,
          }}>
            <AddIcon sx={{ fontSize: 18 }} />
          </div>
        </div>
      </div>
    </Sel>
  )
}

/* ── Tooltip / TeachingTip ── */
const renderTooltip: CR = ctx => {
  const p = ctx.node.properties
  const content = p.Content || 'Tooltip text'
  const title = p.Title || ''
  const isRich = Boolean(title)
  if (isRich) {
    return (
      <Sel ctx={ctx}>
        <div style={{
          position: 'relative', padding: '12px 16px', borderRadius: 8,
          border: `1px solid ${AV.outlineVar}`, background: AV.bg, boxShadow: AV.shadow2,
          maxWidth: 280, fontFamily: 'inherit',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: AV.onSurface, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color: AV.onSurfaceVar, lineHeight: 1.5 }}>{content}</div>
        </div>
      </Sel>
    )
  }
  return (
    <Sel ctx={ctx}>
      <div style={{
        display: 'inline-block', padding: '6px 12px', borderRadius: 4,
        background: AV.onSurface, color: '#FFFFFF', fontSize: 12, fontFamily: 'inherit',
        boxShadow: AV.shadow1,
      }}>
        {content}
      </div>
    </Sel>
  )
}

/* ── TimePicker ── */
const renderTimePicker: CR = ctx => {
  const p = ctx.node.properties
  const label = p.Header || 'Time'
  const time = p.Time || ''
  const hasValue = Boolean(time)
  const { config: vConfig, message: validationMsg } = getValidation(p)
  const borderColor = vConfig ? vConfig.color : AV.outlineVar
  const labelColor = vConfig ? vConfig.color : (hasValue ? AV.blue : AV.onSurfaceVar)
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', position: 'relative', fontFamily: 'inherit' }}>
        <div style={{
          position: 'absolute', left: 12, top: hasValue ? 6 : 16,
          fontSize: hasValue ? 12 : 14, color: labelColor,
          transition: 'all 0.15s', pointerEvents: 'none', fontFamily: 'inherit',
        }}>
          {label}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56, padding: hasValue ? '22px 12px 6px' : '16px 12px',
          border: `${vConfig ? '2px' : '1px'} solid ${borderColor}`, borderRadius: 4,
          fontSize: 14, color: AV.onSurface, background: 'transparent',
          overflow: 'hidden', boxSizing: 'border-box',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{time || ''}</span>
          {vConfig ? <span style={{ color: vConfig.color, display: 'flex', flexShrink: 0 }}>{vConfig.icon}</span> : <AccessTimeIcon sx={{ fontSize: 20, color: AV.onSurfaceVar, flexShrink: 0 }} />}
        </div>
        <ValidationMessage config={vConfig} message={validationMsg} />
      </div>
    </Sel>
  )
}

/* ── AutoSuggestBox ── */
const renderAutoSuggestBox: CR = ctx => {
  const p = ctx.node.properties
  const label = p.Header || 'Search'
  const text = p.Text || ''
  const placeholder = p.PlaceholderText || 'Type to search...'
  const hasValue = Boolean(text)
  const { config: vConfig, message: validationMsg } = getValidation(p)
  const borderColor = vConfig ? vConfig.color : AV.outlineVar
  const labelColor = vConfig ? vConfig.color : (hasValue ? AV.blue : AV.onSurfaceVar)
  return (
    <Sel ctx={ctx}>
      <div style={{ width: '100%', position: 'relative', fontFamily: 'inherit' }}>
        <div style={{
          position: 'absolute', left: 12, top: hasValue ? 6 : 16,
          fontSize: hasValue ? 12 : 14, color: labelColor,
          transition: 'all 0.15s', pointerEvents: 'none', fontFamily: 'inherit',
        }}>
          {label}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56, padding: hasValue ? '22px 12px 6px' : '16px 12px',
          border: `${vConfig ? '2px' : '1px'} solid ${borderColor}`, borderRadius: 4,
          fontSize: 14, color: hasValue ? AV.onSurface : AV.outline, background: 'transparent',
          overflow: 'hidden', boxSizing: 'border-box',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{text || placeholder}</span>
          {vConfig ? <span style={{ color: vConfig.color, display: 'flex', flexShrink: 0 }}>{vConfig.icon}</span> : <SearchIcon sx={{ fontSize: 20, color: AV.onSurfaceVar, flexShrink: 0 }} />}
        </div>
        <ValidationMessage config={vConfig} message={validationMsg} />
      </div>
    </Sel>
  )
}

/* ── NavigationRail ── */
const renderNavigationRail: CR = ctx => {
  const items = ctx.node.children || []
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', width: '100%', minHeight: 200, fontFamily: 'inherit' }}>
        <div style={{
          width: 80, background: AV.surface, borderRight: `1px solid ${AV.outlineVar}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 4,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: AV.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <MenuIcon sx={{ fontSize: 22, color: '#FFF' }} />
          </div>
          {items.map((item, i) => {
            const sel = item.properties.IsSelected === 'True'
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '4px 0', width: '100%', cursor: 'pointer',
              }}>
                <div style={{
                  width: 48, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: sel ? AV.blue50 : 'transparent',
                }}>
                  {getIcon(item.properties.Icon || 'Home', { fontSize: 20, htmlColor: sel ? AV.blue : AV.onSurfaceVar })}
                </div>
                <span style={{ fontSize: 11, fontWeight: sel ? 600 : 400, color: sel ? AV.blue : AV.onSurfaceVar }}>
                  {item.properties.Content || ''}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1, padding: 16, background: AV.bg }}>
          <div style={{ fontSize: 13, color: AV.outline, fontStyle: 'italic' }}>Content area</div>
        </div>
      </div>
    </Sel>
  )
}

/* ── NavigationDrawer ── */
const renderNavigationDrawer: CR = ctx => {
  const p = ctx.node.properties
  const items = ctx.node.children || []
  const header = p.Header || 'App Name'
  return (
    <Sel ctx={ctx}>
      <div style={{ display: 'flex', width: '100%', minHeight: 200, fontFamily: 'inherit' }}>
        <div style={{
          width: 240, background: AV.surface, borderRight: `1px solid ${AV.outlineVar}`,
          display: 'flex', flexDirection: 'column', padding: '8px 12px',
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: AV.onSurface, padding: '12px 8px 16px', fontFamily: 'inherit' }}>
            {header}
          </div>
          {items.map((item, i) => {
            const sel = item.properties.IsSelected === 'True'
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 24, cursor: 'pointer',
                background: sel ? AV.blue50 : 'transparent',
                marginBottom: 2,
              }}>
                {getIcon(item.properties.Icon || 'Home', { fontSize: 20, htmlColor: sel ? AV.blue : AV.onSurfaceVar })}
                <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? AV.blue : AV.onSurfaceVar }}>
                  {item.properties.Content || ''}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1, padding: 16, background: AV.bg }}>
          <div style={{ fontSize: 13, color: AV.outline, fontStyle: 'italic' }}>Content area</div>
        </div>
      </div>
    </Sel>
  )
}

/* ── Fallback ─────────────────────────────────────────────────── */
const renderFallback: CR = ctx => (
  <Sel ctx={ctx}>
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" color="text.disabled">[{ctx.node.type}]</Typography>
      {ctx.renderChildren()}
    </Box>
  </Sel>
)

/* ── Registry ─────────────────────────────────────────────────── */
const R: Partial<Record<ComponentType, CR>> = {
  Page: renderPage,
  StackPanel: renderStackPanel,
  Grid: renderGrid,
  ScrollViewer: renderScrollViewer,
  TextBlock: renderTextBlock,
  Button: renderButton,
  TextBox: ctx => renderTextField(ctx, false),
  PasswordBox: ctx => renderTextField(ctx, true),
  Image: renderImage,
  Border: renderBorder,
  PersonPicture: renderPersonPicture,
  ToggleSwitch: renderToggleSwitch,
  CheckBox: renderCheckBox,
  RadioButton: renderRadioButton,
  Slider: renderSlider,
  ProgressBar: renderProgressBar,
  ProgressRing: renderProgressRing,
  NavigationBar: renderNavigationBar,
  BottomNavigationBar: renderBottomNav,
  Card: renderCard,
  Divider: renderDivider,
  Icon: renderIcon,
  FloatingActionButton: renderFab,
  Chip: renderChip,
  ListView: renderListView,
  GridView: renderGridView,
  NavigationViewItem: renderNavItem,
  Select: renderSelect,
  DatePicker: renderDatePicker,
  IconButton: renderIconButton,
  SegmentedButton: renderSegmentedButton,
  Tabs: renderTabs,
  Snackbar: renderSnackbar,
  Badge: renderBadge,
  Dialog: renderDialog,
  BottomSheet: renderBottomSheet,
  InfoBar: renderInfoBar,
  DataTable: renderDataTable,
  Stepper: renderStepper,
  Tooltip: renderTooltip,
  TimePicker: renderTimePicker,
  AutoSuggestBox: renderAutoSuggestBox,
  NavigationRail: renderNavigationRail,
  NavigationDrawer: renderNavigationDrawer,
  ValidationSummary: renderValidationSummary,
}

/* ── Tree walker ──────────────────────────────────────────────── */
function RenderNode({ node, tokens, selectedId, onSelect, onMove, onDelete, onDuplicate, onMoveUp, onMoveDown, onImageUpload, parentType = null, previewMode }: RendererProps) {
  const processedKids = node.children ? absorbValidationTextBlocks(node.children) : undefined
  const renderChildren = () => processedKids?.map(c =>
    <RenderNode key={c.id} node={c} tokens={tokens} selectedId={selectedId} onSelect={onSelect} onMove={onMove} onDelete={onDelete} onDuplicate={onDuplicate} onMoveUp={onMoveUp} onMoveDown={onMoveDown} onImageUpload={onImageUpload} parentType={node.type} previewMode={previewMode} />
  )
  return (R[node.type] || renderFallback)({ node, tokens, selectedId, onSelect, onMove, onDelete, onDuplicate, onMoveUp, onMoveDown, onImageUpload, renderChildren, parentType, previewMode })
}

/* ── Main renderer — MUI ThemeProvider maps design tokens ─────── */
export default function MD3Renderer({ node, tokens, selectedId, onSelect, onMove, onDelete, onDuplicate, onMoveUp, onMoveDown, onImageUpload, previewMode }: RendererProps) {
  const theme = useMemo(() => createTheme({
    cssVariables: false,
    palette: {
      primary: { main: tokens.colors.primary, contrastText: tokens.colors.onPrimary },
      secondary: { main: tokens.colors.secondary, contrastText: tokens.colors.onSecondary },
      error: { main: tokens.colors.error, contrastText: tokens.colors.onError },
      background: { default: tokens.colors.surfaceContainerLowest, paper: tokens.colors.surface },
      text: { primary: tokens.colors.onSurface, secondary: tokens.colors.onSurfaceVariant },
      divider: tokens.colors.outlineVariant,
    },
    typography: {
      fontFamily: `"${tokens.fontFamily}", "DM Sans", "Segoe UI", Roboto, system-ui, sans-serif`,
    },
    shape: { borderRadius: tokens.shape.medium },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(202,196,208,0.4)',
            color: '#1C1B1F',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: 'none',
            border: '1px solid #CAC4D0',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 },
          elevation1: { boxShadow: '0 1px 3px rgba(0,5,238,0.06), 0 1px 2px rgba(0,0,0,0.04)' },
          elevation2: { boxShadow: '0 4px 12px rgba(0,5,238,0.08), 0 2px 4px rgba(0,0,0,0.04)' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: `"${tokens.fontFamily}", "DM Sans", sans-serif`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  }), [tokens])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: '#FAFBFF',
        fontFamily: `"${tokens.fontFamily}", "DM Sans", "Segoe UI", Roboto, system-ui, sans-serif`,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        <RenderNode node={node} tokens={tokens} selectedId={selectedId} onSelect={onSelect} onMove={onMove} onDelete={onDelete} onDuplicate={onDuplicate} onMoveUp={onMoveUp} onMoveDown={onMoveDown} onImageUpload={onImageUpload} previewMode={previewMode} />
      </Box>
    </ThemeProvider>
  )
}
