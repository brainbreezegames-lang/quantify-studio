import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import PhoneFrame from '../shared/PhoneFrame'

/* ── Icon helpers ── */
function DeleteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ShippingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function WarningTriangle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function ErrorCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  )
}

/* ── Inline text field for form dialogs ── */
function InlineField({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
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

/* ── Interactive dialog wrapper ── */
function InteractiveDialog({
  trigger,
  triggerLabel,
  children,
}: {
  trigger?: React.ReactNode
  triggerLabel: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="ds-btn ds-btn-outlined"
        style={{ height: 36, fontSize: 13 }}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeInUp 200ms ease-out',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, { onClose: () => setOpen(false) })
              }
              return child
            })}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Static dialog previews ── */
function BasicDialog() {
  return (
    <div className="ds-dialog">
      <div className="ds-dialog-icon" style={{ color: 'var(--av-blue)' }}>
        <ShippingIcon />
      </div>
      <div className="ds-dialog-title">Ship equipment</div>
      <div className="ds-dialog-body">
        Ship 45 scaffold frames and 12 braces to Riverside Tower Project? The delivery is scheduled for March 15, 2026.
      </div>
      <div className="ds-dialog-actions">
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }}>Cancel</button>
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }}>Ship Items</button>
      </div>
    </div>
  )
}

function ConfirmationDialog({ onClose }: { onClose?: () => void }) {
  return (
    <div className="ds-dialog">
      <div className="ds-dialog-title">Delete reservation?</div>
      <div className="ds-dialog-body">
        This will permanently remove reservation RSV-2026-0847 for Riverside Tower Project. All associated shipment records will also be deleted. This action cannot be undone.
      </div>
      <div className="ds-dialog-actions">
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Cancel</button>
        <button className="ds-btn ds-btn-filled error" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Delete</button>
      </div>
    </div>
  )
}

function AlertDialog({ onClose }: { onClose?: () => void }) {
  return (
    <div className="ds-dialog">
      <div className="ds-dialog-icon" style={{ color: 'var(--av-error)' }}>
        <ErrorCircle />
      </div>
      <div className="ds-dialog-title" style={{ color: 'var(--av-error)' }}>Connection lost</div>
      <div className="ds-dialog-body">
        Unable to reach the Quantify server. Your changes have been saved locally and will sync automatically when the connection is restored.
      </div>
      <div className="ds-dialog-actions">
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }} onClick={onClose}>OK</button>
      </div>
    </div>
  )
}

function UnsavedChangesDialog({ onClose }: { onClose?: () => void }) {
  return (
    <div className="ds-dialog">
      <div className="ds-dialog-icon" style={{ color: 'var(--av-warning)' }}>
        <WarningTriangle />
      </div>
      <div className="ds-dialog-title">Unsaved changes</div>
      <div className="ds-dialog-body">
        Unsaved changes will be lost. Do you want to save your edits to this reservation before leaving?
      </div>
      <div className="ds-dialog-actions">
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Discard</button>
        <button className="ds-btn ds-btn-outlined" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Cancel</button>
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Save</button>
      </div>
    </div>
  )
}

function FormDialog({ onClose }: { onClose?: () => void }) {
  return (
    <div className="ds-dialog" style={{ maxWidth: 400 }}>
      <div className="ds-dialog-icon" style={{ color: 'var(--av-blue)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className="ds-dialog-title">New reservation</div>
      <div className="ds-dialog-body" style={{ marginBottom: 8 }}>
        Enter the project details to create a new equipment reservation.
      </div>
      <InlineField label="Project Name" value="Riverside Tower Phase 2" />
      <InlineField label="Contact Person" value="Sarah Chen" />
      <InlineField label="Delivery Date" value="2026-03-15" />
      <InlineField label="Notes" placeholder="Optional notes..." />
      <div className="ds-dialog-actions" style={{ marginTop: 8 }}>
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Cancel</button>
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }} onClick={onClose}>Create Reservation</button>
      </div>
    </div>
  )
}

