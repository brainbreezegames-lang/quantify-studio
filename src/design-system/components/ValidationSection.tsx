import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { ErrorIcon, Warning, Info, Success, Close } from '../shared/Icons'

export default function ValidationSection() {
  return (
    <section id="validation" className="ds-section">
      <SectionHeader
        label="Component"
        title="Validation"
        description="Error, warning, success, and info states for inputs and system feedback."
      />

      {/* ── Error Bar ── */}
      <SubSection
        title="Error Bar"
        description="Error bars indicate critical failures that prevent the user from proceeding. They appear at the top of a form or section and use a red background with an error icon."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Error Bar',
              tag: 'Critical',
              content: (
                <div className="ds-validation-bar error" style={{ maxWidth: 480 }}>
                  <ErrorIcon size={20} /> Quantity exceeds available stock (max: 120)
                </div>
              ),
            },
            {
              label: 'Error with Details',
              tag: 'Critical',
              content: (
                <div className="ds-validation-bar error" style={{ maxWidth: 480, alignItems: 'flex-start' }}>
                  <ErrorIcon size={20} />
                  <div style={{ flex: 1 }}>
                    <div>Please fix 2 errors before saving</div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Project Name is required. Quantity must be at least 1.</div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Warning Bar ── */}
      <SubSection
        title="Warning Bar"
        description="Warning bars alert users to potential issues that do not block progress but should be acknowledged. They use an orange/amber background."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Warning Bar',
              tag: 'Caution',
              content: (
                <div className="ds-validation-bar warning" style={{ maxWidth: 480 }}>
                  <Warning size={20} /> Delivery date is within 24 hours — rush charges may apply
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Info Bar ── */}
      <SubSection
        title="Info Bar"
        description="Info bars provide neutral, helpful information that guides users without urgency. They use a blue background."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Info Bar',
              tag: 'Neutral',
              content: (
                <div className="ds-validation-bar info" style={{ maxWidth: 480 }}>
                  <Info size={20} /> Review all items before shipping
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Success Bar ── */}
      <SubSection
        title="Success Bar"
        description="Success bars confirm that an operation completed successfully. They use a green/teal background and typically auto-dismiss after a few seconds."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Success Bar',
              tag: 'Confirmation',
              content: (
                <div className="ds-validation-bar success" style={{ maxWidth: 480 }}>
                  <Success size={20} /> Reservation saved successfully
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── All Variants Together ── */}
      <SubSection
        title="All Severity Levels"
        description="Compare all four severity levels side by side. Each uses a distinct color, icon, and tone to convey its level of urgency."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Severity Comparison',
              tag: 'Reference',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480 }}>
                  <div className="ds-validation-bar error"><ErrorIcon size={20} /> Quantity exceeds available stock (max: 120)</div>
                  <div className="ds-validation-bar warning"><Warning size={20} /> Delivery date is within 24 hours</div>
                  <div className="ds-validation-bar info"><Info size={20} /> Review all items before shipping</div>
                  <div className="ds-validation-bar success"><Success size={20} /> Reservation saved successfully</div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Field-Level Validation ── */}
      <SubSection
        title="Field-Level Validation"
        description="Inline error messages appear directly below form fields. The field border turns red and helper text explains the error. Success states can also be shown with teal helper text."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Required Field Error',
              tag: 'Field',
              content: (
                <div style={{ maxWidth: 320 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-error, #D32F2F)', marginBottom: 4 }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    placeholder="Enter project name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 14,
                      border: '2px solid var(--av-error, #D32F2F)',
                      borderRadius: 'var(--av-radius-sm, 4px)',
                      outline: 'none',
                      fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                      background: 'var(--av-bg, #fff)',
                      color: 'var(--av-on-surface, #1C1B1F)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--av-error, #D32F2F)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ErrorIcon size={14} /> This field is required
                  </div>
                </div>
              ),
            },
            {
              label: 'Value Error',
              tag: 'Field',
              content: (
                <div style={{ maxWidth: 320 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-error, #D32F2F)', marginBottom: 4 }}>
                    Quantity
                  </label>
                  <input
                    type="text"
                    defaultValue="999"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 14,
                      border: '2px solid var(--av-error, #D32F2F)',
                      borderRadius: 'var(--av-radius-sm, 4px)',
                      outline: 'none',
                      fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                      background: 'var(--av-bg, #fff)',
                      color: 'var(--av-on-surface, #1C1B1F)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--av-error, #D32F2F)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ErrorIcon size={14} /> Exceeds available stock (max: 120)
                  </div>
                </div>
              ),
            },
            {
              label: 'Valid Field',
              tag: 'Field',
              content: (
                <div style={{ maxWidth: 320 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-teal, #009B86)', marginBottom: 4 }}>
                    Email
                  </label>
                  <input
                    type="text"
                    defaultValue="john@acme.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 14,
                      border: '2px solid var(--av-teal, #009B86)',
                      borderRadius: 'var(--av-radius-sm, 4px)',
                      outline: 'none',
                      fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                      background: 'var(--av-bg, #fff)',
                      color: 'var(--av-on-surface, #1C1B1F)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--av-teal, #009B86)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Success size={14} /> Valid email address
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Form-Level Validation ── */}
      <SubSection
        title="Form-Level Validation"
        description="A validation bar at the top of a form summarizes all errors. Individual field errors are shown inline. This pattern ensures users see both the overall status and specific issues."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Form with Validation',
              tag: 'Pattern',
              content: (
                <div style={{
                  maxWidth: 400,
                  width: '100%',
                  border: '1px solid var(--av-outline-variant, #CAC4D0)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'var(--av-bg, #fff)',
                }}>
                  <div className="ds-validation-bar error" style={{ borderRadius: 0 }}>
                    <ErrorIcon size={20} /> Please fix 2 errors before saving
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-error, #D32F2F)', marginBottom: 4 }}>
                        Project Name
                      </label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="Enter project name"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: 14,
                          border: '2px solid var(--av-error, #D32F2F)',
                          borderRadius: 4,
                          outline: 'none',
                          fontFamily: 'var(--av-font-primary)',
                          background: 'var(--av-bg, #fff)',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ fontSize: 12, color: 'var(--av-error, #D32F2F)', marginTop: 4 }}>Required</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-on-surface-variant, #49454F)', marginBottom: 4 }}>
                        Site Address
                      </label>
                      <input
                        type="text"
                        defaultValue="123 Main Street"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: 14,
                          border: '1px solid var(--av-outline-variant, #CAC4D0)',
                          borderRadius: 4,
                          outline: 'none',
                          fontFamily: 'var(--av-font-primary)',
                          background: 'var(--av-bg, #fff)',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--av-error, #D32F2F)', marginBottom: 4 }}>
                        Quantity
                      </label>
                      <input
                        type="text"
                        defaultValue="0"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: 14,
                          border: '2px solid var(--av-error, #D32F2F)',
                          borderRadius: 4,
                          outline: 'none',
                          fontFamily: 'var(--av-font-primary)',
                          background: 'var(--av-bg, #fff)',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ fontSize: 12, color: 'var(--av-error, #D32F2F)', marginTop: 4 }}>Must be at least 1</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                      <button className="ds-btn ds-btn-text">Cancel</button>
                      <button className="ds-btn ds-btn-filled">Save</button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Toast-Style Notification ── */}
      <SubSection
        title="Toast-Style Notification"
        description="Floating toast notifications appear briefly to confirm actions or report issues. They combine an icon, message, and optional dismiss button in a compact format."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Success Toast',
              tag: 'Toast',
              content: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'var(--av-success, #009B86)',
                  color: 'var(--av-bg, #fff)',
                  fontSize: 14,
                  maxWidth: 360,
                  width: '100%',
                  boxShadow: 'var(--av-shadow-3)',
                }}>
                  <Success size={20} />
                  <span style={{ flex: 1 }}>Reservation saved</span>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--av-bg, #fff)', cursor: 'pointer', display: 'flex', opacity: 0.7 }}>
                    <Close size={16} />
                  </button>
                </div>
              ),
            },
            {
              label: 'Error Toast',
              tag: 'Toast',
              content: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'var(--av-error, #D32F2F)',
                  color: 'var(--av-bg, #fff)',
                  fontSize: 14,
                  maxWidth: 360,
                  width: '100%',
                  boxShadow: 'var(--av-shadow-3)',
                }}>
                  <ErrorIcon size={20} />
                  <span style={{ flex: 1 }}>Connection lost</span>
                  <button style={{ padding: '4px 12px', fontSize: 13, fontWeight: 600, color: 'var(--av-bg, #fff)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--av-font-primary)' }}>
                    Retry
                  </button>
                </div>
              ),
            },
            {
              label: 'Warning Toast',
              tag: 'Toast',
              content: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'var(--av-warning, #F9A825)',
                  color: 'var(--av-on-surface, #1C1B1F)',
                  fontSize: 14,
                  maxWidth: 360,
                  width: '100%',
                  boxShadow: 'var(--av-shadow-3)',
                }}>
                  <Warning size={20} />
                  <span style={{ flex: 1 }}>Quantity exceeds available stock</span>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--av-on-surface, #1C1B1F)', cursor: 'pointer', display: 'flex', opacity: 0.7 }}>
                    <Close size={16} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Avontus Toolbar Validation Flow ── */}
      <SubSection
        title="Avontus Toolbar Validation Flow"
        description="In Quantify, save-time validation follows a strict 3-step pattern: toolbar icon appears, popup shows the error summary, and the first invalid field is focused and scrolled into view."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Validation flow',
            tag: 'Convention',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--av-error)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>1</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 4 }}>Error icon appears on toolbar</div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 44,
                      padding: '0 8px',
                      background: 'var(--av-surface)',
                      borderRadius: 8,
                      border: '1px solid var(--av-outline-variant)',
                      gap: 8,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Edit reservation</span>
                      <div style={{ color: 'var(--av-error)', display: 'flex' }}>
                        <ErrorIcon size={20} />
                      </div>
                      <button className="ds-btn ds-btn-filled" style={{ height: 28, fontSize: 11, padding: '0 10px' }}>Save</button>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 4 }}>A red error icon appears next to the save button when validation fails.</div>
                  </div>
                </div>
                {/* Step 2 */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--av-error)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>2</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 4 }}>Popup shows error summary</div>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'rgba(211,47,47,0.06)',
                      border: '1px solid var(--av-error)',
                      fontSize: 13,
                      color: 'var(--av-error)',
                      lineHeight: 1.6,
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Please fix the following errors:</div>
                      <div>• Project name is required</div>
                      <div>• Delivery date must be in the future</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 4 }}>Clicking the error icon opens a popup with all validation errors listed.</div>
                  </div>
                </div>
                {/* Step 3 */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--av-error)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>3</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 4 }}>First invalid field is focused</div>
                    <div className="ds-textfield error" style={{ maxWidth: 280 }}>
                      <input type="text" defaultValue="" style={{ borderColor: 'var(--av-error)' }} readOnly />
                      <label style={{ color: 'var(--av-error)' }}>Project name</label>
                      <div className="ds-textfield-helper" style={{ color: 'var(--av-error)' }}>This field is required</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 4 }}>The page scrolls to and focuses the first field with an error.</div>
                  </div>
                </div>
              </div>
            ),
          }]}
        />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div className="ds-validation-bar error" style={{ fontSize: 12, maxWidth: 300 }}>
                <ErrorIcon size={18} /> Quantity must be between 1 and 120
              </div>
            ),
            caption: 'Show specific, actionable error messages that tell users exactly how to fix the problem.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-validation-bar error" style={{ fontSize: 12, maxWidth: 300 }}>
                <ErrorIcon size={18} /> Invalid input
              </div>
            ),
            caption: "Don't use vague error messages. Users need to know what went wrong and how to fix it.",
          },
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--av-error)' }}>Quantity</label>
                <div style={{ padding: '6px 8px', border: '2px solid var(--av-error)', borderRadius: 4, fontSize: 13 }}>999</div>
                <div style={{ fontSize: 11, color: 'var(--av-error)' }}>Exceeds available stock (max: 120)</div>
              </div>
            ),
            caption: 'Show field-level errors inline, directly below the problematic field, so users can fix them in context.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                <div className="ds-validation-bar error" style={{ fontSize: 11 }}>
                  <ErrorIcon size={14} /> Error in Quantity field
                </div>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--av-on-surface-variant)' }}>Quantity</label>
                <div style={{ padding: '6px 8px', border: '1px solid var(--av-outline-variant)', borderRadius: 4, fontSize: 13 }}>999</div>
              </div>
            ),
            caption: "Don't show errors only in a top banner without highlighting the specific field. Users have to search for the problem.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="InfoBar / Validation"
          props={[
            {
              name: 'Severity',
              type: 'InfoBarSeverity',
              default: 'Informational',
              description: 'Visual severity: Error, Warning, Informational, or Success.',
            },
            {
              name: 'Title',
              type: 'string',
              description: 'The primary validation message displayed to the user.',
            },
            {
              name: 'Message',
              type: 'string',
              description: 'Optional secondary detail message for additional context.',
            },
            {
              name: 'IsOpen',
              type: 'bool',
              default: 'true',
              description: 'Whether the validation bar is currently visible.',
            },
            {
              name: 'IsClosable',
              type: 'bool',
              default: 'false',
              description: 'Whether the user can dismiss the validation bar.',
            },
            {
              name: 'IconSource',
              type: 'IconSource',
              description: 'Custom icon override. When not set, uses the default icon for the severity level.',
            },
            {
              name: 'ActionButton',
              type: 'ButtonBase',
              description: 'Optional action button for the validation bar (e.g., Retry, Fix).',
            },
            {
              name: 'Closed',
              type: 'event',
              description: 'Event raised when the validation bar is dismissed.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Error Validation Bar -->
<InfoBar Title="Quantity exceeds available stock"
         Severity="Error"
         IsOpen="{Binding HasError}"
         IsClosable="False" />

<!-- Warning Bar -->
<InfoBar Title="Delivery date is within 24 hours"
         Message="Rush charges may apply"
         Severity="Warning"
         IsOpen="{Binding ShowRushWarning}" />

<!-- Success Bar -->
<InfoBar Title="Reservation saved successfully"
         Severity="Success"
         IsOpen="{Binding ShowSuccess}"
         IsClosable="True" />

<!-- Info Bar -->
<InfoBar Title="Review all items before shipping"
         Severity="Informational"
         IsOpen="True" />

<!-- Field-Level Validation -->
<TextBox Header="Quantity"
         Text="{Binding Quantity, Mode=TwoWay}"
         PlaceholderText="Enter quantity">
  <TextBox.Description>
    <TextBlock Text="Must be between 1 and 120"
               Foreground="{StaticResource ErrorBrush}"
               Visibility="{Binding HasQuantityError}" />
  </TextBox.Description>
</TextBox>

<!-- Form-Level Validation Pattern -->
<StackPanel>
  <InfoBar Title="Please fix 2 errors before saving"
           Severity="Error"
           IsOpen="{Binding HasFormErrors}"
           IsClosable="False" />

  <StackPanel Padding="24" Spacing="16">
    <TextBox Header="Project Name"
             Text="{Binding ProjectName, Mode=TwoWay}"
             BorderBrush="{Binding ProjectNameBorder}">
      <TextBox.Description>
        <TextBlock Text="Required"
                   Foreground="{StaticResource ErrorBrush}"
                   Visibility="{Binding ShowProjectNameError}" />
      </TextBox.Description>
    </TextBox>

    <TextBox Header="Quantity"
             Text="{Binding Quantity, Mode=TwoWay}"
             BorderBrush="{Binding QuantityBorder}">
      <TextBox.Description>
        <TextBlock Text="Must be at least 1"
                   Foreground="{StaticResource ErrorBrush}"
                   Visibility="{Binding ShowQuantityError}" />
      </TextBox.Description>
    </TextBox>
  </StackPanel>
</StackPanel>`}
        />
      </SubSection>
    </section>
  )
}
