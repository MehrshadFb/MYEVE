import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createVehicle } from "../../services/api";

function AddVehicle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    modelName: "",
    price: "",
    range: "",
    horsepower: "",
    picture: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsSubmitting(true);

    // Validate required fields
    if (!vehicleData.brand || !vehicleData.modelName || !vehicleData.price || !vehicleData.range || !vehicleData.horsepower) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      setIsSubmitting(false);
      return;
    }

    // Validate numeric fields
    if (isNaN(vehicleData.price) || parseFloat(vehicleData.price) <= 0) {
      setMessage({ type: "error", text: "Price must be a positive number" });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.range) || parseInt(vehicleData.range) <= 0) {
      setMessage({ type: "error", text: "Range must be a positive number" });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.horsepower) || parseInt(vehicleData.horsepower) <= 0) {
      setMessage({ type: "error", text: "Horsepower must be a positive number" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createVehicle({
        brand: vehicleData.brand,
        modelName: vehicleData.modelName,
        price: parseFloat(vehicleData.price),
        range: parseInt(vehicleData.range),
        horsepower: parseInt(vehicleData.horsepower),
        picture: vehicleData.picture || null
      });
      
      setMessage({ type: "success", text: response.message });
      
      // Clear form after successful submission
      setVehicleData({
        brand: "",
        modelName: "",
        price: "",
        range: "",
        horsepower: "",
        picture: ""
      });
      
      // Redirect to manage page after a short delay
      setTimeout(() => {
        navigate("/manage");
      }, 2000);
      
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create vehicle" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/manage");
  };

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8fafc", 
        padding: "120px 20px 40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ color: "#ef4444", marginBottom: "20px" }}>Access Denied</h1>
          <p style={{ color: "#64748b", marginBottom: "30px" }}>
            Only administrators can access this page.
          </p>
          <button 
            onClick={handleBack}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc", 
      padding: "120px 20px 40px 20px",
      width: "100%"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              Add New Vehicle
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "#64748b",
              margin: 0
            }}>
              Add a new electric vehicle to the inventory
            </p>
          </div>
          <button 
            onClick={handleBack}
            style={{
              background: "#6b7280",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease"
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
            Back to Dashboard
          </button>
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

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Brand *
              </label>
              <input
                name="brand"
                type="text"
                value={vehicleData.brand}
                onChange={handleChange}
                placeholder="e.g., Tesla, BMW, Audi"
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Model Name *
              </label>
              <input
                name="modelName"
                type="text"
                value={vehicleData.modelName}
                onChange={handleChange}
                placeholder="e.g., Model S, i4, e-tron"
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Price (USD) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={vehicleData.price}
                onChange={handleChange}
                placeholder="e.g., 75000.00"
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Range (km) *
              </label>
              <input
                name="range"
                type="number"
                min="0"
                value={vehicleData.range}
                onChange={handleChange}
                placeholder="e.g., 500"
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Horsepower *
              </label>
              <input
                name="horsepower"
                type="number"
                min="0"
                value={vehicleData.horsepower}
                onChange={handleChange}
                placeholder="e.g., 400"
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Picture URL (Optional)
              </label>
              <input
                name="picture"
                type="url"
                value={vehicleData.picture}
                onChange={handleChange}
                placeholder="https://example.com/vehicle-image.jpg"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
              <small style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Provide a URL to an image of the vehicle
              </small>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
            justifyContent: "flex-end"
          }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: "#6b7280",
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
                e.target.style.background = "#4b5563";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#6b7280";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? "#9ca3af" : "#059669",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "14px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = "#047857";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = "#059669";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle; 