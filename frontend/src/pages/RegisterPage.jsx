import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      const data = await authService.register(form.name, form.email, form.password)
      login(data.token, data.user)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0f1a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Inter,sans-serif",
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Glow */}

      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29,70,234,.18), transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,.12), transparent 70%)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1150px",
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: "80px",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* Left Card */}

        <div
          style={{
            background: "#12152a",
            border: "1px solid #1f2440",
            borderRadius: "24px",
            padding: "35px",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: "linear-gradient(135deg,#1d46ea,#22d3ee)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            AI
          </div>

          <h2
            style={{
              fontFamily: "Space Grotesk,sans-serif",
              fontSize: "34px",
              marginBottom: "15px",
            }}
          >
            Join CareerPilot AI
          </h2>

          <p
            style={{
              color: "#9ca3af",
              lineHeight: 1.8,
            }}
          >
            Create your free account and start improving your resume,
            preparing for interviews and tracking your placement journey.
          </p>

          <div
            style={{
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <Feature text="ATS Resume Analysis" />
            <Feature text="AI Cover Letter Generator" />
            <Feature text="Mock Interviews" />
            <Feature text="Learning Roadmap" />
          </div>
        </div>

        {/* Register Form */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#12152a",
            border: "1px solid #1f2440",
            borderRadius: "24px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "Space Grotesk,sans-serif",
              fontSize: "34px",
              marginBottom: "10px",
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "30px",
            }}
          >
            It's free and only takes a minute.
          </p>

          <label>Name</label>

          <input
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Email</label>

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>Password</label>

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Confirm Password</label>

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "15px",
              background: "linear-gradient(135deg,#1d46ea,#1534d8)",
              border: "none",
              color: "white",
              padding: "15px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Create Account
          </button>

          <p
            style={{
              marginTop: "25px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#598ef9",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Sign In
            </span>
          </p>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
              }}
            >
              ← Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#d1d5db",
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#1d46ea",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "13px",
        }}
      >
        ✓
      </span>

      {text}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "22px",
  borderRadius: "12px",
  border: "1px solid #1f2440",
  background: "#0d0f1a",
  color: "white",
  outline: "none",
  fontSize: "15px",
};