function FullScreenDialogContent() {
  return (
    <PhoneFrame title="Full-Screen Dialog" description="Used for complex tasks that require full attention, such as creating new records or multi-step workflows.">
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        padding: '0 4px',
        background: 'var(--av-surface)',
        borderBottom: '1px solid var(--av-outline-variant)',
      }}>
        <button style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'none', cursor: 'pointer', color: 'var(--av-on-surface)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>
          New reservation
        </div>
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13, color: 'var(--av-blue)' }}>
          Save
        </button>
      </div>

      {/* Form content */}
      <div style={{ padding: 20 }}>
        <InlineField label="Project Name" placeholder="Enter project name" />
        <InlineField label="Client" placeholder="Select client" />
        <InlineField label="Delivery Date" value="2026-03-15" />
        <InlineField label="Return Date" value="2026-06-30" />

        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--av-on-surface)',
          margin: '20px 0 12px',
        }}>
          Equipment
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { item: 'Scaffold Frames', qty: '450' },
            { item: 'Cross Braces', qty: '120' },
            { item: 'Base Plates', qty: '45' },
          ].map((eq) => (
            <div key={eq.item} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 16px',
              background: 'var(--av-surface-2)',
              borderRadius: 'var(--av-radius-md)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--av-on-surface)' }}>{eq.item}</span>
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--av-font-mono)', color: 'var(--av-blue)' }}>{eq.qty}</span>
            </div>
          ))}
        </div>

        <button className="ds-btn ds-btn-tonal" style={{ height: 36, fontSize: 13, marginTop: 12, width: '100%' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Equipment
        </button>
      </div>
    </PhoneFrame>
  )
}

