import { createContext, useContext, useState, useRef, useCallback } from 'react'

export interface WebElementInfo {
  path: string
  tag: string
  classes: string
  text: string | null
  hasChildren: boolean
  rect: { x: number; y: number; w: number; h: number }
  styles: Record<string, string>
}

interface WebEditContextValue {
  selectedWebElement: WebElementInfo | null
  setSelectedWebElement: (el: WebElementInfo | null) => void
  sendToIframe: (type: string, data: Record<string, unknown>) => void
  editIframeRef: React.RefObject<HTMLIFrameElement>
}

const WebEditContext = createContext<WebEditContextValue>({
  selectedWebElement: null,
  setSelectedWebElement: () => {},
  sendToIframe: () => {},
  editIframeRef: { current: null },
})

export function WebEditProvider({ children }: { children: React.ReactNode }) {
  const [selectedWebElement, setSelectedWebElement] = useState<WebElementInfo | null>(null)
  const editIframeRef = useRef<HTMLIFrameElement>(null)

  const sendToIframe = useCallback((type: string, data: Record<string, unknown>) => {
    editIframeRef.current?.contentWindow?.postMessage({ source: 'pencil-host', type, data }, '*')
  }, [])

  return (
    <WebEditContext.Provider value={{ selectedWebElement, setSelectedWebElement, sendToIframe, editIframeRef }}>
      {children}
    </WebEditContext.Provider>
  )
}

export const useWebEdit = () => useContext(WebEditContext)
