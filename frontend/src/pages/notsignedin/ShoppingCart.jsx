import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/api";

function ShoppingCart() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const buttonStyle = {
  padding: "6px 14px",
  fontSize: "1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      <Header />

      {/* Header Section */}
      <section style={{
        paddingTop: "120px",
        paddingBottom: "60px",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        textAlign: "center",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: "800",
          background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Shopping Cart
        </h1>
        <p style={{
          fontSize: "1.2rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto 20px"
        }}>
          Review your selected vehicles
        </p>
      </section>

      {/* Cart Content */}
      <section style={{
        backgroundColor: "white",
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {isLoggedIn && cartItems.length > 0 ? (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "30px"
            }}>
              {cartItems.map((item, index) => {
                const vehicle = item.vehicle;
                return (
                  <div key={index} style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <h3 style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "10px"
                    }}>
                      {vehicle.name}
                    </h3>

                    <p style={{ color: "#64748b", marginBottom: "8px" }}>
                      Brand: <strong>{vehicle.brand}</strong> | Model: <strong>{vehicle.model}</strong>
                    </p>

                    <p style={{ color: "#3b82f6", fontWeight: "600", marginBottom: "16px" }}>
                      ${vehicle.price} × {item.quantity} = ${(parseFloat(vehicle.price) * item.quantity).toFixed(2)}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <button
                          onClick={() => {
                          console.log("Clicked − for:", item.id, "Current quantity:", item.quantity);
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            handleRemoveItem(item.id);
                          }
                        }}
                          style={buttonStyle}
                        >
                          −
                        </button>

                        <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                          console.log("Clicked ＋ for:", item.id, "New quantity:", item.quantity + 1);
                          updateQuantity(item.id, item.quantity + 1);
                        }}

                          style={buttonStyle}
                        >
                          ＋
                        </button>


                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          marginLeft: "auto",
                          padding: "6px 12px",
                          fontSize: "0.9rem",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Summary */}
            <div style={{
              marginTop: "40px",
              textAlign: "right",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1e293b"
            }}>
              Total: ${parseFloat(totalAmount).toFixed(2)}
            </div>
          </>
        ) : isLoggedIn ? (
          <p style={{
            fontSize: "1.2rem",
            textAlign: "center",
            color: "#64748b"
          }}>
            Your cart is currently empty.
          </p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
              Please sign in to view your cart.
            </p>
            <Link to="/signin" style={{
              background: "#3b82f6",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              Sign In
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default ShoppingCart;
