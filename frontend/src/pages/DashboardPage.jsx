// import { useAuth } from '../hooks/useAuth'
// import { FileText, Briefcase, Mic, TrendingUp } from 'lucide-react'

// const stats = [
//   { label: 'ATS Score', value: '82%', sub: '+12% this week', icon: TrendingUp, color: '#22c55e' },
//   { label: 'Jobs Tracked', value: '8', sub: '3 interviews pending', icon: Briefcase, color: '#598ef9' },
//   { label: 'Mock Interviews', value: '5', sub: '2 completed today', icon: Mic, color: '#a855f7' },
//   { label: 'Resume Uploads', value: '2', sub: 'Last updated today', icon: FileText, color: '#f59e0b' },
// ]

// const recentActivity = [
//   { action: 'Resume analyzed', detail: 'ATS Score: 82%', time: '2 min ago', color: '#22c55e' },
//   { action: 'Cover letter generated', detail: 'For Google SWE role', time: '1 hour ago', color: '#598ef9' },
//   { action: 'Mock interview completed', detail: 'React + DSA round', time: '3 hours ago', color: '#a855f7' },
//   { action: 'Job added to tracker', detail: 'Microsoft — Backend Intern', time: 'Yesterday', color: '#f59e0b' },
// ]

// export default function DashboardPage() {
//   const { user } = useAuth()

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

//       {/* Header */}
//       <div>
//         <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'white' }}>
//           Hey, {user?.name || 'Student'} 👋
//         </h2>
//         <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
//           Here's your placement progress at a glance.
//         </p>
//       </div>

//       {/* Stat Cards */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
//         {stats.map((stat, i) => {
//           const Icon = stat.icon
//           return (
//             <div key={i} style={{
//               backgroundColor: '#12152a',
//               border: '1px solid #1f2440',
//               borderRadius: '16px',
//               padding: '20px',
//               display: 'flex', flexDirection: 'column', gap: '12px',
//               transition: 'border-color 0.2s'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>{stat.label}</span>
//                 <div style={{
//                   width: '34px', height: '34px', borderRadius: '10px',
//                   backgroundColor: `${stat.color}18`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center'
//                 }}>
//                   <Icon size={16} color={stat.color} />
//                 </div>
//               </div>
//               <div>
//                 <p style={{ fontSize: '28px', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>
//                   {stat.value}
//                 </p>
//                 <p style={{ fontSize: '12px', color: stat.color, marginTop: '4px' }}>{stat.sub}</p>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Bottom Grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

