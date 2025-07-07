import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ShoppingCart() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // convert to true/false
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
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
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>MYEVE</h1>
          <nav style={{ display: "flex", gap: "30px" }}>
            <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
            <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
            <Link to="/about" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>About</Link>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/signin" style={{
            background: "#3b82f6", color: "white", padding: "12px 24px",
            borderRadius: "8px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease"
          }}
            onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#3b82f6"; e.target.style.transform = "translateY(0)"; }}
          >
            Sign In
          </Link>

          <Link to="/shoppingcart" style={{
            background: "#3b82f6", padding: "10px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease"
          }}
            onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#3b82f6"; e.target.style.transform = "translateY(0)"; }}
          >
            <img src="/cart-icon.png" alt="Cart" style={{ width: "24px", height: "24px" }} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        textAlign: "center",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        {isLoggedIn ? (
          <div style={{ width: "100%" }}>
            <h1 style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Shopping Cart
            </h1>
            <p style={{
              fontSize: "1.3rem",
              marginBottom: "600px",
              opacity: 0.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              List of carts will go here
            </p>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <h1 style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Shopping Cart Empty
            </h1>
            <p style={{
              fontSize: "1.3rem",
              opacity: 0.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              Please sign in to view your cart.
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginTop: "40px",
              flexWrap: "wrap"
            }}>
              <Link to="/signin" style={{
                background: "#3b82f6", color: "white", padding: "12px 24px",
                borderRadius: "8px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease"
              }}
                onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = "#3b82f6"; e.target.style.transform = "translateY(0)"; }}
              >
                Sign In
              </Link>

              <Link to="/signup" style={{
                background: "#3b82f6", color: "white", padding: "12px 24px",
                borderRadius: "8px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease"
              }}
                onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = "#3b82f6"; e.target.style.transform = "translateY(0)"; }}
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 0px",
        backgroundColor: "#1e293b",
        color: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <p style={{ opacity: 0.8 }}>
            © 2024 EVStore. All rights reserved. Driving the future of transportation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingCart;
