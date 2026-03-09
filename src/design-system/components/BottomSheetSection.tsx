import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import PhoneFrame from '../shared/PhoneFrame'

/* ── Shared styles ── */
const sheetSurface: React.CSSProperties = {
  background: 'var(--av-bg)',
  borderRadius: '16px 16px 0 0',
  boxShadow: 'var(--av-shadow-4)',
  width: '100%',
}

const dragHandle: React.CSSProperties = {
  width: 32,
  height: 4,
  borderRadius: 2,
  background: 'var(--av-outline-variant)',
  margin: '8px auto 0',
}

const scrimOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1,
}

const sheetContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

/* ── Inline text field for form sheets ── */
function InlineField({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        position: 'relative',
        border: '1px solid var(--av-outline)',
        borderRadius: 'var(--av-radius-sm)',
        padding: '20px 16px 8px',
        background: 'transparent',
      }}>
        <label style={{
          position: 'absolute',
          top: 6,
          left: 16,
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--av-on-surface-variant)',
        }}>
          {label}
        </label>
        <div style={{
          fontSize: 14,
          color: value ? 'var(--av-on-surface)' : 'var(--av-outline)',
          fontFamily: 'var(--av-font-primary)',
        }}>
          {value || placeholder || ''}
        </div>
      </div>
    </div>
  )
}

/* ── Sample background content for phone frames ── */
function SampleAppContent({ dimmed }: { dimmed?: boolean }) {
  const opacity = dimmed ? 0.3 : 1
  return (
    <div style={{ padding: 16, opacity, transition: 'opacity 200ms' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--av-on-surface)' }}>Reservations</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--av-radius-full)',
            background: 'var(--av-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-on-surface-variant)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--av-radius-full)',
            background: 'var(--av-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-on-surface-variant)" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* List items */}
      {[
        { name: 'Riverside Tower', qty: '450 frames', badge: 'Active', color: '#004E43', bg: 'var(--av-success-container)' },
        { name: 'Harbor Bridge', qty: '120 frames', badge: 'Pending', color: '#5D4300', bg: 'var(--av-warning-container)' },
        { name: 'Metro Station B2', qty: '280 frames', badge: 'Shipped', color: '#000377', bg: 'var(--av-info-container)' },
      ].map((item) => (
        <div key={item.name} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid var(--av-surface-3)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>{item.name}</div>
            <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>{item.qty}</div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 10px',
            borderRadius: 'var(--av-radius-full)', color: item.color, background: item.bg,
          }}>
            {item.badge}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Action list item ── */
function ActionItem({
  icon, label, description, destructive,
}: {
  icon: React.ReactNode
  label: string
  description?: string
  destructive?: boolean
}) {
  const color = destructive ? 'var(--av-error)' : 'var(--av-on-surface)'
  const iconColor = destructive ? 'var(--av-error)' : 'var(--av-on-surface-variant)'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 20px',
      cursor: 'pointer',
      transition: 'background 150ms',
    }}>
      <div style={{ color: iconColor, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>{description}</div>
        )}
      </div>
    </div>
  )
}

/* ── Modal Bottom Sheet ── */
function ModalBottomSheet() {
  return (
    <PhoneFrame title="Modal Bottom Sheet" description="Overlays content with a scrim. Used for non-critical choices that don't warrant a full dialog.">
      <div style={{ position: 'relative', height: '100%', minHeight: 524 }}>
        <SampleAppContent dimmed />
        <div style={scrimOverlay} />
        <div style={sheetContainer}>
          <div style={sheetSurface}>
            <div style={dragHandle} />
            <div style={{ padding: '16px 20px 4px' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 4 }}>
                Sort Reservations
              </div>
              <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 12 }}>
                Choose how to order your reservation list.
              </div>
            </div>
            {[
              { label: 'Date Created (Newest)', selected: true },
              { label: 'Date Created (Oldest)', selected: false },
              { label: 'Project Name (A-Z)', selected: false },
              { label: 'Status', selected: false },
              { label: 'Delivery Date', selected: false },
            ].map((opt) => (
              <div key={opt.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                cursor: 'pointer',
                background: opt.selected ? 'var(--av-blue-50)' : 'transparent',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${opt.selected ? 'var(--av-blue)' : 'var(--av-on-surface-variant)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {opt.selected && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--av-blue)' }} />
                  )}
                </div>
                <span style={{
                  fontSize: 14,
                  color: opt.selected ? 'var(--av-blue)' : 'var(--av-on-surface)',
                  fontWeight: opt.selected ? 600 : 400,
                }}>
                  {opt.label}
                </span>
              </div>
            ))}
            <div style={{ height: 16 }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ── Standard Bottom Sheet ── */
function StandardBottomSheet() {
  return (
    <PhoneFrame title="Standard Bottom Sheet" description="Sits below the main content without a scrim. Used for persistent supplementary information.">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 524 }}>
        {/* Main content area */}
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--av-on-surface)', marginBottom: 4 }}>
            Riverside Tower
          </div>
          <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 16 }}>
            RSV-2026-0847
          </div>

          {/* Map placeholder */}
          <div style={{
            height: 160,
            borderRadius: 'var(--av-radius-lg)',
            background: 'linear-gradient(135deg, var(--av-blue-50) 0%, var(--av-blue-100) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--av-blue-300)" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', lineHeight: 1.5 }}>
            Delivery site located at 1234 Harbor Blvd, Suite 200. Tap for directions.
          </div>
        </div>

        {/* Standard sheet -- sits at bottom */}
        <div style={{
          ...sheetSurface,
          borderTop: '1px solid var(--av-outline-variant)',
          boxShadow: '0 -4px 12px rgba(0,5,238,0.06)',
        }}>
          <div style={dragHandle} />
          <div style={{ padding: '12px 20px 16px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 8 }}>
              Delivery Details
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 6 }}>
              <span>Scheduled</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>March 15, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 6 }}>
              <span>Qty</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>450 frames</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)' }}>
              <span>Status</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 10px',
                borderRadius: 'var(--av-radius-full)', color: '#004E43', background: 'var(--av-success-container)',
              }}>
                In Transit
              </span>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ── Bottom Sheet with Action List ── */
