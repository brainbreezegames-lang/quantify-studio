import { DesignerProvider } from './designer-store'
import DesignerToolbar from './components/DesignerToolbar'
import LayerPanel from './components/LayerPanel'
import Canvas from './components/Canvas'
import ChatPanel from './components/ChatPanel'

function DesignerLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: '"Switzer", system-ui, sans-serif' }}>
      <DesignerToolbar />
      <div className="flex-1 flex overflow-hidden">
        <LayerPanel />
        <Canvas />
        <ChatPanel />
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
