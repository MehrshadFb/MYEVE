import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Header from "../../components/Header";
import { getAllVehicles, getAllUsers } from "../../services/api";

function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehicleData, userData] = await Promise.all([
        getAllVehicles(),
        getAllUsers(),
      ]);
      setVehicles(vehicleData);
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to fetch analytics data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const downloadVehicleAnalytics = () => {
    try {
      // Calculate analytics
      const totalVehicles = vehicles.length;
      const totalInventory = vehicles.reduce(
        (sum, vehicle) => sum + (vehicle.quantity || 0),
        0
      );
      const totalValue = vehicles.reduce(
        (sum, vehicle) => sum + (vehicle.quantity || 0) * (vehicle.price || 0),
        0
      );
      const timesOrdered = vehicles.reduce(
        (sum, vehicle) => sum + (vehicle.amountSold || 0),
        0
      );

      // Group by brand
      const brandAnalytics = vehicles.reduce((acc, vehicle) => {
        const brand = vehicle.brand || "Unknown";
        if (!acc[brand]) {
          acc[brand] = {
            count: 0,
            totalInventory: 0,
            totalValue: 0,
            timesOrdered: 0,
          };
        }
        acc[brand].count += 1;
        acc[brand].totalInventory += vehicle.quantity || 0;
        acc[brand].totalValue += (vehicle.quantity || 0) * (vehicle.price || 0);
        acc[brand].timesOrdered += vehicle.amountSold || 0;
        return acc;
      }, {});

      // Create CSV content
      let csvContent = "Vehicle Analytics Report\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

      csvContent += "SUMMARY\n";
      csvContent += `Total Vehicles,${totalVehicles}\n`;
      csvContent += `Total Inventory,${totalInventory}\n`;
      csvContent += `Total Inventory Value,$${totalValue}\n`;
      csvContent += `Total Times Ordered,${timesOrdered}\n\n`;

      csvContent += "BRAND ANALYTICS\n";
      csvContent +=
        "Brand,Vehicle Count,Total Inventory,Total Value,Times Ordered\n";
      Object.entries(brandAnalytics).forEach(([brand, data]) => {
        csvContent += `${brand},${data.count},${data.totalInventory},$${data.totalValue},${data.timesOrdered}\n`;
      });

      csvContent += "\nDETAILED VEHICLE LIST\n";
      csvContent +=
        "Brand,Model,Year,Quantity,Price,Times Ordered,Total Value\n";
      vehicles.forEach((vehicle) => {
        const totalValue = (vehicle.quantity || 0) * (vehicle.price || 0);
        csvContent += `${vehicle.brand || ""},${vehicle.model || ""},${vehicle.year || ""},${vehicle.quantity || 0},$${vehicle.price || 0},${vehicle.amountSold || 0},$${totalValue}\n`;
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `vehicle-analytics-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({
        type: "success",
        text: "Vehicle analytics downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading vehicle analytics:", error);
      setMessage({
        type: "error",
        text: "Failed to download vehicle analytics",
      });
    }
  };

  const downloadUserAnalytics = () => {
    try {
      // Calculate user analytics
      const totalUsers = users.length;
      const adminCount = users.filter((user) => user.role === "admin").length;
      const customerCount = users.filter(
        (user) => user.role === "customer"
      ).length;

      // Create CSV content
      let csvContent = "User Analytics Report\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

      csvContent += "SUMMARY\n";
      csvContent += `Total Users,${totalUsers}\n`;
      csvContent += `Admin Users,${adminCount}\n`;
      csvContent += `Customer Users,${customerCount}\n\n`;

      csvContent += "USER LIST\n";
      csvContent += "ID,Username,Email,Role,Created Date\n";
      users.forEach((user) => {
        const createdDate = user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A";
        csvContent += `${user.id || ""},${user.username || ""},${user.email || ""},${user.role || ""},${createdDate}\n`;
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `user-analytics-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({
        type: "success",
        text: "User analytics downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading user analytics:", error);
      setMessage({ type: "error", text: "Failed to download user analytics" });
    }
  };

  // Show loading while checking user
  if (!user) {
    return <div>Loading...</div>;
  }

  // Don't render anything for non-admin users as they will be redirected
  if (user.role !== "admin") {
    return null;
  }

  if (loading) {
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
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 20px 20px 20px",
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {/* Loading Spinner */}
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px auto",
              }}
            ></div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Loading Analytics Dashboard
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#64748b",
              }}
            >
              Fetching vehicle and user data...
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Calculate summary stats
  const totalVehicles = vehicles.length;
  const totalInventory = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.quantity || 0),
    0
  );
  const totalValue = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.quantity || 0) * (vehicle.price || 0),
    0
  );
  const timesOrdered = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.amountSold || 0),
    0
  );
  const totalUsers = users.length;
  const adminCount = users.filter((user) => user.role === "admin").length;
  const customerCount = users.filter((user) => user.role === "customer").length;

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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px 20px 20px",
          color: "#1e293b",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 10px 0",
            }}
          >
            Analytics Dashboard
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#64748b",
              margin: 0,
            }}
          >
            Download comprehensive analytics reports for vehicles and users
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "24px",
              backgroundColor:
                message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#059669" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              fontSize: "0.9rem",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Analytics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {/* Vehicle Analytics Card */}
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#1e293b",
              }}
            >
              Vehicle Analytics
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#3b82f6",
                    }}
                  >
                    {totalVehicles}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Total Vehicles
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#059669",
                    }}
                  >
                    {totalInventory}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Total Inventory
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "#dc2626",
                    }}
                  >
                    ${totalValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Total Value
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#8b5cf6",
                    }}
                  >
                    {timesOrdered}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Times Ordered
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadVehicleAnalytics}
              style={{
                width: "100%",
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
              Download Vehicle Analytics (CSV)
            </button>
          </div>

          {/* User Analytics Card */}
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#1e293b",
              }}
            >
              User Analytics
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#3b82f6",
                    }}
                  >
                    {totalUsers}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    Total Users
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: "#fee2e2",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#dc2626",
                      }}
                    >
                      {adminCount}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      Admins
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: "#dcfce7",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#059669",
                      }}
                    >
                      {customerCount}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      Customers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadUserAnalytics}
              style={{
                width: "100%",
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
              Download User Analytics (CSV)
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/manage")}
            style={{
              background: "#6b7280",
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
              e.target.style.background = "#4b5563";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6b7280";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Back to Management Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
