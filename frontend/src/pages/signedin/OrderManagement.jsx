import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getAllOrders, updateOrderStatus } from "../../services/api";
import useAuth from "../../context/useAuth";

function OrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await getAllOrders(params);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
      setTotalOrders(response.totalOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders();
    }
  }, [user, currentPage, selectedStatus]);

  const handleStatusUpdate = async (orderId, newStatus, adminNotes = "") => {
    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, { status: newStatus, adminNotes });
      await fetchOrders(); // Refresh the orders list
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      confirmed: "#10b981",
      shipped: "#8b5cf6",
      delivered: "#059669",
      cancelled: "#ef4444",
      refunded: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (user?.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
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
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          textAlign: "center",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Order Management
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Manage customer orders and track their status
        </p>
      </section>

      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Controls */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    marginBottom: "5px",
                  }}
                >
                  Filter by Status:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px 12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ fontSize: "1rem", color: "#64748b" }}>
              Total Orders: {totalOrders}
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Orders Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                No orders found.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ backgroundColor: "#f8fafc" }}>
                    <tr>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Order #
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Customer
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Items
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          color: "#374151",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            fontFamily: "monospace",
                            fontWeight: "500",
                            color: "#1e293b",
                          }}
                        >
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div
                              style={{ fontWeight: "500", color: "#1e293b" }}
                            >
                              {order.user?.username}
                            </div>
                            <div
                              style={{ fontSize: "0.875rem", color: "#64748b" }}
                            >
                              {order.user?.email}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "0.875rem",
                            color: "#374151",
                          }}
                        >
                          {formatDate(order.createdAt)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontWeight: "600",
                            color: "#059669",
                          }}
                        >
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              backgroundColor: `${getStatusColor(order.status)}20`,
                              color: getStatusColor(order.status),
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "0.875rem",
                            color: "#374151",
                          }}
                        >
                          {order.items?.length || 0} item(s)
                        </td>
                        <td style={{ padding: "16px" }}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order.id, e.target.value)
                            }
                            disabled={updatingOrder === order.id}
                            style={{
                              padding: "6px 10px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                              cursor:
                                updatingOrder === order.id
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: updatingOrder === order.id ? 0.5 : 1,
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "30px",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  backgroundColor: currentPage === 1 ? "#f8fafc" : "white",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  backgroundColor:
                    currentPage === totalPages ? "#f8fafc" : "white",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
