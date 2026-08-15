import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/apiConfig";
import LogoImage from "../assets/logo.png";
import { Mail, ArrowLeft, ArrowRight, KeyRound, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await axios.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong with the password reset request.");
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
            Enter your registered email address below and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertTriangle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Registered Email Address</label>
              <div className="input-field-wrapper">
                <Mail className="field-icon" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. student@svck.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className="login_btn" disabled={loading}>
              {loading ? (
                <span className="loading-state">
                  <span className="spinner"></span>
                  <span>Sending Link...</span>
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
            <h3>Reset Link Sent! 🎉</h3>
            <p>
              We have dispatched password reset instructions to <strong>{email}</strong>. Please check your inbox.
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