import { DesignerProvider, useDesigner } from './designer-store'
import DesignerToolbar from './components/DesignerToolbar'
import LayerPanel from './components/LayerPanel'
import Canvas from './components/Canvas'
import ChatPanel from './components/ChatPanel'
import InspectorPanel from './components/InspectorPanel'

function RightPanel() {
  const { state } = useDesigner()
  const { rightPanel, selectedElement } = state

  // Inspector/Code panels handle their own rendering
  if (rightPanel === 'code' || (rightPanel === 'inspect' && selectedElement)) {
    return <InspectorPanel />
  }

  // Default: chat panel
  return <ChatPanel />
}

function DesignerLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: '"Switzer", system-ui, sans-serif' }}>
      <DesignerToolbar />
      <div className="flex-1 flex overflow-hidden">
        <LayerPanel />
        <Canvas />
        <RightPanel />
      </div>
    </div>
  )
}

export default function DesignerApp() {
  return (
    <DesignerProvider>
      <DesignerLayout />
    </DesignerProvider>
  )
}
