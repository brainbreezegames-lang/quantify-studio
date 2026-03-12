import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { StoreProvider } from './store'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

const DesignSystem = React.lazy(() => import('./design-system/DesignSystem'))
const Designer = React.lazy(() => import('./designer/DesignerApp'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Routes>
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/designer" element={<Designer />} />
            <Route path="*" element={
              <StoreProvider>
                <App />
              </StoreProvider>
            } />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
