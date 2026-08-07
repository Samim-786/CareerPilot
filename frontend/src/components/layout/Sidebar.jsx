import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, FileText, Briefcase, Mic, Bot, Map, LogOut } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText,        label: 'Resume',     path: '/resume' },
  { icon: Briefcase,       label: 'Job Tracker', path: '/jobs' },
  { icon: Mic,             label: 'Mock Interview', path: '/interview' },
  { icon: Bot,             label: 'AI Chat',    path: '/chat' },
  { icon: Map,             label: 'Roadmap',    path: '/roadmap' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <style>{`
        /* Desktop styles */
        .sidebar {
          width: 256px;
        }
        .sidebar .nav-label,
        .sidebar .user-details,
        .sidebar .brand-title {
          display: inline-block;
        }
        .sidebar .brand-container,
        .sidebar .nav-button,
        .sidebar .logout-button {
          justify-content: flex-start;
        }
        .sidebar .user-card {
          justify-content: flex-start;
          padding: 12px 16px;
        }

        /* Mobile & Tablet styles (screens under 768px) */
        @media (max-width: 768px) {
          .sidebar {
            width: 72px !important;
          }
          .sidebar .nav-label,
          .sidebar .user-details,
          .sidebar .brand-title {
            display: none !important;
          }
          .sidebar .brand-container,
          .sidebar .nav-button,
          .sidebar .logout-button {
            justify-content: center !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .sidebar .user-card {
            justify-content: center !important;
            padding: 10px 0 !important;
          }
        }
      `}</style>

      <aside
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          backgroundColor: '#12152a',
          borderRight: '1px solid #1f2440',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          transition: 'width 0.3s ease',
        }}
      >
        {/* Logo */}
        <div
          className="brand-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '20px 24px',
            borderBottom: '1px solid #1f2440',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1d46ea, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <span
            className="brand-title"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: 'white',
            }}
          >
            CareerPilot
          </span>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                className="nav-button"
                onClick={() => navigate(item.path)}
                title={item.label} // Tooltip when collapsed
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: isActive
                    ? 'rgba(29,70,234,0.15)'
                    : 'transparent',
                  color: isActive ? '#598ef9' : '#9ca3af',
                  border: isActive
                    ? '1px solid rgba(29,70,234,0.3)'
                    : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#181c30'
                    e.currentTarget.style.color = 'white'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#9ca3af'
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #1f2440',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            className="user-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '12px',
              backgroundColor: '#181c30',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(29,70,234,0.2)',
                color: '#598ef9',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details" style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'Student'}
              </p>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#9ca3af',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#181c30'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}