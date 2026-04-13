import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react" // <-- Notice it says /react, not /next
import './style/index.css'
import App from './App.jsx'
import { store } from './store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <SpeedInsights />
    <Analytics />
  </StrictMode>,
)
