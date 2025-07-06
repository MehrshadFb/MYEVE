import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/api";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/welcome");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signin-page" style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>

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

      {/* SIGN-IN FORM */}
      <div className="signup-box" style={{ marginTop: "60px" }}>
        <div>
          <h2>Sign In</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
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
            <button type="submit">Sign In</button>
          </form>

          <p>No account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
