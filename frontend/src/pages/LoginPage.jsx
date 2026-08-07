import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { authService } from "../services/authService";
export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      const data = await authService.login(email, password);

      login(data.token, data.user);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password";

      toast.error(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(29,70,234,0.18), transparent 70%)",
          top: -120,
          left: -120,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)",
          bottom: -80,
          right: -80,
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "80px",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* Left */}

        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "linear-gradient(135deg,#1d46ea,#22d3ee)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              AI
            </div>

            <h2
              style={{
                fontFamily: "Space Grotesk,sans-serif",
                fontSize: "24px",
              }}
            >
              CareerPilot AI
            </h2>
          </div>

          <h1
            style={{
              fontFamily: "Space Grotesk,sans-serif",
              fontSize: "58px",
              lineHeight: "1.15",
              marginBottom: "25px",
            }}
          >
            Welcome
            <br />
            Back 👋
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "18px",
              lineHeight: "1.8",
              maxWidth: "500px",
            }}
          >
            Continue building your career with AI-powered resume analysis,
            interview preparation and personalized learning roadmaps.
          </p>

          <div
            style={{
              marginTop: "45px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              color: "#d1d5db",
            }}
          >
            <span>✔ Resume Analysis</span>
            <span>✔ AI Mock Interviews</span>
            <span>✔ ATS Optimization</span>
            <span>✔ Personalized Learning Roadmap</span>
          </div>
        </div>

        {/* Login Card */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#12152a",
            border: "1px solid #1f2440",
            borderRadius: "22px",
            padding: "35px",
            boxShadow: "0 0 40px rgba(0,0,0,.25)",
          }}
        >
          <h2
            style={{
              fontFamily: "Space Grotesk,sans-serif",
              fontSize: "30px",
              marginBottom: "10px",
            }}
          >
            Sign In
          </h2>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "30px",
            }}
          >
            Login to continue.
          </p>

          <label style={{ color: "#cbd5e1", fontSize: 14 }}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={{ color: "#cbd5e1", fontSize: 14 }}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              marginBottom: "25px",
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            <label>
              <input type="checkbox" /> Remember me
            </label>

            <span
              style={{
                color: "#598ef9",
                cursor: "pointer",
              }}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#1d46ea,#1534d8)",
              border: "none",
              color: "white",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Sign In
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "25px",
              color: "#9ca3af",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#598ef9",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Register
            </span>
          </p>

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
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