//         {/* Recent Activity */}
//         <div style={{
//           backgroundColor: '#12152a',
//           border: '1px solid #1f2440',
//           borderRadius: '16px',
//           padding: '24px'
//         }}>
//           <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>
//             Recent Activity
//           </h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             {recentActivity.map((item, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//                 <div style={{
//                   width: '8px', height: '8px', borderRadius: '50%',
//                   backgroundColor: item.color,
//                   marginTop: '5px', flexShrink: 0
//                 }} />
//                 <div style={{ flex: 1 }}>
//                   <p style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{item.action}</p>
//                   <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{item.detail}</p>
//                 </div>
//                 <span style={{ color: '#4b5563', fontSize: '12px', flexShrink: 0 }}>{item.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div style={{
//           backgroundColor: '#12152a',
//           border: '1px solid #1f2440',
//           borderRadius: '16px',
//           padding: '24px'
//         }}>
//           <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>
//             Quick Actions
//           </h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             {[
//               { label: '📄 Analyze my Resume', color: '#1d46ea' },
//               { label: '✉️ Generate Cover Letter', color: '#a855f7' },
//               { label: '🎤 Start Mock Interview', color: '#22c55e' },
//               { label: '🗺️ View Learning Roadmap', color: '#f59e0b' },
//             ].map((action, i) => (
//               <button key={i} style={{
//                 width: '100%', padding: '12px 16px',
//                 borderRadius: '10px', fontSize: '14px',
//                 fontWeight: 500, cursor: 'pointer',
//                 backgroundColor: `${action.color}12`,
//                 border: `1px solid ${action.color}30`,
//                 color: 'white', textAlign: 'left',
//                 transition: 'all 0.2s'
//               }}
//                 onMouseEnter={e => e.currentTarget.style.backgroundColor = `${action.color}25`}
//                 onMouseLeave={e => e.currentTarget.style.backgroundColor = `${action.color}12`}
//               >
//                 {action.label}
//               </button>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  FileText,
  Briefcase,
  Mic,
  Map,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    title: 'Resume Analyzer',
    description: 'Upload and analyze your resume with AI-powered ATS insights.',
    icon: FileText,
    color: '#598ef9',
    path: '/resume'
  },
  {
    title: 'Job Tracker',
    description: 'Track applications and manage your placement journey.',
    icon: Briefcase,
    color: '#22c55e',
    path: '/jobs'
  },
  {
    title: 'Mock Interview',
    description: 'Practice technical interviews with AI-generated questions.',
    icon: Mic,
    color: '#a855f7',
    path: '/interview'
  },
  {
    title: 'Learning Roadmap',
    description: 'Generate a personalized roadmap based on your goals.',
    icon: Map,
    color: '#f59e0b',
    path: '/roadmap'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .dashboard{
          display:flex;
          flex-direction:column;
          gap:28px;
        }

        .feature-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:20px;
        }

        .bottom-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        @media (max-width:1024px){
          .feature-grid{
            grid-template-columns:1fr;
          }

          .bottom-grid{
            grid-template-columns:1fr;
          }
        }

        @media (max-width:640px){
          .feature-card{
            padding:20px !important;
          }
        }
      `}</style>

      <div className="dashboard">

        <div>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(24px,4vw,34px)',
              fontWeight: 700,
              color: 'white'
            }}
          >
            Welcome back, {user?.name || 'Student'} 👋
          </h2>

          <p
            style={{
              marginTop: 8,
              color: '#9ca3af',
              fontSize: 15
            }}
          >
            Everything you need for your placement journey in one place.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(feature => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="feature-card"
                onClick={() => navigate(feature.path)}
                style={{
                  cursor: 'pointer',
                  background: '#12152a',
                  border: '1px solid #1f2440',
                  borderRadius: 18,
                  padding: 28,
                  transition: '.25s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = feature.color
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1f2440'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${feature.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18
                  }}
                >
                  <Icon
                    size={24}
                    color={feature.color}
                  />
                </div>

                <h3
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 10,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    color: '#9ca3af',
                    lineHeight: 1.6,
                    fontSize: 14
                  }}
                >
                  {feature.description}
                </p>

                <div
                  style={{
                    marginTop: 22,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: feature.color,
                    fontWeight: 600
                  }}
                >
                  Open Module
                  <ArrowRight size={18} />
                </div>
              </div>
            )
          })}
        </div>

                <div className="bottom-grid">

          {/* Recent Activity */}

          <div
            style={{
              background: '#12152a',
              border: '1px solid #1f2440',
              borderRadius: 18,
              padding: 28
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 20,
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Recent Activity
            </h3>

            <div
              style={{
                minHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <FileText
                size={42}
                color="#4b5563"
              />

              <h4
                style={{
                  color: 'white',
                  fontSize: 18
                }}
              >
                No Activity Yet
              </h4>

              <p
                style={{
                  color: '#9ca3af',
                  textAlign: 'center',
                  maxWidth: 320,
                  lineHeight: 1.6
                }}
              >
                Your resume analysis, interview history,
                roadmap generation and job applications
                will appear here.
              </p>
            </div>
          </div>

          {/* Quick Actions */}

          <div
            style={{
              background: '#12152a',
              border: '1px solid #1f2440',
              borderRadius: 18,
              padding: 28
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 20,
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Quick Actions
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              {features.map(feature => (
                <button
                  key={feature.title}
                  onClick={() => navigate(feature.path)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 12,
                    border: `1px solid ${feature.color}30`,
                    background: `${feature.color}12`,
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: '.25s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      `${feature.color}25`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background =
                      `${feature.color}12`
                  }}
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  )
}