import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState("");

  // Check password strength
  const checkStrength = (value) => {
    if (value.length < 6) return "Weak";
    if (/[A-Z]/.test(value) && /[0-9]/.test(value))
      return "Strong";
    return "Medium";
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`http://localhost:5000/api/auth/verify-reset-token/${token}`);
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
      await axios.post(`https://wb-be-q2u6.onrender.com/api/auth/reset-password/${token}`, {
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
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Token Expired or Invalid
          </h2>
          <p>Please request a new reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6">

      <div className="backdrop-blur-xl bg-white/40 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500">

        {!success ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Reset Password
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="password"
                required
                placeholder="New Password"
                className="w-full p-4 rounded-xl border border-gray-300 mb-2"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setStrength(checkStrength(e.target.value));
                }}
              />

              <p className={`text-sm mb-4 ${
                strength === "Strong" ? "text-green-600" :
                strength === "Medium" ? "text-yellow-600" :
                "text-red-600"
              }`}>
                Strength: {strength}
              </p>

              <input
                type="password"
                required
                placeholder="Confirm Password"
                className="w-full p-4 rounded-xl border border-gray-300 mb-6"
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Password Updated Successfully 🎉
            </h2>
            <p className="text-gray-600">
              Redirecting to login...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}