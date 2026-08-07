import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import { ToastContainer } from "react-toastify";

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Protected Pages
import DashboardPage from './pages/DashboardPage'
import ResumePage from './pages/ResumePage'
import JobTrackerPage from './pages/JobTrackerPage'
import InterviewPage from './pages/InterviewPage'
import ChatPage from './pages/ChatPage'
import RoadmapPage from './pages/RoadmapPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/jobs" element={<JobTrackerPage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
            </Route>
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </BrowserRouter>
    </AuthProvider>
  )
}