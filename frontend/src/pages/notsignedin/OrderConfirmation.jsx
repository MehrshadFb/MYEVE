import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Header from "../../components/Header";
import useAuth from "../../context/useAuth";

function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order data from location state (passed from checkout)
    if (location.state?.order) {
      setOrder(location.state.order);
    }
  }, [location.state]);

  if (!user?.id) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p>Please sign in to view order confirmation.</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

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
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          color: "white",
          textAlign: "center",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          Order Confirmed!
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </section>

      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Order Details */}
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1e293b",
              }}
            >
              Order Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "5px",
                  }}
                >
                  Order Number
                </label>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  {order.orderNumber}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "5px",
                  }}
                >
                  Order Date
                </label>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  {new Date(order.createdAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "5px",
                  }}
                >
                  Status
                </label>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#f59e0b",
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "5px",
                  }}
                >
                  Total Amount
                </label>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#059669",
                  }}
                >
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#f0fdf4",
                borderRadius: "8px",
                border: "1px solid #bbf7d0",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#166534",
                  marginBottom: "10px",
                }}
              >
                What's Next?
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "#166534",
                  lineHeight: "1.6",
                }}
              >
                <li>You will receive an email confirmation shortly</li>
                <li>Your order will be processed within 1-2 business days</li>
                <li>
                  You'll receive tracking information once your order ships
                </li>
                <li>Estimated delivery: 5-7 business days</li>
              </ul>
            </div>
          </div>

          {/* Financial Summary */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "30px",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1e293b",
              }}
            >
              Payment Summary
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#374151",
              }}
            >
              <span>Subtotal:</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
                color: "#374151",
              }}
            >
              <span>Tax (HST 13%):</span>
              <span>${parseFloat(order.taxAmount).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.25rem",
                fontWeight: "700",
                paddingTop: "15px",
                borderTop: "2px solid #e5e7eb",
                color: "#1e293b",
              }}
            >
              <span>Total Paid:</span>
              <span style={{ color: "#059669" }}>
                ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-block",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#3b82f6";
              }}
            >
              Continue Shopping
            </Link>

            <Link
              to="/profile"
              style={{
                display: "inline-block",
                backgroundColor: "#059669",
                color: "white",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#047857";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#059669";
              }}
            >
              View Order History
            </Link>
          </div>

          {/* Support Info */}
          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h4
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#1e293b",
              }}
            >
              Need Help?
            </h4>
            <p style={{ color: "#64748b", margin: "0" }}>
              If you have any questions about your order, please contact our
              support team at{" "}
              <a
                href="mailto:support@yourstore.com"
                style={{ color: "#3b82f6" }}
              >
                support@yourstore.com
              </a>{" "}
              or call us at (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
