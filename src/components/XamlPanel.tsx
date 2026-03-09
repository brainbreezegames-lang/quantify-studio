import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useAppState } from '../store'
import { generateXamlReport } from '../services/xaml'

function highlightXaml(code: string): string {
  return code
    // XML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Attribute values (must come before attribute names)
    .replace(/(&quot;|")(.*?)(&quot;|")/g, '<span class="xaml-string">"$2"</span>')
    // Self-closing tags
    .replace(/&lt;(\/?)([\w:.]+)/g, '&lt;<span class="xaml-tag">$1$2</span>')
    // Attribute names
    .replace(/\s([\w:]+)=/g, ' <span class="xaml-attr">$1</span>=')
}

export default function XamlPanel() {
  const { currentTree, designTokens } = useAppState()
  const [copied, setCopied] = useState(false)

  if (!currentTree) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2.5 border-b border-studio-border">
          <h2 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider">XAML</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-studio-text-dim text-center">Generated XAML will appear here</p>
        </div>
      </div>
    )
  }

  const report = generateXamlReport(currentTree, designTokens)
  const xaml = report.xaml
  const warningCount = report.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length
  const errorCount = report.diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length

  const handleCopy = async () => {
    await navigator.clipboard.writeText(xaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-studio-border flex items-center justify-between">
        <h2 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider">XAML</h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors ${
            copied
              ? 'bg-studio-success/15 text-studio-success'
              : 'text-studio-text-muted hover:text-studio-text hover:bg-studio-surface-3'
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {(warningCount > 0 || errorCount > 0) && (
          <div className={`mx-3 mt-3 rounded-lg border px-3 py-2 text-[11px] leading-5 ${
            errorCount > 0
              ? 'border-red-500/30 bg-red-500/8 text-red-200'
              : 'border-amber-500/30 bg-amber-500/8 text-amber-100'
          }`}>
            {errorCount > 0 ? `${errorCount} export issue${errorCount > 1 ? 's' : ''}` : `${warningCount} conversion warning${warningCount > 1 ? 's' : ''}`}
            {report.diagnostics.slice(0, 3).map((diagnostic) => (
              <div key={`${diagnostic.code}-${diagnostic.nodeId || diagnostic.message}`} className="text-studio-text-dim">
                {diagnostic.code}: {diagnostic.message}
              </div>
            ))}
          </div>
        )}
        <pre className="p-3 text-[12px] leading-5 font-mono text-studio-text-muted overflow-x-auto">
          <code dangerouslySetInnerHTML={{ __html: highlightXaml(xaml) }} />
        </pre>
      </div>
    </div>
  )
}
