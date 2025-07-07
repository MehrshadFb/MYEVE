import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { signIn } from "../../services/api";
import Header from "../../components/Header";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(formData);
      login(data.token, data.refreshToken, data.user);
      navigate("/manage");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signin-page" style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>      
    <Header />
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