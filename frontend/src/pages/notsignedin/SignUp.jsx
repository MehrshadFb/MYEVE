import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/api";
import Header from "../../components/Header";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(formData);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc", 
      width: "100vw", 
      overflowX: "hidden" 
    }}>
      <Header />
      
      {/* Main Container */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "20px",
        marginTop: "80px"
      }}>
        
        {/* Sign Up Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #e2e8f0"
        }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 8px 0"
            }}>
              Create Account
            </h1>
            <p style={{
              color: "#64748b",
              fontSize: "0.875rem",
              margin: 0
            }}>
              Join MYEVE and start exploring amazing vehicles
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              color: "#ef4444",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151"
              }}>
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151"
              }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151"
              }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading ? "#9ca3af" : "#3b82f6",
                color: "white",
                padding: "14px 20px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                marginBottom: "24px"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = "#2563eb";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = "#3b82f6";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#64748b"
          }}>
            Already have an account?{" "}
            <a 
              href="/signin" 
              style={{
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#3b82f6";
              }}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
