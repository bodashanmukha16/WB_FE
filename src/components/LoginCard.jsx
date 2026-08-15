import { useEffect, useState } from "react";
import LogoImage from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { User, Lock, Eye, EyeOff, Sparkles, ShieldAlert, ArrowRight, GraduationCap } from "lucide-react";

export default function LoginCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dash");
    } catch (e) {
      const serverMsg = e.response?.data?.message || "Invalid username or password";
      setError(serverMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    const prev_id = localStorage.getItem("token");
    if (prev_id) {
      navigate("/dash");
    }
  }, [navigate]);

  return (
    <div className="login-card">
      
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        
        <div className="left-content">
          <div className="platform-badge">
            <GraduationCap className="badge-icon" />
            <span>Academic Portal</span>
          </div>

          <div className="illustration-wrapper">
            <img src={LogoImage} alt="Workbench Logo" className="illustration" />
          </div>

          <div className="left-text">
            <h3>Centralized Student Portal</h3>
            <p>Access your academic records, enrollments, and live schedules in one secure platform.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="welcome-badge">
          <Sparkles className="sparkle-icon" />
          <span>Welcome Back</span>
        </div>

        <div className="form-header">
          <h2>Sign In To Your Account</h2>
          <p className="subtext">Enter your college roll number and password to continue</p>
        </div>

        {error && (
          <div className="error-alert">
            <ShieldAlert className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* USERNAME INPUT */}
          <div className="input-group">
            <label htmlFor="username">Roll Number / Username</label>
            <div className="input-field-wrapper">
              <User className="field-icon" />
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. 23SVCK0501 or 23SITS1A0501"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="input-group">
            <label htmlFor="password">Account Password</label>
            <div className="input-field-wrapper">
              <Lock className="field-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="login_btn" disabled={loading}>
            {loading ? (
              <span className="loading-state">
                <span className="spinner"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="btn-content">
                <span>Sign In To Portal</span>
                <ArrowRight className="arrow-icon" />
              </span>
            )}
          </button>

          {/* LINKS */}
          <div className="links">
            <p onClick={() => navigate("/forgot-password")} className="forgot-pass-link">
              Forgot your password?
            </p>
          </div>
        </form>

      </div>

    </div>
  );
}
