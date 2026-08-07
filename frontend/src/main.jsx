import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#12152a',
          color: 'white',
          border: '1px solid #1f2440',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#12152a',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#12152a',
          },
        },
      }}
    />
    <App />
  </StrictMode>
)