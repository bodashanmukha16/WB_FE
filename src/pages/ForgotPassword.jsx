import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      alert("Something went wrong with the password reset request.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 font-sans">

      <div className="backdrop-blur-xl bg-white/40 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500">

        {!success ? (
          <>
            <div className="text-center mb-6">
              <img
                src="https://res.cloudinary.com/dja3u3qwa/image/upload/v1771704478/logo_new_grbbdt.png"
                alt="Logo"
                width="150"
                className="mx-auto"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-600 bg-white/80 text-gray-800"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">
              Reset Link Sent! 🎉
            </h2>
            <p className="text-gray-600 text-sm">
              Please check your inbox for instructions to reset your password.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}