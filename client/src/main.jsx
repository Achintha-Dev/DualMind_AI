import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthProvider from './context/AuthProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
   <StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position='top-center'/>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
