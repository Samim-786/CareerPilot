import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {

  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f1a' }}>

      <style>{`
        .main-content {
          margin-left: 256px;
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 72px !important;
          }
          .topbar {
            padding: 12px 16px !important;
          }
          .topbar h1 {
            font-size: 16px !important;
          }
          .topbar-subtitle {
            display: none;
          }
          .ai-ready-label {
            display: none;
          }
          .page-content {
            padding: 16px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .page-content {
            padding: 24px !important;
          }
        }
      `}</style>

      <Sidebar />

      {/* Main Content */}
      <main className="main-content"
      style={{ flex: 1, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0, overflowX: 'hidden'  }}>

        {/* Topbar */}
        <header className="topbar"
        style={{
          position: 'sticky', top: 0, zIndex: 30,
          backgroundColor: 'rgba(13,15,26,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1f2440',
          padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              Welcome back, {user?.name} 👋
            </h1>
            <p className="topbar-subtitle" style={{ color: '#6b7280', fontSize: '14px', marginTop: '2px' }}>
              Let's get you placed today
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              animation: 'pulse 2s infinite'
            }} />
            <span className="ai-ready-label" style={{ color: '#9ca3af', fontSize: '14px' }}>AI Ready</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content" style={{ flex: 1, padding: '32px' ,minWidth: 0, overflowX: 'hidden'}}>
          <Outlet />
        </div>

      </main>
    </div>
  )
}