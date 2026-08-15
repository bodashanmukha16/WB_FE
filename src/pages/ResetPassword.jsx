import { useParams, useNavigate } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState("");

  const checkStrength = (value) => {
    if (!value || value.length < 6) return "Weak";
    if (/[A-Z]/.test(value) && /[0-9]/.test(value)) return "Strong";
    return "Medium";
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${API_ENDPOINTS.AUTH}/verify-reset-token/${token}`);
      } catch {
        setValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_ENDPOINTS.AUTH}/reset-password/${token}`, {
        newPassword: password,
      });
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch {
      setValidToken(false);
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="login-background">
        <div className="login-card-compact text-center">
          <div className="icon-badge warning-badge">
            <ShieldAlert className="badge-icon-lg warning-icon" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Token Expired or Invalid
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "24px" }}>
            The password reset token is invalid or has expired. Please request a new reset link.
          </p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="login_btn"
            style={{ width: "100%" }}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-background">
      <div className="login-card-compact">

        <div className="compact-header">
          <div className="icon-badge">
            <ShieldCheck className="badge-icon-lg" />
          </div>

          <h2>Create New Password</h2>
          <p className="subtext">
            Enter and confirm your new account password below
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* NEW PASSWORD */}
            <div className="input-group">
              <label htmlFor="new-password">New Password</label>
              <div className="input-field-wrapper">
                <Lock className="field-icon" />
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setStrength(checkStrength(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                </button>
              </div>
              {password && (
                <div className="strength-meter">
                  <span className="strength-label">Password Strength:</span>
                  <span className={`strength-badge strength-${strength.toLowerCase()}`}>
                    {strength}
                  </span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <div className="input-field-wrapper">
                <Lock className="field-icon" />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="login_btn" disabled={loading}>
              {loading ? (
                <span className="loading-state">
                  <span className="spinner"></span>
                  <span>Updating Password...</span>
                </span>
              ) : (
                <span className="btn-content">
                  <span>Update Password</span>
                  <ArrowRight className="arrow-icon" />
                </span>
              )}
            </button>
          </form>
        ) : (
          <div className="success-card">
            <CheckCircle2 className="success-icon" />
            <h3>Password Updated! 🎉</h3>
            <p>Your password has been changed successfully. Redirecting you to sign in...</p>
          </div>
        )}

        <div className="back-link-wrapper">
          <button type="button" onClick={() => navigate("/")} className="back-btn">
            <ArrowLeft className="back-icon" />
            <span>Back to Sign In</span>
          </button>
        </div>

      </div>
    </div>
  );
}