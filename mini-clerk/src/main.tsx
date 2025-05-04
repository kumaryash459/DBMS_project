import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Use the publishable key directly
const CLERK_PUBLISHABLE_KEY = "pk_test_c3RpbGwtZ3JvdXBlci0yMC5jbGVyay5hY2NvdW50cy5kZXYk"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
