import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { store } from './store/store'
import App from './App.jsx'
import './style/index.css'

function GlobalFallback({ error }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-white">
      <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong!</h2>
      <p className="text-slate-300 mb-4">An unexpected error occurred. Please refresh the page or try again later.</p>
      <pre className="text-xs text-slate-500 max-w-lg overflow-auto p-4 bg-slate-900 rounded-md">
        {error.message}
      </pre>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GlobalFallback}>
      <Provider store={store}>
        <App />
      </Provider>     
      <SpeedInsights />
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
)