import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      padding: "10px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      boxShadow: "0 20px 20px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h1 style={{ 
          fontSize: "1.8rem", 
          fontWeight: "700", 
          color: "#1e293b",
          margin: 0
        }}>
          MYEVE
        </h1>
        <nav style={{ display: "flex", gap: "30px" }}>
          <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
          <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
          <Link to="/about" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>About</Link>
          {isAuthenticated && (
            <>
              <Link to="/manage" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Manage</Link>
              <Link to="/profile" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Profile</Link>
            </>
          )}
        </nav>
      </div>
      
      {isAuthenticated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ 
            color: "#1e293b", 
            fontWeight: "600",
            fontSize: "1rem"
          }}>
            Welcome, {user?.username}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#dc2626";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#ef4444";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link 
          to="/signin" 
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#2563eb";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Sign In
        </Link>
      )}
    </header>
  );
}

export default Header; 