export default function DialogsSection() {
  return (
    <section id="dialogs" className="ds-section">
      <SectionHeader
        label="Component"
        title="Dialogs"
        description="Modal overlays for critical decisions, confirmations, and focused tasks."
      />

      {/* ── Basic Dialog ── */}
      <SubSection
        title="Basic Dialog"
        description="The standard dialog includes an optional icon, a title, body text, and one or two action buttons. The icon reinforces the dialog purpose and uses the primary brand color."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Icon + Title + Body + Actions',
              tag: 'MD3 Dialog',
              content: (
                <div className="ds-dialog-preview" style={{ minHeight: 280 }}>
                  <BasicDialog />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Confirmation Dialog ── */}
      <SubSection
        title="Confirmation Dialog"
        description="Used for destructive or irreversible actions. The dialog explains the consequences and offers Cancel and a clearly-labeled destructive action. Use the error color for the destructive button."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Delete Confirmation',
              tag: 'Destructive',
              content: (
                <div className="ds-dialog-preview" style={{ minHeight: 240 }}>
                  <ConfirmationDialog />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Alert Dialog ── */}
      <SubSection
        title="Alert Dialog"
        description="Alert dialogs communicate urgent information like errors, connection issues, or system status. They use a warning or error icon and typically have a single acknowledgement action."
      >
        <ComponentShowcase items={[
          {
            label: 'Error Alert',
            tag: 'Alert',
            content: (
              <div className="ds-dialog-preview" style={{ minHeight: 240 }}>
                <AlertDialog />
              </div>
            ),
          },
          {
            label: 'Warning Alert',
            tag: 'Alert',
            content: (
              <div className="ds-dialog-preview" style={{ minHeight: 240 }}>
                <UnsavedChangesDialog />
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── With Form Fields ── */}
      <SubSection
        title="With Form Fields"
        description="Dialogs can contain form inputs for quick data entry. Keep forms short (2-4 fields). For complex forms, use a full-screen dialog instead."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'New reservation Form',
              tag: 'Form Dialog',
              content: (
                <div className="ds-dialog-preview" style={{ minHeight: 420 }}>
                  <FormDialog />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Full-Screen Dialog ── */}
      <SubSection
        title="Full-Screen Dialog"
        description="Full-screen dialogs are used on mobile for complex tasks that benefit from full attention. They include a toolbar with a close (X) icon, a title, and a save action. Content scrolls beneath the toolbar."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Full-Screen Dialog (Mobile)',
              tag: 'Phone Frame',
              content: (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <FullScreenDialogContent />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Interactive Demos ── */}
      <SubSection
        title="Interactive Demos"
        description="Click each button to open a live dialog with scrim overlay. Click outside the dialog or use the action buttons to dismiss."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Try Live Dialogs',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <InteractiveDialog triggerLabel="Delete Confirmation">
                    <ConfirmationDialog />
                  </InteractiveDialog>
                  <InteractiveDialog triggerLabel="Error Alert">
                    <AlertDialog />
                  </InteractiveDialog>
                  <InteractiveDialog triggerLabel="Unsaved changes">
                    <UnsavedChangesDialog />
                  </InteractiveDialog>
                  <InteractiveDialog triggerLabel="Form Dialog">
                    <FormDialog />
                  </InteractiveDialog>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Quantify Dialog Conventions ── */}
      <SubSection
        title="Quantify Dialog Conventions"
        description="Strict rules that apply to every dialog in Quantify. These conventions ensure dialogs feel predictable and prevent accidental data loss."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>One Close Method</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              Every dialog uses <strong>either</strong> an X button <strong>or</strong> a Cancel button — never both. This eliminates the "which cancel is real?" ambiguity.
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Keyboard Shortcuts</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              <strong>Enter</strong> = OK / primary action.<br />
              <strong>Escape</strong> = Cancel / close.<br />
              No exceptions. Users rely on muscle memory.
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Button Order</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              Left to right: <strong>Apply → OK → Cancel</strong>.<br />
              The primary action is always before Cancel. Apply only appears when live preview is needed.
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Delete Wording</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              Canonical text: <em>"Are you sure you would like to delete this item?"</em> with buttons <strong>"Yes, delete"</strong> and <strong>"No"</strong>.
            </div>
          </div>
        </div>

        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 240, padding: 14, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 14 }}>Delete item</div>
                <div className="ds-dialog-body" style={{ fontSize: 11 }}>Are you sure you would like to delete this item?</div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 30, fontSize: 12 }}>No</button>
                  <button className="ds-btn ds-btn-filled error" style={{ height: 30, fontSize: 12 }}>Yes, delete</button>
                </div>
              </div>
            ),
            caption: 'Use the canonical Quantify delete confirmation with "Yes, delete" and "No" buttons.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 240, padding: 14, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 14 }}>Delete?</div>
                <div className="ds-dialog-body" style={{ fontSize: 11 }}>This cannot be undone.</div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 30, fontSize: 12 }}>Cancel</button>
                  <button className="ds-btn ds-btn-filled error" style={{ height: 30, fontSize: 12 }}>Delete</button>
                </div>
              </div>
            ),
            caption: 'Don\'t deviate from canonical wording. "Cancel" vs "No" and omitting the full question confuses users.',
          },
        ]} />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 260, padding: 16, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 15 }}>Delete item</div>
                <div className="ds-dialog-body" style={{ fontSize: 12 }}>Are you sure you would like to delete this item?</div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 32, fontSize: 12 }}>No</button>
                  <button className="ds-btn ds-btn-filled error" style={{ height: 32, fontSize: 12 }}>Yes, delete</button>
                </div>
              </div>
            ),
            caption: 'Use the canonical Quantify delete wording with "Yes, delete" and "No" buttons.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 260, padding: 16, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 15 }}>Are you sure?</div>
                <div className="ds-dialog-body" style={{ fontSize: 12 }}>Do you want to proceed?</div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 32, fontSize: 12 }}>No</button>
                  <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12 }}>Yes</button>
                </div>
              </div>
            ),
            caption: 'Don\'t use vague titles like "Are you sure?" or generic labels like "Yes/No". Be specific about the action and its consequences.',
          },
          {
            type: 'do',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 260, padding: 16, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 15 }}>Ship equipment</div>
                <div className="ds-dialog-body" style={{ fontSize: 12 }}>45 frames to Riverside Tower.</div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 32, fontSize: 12 }}>Cancel</button>
                  <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12 }}>Ship</button>
                </div>
              </div>
            ),
            caption: 'Keep dialog content concise. Users should understand the decision within seconds.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-dialog" style={{ maxWidth: 260, padding: 16, transform: 'scale(0.85)' }}>
                <div className="ds-dialog-title" style={{ fontSize: 15 }}>Ship</div>
                <div className="ds-dialog-body" style={{ fontSize: 9, lineHeight: 1.3 }}>
                  You are about to ship equipment including 45 scaffold frames, 12 cross braces, 8 base plates, 4 ladders, 6 guardrails, and 2 access platforms to the Riverside Tower Project located at...
                </div>
                <div className="ds-dialog-actions">
                  <button className="ds-btn ds-btn-text" style={{ height: 32, fontSize: 12 }}>Cancel</button>
                  <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12 }}>OK</button>
                </div>
              </div>
            ),
            caption: 'Don\'t overload dialogs with excessive detail. Move long content to a detail view and summarize in the dialog.',
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="ContentDialog"
          props={[
            {
              name: 'Title',
              type: 'string',
              description: 'The title displayed at the top of the dialog.',
            },
            {
              name: 'Content',
              type: 'UIElement',
              description: 'The body content of the dialog. Can be text, forms, or any UI element.',
            },
            {
              name: 'PrimaryButtonText',
              type: 'string',
              description: 'Label for the primary action button (right-most). Leave empty to hide.',
            },
            {
              name: 'SecondaryButtonText',
              type: 'string',
              description: 'Label for the secondary action button. Leave empty to hide.',
            },
            {
              name: 'CloseButtonText',
              type: 'string',
              description: 'Label for the close/cancel button. Leave empty to hide.',
            },
            {
              name: 'PrimaryButtonStyle',
              type: 'Style',
              default: 'FilledButtonStyle',
              description: 'Style applied to the primary button. Use error variant for destructive actions.',
            },
            {
              name: 'PrimaryButtonCommand',
              type: 'ICommand',
              description: 'Command executed when the primary button is clicked.',
            },
            {
              name: 'IsPrimaryButtonEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the primary button is enabled. Useful for form validation.',
            },
            {
              name: 'DefaultButton',
              type: 'ContentDialogButton',
              default: 'Primary',
              description: 'Which button is activated by the Enter key. Options: None, Primary, Secondary, Close.',
            },
            {
              name: 'FullSizeDesired',
              type: 'bool',
              default: 'false',
              description: 'When true, the dialog expands to fill the screen (mobile full-screen dialog pattern).',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Basic Dialog with Icon -->
<ContentDialog
    Title="Ship equipment"
    PrimaryButtonText="Ship Items"
    CloseButtonText="Cancel"
    DefaultButton="Primary">
  <StackPanel Spacing="16">
    <SymbolIcon Symbol="DeliveryTruck"
                Foreground="{ThemeResource PrimaryBrush}" />
    <TextBlock TextWrapping="Wrap"
               Style="{StaticResource BodyMedium}">
      Ship 45 scaffold frames and 12 braces to
      Riverside Tower Project?
    </TextBlock>
  </StackPanel>
</ContentDialog>

<!-- Confirmation (Destructive) Dialog -->
<ContentDialog
    Title="Delete reservation?"
    PrimaryButtonText="Delete"
    CloseButtonText="Cancel"
    PrimaryButtonStyle="{StaticResource DestructiveButtonStyle}"
    DefaultButton="Close">
  <TextBlock TextWrapping="Wrap"
             Style="{StaticResource BodyMedium}"
             Foreground="{ThemeResource OnSurfaceVariantBrush}">
    This will permanently remove reservation RSV-2026-0847.
    This action cannot be undone.
  </TextBlock>
</ContentDialog>

<!-- Alert Dialog (Single Action) -->
<ContentDialog
    Title="Connection lost"
    PrimaryButtonText="OK"
    DefaultButton="Primary">
  <StackPanel Spacing="12">
    <SymbolIcon Symbol="ErrorCircle"
                Foreground="{ThemeResource ErrorBrush}" />
    <TextBlock TextWrapping="Wrap"
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}">
      Unable to reach the Quantify server. Changes saved locally.
    </TextBlock>
  </StackPanel>
</ContentDialog>

<!-- Dialog with Form Fields -->
<ContentDialog
    Title="New reservation"
    PrimaryButtonText="Create Reservation"
    CloseButtonText="Cancel"
    PrimaryButtonCommand="{Binding CreateCommand}"
    IsPrimaryButtonEnabled="{Binding IsFormValid}">
  <StackPanel Spacing="16">
    <TextBox Header="Project Name"
             Text="{Binding ProjectName, Mode=TwoWay}"
             PlaceholderText="Enter project name" />
    <TextBox Header="Contact Person"
             Text="{Binding ContactPerson, Mode=TwoWay}" />
    <CalendarDatePicker Header="Delivery Date"
                        Date="{Binding DeliveryDate, Mode=TwoWay}" />
    <TextBox Header="Notes"
             Text="{Binding Notes, Mode=TwoWay}"
             PlaceholderText="Optional notes..."
             AcceptsReturn="True"
             TextWrapping="Wrap" />
  </StackPanel>
</ContentDialog>

<!-- Full-Screen Dialog (Mobile) -->
<ContentDialog FullSizeDesired="True"
               Style="{StaticResource FullScreenDialogStyle}">
  <Grid>
    <Grid.RowDefinitions>
      <RowDefinition Height="56" />
      <RowDefinition Height="*" />
    </Grid.RowDefinitions>

    <!-- Toolbar -->
    <Grid Grid.Row="0" Background="{ThemeResource SurfaceBrush}"
          BorderBrush="{ThemeResource OutlineVariantBrush}"
          BorderThickness="0,0,0,1">
      <Button Style="{StaticResource IconButtonStyle}"
              HorizontalAlignment="Left"
              Command="{Binding CloseCommand}">
        <SymbolIcon Symbol="Dismiss" />
      </Button>
      <TextBlock Text="New reservation"
                 Style="{StaticResource TitleMedium}"
                 HorizontalAlignment="Center"
                 VerticalAlignment="Center" />
      <Button Content="Save"
              Style="{StaticResource TextButtonStyle}"
              HorizontalAlignment="Right"
              Command="{Binding SaveCommand}" />
    </Grid>

    <!-- Scrollable Form -->
    <ScrollViewer Grid.Row="1" Padding="20">
      <StackPanel Spacing="16">
        <TextBox Header="Project Name"
                 Text="{Binding ProjectName, Mode=TwoWay}" />
        <TextBox Header="Client"
                 Text="{Binding Client, Mode=TwoWay}" />
        <CalendarDatePicker Header="Delivery Date"
                            Date="{Binding DeliveryDate}" />
        <CalendarDatePicker Header="Return Date"
                            Date="{Binding ReturnDate}" />
      </StackPanel>
    </ScrollViewer>
  </Grid>
</ContentDialog>`}
        />
      </SubSection>
    </section>
  )
}
