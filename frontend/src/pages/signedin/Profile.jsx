import { useState } from "react";
import useAuth from "../../context/useAuth";
import { updateProfile, createAddress } from "../../services/api";
import Header from "../../components/Header";

function Profile() {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    zip: "",
    phone: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate password change
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (profileData.newPassword && profileData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    if (profileData.newPassword && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(profileData.newPassword)) {
      setMessage({ type: "error", text: "Password must contain at least one special character" });
      return;
    }

    try {
      const response = await updateProfile({
        username: profileData.username,
        email: profileData.email,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });
      
      setMessage({ type: "success", text: response.message });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await createAddress(newAddress);
      setMessage({ type: "success", text: response.message || "Address added successfully!" });
      
      // Clear address form
      setNewAddress({
        street: "",
        city: "",
        province: "",
        country: "",
        zip: "",
        phone: ""
      });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add address" });
    }
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc", 
      padding: "40px 0",
      width: "100%",
      overflow: "hidden"
    }}>
      <Header />
      <div style={{
        width: "100%",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginTop: "0px"
      }}>
        <div style={{
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom: "2px solid #e2e8f0"
        }}>
          <div>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 10px 0"
            }}>
              Profile Settings
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "#64748b",
              margin: 0
            }}>
              Manage your account information and addresses
            </p>
          </div>
        </div>

        {message.text && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: message.type === "success" ? "#059669" : "#dc2626",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {message.text}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "40px"
        }}>
          {/* Profile Information */}
          <div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "20px"
            }}>
              Account Information
            </h2>
            <form onSubmit={handleProfileUpdate}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  placeholder="Enter current password"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  placeholder="Enter new password (min 8 chars + special char)"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
                <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Must be at least 8 characters and include a special character
                </small>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  placeholder="Confirm new password"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2563eb";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#3b82f6";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Add Address */}
          <div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "20px"
            }}>
              Add New Address
            </h2>
            <form onSubmit={handleAddAddress}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Street Address
                </label>
                <input
                  name="street"
                  type="text"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  placeholder="Enter street address"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Province/State
                </label>
                <input
                  name="province"
                  type="text"
                  value={newAddress.province}
                  onChange={handleAddressChange}
                  placeholder="Enter province or state"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Country
                </label>
                <input
                  name="country"
                  type="text"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  placeholder="Enter country"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Zip/Postal Code
                </label>
                <input
                  name="zip"
                  type="text"
                  value={newAddress.zip}
                  onChange={handleAddressChange}
                  placeholder="Enter zip or postal code"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Phone (Optional)
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={newAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="Enter phone number"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "50%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#059669",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#047857";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#059669";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 