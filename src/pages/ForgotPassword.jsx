import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/apiConfig";
import { UserCheck, ArrowLeft, ArrowRight, KeyRound, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const clean = rollNumber.trim();
    if (!clean) {
      setError("Please enter your Student Roll Number.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_ENDPOINTS.AUTH}/forgot-password`, {
        rollNumber: clean,
        email: clean // Fallback in case user inputs email
      });
      
      setSuccessMsg(res.data?.message || `Password reset link sent to your registered email address.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process password reset. Please check your roll number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card-compact">
        
        {/* Header Icon / Logo */}
        <div className="compact-header">
          <div className="icon-badge">
            <KeyRound className="badge-icon-lg" />
          </div>

          <div className="welcome-badge center-badge">
            <Sparkles className="sparkle-icon" />
            <span>Account Security</span>
          </div>

          <h2>Forgot Password?</h2>
          <p className="subtext">
            Enter your Student Roll Number below. The system will automatically resolve your college organization and send reset instructions to your registered email.
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertTriangle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {!successMsg ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="rollNumber">Student Roll Number</label>
              <div className="input-field-wrapper">
                <UserCheck className="field-icon" />
                <input
                  id="rollNumber"
                  type="text"
                  required
                  placeholder="e.g. 19KH1A0512 or 23SVCK0531"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  autoComplete="off"
                  style={{ textTransform: "uppercase" }}
                />
              </div>
            </div>

            <button type="submit" className="login_btn" disabled={loading}>
              {loading ? (
                <span className="loading-state">
                  <span className="spinner"></span>
                  <span>Resolving & Sending...</span>
                </span>
              ) : (
                <span className="btn-content">
                  <span>Send Reset Link</span>
                  <ArrowRight className="arrow-icon" />
                </span>
              )}
            </button>
          </form>
        ) : (
          <div className="success-card">
            <CheckCircle2 className="success-icon" />
            <h3>Reset Link Dispatched! 🎉</h3>
            <p style={{ marginTop: "10px", lineHeight: "1.6", color: "#334155" }}>
              {successMsg}
            </p>
          </div>
        )}

        {/* Back to Sign In Link */}
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