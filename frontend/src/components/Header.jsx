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
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 
            style={{ 
              fontSize: "1.8rem", 
              fontWeight: "700", 
              color: "#1e293b",
              margin: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "visible",
              background: "transparent"
            }}
            onMouseEnter={(e) => {
              // Create a more sophisticated electric effect
              const originalText = e.target.textContent;
              const letters = originalText.split('');
              
              // Clear any existing effects
              e.target.innerHTML = '';
              
              // Create individual letter spans with electric effect
              letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.cssText = `
                  display: inline-block;
                  color: #1e293b;
                  transition: all 0.3s ease;
                  position: relative;
                  animation: electricLetter 0.6s ease-out;
                  animation-delay: ${index * 0.05}s;
                `;
                
                e.target.appendChild(span);
              });
              
              // Add the animation style
              const style = document.createElement('style');
                              style.textContent = `
                  @keyframes electricLetter {
                    0% {
                      color: #1e293b;
                      text-shadow: none;
                      transform: scale(1);
                    }
                    25% {
                      color: rgba(59, 130, 246, 0.8);
                      text-shadow: 0 0 2px rgba(59, 130, 246, 0.6), 0 0 4px rgba(59, 130, 246, 0.4);
                      transform: scale(1.02);
                    }
                    50% {
                      color: rgba(96, 165, 250, 0.9);
                      text-shadow: 0 0 3px rgba(96, 165, 250, 0.7), 0 0 6px rgba(96, 165, 250, 0.5);
                      transform: scale(1.03);
                    }
                    75% {
                      color: rgba(59, 130, 246, 0.8);
                      text-shadow: 0 0 2px rgba(59, 130, 246, 0.6), 0 0 4px rgba(59, 130, 246, 0.4);
                      transform: scale(1.02);
                    }
                    100% {
                      color: rgba(59, 130, 246, 0.7);
                      text-shadow: 0 0 1px rgba(59, 130, 246, 0.5);
                      transform: scale(1);
                    }
                  }
                `;
              
              if (!document.getElementById('electric-style')) {
                style.id = 'electric-style';
                document.head.appendChild(style);
              }
            }}
            onMouseLeave={(e) => {
              // Restore original text
              e.target.textContent = "MYEVE";
              e.target.style.color = "#1e293b";
              e.target.style.textShadow = "none";
            }}>
            MYEVE
          </h1>
        </Link>
        <nav style={{ display: "flex", gap: "30px" }}>
          <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
          <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
          <Link to="/about" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>About</Link>
          {isAuthenticated && (
            <Link to="/profile" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Profile</Link>
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
          {user?.role === "admin" && (
            <Link 
              to="/manage" 
              style={{
                color: "#64748b",
                textDecoration: "none",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8fafc";
                e.target.style.color = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#64748b";
              }}
            >
              Manage
            </Link>
          )}
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