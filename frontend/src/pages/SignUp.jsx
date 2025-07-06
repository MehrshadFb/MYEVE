import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/api";
import '../SignInUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(formData);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-page" style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>

      {/* HEADER START */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        boxShadow: "0 20px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0
            }}>
              MYEVE
            </h1>
          </Link>
          <nav style={{ display: "flex", gap: "30px" }}>
            <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
            <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
            <Link to="/about" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>About</Link>
          </nav>
        </div>
      </header>
      {/* HEADER END */}

      {/* SIGN-UP BOX */}
      <div className="signup-box" style={{ marginTop: "70px" }}>
        <div>
          <h2>Sign Up</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <p>
                <input
                  className="form-input"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </p>
            </div>
            <div>
              <p>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </p>
            </div>
            <div>
              <p>
                <input
                  className="form-input"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </p>
            </div>
            <div>
              <p>
                <select className="form-input" name="role" value={formData.role} onChange={handleChange}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </p>
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <a href="/signin">Sign in</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
