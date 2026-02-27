import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      alert("Something went wrong",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6">

      <div className="backdrop-blur-xl bg-white/40 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500">

        {!success ? (
          <>
            <div style={{"text-align":"center", "margin-bottom":"20px;"}}>
                  <img src="https://res.cloudinary.com/dja3u3qwa/image/upload/v1771704478/logo_new_grbbdt.png" width="150" style={{"display":"flex", "margin-left":"auto","margin-right":"auto"}}/>
                </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full p-4 rounded-xl border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Email Sent Successfully 🎉
            </h2>
            <p className="text-gray-600">
              Please check your email to reset your password.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}