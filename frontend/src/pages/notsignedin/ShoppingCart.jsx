import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getCart } from "../../services/api"; // ✅ Import cart API



function ShoppingCart() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);

  if (token) {
    getCart()
      .then((data) => {
        setCartItems(data.items || []);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
      });
  }
}, []);


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <Header />
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
            {cartItems.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item) => (
            <li key={item.id} style={{ marginBottom: "10px" }}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{
          fontSize: "1.3rem",
          marginBottom: "600px",
          opacity: 0.9,
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          Your cart is empty.
        </p>
      )}

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