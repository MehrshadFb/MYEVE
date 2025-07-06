import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="signup-page">
       <div className="signup-box">
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
      <p>
        Already have an account? <a href="/signin">Sign in</a>
      </p>
    </div>
    </div>
    </div>
  );
}

export default SignUp;
