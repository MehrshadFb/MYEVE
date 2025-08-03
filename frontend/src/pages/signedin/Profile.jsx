import { useState, useEffect } from "react";
import useAuth from "../../context/useAuth";
import {
  updateProfile,
  createAddress,
  getAllAddressesByUserId,
  deleteAddress,
} from "../../services/api";
import Header from "../../components/Header";
import OrderHistory from "../../components/OrderHistory";

function Profile() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    zip: "",
    phone: "",
  });

  // Fetch user addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAllAddressesByUserId(user.id);
        setAddresses(response);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveField = async (field) => {
    try {
      const updateData = { [field]: tempValue };
      const response = await updateProfile(updateData);

      setProfileData((prev) => ({ ...prev, [field]: tempValue }));
      setMessage({
        type: "success",
        text: response.message || "Profile updated successfully!",
      });
      setEditingField(null);
      setTempValue("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate password change
    if (profileData.newPassword !== profileData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (profileData.newPassword && profileData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    if (
      profileData.newPassword &&
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(profileData.newPassword)
    ) {
      setMessage({
        type: "error",
        text: "Password must contain at least one special character",
      });
      return;
    }

    try {
      const response = await updateProfile({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });

      setMessage({ type: "success", text: response.message });

      // Clear password fields
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await createAddress(newAddress);
      setMessage({
        type: "success",
        text: response.message || "Address added successfully!",
      });

      // Refresh addresses list
      const updatedAddresses = await getAllAddressesByUserId(user.id);
      setAddresses(updatedAddresses);

      // Clear address form
      setNewAddress({
        street: "",
        city: "",
        province: "",
        country: "",
        zip: "",
        phone: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add address",
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(addressId);
        setMessage({ type: "success", text: "Address deleted successfully!" });

        // Refresh addresses list
        const updatedAddresses = await getAllAddressesByUserId(user.id);
        setAddresses(updatedAddresses);
      } catch (err) {
        console.error("Error deleting address:", err);
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to delete address",
        });
      }
    }
  };

  const renderEditableField = (label, field, value, type = "text") => {
    const isEditing = editingField === field;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          marginBottom: "12px",
          backgroundColor: "white",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "4px",
            }}
          >
            {label}
          </div>
          {isEditing ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  flex: 1,
                }}
                autoFocus
              />
              <button
                onClick={() => saveField(field)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#059669",
                  color: "white",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#64748b",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              style={{
                fontSize: "16px",
                color: "#1e293b",
                fontWeight: "500",
              }}
            >
              {value || "Not set"}
            </div>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => startEditing(field, value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Edit"
          >
            ✎
          </button>
        )}
      </div>
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Header />
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: "70px 40px",
          marginTop: "0px",
        }}
      >
        <div
          style={{
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "2px solid #e2e8f0",
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
              Profile Settings
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#64748b",
                margin: 0,
              }}
            >
              Manage your account information and addresses
            </p>
          </div>
        </div>

        {message.text && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor:
                message.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: message.type === "success" ? "#059669" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {message.text}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 600px))",
            gap: "100px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          {/* Profile Information */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
              }}
            >
              Account Information
            </h2>

            {renderEditableField("Username", "username", profileData.username)}
            {renderEditableField("Email", "email", profileData.email, "email")}

            {/* Password Change Section */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Change Password
              </h3>
              <form onSubmit={handlePasswordUpdate}>
                <div style={{ marginBottom: "12px" }}>
                  <input
                    name="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={handleProfileChange}
                    placeholder="Current password"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <input
                    name="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={handleProfileChange}
                    placeholder="New password (min 8 chars + special char)"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={handleProfileChange}
                    placeholder="Confirm new password"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Addresses Section */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
              }}
            >
              Addresses
            </h2>

            {/* Display existing addresses */}
            {addresses.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  Your Addresses
                </h3>
                {addresses &&
                  addresses.length > 0 &&
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      style={{
                        padding: "16px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        backgroundColor: "white",
                        position: "relative",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#1e293b" }}>
                        {address.street}
                        <br />
                        {address.city}, {address.province} {address.zip}
                        <br />
                        {address.country}
                        {address.phone && (
                          <>
                            <br />
                            📞 {address.phone}
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#ef4444",
                          color: "white",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                        title="Delete address"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Add new address form */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Add New Address
              </h3>
              <form onSubmit={handleAddAddress}>
                <div style={{ marginBottom: "12px" }}>
                  <input
                    name="street"
                    type="text"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Street address"
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <input
                    name="city"
                    type="text"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    name="province"
                    type="text"
                    value={newAddress.province}
                    onChange={handleAddressChange}
                    placeholder="Province/State"
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <input
                    name="country"
                    type="text"
                    value={newAddress.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    name="zip"
                    type="text"
                    value={newAddress.zip}
                    onChange={handleAddressChange}
                    placeholder="Zip/Postal Code"
                    required
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    name="phone"
                    type="tel"
                    value={newAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Phone (optional)"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#059669",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Add Address
                </button>
              </form>
            </div>
          </div>

          {/* Order History Section */}
          <OrderHistory />
        </div>
      </div>
    </div>
  );
}

export default Profile;
