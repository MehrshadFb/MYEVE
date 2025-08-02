import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useEffect } from "react";
import UsersList from "./UsersList";
import AddressList from "./AddressList";
import Header from "../../components/Header";

function Manage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect customers to main page
  useEffect(() => {
    if (user && user.role === "customer") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Don't render anything for customers as they will be redirected
  if (user.role === "customer") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "0px 0",
        width: "100%",
      }}
    >
      <Header />
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "2px solid #e2e8f0",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 10px 0",
              }}
            >
              Welcome, {user.username}!
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#64748b",
                margin: 0,
              }}
            >
              Role:{" "}
              <span
                style={{
                  fontWeight: "600",
                  color: user.role === "admin" ? "#dc2626" : "#059669",
                }}
              >
                {user.role}
              </span>
            </p>
          </div>
        </div>

        {user.role === "admin" && (
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Admin Dashboard
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Manage users, vehicles, and view system information.
            </p>

            <div
              style={{
                padding: "0 40px",
                marginBottom: "30px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/add-vehicle")}
                  style={{
                    background: "#059669",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#047857";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#059669";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Add Vehicles
                </button>

                <button
                  onClick={() => navigate("/vehicle-list")}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
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
                  Manage Vehicles
                </button>

                <button
                  onClick={() => navigate("/order-management")}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#b91c1c";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#dc2626";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Manage Orders
                </button>

                <button
                  onClick={() => navigate("/analytics")}
                  style={{
                    background: "#8b5cf6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#7c3aed";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#8b5cf6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Analytics
                </button>
              </div>
            </div>

            <UsersList />
          </div>
        )}

        {user.role === "customer" && (
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Customer Dashboard
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Manage your addresses and account information.
            </p>
            <AddressList />
          </div>
        )}
      </div>
    </div>
  );
}

export default Manage;
