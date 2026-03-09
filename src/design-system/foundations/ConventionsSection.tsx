import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import DoDontGrid from '../shared/DoDontGrid'
import CodeSnippet from '../shared/CodeSnippet'
import { Close, Back, Check, More, Delete, Edit, Add, Refresh } from '../shared/Icons'

/* ── Inline helpers ── */
function RuleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase' as const,
        color: 'var(--av-blue)',
        marginBottom: 8,
      }}>
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
        {children}
      </div>
    </div>
  )
}

function InlineLabel({ correct, text }: { correct?: boolean; text: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 6,
      fontSize: 14,
      fontWeight: 500,
      fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
      background: correct ? 'rgba(0,155,134,0.08)' : 'rgba(211,47,47,0.08)',
      color: correct ? 'var(--av-success, #009B86)' : 'var(--av-error, #D32F2F)',
      border: `1px solid ${correct ? 'var(--av-success, #009B86)' : 'var(--av-error, #D32F2F)'}`,
    }}>
      {correct ? <Check size={14} /> : <Close size={14} />}
      {text}
    </span>
  )
}

function ToolbarMode({
  label,
  description,
  leading,
  title,
  trailing,
  bg,
}: {
  label: string
  description: string
  leading: React.ReactNode
  title: string
  trailing: React.ReactNode
  bg?: string
}) {
  const btnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--av-on-surface, #1C1B1F)',
    flexShrink: 0,
  }

  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        padding: '0 4px',
        background: bg || 'var(--av-surface, #FAFBFF)',
        borderRadius: 10,
        border: '1px solid var(--av-outline-variant, #CAC4D0)',
      }}>
        <button style={btnStyle}>{leading}</button>
        <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', paddingLeft: 4 }}>
          {title}
        </div>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>{trailing}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  )
}

function CrudButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
      background: 'var(--av-surface, #FAFBFF)',
      border: '1px solid var(--av-outline-variant, #CAC4D0)',
      cursor: 'pointer',
      color: 'var(--av-on-surface, #1C1B1F)',
    }}>
      {icon}
      {label}
    </button>
  )
}

