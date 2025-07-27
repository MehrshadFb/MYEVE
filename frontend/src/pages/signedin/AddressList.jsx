import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import useAuth from "../../context/useAuth";
import {
  getAllAddressesByUserId,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../services/api";
const AddressList = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    province: "",
    country: "Canada",
    zip: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const userId = user?.id;
  useEffect(() => {
    fetchAddresses();
  }, []);
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAddressesByUserId(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };
  const handleAddAddress = async () => {
    try {
      await createAddress({ ...newAddress, userId });
      setNewAddress({
        street: "",
        city: "",
        province: "",
        country: "Canada",
        zip: "",
        phone: "",
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address");
    }
  };
  const handleEditAddress = async (id) => {
    try {
      await updateAddress(id, editingData);
      setEditingId(null);
      setEditingData({});
      fetchAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      setError("Failed to update address");
    }
  };
  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        fetchAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        setError("Failed to delete address");
      }
    }
  };
  const startEditing = (address) => {
    setEditingId(address.id);
    setEditingData(address);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };
  if (!user?.id) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {" "}
        <Header />{" "}
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          {" "}
          <p style={{ color: "#1e293b", fontSize: "1.1rem" }}>
            Please sign in to manage your addresses.
          </p>{" "}
        </div>{" "}
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
      {" "}
      <Header /> {/* Header Section */}{" "}
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
        {" "}
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {" "}
          Address Management{" "}
        </h1>{" "}
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {" "}
          Manage your saved addresses{" "}
        </p>{" "}
      </section>{" "}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "40px 20px" }}>
        {" "}
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {" "}
          {/* Add New Address Form */}{" "}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "30px",
            }}
          >
            {" "}
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1e293b",
              }}
            >
              {" "}
              Add New Address{" "}
            </h3>{" "}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {" "}
              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
              <input
                type="text"
                placeholder="Province"
                value={newAddress.province}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, province: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.zip}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zip: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
              <input
                type="text"
                placeholder="Phone (Optional)"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />{" "}
            </div>{" "}
            <button
              onClick={handleAddAddress}
              style={{
                marginTop: "20px",
                backgroundColor: "#059669",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {" "}
              Add Address{" "}
            </button>{" "}
          </div>{" "}
          {/* Loading and Error States */}{" "}
          {loading && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              {" "}
              Loading addresses...{" "}
            </div>
          )}{" "}
          {error && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}
            >
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          {/* Address List */}{" "}
          {!loading && !error && (
            <div>
              {" "}
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "20px",
                  color: "#1e293b",
                }}
              >
                {" "}
                Your Addresses ({addresses.length}){" "}
              </h3>{" "}
              {addresses.length === 0 ? (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  {" "}
                  No addresses found. Add your first address above.{" "}
                </div>
              ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                  {" "}
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        border:
                          editingId === address.id
                            ? "2px solid #059669"
                            : "1px solid #e5e7eb",
                      }}
                    >
                      {" "}
                      {editingId === address.id ? (
                        <div>
                          {" "}
                          <h4
                            style={{ marginBottom: "15px", color: "#1e293b" }}
                          >
                            Edit Address
                          </h4>{" "}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                              gap: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            {" "}
                            <input
                              type="text"
                              value={editingData.street || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  street: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                            <input
                              type="text"
                              value={editingData.city || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  city: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                            <input
                              type="text"
                              value={editingData.province || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  province: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                            <input
                              type="text"
                              value={editingData.country || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  country: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                            <input
                              type="text"
                              value={editingData.zip || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  zip: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                            <input
                              type="text"
                              value={editingData.phone || ""}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  phone: e.target.value,
                                })
                              }
                              style={{
                                padding: "10px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "1rem",
                              }}
                            />{" "}
                          </div>{" "}
                          <div style={{ display: "flex", gap: "10px" }}>
                            {" "}
                            <button
                              onClick={() => handleEditAddress(address.id)}
                              style={{
                                backgroundColor: "#059669",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              {" "}
                              Save{" "}
                            </button>{" "}
                            <button
                              onClick={cancelEditing}
                              style={{
                                backgroundColor: "#6b7280",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              {" "}
                              Cancel{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>
                      ) : (
                        <div>
                          {" "}
                          <div style={{ marginBottom: "15px" }}>
                            {" "}
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "1.1rem",
                                color: "#1e293b",
                                marginBottom: "5px",
                              }}
                            >
                              {" "}
                              {address.street}{" "}
                            </div>{" "}
                            <div
                              style={{ color: "#64748b", marginBottom: "2px" }}
                            >
                              {" "}
                              {address.city}, {address.province}{" "}
                              {address.zip}{" "}
                            </div>{" "}
                            <div
                              style={{ color: "#64748b", marginBottom: "2px" }}
                            >
                              {" "}
                              {address.country}{" "}
                            </div>{" "}
                            {address.phone && (
                              <div style={{ color: "#64748b" }}>
                                {" "}
                                Phone: {address.phone}{" "}
                              </div>
                            )}{" "}
                          </div>{" "}
                          <div style={{ display: "flex", gap: "10px" }}>
                            {" "}
                            <button
                              onClick={() => startEditing(address)}
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                              }}
                            >
                              {" "}
                              Edit{" "}
                            </button>{" "}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                              }}
                            >
                              {" "}
                              Delete{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>
                      )}{" "}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
