import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState(false)

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0f1a', color: 'white', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* Animated background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(29,70,234,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'transform 0.1s ease'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: `translateY(${scrollY * -0.08}px)`,
          transition: 'transform 0.1s ease'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '40%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Grid pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(51,102,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(51,102,245,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 60px',
        background: scrollY > 20 ? 'rgba(13,15,26,0.85)' : 'transparent',
        backdropFilter: scrollY > 20 ? 'blur(12px)' : 'none',
        borderBottom: scrollY > 20 ? '1px solid #1f2440' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #1d46ea, #22d3ee)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px'
          }}>✦</div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', fontSize: '20px' }}>CareerPilot AI</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1px solid #1f2440',
            color: 'white', padding: '8px 22px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.target.style.borderColor = '#1d46ea'}
            onMouseLeave={e => e.target.style.borderColor = '#1f2440'}
          >
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{
            background: 'linear-gradient(135deg, #1d46ea, #1534d8)',
            border: 'none', color: 'white', padding: '8px 22px',
            borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
            fontWeight: '500', boxShadow: '0 0 20px rgba(29,70,234,0.4)',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.target.style.boxShadow = '0 0 30px rgba(29,70,234,0.6)'}
            onMouseLeave={e => e.target.style.boxShadow = '0 0 20px rgba(29,70,234,0.4)'}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '180px 60px 100px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(29,70,234,0.1)',
          border: '1px solid rgba(29,70,234,0.3)',
          borderRadius: '999px', padding: '6px 18px',
          fontSize: '13px', color: '#598ef9', marginBottom: '32px',
          animation: 'pulse 2s infinite'
        }}>
          ✦ AI-Powered Placement Assistant
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '68px', fontWeight: '700',
          lineHeight: '1.1', marginBottom: '28px',
          maxWidth: '820px', margin: '0 auto 28px'
        }}>
          Land your dream job with{' '}
          <span style={{
            background: 'linear-gradient(90deg, #598ef9, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            AI guidance
          </span>
        </h1>

        <p style={{
          color: '#9ca3af', fontSize: '18px',
          maxWidth: '560px', margin: '0 auto 48px', lineHeight: '1.8'
        }}>
          Upload your resume, paste a job description — CareerPilot analyzes skill gaps, optimizes your resume, generates cover letters, and preps you for interviews.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/register')} style={{
            background: 'linear-gradient(135deg, #1d46ea, #1534d8)',
            border: 'none', color: 'white',
            padding: '15px 36px', borderRadius: '12px',
            cursor: 'pointer', fontSize: '16px', fontWeight: '600',
            boxShadow: '0 0 30px rgba(29,70,234,0.4)',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 0 40px rgba(29,70,234,0.6)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0 30px rgba(29,70,234,0.4)' }}
          >
            Start for free →
          </button>
          <button onClick={() => navigate('/login')} style={{
            background: '#12152a', border: '1px solid #1f2440',
            color: 'white', padding: '15px 36px',
            borderRadius: '12px', cursor: 'pointer', fontSize: '16px',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.borderColor = '#598ef9' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.borderColor = '#1f2440' }}
          >
            Sign in
          </button>
        </div>

        {/* Floating stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '40px',
          marginTop: '80px', opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease 0.5s'
        }}>
          {[['500+', 'Students Placed'], ['95%', 'ATS Match Rate'], ['10x', 'Faster Prep']].map(([num, label], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '32px', fontWeight: '700',
                background: 'linear-gradient(90deg, #598ef9, #22d3ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{num}</div>
              <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '38px', fontWeight: '700', marginBottom: '16px'
        }}>
          Everything you need to get placed
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '52px', fontSize: '16px' }}>
          One platform. Every tool from resume to offer letter.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        position: 'relative', zIndex: 1,
        margin: '40px 60px 80px',
        background: 'linear-gradient(135deg, rgba(29,70,234,0.15), rgba(34,211,238,0.08))',
        border: '1px solid rgba(29,70,234,0.25)',
        borderRadius: '24px', padding: '60px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
          Ready to get placed?
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '16px' }}>
          Join hundreds of students who landed their dream roles using CareerPilot AI.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: 'linear-gradient(135deg, #1d46ea, #1534d8)',
          border: 'none', color: 'white',
          padding: '15px 40px', borderRadius: '12px',
          cursor: 'pointer', fontSize: '16px', fontWeight: '600',
          boxShadow: '0 0 30px rgba(29,70,234,0.4)',
          transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
        >
          Create free account →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '32px',
        borderTop: '1px solid #1f2440',
        color: '#4b5563', fontSize: '14px'
      }}>
        © 2025 CareerPilot AI — Built with Spring Boot · React · RAG · pgvector
      </footer>

    </div>
  )
}

function FeatureCard({ feature, delay }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 300 + delay)
  }, [])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#181c30' : '#12152a',
        border: `1px solid ${hovered ? 'rgba(29,70,234,0.4)' : '#1f2440'}`,
        borderRadius: '16px', padding: '28px',
        cursor: 'default',
        transform: visible ? (hovered ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 0 30px rgba(29,70,234,0.1)' : 'none'
      }}
    >
      <div style={{ fontSize: '30px', marginBottom: '16px' }}>{feature.icon}</div>
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '17px', fontWeight: '600', marginBottom: '10px',
        color: hovered ? '#598ef9' : 'white',
        transition: 'color 0.3s'
      }}>{feature.title}</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7' }}>{feature.desc}</p>
    </div>
  )
}

const features = [
  { icon: '📄', title: 'Resume Analysis', desc: 'Upload your resume and get instant ATS score, skill gap analysis, and optimization suggestions.' },
  { icon: '🎯', title: 'Job Matching', desc: 'Paste any job description and see exactly how well your profile matches the requirements.' },
  { icon: '✉️', title: 'Cover Letter Generator', desc: 'Generate personalized cover letters tailored to each job in seconds.' },
  { icon: '🤖', title: 'AI Chat Assistant', desc: 'Ask anything about your resume or job using RAG-powered contextual answers.' },
  { icon: '🎤', title: 'Mock Interviews', desc: 'Practice with AI-generated questions and get instant feedback on your answers.' },
  { icon: '🗺️', title: 'Learning Roadmap', desc: 'Get a personalized roadmap to bridge skill gaps and become the ideal candidate.' },
]