import { useEffect, useState } from "react";
import LogoImage from "../assets/logo.png";
import { Await, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
export default function LoginCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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
      setError("Invalid username or password", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    const prev_id = localStorage.getItem("token");
    if (prev_id) {
      navigate("/dash");
    }
  }, [navigate])
  //Redirect if already Logged in

  return (
    <div className="login-card">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="circle"></div>
        <img src={LogoImage} alt="illustration" className="illustration" />
        {/* <p>
          Centralized academic portal for students.
          Access everything in one place.
        </p> */}
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="welcome-badge">Welcome back</div>

        <h2>Login your account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="login_btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="links">
            <p>Forgot Password?</p>
          </div>
        </form>
      </div>
    </div>
  );
}