export default function ConventionsSection() {
  const btnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--av-on-surface, #1C1B1F)',
    flexShrink: 0,
  }

  return (
    <section id="conventions" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Conventions"
        description="Avontus-specific UX rules and patterns that ensure consistency across every Quantify screen."
      />

      {/* ── 1. Label Capitalization ── */}
      <SubSection
        title="Label Capitalization"
        description="All UI labels use sentence case — capitalize only the first word and proper nouns. This applies to buttons, menus, column headers, tab titles, and field labels throughout Quantify."
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <InlineLabel correct text="Remote server" />
          <InlineLabel correct text="Reservation details" />
          <InlineLabel correct text="Add equipment" />
          <InlineLabel correct text="Ship reservation" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <InlineLabel text="Remote Server" />
          <InlineLabel text="Reservation Details" />
          <InlineLabel text="Add Equipment" />
          <InlineLabel text="Ship Reservation" />
        </div>
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--av-on-surface)' }}>
                <span>Connection settings</span>
                <span>Edit reservation</span>
                <span>Delivery date</span>
                <span>Project name</span>
              </div>
            ),
            caption: 'Use sentence case for all labels, buttons, headers, and menu items.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--av-on-surface)' }}>
                <span>Connection Settings</span>
                <span>Edit Reservation</span>
                <span>Delivery Date</span>
                <span>Project Name</span>
              </div>
            ),
            caption: 'Title Case looks formal but conflicts with MD3 conventions. Never capitalize every word.',
          },
        ]} />
      </SubSection>

      {/* ── 2. Toolbar Modes ── */}
      <SubSection
        title="Toolbar Modes"
        description="Quantify uses three canonical toolbar configurations. The leading icon and trailing actions change depending on the screen's editing state. These three modes cover 100% of toolbar use cases in the app."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Three canonical modes',
            tag: 'Convention',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
                <ToolbarMode
                  label="Edit mode"
                  description='X (close) on the left dismisses without saving. Verb button on the right commits the action (e.g., "Ship", "Save"). Optional overflow menu for extras.'
                  leading={<Close size={18} />}
                  title="Ship reservation"
                  trailing={
                    <>
                      <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>Ship</button>
                    </>
                  }
                />
                <ToolbarMode
                  label="Read-only mode"
                  description="Back arrow on the left returns to the previous screen. Overflow menu (three-dot) on the right provides view-level actions like Share, Print, or Edit."
                  leading={<Back size={18} />}
                  title="Reservation details"
                  trailing={
                    <button style={btnStyle}><More size={18} /></button>
                  }
                />
                <ToolbarMode
                  label="Edit mode with extras"
                  description="X on the left, checkmark to confirm, plus a three-dot overflow for secondary actions like Delete or Duplicate."
                  leading={<Close size={18} />}
                  title="Edit reservation"
                  trailing={
                    <>
                      <button style={btnStyle}><Check size={18} /></button>
                      <button style={btnStyle}><More size={18} /></button>
                    </>
                  }
                  bg="var(--av-blue-light, rgba(41,98,255,0.04))"
                />
              </div>
            ),
          }]}
        />
      </SubSection>

      {/* ── 3. Dialog Rules ── */}
      <SubSection
        title="Dialog Rules"
        description="Strict conventions ensure dialogs feel predictable and safe across the entire app. Violating these rules causes confusion and accidental data loss."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          <RuleCard title="One close method">
            Every dialog must have exactly <strong>one</strong> way to close: the X button <em>or</em> a Cancel button — never both. This prevents ambiguity about which action "really" cancels.
          </RuleCard>
          <RuleCard title="Keyboard shortcuts">
            <strong>Enter</strong> always triggers OK / primary action.<br />
            <strong>Escape</strong> always triggers Cancel / close.<br />
            No exceptions. Users rely on muscle memory.
          </RuleCard>
          <RuleCard title="Button order">
            From left to right: <strong>Apply → OK → Cancel</strong>.<br />
            The primary action is always before Cancel. Apply appears only when live preview is needed.
          </RuleCard>
          <RuleCard title='Ellipsis suffix ("...")'>
            Menu items that open a dialog append <strong>"..."</strong> to their label. This signals that the action won't execute immediately.<br />
            Example: <em>"Print..."</em>, <em>"Export..."</em>, <em>"Connection settings..."</em>
          </RuleCard>
        </div>

        <div style={{ marginTop: 24 }}>
          <DoDontGrid items={[
            {
              type: 'do',
              content: (
                <div className="ds-dialog" style={{ maxWidth: 240, padding: 14, transform: 'scale(0.9)' }}>
                  <div className="ds-dialog-title" style={{ fontSize: 14 }}>Ship reservation</div>
                  <div className="ds-dialog-body" style={{ fontSize: 12 }}>Send 45 items to Downtown Office Tower?</div>
                  <div className="ds-dialog-actions">
                    <button className="ds-btn ds-btn-filled" style={{ height: 30, fontSize: 12 }}>Ship</button>
                    <button className="ds-btn ds-btn-text" style={{ height: 30, fontSize: 12 }}>Cancel</button>
                  </div>
                </div>
              ),
              caption: 'Button order: primary action before Cancel. One close method only.',
            },
            {
              type: 'dont',
              content: (
                <div className="ds-dialog" style={{ maxWidth: 240, padding: 14, transform: 'scale(0.9)' }}>
                  <div className="ds-dialog-title" style={{ fontSize: 14 }}>Ship reservation</div>
                  <div className="ds-dialog-body" style={{ fontSize: 12 }}>Send 45 items to Downtown Office Tower?</div>
                  <div className="ds-dialog-actions">
                    <button className="ds-btn ds-btn-text" style={{ height: 30, fontSize: 12 }}>Cancel</button>
                    <button className="ds-btn ds-btn-text" style={{ height: 30, fontSize: 12 }}>No</button>
                    <button className="ds-btn ds-btn-filled" style={{ height: 30, fontSize: 12 }}>OK</button>
                  </div>
                </div>
              ),
              caption: 'Never mix Cancel and No, or put Cancel before the primary action.',
            },
          ]} />
        </div>
      </SubSection>

      {/* ── 4. Delete Confirmation ── */}
      <SubSection
        title="Delete Confirmation"
        description='All delete operations use the canonical confirmation wording. The phrasing is deliberate — "Are you sure you would like to delete this item?" with "Yes, Delete" and "No" buttons.'
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Canonical delete dialog',
            tag: 'Required',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 380 }}>
                <div className="ds-dialog-icon" style={{ color: 'var(--av-error)' }}>
                  <Delete size={24} />
                </div>
                <div className="ds-dialog-title">Delete item</div>
                <div className="ds-dialog-body">
                  Are you sure you would like to delete this item?
                </div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }}>No</button>
                  <button className="ds-btn ds-btn-filled error" style={{ height: 36, fontSize: 13 }}>Yes, delete</button>
                </div>
              </div>
            ),
          }]}
        />
        <CodeSnippet
          code={`<!-- Avontus Delete Confirmation Dialog -->
<ContentDialog
    Title="Delete item"
    PrimaryButtonText="Yes, delete"
    CloseButtonText="No"
    PrimaryButtonStyle="{StaticResource DestructiveButtonStyle}"
    DefaultButton="Close">
  <TextBlock TextWrapping="Wrap">
    Are you sure you would like to delete this item?
  </TextBlock>
</ContentDialog>`}
        />
      </SubSection>

      {/* ── 5. Nag Pattern ── */}
      <SubSection
        title={"Nag Pattern (\"Don't Show Again\")"}
        description={"For recurring confirmation dialogs, add a \"Don't show this message again\" checkbox. Users can reset all suppressed dialogs from Settings."}
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Nag dialog with checkbox',
            tag: 'Pattern',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 380 }}>
                <div className="ds-dialog-title">Ship reservation</div>
                <div className="ds-dialog-body">
                  This will mark the reservation as shipped and notify the project manager.
                </div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 0 4px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    style={{
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                      accentColor: 'var(--av-blue, #2962FF)',
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--av-on-surface-variant)' }}>
                    Don't show this message again
                  </span>
                </label>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }}>Cancel</button>
                  <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }}>Ship</button>
                </div>
              </div>
            ),
          }]}
        />
      </SubSection>

      {/* ── 6. Grid CRUD Behavior ── */}
      <SubSection
        title="Grid CRUD Behavior"
        description="Data grids in Quantify always show Add, Edit, Delete, and Refresh buttons. Critically, all four buttons are always enabled — never grayed out based on selection state. This is a core Avontus convention that differs from many other apps."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Always-enabled CRUD toolbar',
            tag: 'Required',
            content: (
              <div style={{ width: '100%' }}>
                {/* Toolbar strip */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  padding: '10px 16px',
                  background: 'var(--av-surface, #FAFBFF)',
                  borderRadius: '10px 10px 0 0',
                  border: '1px solid var(--av-outline-variant, #CAC4D0)',
                  borderBottom: 'none',
                }}>
                  <CrudButton icon={<Add size={16} />} label="Add" />
                  <CrudButton icon={<Edit size={16} />} label="Edit" />
                  <CrudButton icon={<Delete size={16} />} label="Delete" />
                  <CrudButton icon={<Refresh size={16} />} label="Refresh" />
                </div>
                {/* Grid rows */}
                <div style={{
                  border: '1px solid var(--av-outline-variant, #CAC4D0)',
                  borderRadius: '0 0 10px 10px',
                  overflow: 'hidden',
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 100px 80px',
                    padding: '8px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    color: 'var(--av-on-surface-variant)',
                    background: 'var(--av-surface-2, #E8E8E8)',
                    borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)',
                  }}>
                    <span />
                    <span>Equipment</span>
                    <span>Quantity</span>
                    <span>Status</span>
                  </div>
                  {[
                    { name: 'Scaffold frames', qty: '450', status: 'Available', selected: true },
                    { name: 'Cross braces', qty: '120', status: 'Available', selected: false },
                    { name: 'Base plates', qty: '45', status: 'Reserved', selected: false },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 100px 80px',
                      padding: '10px 12px',
                      fontSize: 14,
                      color: 'var(--av-on-surface)',
                      background: row.selected ? 'var(--av-blue-light, rgba(41,98,255,0.06))' : 'transparent',
                      borderBottom: i < 2 ? '1px solid var(--av-outline-variant, #CAC4D0)' : 'none',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: row.selected ? 'none' : '2px solid var(--av-outline, #79747E)',
                        background: row.selected ? 'var(--av-blue, #2962FF)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {row.selected && <Check size={12} />}
                      </div>
                      <span>{row.name}</span>
                      <span style={{ fontFamily: 'var(--av-font-mono)' }}>{row.qty}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: row.status === 'Available'
                          ? 'rgba(0,155,134,0.1)'
                          : 'rgba(41,98,255,0.1)',
                        color: row.status === 'Available'
                          ? 'var(--av-success, #009B86)'
                          : 'var(--av-blue, #2962FF)',
                      }}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }]}
        />

        <div style={{ marginTop: 16 }}>
          <DoDontGrid items={[
            {
              type: 'do',
              content: (
                <div style={{ display: 'flex', gap: 6 }}>
                  <CrudButton icon={<Add size={14} />} label="Add" />
                  <CrudButton icon={<Edit size={14} />} label="Edit" />
                  <CrudButton icon={<Delete size={14} />} label="Delete" />
                  <CrudButton icon={<Refresh size={14} />} label="Refresh" />
                </div>
              ),
              caption: 'All four CRUD buttons are always enabled. Clicking Edit or Delete with no selection shows a prompt.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', gap: 6 }}>
                  <CrudButton icon={<Add size={14} />} label="Add" />
                  <span style={{ opacity: 0.35, pointerEvents: 'none' as const }}>
                    <CrudButton icon={<Edit size={14} />} label="Edit" />
                  </span>
                  <span style={{ opacity: 0.35, pointerEvents: 'none' as const }}>
                    <CrudButton icon={<Delete size={14} />} label="Delete" />
                  </span>
                  <CrudButton icon={<Refresh size={14} />} label="Refresh" />
                </div>
              ),
              caption: 'Never disable Edit or Delete based on selection. This is a core Avontus convention.',
            },
          ]} />
        </div>

        <div style={{ marginTop: 16 }}>
          <RuleCard title="Selection after delete">
            When a row is deleted, the grid selects the <strong>next row down</strong>. If the deleted row was the last one, select the <strong>previous row</strong> instead. This keeps the user's context stable and prevents a jarring empty-selection state.
          </RuleCard>
        </div>
      </SubSection>

      {/* ── 7. Combobox Conventions ── */}
      <SubSection
        title="Combobox Conventions"
        description='Comboboxes (dropdowns) in Quantify follow strict rules for empty states and inactive items.'
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
          <RuleCard title='Empty state: " (select)"'>
            When no value is chosen, the combobox displays <strong>" (select)"</strong> — with a leading space. This is the canonical Avontus empty-state placeholder, not "Choose..." or "Select...".
          </RuleCard>
          <RuleCard title="Inactive items">
            Items marked as inactive are <strong>hidden</strong> from the dropdown list — unless the field currently holds that value. If the user navigates to a record with an inactive item, the combobox still shows it, but no other user can select it.
          </RuleCard>
        </div>

        <ComponentShowcase
          items={[
            {
              label: 'Empty state',
              tag: 'Convention',
              content: (
                <div style={{
                  position: 'relative',
                  width: 240,
                  height: 48,
                  border: '1px solid var(--av-outline, #79747E)',
                  borderRadius: 'var(--av-radius-sm, 4px)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 36px 0 16px',
                  fontSize: 14,
                  color: 'var(--av-on-surface-variant)',
                  fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                  background: 'var(--av-bg, #fff)',
                }}>
                  <span style={{ position: 'absolute', top: 4, left: 16, fontSize: 11, fontWeight: 500, color: 'var(--av-on-surface-variant)' }}>Scaffold type</span>
                  <span style={{ paddingTop: 8 }}> (select)</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--av-on-surface-variant)' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              ),
            },
            {
              label: 'With inactive item shown',
              tag: 'Convention',
              content: (
                <div style={{
                  position: 'relative',
                  width: 240,
                  height: 48,
                  border: '1px solid var(--av-outline, #79747E)',
                  borderRadius: 'var(--av-radius-sm, 4px)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 36px 0 16px',
                  fontSize: 14,
                  color: 'var(--av-on-surface)',
                  fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                  background: 'var(--av-bg, #fff)',
                }}>
                  <span style={{ position: 'absolute', top: 4, left: 16, fontSize: 11, fontWeight: 500, color: 'var(--av-blue)' }}>Scaffold type</span>
                  <span style={{ paddingTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Tube & Clamp
                    <span style={{ fontSize: 10, color: 'var(--av-on-surface-variant)', fontStyle: 'italic' }}>(inactive)</span>
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--av-on-surface-variant)' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── 8. Copyright Format ── */}
      <SubSection
        title="Copyright Format"
        description="The canonical copyright string must appear in every About screen and print footer."
      >
        <div className="ds-card ds-card-outlined" style={{
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 14,
            fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
            color: 'var(--av-on-surface-variant)',
            letterSpacing: '0.2px',
          }}>
            © Avontus 2008–2025. All rights reserved.
          </span>
        </div>
        <CodeSnippet
          code={`<!-- Canonical Copyright -->
<TextBlock Text="© Avontus 2008–2025. All rights reserved."
           Style="{StaticResource CaptionMedium}"
           Foreground="{ThemeResource OnSurfaceVariantBrush}"
           HorizontalAlignment="Center" />`}
        />
      </SubSection>

      {/* ── 9. Spacing Rules ── */}
      <SubSection
        title="Spacing Rules"
        description="Two spacing constants used throughout Quantify for consistent page layout."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-card ds-card-filled" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '32px', border: '2px dashed var(--av-blue)', borderRadius: 'var(--av-radius-lg)', margin: 0, position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--av-font-mono, monospace)',
                color: 'var(--av-blue)',
                background: 'var(--av-bg, #fff)',
                padding: '2px 6px',
                borderRadius: 3,
              }}>
                32px
              </div>
              <div style={{
                background: 'var(--av-surface-2)',
                borderRadius: 8,
                padding: 20,
                fontSize: 13,
                color: 'var(--av-on-surface-variant)',
                textAlign: 'center',
              }}>
                Page content area
              </div>
            </div>
            <div style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)' }}>
              Page border: 32px
            </div>
          </div>
          <div className="ds-card ds-card-filled" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }}>Save</button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--av-font-mono, monospace)',
                color: 'var(--av-blue)',
              }}>
                ← 16px →
              </div>
              <button className="ds-btn ds-btn-outlined" style={{ height: 36, fontSize: 13 }}>Cancel</button>
            </div>
            <div style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', borderTop: '1px solid var(--av-outline-variant)' }}>
              Button gap: 16px
            </div>
          </div>
        </div>
        <CodeSnippet
          code={`<!-- Spacing tokens used by Avontus -->
<!-- Page border padding -->
<Page Padding="32">
  <!-- Button spacing in dialog footers -->
  <StackPanel Orientation="Horizontal" Spacing="16">
    <Button Content="Save" Style="{StaticResource FilledButtonStyle}" />
    <Button Content="Cancel" Style="{StaticResource TextButtonStyle}" />
  </StackPanel>
</Page>`}
        />
      </SubSection>
    </section>
  )
}