function ActionListSheet() {
  return (
    <PhoneFrame title="Action List Sheet" description="A menu of actions presented as a bottom sheet. Ideal for contextual options on a long-pressed or selected item.">
      <div style={{ position: 'relative', height: '100%', minHeight: 524 }}>
        <SampleAppContent dimmed />
        <div style={scrimOverlay} />
        <div style={sheetContainer}>
          <div style={sheetSurface}>
            <div style={dragHandle} />
            <div style={{ padding: '16px 20px 4px' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>
                Riverside Tower
              </div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2, marginBottom: 8 }}>
                RSV-2026-0847 -- 450 frames
              </div>
              <div style={{ height: 1, background: 'var(--av-outline-variant)' }} />
            </div>
            <ActionItem
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
              label="Edit Reservation"
              description="Modify quantities, dates, or project details"
            />
            <ActionItem
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
              label="Duplicate"
              description="Create a copy of this reservation"
            />
            <ActionItem
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>}
              label="Share"
              description="Send reservation details via email"
            />
            <ActionItem
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>}
              label="Export PDF"
            />
            <div style={{ height: 1, background: 'var(--av-outline-variant)', margin: '4px 20px' }} />
            <ActionItem
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>}
              label="Delete Reservation"
              destructive
            />
            <div style={{ height: 16 }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ── Bottom Sheet with Form ── */
function FormSheet() {
  return (
    <PhoneFrame title="Form Bottom Sheet" description="A bottom sheet containing form fields for quick data entry without navigating away from the current view.">
      <div style={{ position: 'relative', height: '100%', minHeight: 524 }}>
        <SampleAppContent dimmed />
        <div style={scrimOverlay} />
        <div style={sheetContainer}>
          <div style={sheetSurface}>
            <div style={dragHandle} />
            <div style={{ padding: '16px 20px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>
                  Quick Add Equipment
                </div>
                <button style={{
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', background: 'none', cursor: 'pointer', color: 'var(--av-on-surface-variant)',
                  borderRadius: 'var(--av-radius-full)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <InlineField label="Equipment Type" value="Scaffold Frames" />
              <InlineField label="Quantity" value="50" />
              <InlineField label="Notes" placeholder="Optional notes..." />
              <button className="ds-btn ds-btn-filled" style={{ width: '100%', marginTop: 4 }}>
                Add to Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ── Expandable Bottom Sheet ── */
function ExpandableSheet() {
  const [expanded, setExpanded] = useState(false)

  return (
    <PhoneFrame title="Expandable Sheet" description="Sheets can expand from a peek height to reveal more content. Tap the drag handle area to toggle.">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 524 }}>
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--av-on-surface)', marginBottom: 4 }}>
            Equipment List
          </div>
          <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 16 }}>
            Riverside Tower Project
          </div>

          {[
            { name: 'Scaffold Frames', qty: 450, icon: 'F' },
            { name: 'Cross Braces', qty: 120, icon: 'B' },
            { name: 'Base Plates', qty: 45, icon: 'P' },
          ].map((item) => (
            <div key={item.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid var(--av-surface-3)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--av-radius-md)',
                background: 'var(--av-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--av-blue)',
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)' }}>{item.name}</div>
              </div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface-variant)' }}>
                {item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* Expandable sheet */}
        <div style={{
          ...sheetSurface,
          borderTop: '1px solid var(--av-outline-variant)',
          boxShadow: '0 -4px 12px rgba(0,5,238,0.06)',
          transition: 'max-height 300ms cubic-bezier(0.2, 0, 0, 1)',
          maxHeight: expanded ? 320 : 100,
          overflow: 'hidden',
        }}>
          <div
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: 'pointer', padding: '0 20px' }}
          >
            <div style={dragHandle} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>
                Order Summary
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                  color: 'var(--av-on-surface-variant)',
                  transition: 'transform 300ms',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
              </svg>
            </div>
          </div>
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 8 }}>
              <span>Total Items</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>615</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 8 }}>
              <span>Estimated Weight</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>12,300 kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 8 }}>
              <span>Trucks Required</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--av-on-surface-variant)', marginBottom: 16 }}>
              <span>Delivery Date</span>
              <span style={{ fontWeight: 600, color: 'var(--av-on-surface)' }}>March 15, 2026</span>
            </div>
            <button className="ds-btn ds-btn-filled" style={{ width: '100%' }}>
              Confirm Shipment
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default function BottomSheetSection() {
  return (
    <section id="bottom-sheets" className="ds-section">
      <SectionHeader
        label="Component"
        title="Bottom Sheets"
        description="Slide-up surfaces for supplementary content and quick actions."
      />

      {/* ── Modal Bottom Sheet ── */}
      <SubSection
        title="Modal Bottom Sheet"
        description="Modal sheets overlay the current content with a scrim and require the user to interact before returning to the underlying view. Used for non-critical decisions like sorting, filtering, or selecting options."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Sort Options (Modal)',
              tag: 'Phone Frame',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <ModalBottomSheet />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Standard Bottom Sheet ── */}
      <SubSection
        title="Standard Bottom Sheet"
        description="Standard sheets sit below the main content without a scrim. They remain visible alongside the primary content and can be expanded or collapsed. Used for persistent supplementary details."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Delivery Details (Standard)',
              tag: 'Phone Frame',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <StandardBottomSheet />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Action List ── */}
      <SubSection
        title="With Action List"
        description="A bottom sheet presenting a list of contextual actions. Each action has an icon and label. Destructive actions are separated by a divider and displayed in the error color."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Contextual Actions',
              tag: 'Phone Frame',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <ActionListSheet />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Form Content ── */}
      <SubSection
        title="With Form Content"
        description="Bottom sheets can contain form fields for quick data entry. The sheet should include a clear title, close button, and a primary action button. Keep forms short -- use a full-screen dialog for complex input."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Quick Add Equipment',
              tag: 'Phone Frame',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <FormSheet />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Expandable Sheet ── */}
      <SubSection
        title="Expandable Sheet"
        description="Sheets can expand from a compact peek height to reveal additional content. The drag handle provides a visual affordance for expansion. Tap the handle area in the demo below to toggle."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Order Summary (Expandable)',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <ExpandableSheet />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Anatomy ── */}
      <SubSection
        title="Anatomy"
        description="A bottom sheet is composed of a drag handle, optional header, content area, and optional action footer. The surface uses a 16px top-corner radius and the highest elevation shadow."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Sheet Anatomy',
              tag: 'Reference',
              content: (
                <div style={{
                  maxWidth: 340,
                  margin: '0 auto',
                  background: 'var(--av-surface)',
                  borderRadius: 16,
                  border: '1px solid var(--av-outline-variant)',
                  overflow: 'hidden',
                }}>
                  {/* Drag handle area */}
                  <div style={{ padding: '8px 0 4px', textAlign: 'center' }}>
                    <div style={{ ...dragHandle, margin: '0 auto', position: 'relative' }} />
                    <div style={{ fontSize: 10, color: 'var(--av-blue)', fontFamily: 'var(--av-font-mono)', marginTop: 6 }}>
                      Drag Handle (32x4, centered)
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'var(--av-outline-variant)', margin: '4px 0' }} />

                  {/* Header */}
                  <div style={{ padding: '12px 20px', background: 'var(--av-blue-50)' }}>
                    <div style={{ fontSize: 10, color: 'var(--av-blue)', fontFamily: 'var(--av-font-mono)', marginBottom: 4 }}>Header (optional)</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>Sheet Title</div>
                    <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>Supporting text</div>
                  </div>
                  <div style={{ height: 1, background: 'var(--av-outline-variant)' }} />

                  {/* Content */}
                  <div style={{ padding: '16px 20px', minHeight: 80 }}>
                    <div style={{ fontSize: 10, color: 'var(--av-blue)', fontFamily: 'var(--av-font-mono)', marginBottom: 8 }}>Content Area</div>
                    <div style={{
                      height: 60,
                      border: '2px dashed var(--av-outline-variant)',
                      borderRadius: 'var(--av-radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: 'var(--av-on-surface-variant)',
                    }}>
                      Lists, forms, or custom content
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'var(--av-outline-variant)' }} />

                  {/* Footer */}
                  <div style={{ padding: '12px 20px', background: 'var(--av-blue-50)' }}>
                    <div style={{ fontSize: 10, color: 'var(--av-blue)', fontFamily: 'var(--av-font-mono)', marginBottom: 8 }}>Actions (optional)</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button className="ds-btn ds-btn-text" style={{ height: 32, fontSize: 12 }}>Cancel</button>
                      <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12 }}>Confirm</button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{
                width: 180,
                background: 'var(--av-bg)',
                borderRadius: '12px 12px 0 0',
                boxShadow: 'var(--av-shadow-3)',
                padding: '8px 0',
              }}>
                <div style={{ ...dragHandle, marginBottom: 8 }} />
                <div style={{ padding: '0 16px 8px', fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>Sort By</div>
                {['Newest', 'Oldest', 'Name'].map((o) => (
                  <div key={o} style={{ padding: '8px 16px', fontSize: 13, color: 'var(--av-on-surface)' }}>{o}</div>
                ))}
              </div>
            ),
            caption: 'Use bottom sheets for a small number of focused options. Include a drag handle for dismissibility.',
          },
          {
            type: 'dont',
            content: (
              <div style={{
                width: 180,
                background: 'var(--av-bg)',
                borderRadius: '12px 12px 0 0',
                boxShadow: 'var(--av-shadow-3)',
                padding: '8px 0',
              }}>
                <div style={{ padding: '4px 16px 4px', fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>Options</div>
                {['Edit', 'Copy', 'Share', 'Move', 'Archive', 'Pin', 'Label', 'Flag', 'Print', 'Export', 'Delete'].map((o) => (
                  <div key={o} style={{ padding: '4px 16px', fontSize: 11, color: 'var(--av-on-surface)' }}>{o}</div>
                ))}
              </div>
            ),
            caption: 'Don\'t overload bottom sheets with too many options. Use a navigation drawer or dedicated screen for long lists.',
          },
          {
            type: 'do',
            content: (
              <div style={{
                width: 180,
                background: 'var(--av-bg)',
                borderRadius: '12px 12px 0 0',
                boxShadow: 'var(--av-shadow-3)',
                padding: '8px 0',
              }}>
                <div style={{ ...dragHandle, marginBottom: 8 }} />
                <div style={{ padding: '4px 16px 8px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)' }}>Quick Add</div>
                </div>
                <div style={{ padding: '0 16px 12px' }}>
                  <div style={{ border: '1px solid var(--av-outline)', borderRadius: 4, padding: '6px 8px', fontSize: 11, color: 'var(--av-outline)', marginBottom: 8 }}>Equipment type</div>
                  <div style={{ border: '1px solid var(--av-outline)', borderRadius: 4, padding: '6px 8px', fontSize: 11, color: 'var(--av-outline)', marginBottom: 8 }}>Quantity</div>
                  <div style={{ background: 'var(--av-blue)', color: 'var(--av-bg, #fff)', borderRadius: 20, padding: '6px', textAlign: 'center', fontSize: 11, fontWeight: 600 }}>Add</div>
                </div>
              </div>
            ),
            caption: 'Keep form sheets short with 2-3 fields. Use full-screen dialogs for complex input.',
          },
          {
            type: 'dont',
            content: (
              <div style={{
                width: 180,
                background: 'var(--av-bg)',
                borderRadius: '12px 12px 0 0',
                boxShadow: 'var(--av-shadow-3)',
                padding: '8px 16px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 4 }}>New Reservation</div>
                {['Project', 'Client', 'Contact', 'Phone', 'Date', 'Return', 'Notes'].map((f) => (
                  <div key={f} style={{ border: '1px solid var(--av-outline-variant)', borderRadius: 3, padding: '3px 6px', fontSize: 9, color: 'var(--av-outline)', marginBottom: 4 }}>{f}</div>
                ))}
              </div>
            ),
            caption: 'Don\'t put complex multi-field forms in a bottom sheet. The limited vertical space causes excessive scrolling.',
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="BottomSheet"
          props={[
            {
              name: 'IsModal',
              type: 'bool',
              default: 'true',
              description: 'When true, displays a scrim overlay and blocks interaction with the underlying content.',
            },
            {
              name: 'IsOpen',
              type: 'bool',
              default: 'false',
              description: 'Controls visibility of the bottom sheet. Bind two-way for programmatic open/close.',
            },
            {
              name: 'PeekHeight',
              type: 'double',
              default: '0',
              description: 'The collapsed height of the sheet when partially visible. Set to 0 to hide when closed.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '16,16,0,0',
              description: 'Top corner radius of the sheet surface. Bottom corners are always 0.',
            },
            {
              name: 'ShowDragHandle',
              type: 'bool',
              default: 'true',
              description: 'Whether to display the drag handle indicator at the top of the sheet.',
            },
            {
              name: 'IsDismissEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the user can dismiss the sheet by swiping down or tapping the scrim.',
            },
            {
              name: 'Content',
              type: 'UIElement',
              description: 'The child content displayed inside the bottom sheet surface.',
            },
            {
              name: 'Background',
              type: 'Brush',
              default: 'Surface',
              description: 'Background color of the sheet surface.',
            },
            {
              name: 'ScrimOpacity',
              type: 'double',
              default: '0.4',
              description: 'Opacity of the background scrim for modal sheets. Range 0-1.',
            },
            {
              name: 'Opened',
              type: 'event',
              description: 'Event raised when the sheet finishes its open animation.',
            },
            {
              name: 'Closed',
              type: 'event',
              description: 'Event raised when the sheet finishes its close animation.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Modal Bottom Sheet -->
<utu:BottomSheet x:Name="SortSheet"
                 IsModal="True"
                 ShowDragHandle="True"
                 CornerRadius="16,16,0,0">
  <StackPanel Padding="20" Spacing="4">
    <TextBlock Text="Sort Reservations"
               Style="{StaticResource TitleMedium}" />
    <TextBlock Text="Choose how to order your list."
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}" />

    <RadioButtons Header=""
                  SelectedIndex="0">
      <RadioButton Content="Date Created (Newest)" />
      <RadioButton Content="Date Created (Oldest)" />
      <RadioButton Content="Project Name (A-Z)" />
      <RadioButton Content="Status" />
      <RadioButton Content="Delivery Date" />
    </RadioButtons>
  </StackPanel>
</utu:BottomSheet>

<!-- Standard (Non-Modal) Bottom Sheet -->
<utu:BottomSheet x:Name="DetailsSheet"
                 IsModal="False"
                 PeekHeight="100"
                 ShowDragHandle="True">
  <StackPanel Padding="20" Spacing="8">
    <TextBlock Text="Delivery Details"
               Style="{StaticResource TitleSmall}" />
    <Grid>
      <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*" />
        <ColumnDefinition Width="Auto" />
      </Grid.ColumnDefinitions>
      <TextBlock Text="Scheduled"
                 Style="{StaticResource BodyMedium}" />
      <TextBlock Grid.Column="1"
                 Text="{Binding DeliveryDate}"
                 Style="{StaticResource LabelLarge}" />
    </Grid>
  </StackPanel>
</utu:BottomSheet>

<!-- Action List Bottom Sheet -->
<utu:BottomSheet x:Name="ActionsSheet"
                 IsModal="True"
                 ShowDragHandle="True">
  <StackPanel>
    <TextBlock Text="Riverside Tower"
               Style="{StaticResource TitleMedium}"
               Margin="20,16,20,0" />
    <TextBlock Text="RSV-2026-0847"
               Style="{StaticResource BodySmall}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}"
               Margin="20,2,20,12" />
    <MenuFlyoutSeparator />

    <Button Style="{StaticResource SheetActionStyle}"
            Command="{Binding EditCommand}">
      <StackPanel Orientation="Horizontal" Spacing="16">
        <SymbolIcon Symbol="Edit" />
        <TextBlock Text="Edit Reservation" />
      </StackPanel>
    </Button>
    <Button Style="{StaticResource SheetActionStyle}"
            Command="{Binding DuplicateCommand}">
      <StackPanel Orientation="Horizontal" Spacing="16">
        <SymbolIcon Symbol="Copy" />
        <TextBlock Text="Duplicate" />
      </StackPanel>
    </Button>
    <Button Style="{StaticResource SheetActionStyle}"
            Command="{Binding ShareCommand}">
      <StackPanel Orientation="Horizontal" Spacing="16">
        <SymbolIcon Symbol="Share" />
        <TextBlock Text="Share" />
      </StackPanel>
    </Button>

    <MenuFlyoutSeparator />

    <Button Style="{StaticResource SheetActionDestructiveStyle}"
            Command="{Binding DeleteCommand}">
      <StackPanel Orientation="Horizontal" Spacing="16">
        <SymbolIcon Symbol="Delete" />
        <TextBlock Text="Delete Reservation" />
      </StackPanel>
    </Button>
  </StackPanel>
</utu:BottomSheet>

<!-- Form Bottom Sheet -->
<utu:BottomSheet x:Name="QuickAddSheet"
                 IsModal="True"
                 ShowDragHandle="True"
                 IsDismissEnabled="True">
  <Grid Padding="20" RowSpacing="12">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto" />
      <RowDefinition Height="Auto" />
      <RowDefinition Height="Auto" />
      <RowDefinition Height="Auto" />
      <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>

    <Grid>
      <TextBlock Text="Quick Add Equipment"
                 Style="{StaticResource TitleMedium}" />
      <Button Style="{StaticResource IconButtonStyle}"
              HorizontalAlignment="Right"
              Command="{Binding CloseSheetCommand}">
        <SymbolIcon Symbol="Dismiss" />
      </Button>
    </Grid>

    <TextBox Grid.Row="1"
             Header="Equipment Type"
             Text="{Binding EquipmentType, Mode=TwoWay}" />
    <NumberBox Grid.Row="2"
               Header="Quantity"
               Value="{Binding Quantity, Mode=TwoWay}"
               SpinButtonPlacementMode="Inline" />
    <TextBox Grid.Row="3"
             Header="Notes"
             Text="{Binding Notes, Mode=TwoWay}"
             PlaceholderText="Optional notes..." />
    <Button Grid.Row="4"
            Content="Add to Reservation"
            Style="{StaticResource FilledButtonStyle}"
            HorizontalAlignment="Stretch"
            Command="{Binding AddEquipmentCommand}" />
  </Grid>
</utu:BottomSheet>

<!-- Opening a sheet from code-behind / ViewModel -->
<!-- In XAML: -->
<Button Content="Sort"
        Click="OnSortClicked" />

<!-- In code-behind: -->
<!-- SortSheet.IsOpen = true; -->`}
        />
      </SubSection>
    </section>
  )
}
