import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Close, ErrorIcon, Warning, Info, Success as SuccessIcon } from '../shared/Icons'

export default function SnackbarsSection() {
  const snackbarBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 8,
    background: 'var(--av-on-surface, #1C1B1F)',
    color: 'var(--av-bg, #fff)',
    fontSize: 14,
    maxWidth: 400,
    width: '100%',
    boxShadow: 'var(--av-shadow-3)',
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
  }

  const actionBtnStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--av-blue-light, #82B1FF)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 4,
    flexShrink: 0,
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
  }

  const closeBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--av-outline-variant, #CAC4D0)',
    flexShrink: 0,
  }

  return (
    <section id="snackbars" className="ds-section">
      <SectionHeader
        label="Component"
        title="Snackbars"
        description="Brief, auto-dismissing feedback messages with optional actions."
      />

      {/* ── Single-Line ── */}
      <SubSection
        title="Single-Line Snackbar"
        description="A simple text message for brief feedback. The most common variant, appearing at the bottom of the viewport and dismissing after 4-10 seconds."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Basic',
              tag: 'Snackbar',
              content: (
                <div style={snackbarBase}>
                  <span style={{ flex: 1 }}>Reservation saved successfully</span>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Two-Line ── */}
      <SubSection
        title="Two-Line Snackbar"
        description="Longer messages that wrap to two lines for additional context. Use when a single line is not sufficient to convey the message."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Two-Line',
              tag: 'Snackbar',
              content: (
                <div style={{ ...snackbarBase, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div>Reservation RES-2024-0847 shipped</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>450 items sent to Downtown Office Tower</div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Action Button ── */}
      <SubSection
        title="With Action Button"
        description="An optional action button lets users respond to the message, such as undoing a delete or viewing details. Use a single text action; avoid multiple buttons."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'With Undo',
              tag: 'Action',
              content: (
                <div style={snackbarBase}>
                  <span style={{ flex: 1 }}>Equipment item removed</span>
                  <button style={actionBtnStyle}>Undo</button>
                </div>
              ),
            },
            {
              label: 'With View',
              tag: 'Action',
              content: (
                <div style={{ ...snackbarBase, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div>Reservation RES-2024-0847 shipped</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>450 items sent to Downtown Office Tower</div>
                  </div>
                  <button style={actionBtnStyle}>View</button>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Close Button ── */}
      <SubSection
        title="With Close Button"
        description="A close button allows the user to dismiss the snackbar early. Use when the message may need to be read carefully or when auto-dismiss timing may be too short."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'With Close',
              tag: 'Dismissable',
              content: (
                <div style={snackbarBase}>
                  <span style={{ flex: 1 }}>Changes saved to draft</span>
                  <button style={closeBtnStyle}><Close size={16} /></button>
                </div>
              ),
            },
            {
              label: 'Action + Close',
              tag: 'Full',
              content: (
                <div style={snackbarBase}>
                  <span style={{ flex: 1 }}>3 items archived</span>
                  <button style={actionBtnStyle}>Undo</button>
                  <button style={closeBtnStyle}><Close size={16} /></button>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Semantic Variants ── */}
      <SubSection
        title="Semantic Variants"
        description="Color-coded snackbars communicate the nature of the message: error for failures, warning for caution, success for confirmation, and info for neutral feedback."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Error',
              tag: 'Severity',
              content: (
                <div style={{ ...snackbarBase, background: 'var(--av-error, #D32F2F)' }}>
                  <ErrorIcon size={20} />
                  <span style={{ flex: 1 }}>Connection lost. Please check your network.</span>
                  <button style={{ ...actionBtnStyle, color: 'var(--av-bg, #fff)' }}>Retry</button>
                </div>
              ),
            },
            {
              label: 'Warning',
              tag: 'Severity',
              content: (
                <div style={{ ...snackbarBase, background: 'var(--av-warning, #F9A825)' }}>
                  <Warning size={20} />
                  <span style={{ flex: 1 }}>Quantity exceeds available stock</span>
                  <button style={closeBtnStyle}><Close size={16} /></button>
                </div>
              ),
            },
            {
              label: 'Success',
              tag: 'Severity',
              content: (
                <div style={{ ...snackbarBase, background: 'var(--av-success, #009B86)' }}>
                  <SuccessIcon size={20} />
                  <span style={{ flex: 1 }}>Reservation saved successfully</span>
                  <button style={closeBtnStyle}><Close size={16} /></button>
                </div>
              ),
            },
            {
              label: 'Info',
              tag: 'Severity',
              content: (
                <div style={{ ...snackbarBase, background: 'var(--av-info, #0005EE)' }}>
                  <Info size={20} />
                  <span style={{ flex: 1 }}>Review all items before shipping</span>
                  <button style={closeBtnStyle}><Close size={16} /></button>
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
              <div style={{ ...snackbarBase, maxWidth: 300 }}>
                <span style={{ flex: 1 }}>Equipment item removed</span>
                <button style={actionBtnStyle}>Undo</button>
              </div>
            ),
            caption: 'Keep snackbar messages short and include an undo action for destructive operations.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ ...snackbarBase, maxWidth: 300 }}>
                <span style={{ flex: 1 }}>The scaffolding frame equipment item with ID #12847 has been permanently removed from inventory list for project Downtown Office Tower</span>
              </div>
            ),
            caption: "Don't use long, detailed messages in snackbars. Move complex information to a dialog or notification center.",
          },
          {
            type: 'do',
            content: (
              <div style={{ ...snackbarBase, maxWidth: 300 }}>
                <span style={{ flex: 1 }}>3 items archived</span>
                <button style={actionBtnStyle}>Undo</button>
                <button style={closeBtnStyle}><Close size={14} /></button>
              </div>
            ),
            caption: 'Use a single action button. Combine it with a close button if the message needs manual dismissal.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ ...snackbarBase, maxWidth: 300 }}>
                <span style={{ flex: 1 }}>Deleted</span>
                <button style={actionBtnStyle}>Undo</button>
                <button style={actionBtnStyle}>View</button>
                <button style={actionBtnStyle}>Details</button>
              </div>
            ),
            caption: "Don't add multiple action buttons. Snackbars should have at most one action.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="InfoBar (Snackbar)"
          props={[
            {
              name: 'Title',
              type: 'string',
              description: 'The primary message text displayed in the snackbar.',
            },
            {
              name: 'Message',
              type: 'string',
              description: 'Optional secondary text for two-line snackbars.',
            },
            {
              name: 'Severity',
              type: 'InfoBarSeverity',
              default: 'Informational',
              description: 'Visual severity: Informational, Success, Warning, or Error.',
            },
            {
              name: 'IsOpen',
              type: 'bool',
              default: 'true',
              description: 'Whether the snackbar is currently visible.',
            },
            {
              name: 'IsClosable',
              type: 'bool',
              default: 'true',
              description: 'Whether the close button is shown.',
            },
            {
              name: 'ActionButton',
              type: 'ButtonBase',
              description: 'An optional action button element (e.g., Undo, Retry).',
            },
            {
              name: 'Closed',
              type: 'event',
              description: 'Event raised when the snackbar is dismissed.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Basic Snackbar -->
<InfoBar Title="Reservation saved successfully"
         Severity="Success"
         IsOpen="{Binding ShowSnackbar}"
         IsClosable="True" />

<!-- Snackbar with Action -->
<InfoBar Title="Equipment item removed"
         Severity="Informational"
         IsOpen="{Binding ShowSnackbar}">
  <InfoBar.ActionButton>
    <Button Content="Undo"
            Command="{Binding UndoCommand}" />
  </InfoBar.ActionButton>
</InfoBar>

<!-- Error Snackbar with Retry -->
<InfoBar Title="Connection lost"
         Message="Please check your network."
         Severity="Error"
         IsOpen="{Binding IsOffline}">
  <InfoBar.ActionButton>
    <Button Content="Retry"
            Command="{Binding RetryCommand}" />
  </InfoBar.ActionButton>
</InfoBar>

<!-- Warning Snackbar -->
<InfoBar Title="Quantity exceeds available stock"
         Severity="Warning"
         IsOpen="{Binding ShowStockWarning}"
         IsClosable="True" />

<!-- Two-Line Snackbar -->
<InfoBar Title="Reservation RES-2024-0847 shipped"
         Message="450 items sent to Downtown Office Tower"
         Severity="Informational"
         IsOpen="{Binding ShowShipNotification}">
  <InfoBar.ActionButton>
    <Button Content="View"
            Command="{Binding ViewReservationCommand}" />
  </InfoBar.ActionButton>
</InfoBar>`}
        />
      </SubSection>
    </section>
  )
}
