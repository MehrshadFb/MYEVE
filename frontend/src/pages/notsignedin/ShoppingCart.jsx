import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getCart, updateCartItem, removeCartItem } from "../../services/api";
import useAuth from "../../context/useAuth";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useAuth();

  const buttonStyle = {
    padding: "6px 14px",
    fontSize: "1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const fetchCart = async () => {
    try {
      const data = await getCart();
      const items = data.CartItems || data.items || [];

      // Normalize the vehicle object
      const normalizedItems = items.map((item) => ({
        ...item,
        vehicle: item.Vehicle || item.vehicle || {},
      }));

      setCartItems(normalizedItems);

      const total = normalizedItems.reduce((sum, item) => {
        return sum + parseFloat(item.vehicle.price || 0) * item.quantity;
      }, 0);

      setTotalAmount(total || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch cart only when user is ready
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedCart = await updateCartItem(itemId, newQuantity);
      const items = updatedCart.CartItems || updatedCart.items || [];

      const normalizedItems = items.map((item) => ({
        ...item,
        vehicle: item.Vehicle || item.vehicle || {},
      }));

      setCartItems(normalizedItems);

      const total = normalizedItems.reduce((sum, item) => {
        return sum + parseFloat(item.vehicle.price || 0) * item.quantity;
      }, 0);

      setTotalAmount(total);
    } catch (error) {
      console.error("🚨 Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch (error) {
      console.error("🚨 Error removing item:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header />

      {/* Header Section */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "60px",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          textAlign: "center",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Shopping Cart
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto 20px",
          }}
        >
          Review your selected vehicles
        </p>
      </section>

      {/* Cart Content */}
      <section
        style={{
          backgroundColor: "white",
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {user?.id && cartItems.length > 0 ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "30px",
              }}
            >
              {cartItems.map((item, index) => {
                const vehicle = item.Vehicle;
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      border: "1px solid #e2e8f0",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "10px",
                      }}
                    >
                      {vehicle?.model || "Unknown Vehicle"}
                    </h3>

                    <p style={{ color: "#64748b", marginBottom: "8px" }}>
                      Brand: <strong>{vehicle?.brand}</strong> | Model:{" "}
                      <strong>{vehicle?.model}</strong>
                    </p>

                    <p
                      style={{
                        color: "#3b82f6",
                        fontWeight: "600",
                        marginBottom: "16px",
                      }}
                    >
                      ${vehicle?.price} × {item.quantity} = $
                      {(parseFloat(vehicle?.price) * item.quantity).toFixed(2)}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={buttonStyle}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
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
                          cursor: "pointer",
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
            <div
              style={{
                marginTop: "40px",
                textAlign: "right",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Total: ${parseFloat(totalAmount).toFixed(2)}
            </div>

            {/* Checkout Button */}
            <div
              style={{
                marginTop: "30px",
                textAlign: "right",
              }}
            >
              <Link
                to="/checkout"
                style={{
                  display: "inline-block",
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Proceed to Checkout
              </Link>
            </div>

            {/* Loan Calculator */}
            <div
              style={{
                marginTop: "40px",
                textAlign: "right",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Calculate Your Monthly Payment Using the{" "}
              <Link
                to="/loan-calculator"
                style={{
                  marginTop: "40px",
                  textAlign: "right",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#407fe5ff",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#000000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#407fe5ff";
                }}
              >
                Loan Calculator
              </Link>
            </div>

            {/* Compare Vehicle */}
            <div
              style={{
                marginTop: "40px",
                textAlign: "right",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Or Compare Vehicles{" "}
              <Link
                to="/compare-vehicle"
                style={{
                  marginTop: "40px",
                  textAlign: "right",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#407fe5ff",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#000000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#407fe5ff";
                }}
              >
                Here
              </Link>
            </div>
          </>
        ) : user?.id ? (
          <p
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Your cart is currently empty.
          </p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
              Please sign in to view your cart.
            </p>
            <Link
              to="/signin"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default ShoppingCart;
