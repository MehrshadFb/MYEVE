import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { createVehicle, uploadVehicleImages, importVehiclesCSV, exportVehiclesCSV, downloadVehiclesCSV } from "../../services/api";

function AddVehicle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    type: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    seats: "",
    range: "",
    quantity: 0,
    price: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [csvMessage, setCsvMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsSubmitting(true);

    // Validate required fields
    if (
      !vehicleData.type ||
      !vehicleData.brand ||
      !vehicleData.model ||
      !vehicleData.year ||
      !vehicleData.seats ||
      !vehicleData.range ||
      !vehicleData.price
    ) {
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

    if (isNaN(vehicleData.year) || parseInt(vehicleData.year) < 1900 || parseInt(vehicleData.year) > new Date().getFullYear() + 2) {
      setMessage({
        type: "error",
        text: "Year must be between 1900 and " + (new Date().getFullYear() + 2),
      });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.seats) || parseInt(vehicleData.seats) < 1) {
      setMessage({
        type: "error",
        text: "Seats must be a positive number",
      });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.range) || parseInt(vehicleData.range) < 0) {
      setMessage({
        type: "error",
        text: "Range must be a non-negative number",
      });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.quantity) || parseInt(vehicleData.quantity) < 0) {
      setMessage({
        type: "error",
        text: "Quantity must be a non-negative number",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createVehicle({
        type: vehicleData.type,
        description: vehicleData.description,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        seats: parseInt(vehicleData.seats),
        range: parseInt(vehicleData.range),
        quantity: parseInt(vehicleData.quantity),
        price: parseFloat(vehicleData.price),
      });

      setMessage({ type: "success", text: response.message });

      const { vid } = response.vehicle || response; // adjust based on API response

      if (selectedFiles.length > 0) {
        await uploadVehicleImages(vid, selectedFiles, user.token);
        setMessage({ type: "success", text: "Vehicle and images uploaded!" });
      }

      // Clear form after successful submission
      setVehicleData({
        type: "",
        description: "",
        brand: "",
        model: "",
        year: "",
        seats: "",
        range: "",
        quantity: 0,
        price: "",
      });
      setSelectedFiles([]);

      // Redirect to manage page after a short delay
      setTimeout(() => {
        navigate("/manage");
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create vehicle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/manage");
  };

  // CSV handling functions
  const handleCSVFileSelect = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    setCsvMessage({ type: "", text: "" });
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      setCsvMessage({ type: "error", text: "Please select a CSV file first" });
      return;
    }

    try {
      setCsvMessage({ type: "", text: "Importing vehicles..." });
      const result = await importVehiclesCSV(csvFile);
      
      if (result.success) {
        let message = `Successfully imported ${result.imported} vehicles.`;
        if (result.skipped > 0) {
          message += ` ${result.skipped} vehicles were skipped (duplicates or errors).`;
        }
        if (result.errors && result.errors.length > 0) {
          message += ` Errors: ${result.errors.slice(0, 3).join('; ')}`;
          if (result.errors.length > 3) {
            message += ` and ${result.errors.length - 3} more...`;
          }
        }
        setCsvMessage({ type: "success", text: message });
      } else {
        setCsvMessage({ 
          type: "error", 
          text: `Import failed: ${result.errors ? result.errors.join('; ') : 'Unknown error'}` 
        });
      }
      
      setCsvFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][accept=".csv"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setCsvMessage({ 
        type: "error", 
        text: error.message || "Failed to import CSV file" 
      });
    }
  };

  const handleCSVExport = async () => {
    try {
      await exportVehiclesCSV();
      setCsvMessage({ type: "success", text: "Vehicles exported to CSV successfully" });
    } catch (error) {
      setCsvMessage({ 
        type: "error", 
        text: error.message || "Failed to export CSV file" 
      });
    }
  };

  const handleCSVDownload = async () => {
    try {
      await downloadVehiclesCSV();
      setCsvMessage({ type: "success", text: "CSV file downloaded successfully" });
    } catch (error) {
      setCsvMessage({ 
        type: "error", 
        text: error.message || "Failed to download CSV file" 
      });
    }
  };

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          padding: "120px 20px 40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#ef4444", marginBottom: "20px" }}>
            Access Denied
          </h1>
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
              fontSize: "1rem",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "120px 20px 40px 20px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
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
              Add New Vehicle
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#64748b",
                margin: 0,
              }}
            >
              Add a new vehicle to the inventory
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
            ← Back
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              backgroundColor:
                message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#059669" : "#dc2626",
              border: `1px solid ${
                message.type === "success" ? "#bbf7d0" : "#fecaca"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* CSV Management Section */}
        <div
          style={{
            backgroundColor: "#f1f5f9",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "32px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 16px 0",
            }}
          >
            CSV Management
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#64748b",
              margin: "0 0 20px 0",
            }}
          >
            Import vehicles from CSV file or export current inventory to CSV. The CSV can have any columns - only matching fields (brand, model, type, year, seats, range, price, quantity, description) will be imported. VIDs are automatically generated.
          </p>

          {/* CSV Message Display */}
          {csvMessage.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "16px",
                backgroundColor:
                  csvMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                color: csvMessage.type === "success" ? "#059669" : "#dc2626",
                border: `1px solid ${
                  csvMessage.type === "success" ? "#bbf7d0" : "#fecaca"
                }`,
                fontSize: "0.9rem",
              }}
            >
              {csvMessage.text}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "16px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "0.9rem",
                }}
              >
                Select CSV file to import:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVFileSelect}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.9rem",
                  backgroundColor: "white",
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleCSVImport}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                background: "#10b981",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                alignSelf: "end",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#059669";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#10b981";
              }}
            >
              Import CSV
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={handleCSVExport}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "1px solid #3b82f6",
                background: "white",
                color: "#3b82f6",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
              }}
            >
              Export to CSV
            </button>
            <button
              type="button"
              onClick={handleCSVDownload}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#3b82f6";
              }}
            >
              Download CSV
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Image Upload */}
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Upload Images (Multiple files allowed)
              </label>
              <div style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f9fafb",
                transition: "all 0.3s ease",
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 10) {
                      setMessage({ 
                        type: "error", 
                        text: "Maximum 10 images allowed. Please select fewer files." 
                      });
                      return;
                    }
                    setSelectedFiles(files);
                    // Clear any previous error message
                    if (message.text && message.text.includes("Maximum 10 images")) {
                      setMessage({ type: "", text: "" });
                    }
                  }}
                  style={{ 
                    fontSize: "16px",
                    marginBottom: "10px",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                />
                <p style={{
                  margin: "10px 0 0 0",
                  fontSize: "14px",
                  color: "#6b7280"
                }}>
                  Select up to 10 images (JPG, PNG, GIF) - Hold Ctrl/Cmd to select multiple files
                </p>
                {selectedFiles.length > 0 && (
                  <div style={{
                    marginTop: "12px",
                    padding: "12px",
                    backgroundColor: "#ecfdf5",
                    borderRadius: "6px",
                    border: "1px solid #bbf7d0"
                  }}>
                    <p style={{
                      margin: "0 0 8px 0",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#059669"
                    }}>
                      {selectedFiles.length} file(s) selected:
                    </p>
                    <ul style={{
                      margin: 0,
                      padding: "0 0 0 20px",
                      fontSize: "13px",
                      color: "#374151"
                    }}>
                      {selectedFiles.map((file, index) => (
                        <li key={index} style={{ marginBottom: "4px" }}>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Vehicle Type *
              </label>
              <select
                name="type"
                value={vehicleData.type}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="">Select vehicle type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Truck">Truck</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Luxury">Luxury</option>
                <option value="Compact">Compact</option>
                <option value="Crossover">Crossover</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={vehicleData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Model */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                placeholder="Enter model name"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Year */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={vehicleData.year}
                onChange={handleChange}
                placeholder="Enter year"
                min="1900"
                max={new Date().getFullYear() + 2}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Seats */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Number of Seats *
              </label>
              <select
                name="seats"
                value={vehicleData.seats}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="">Select number of seats</option>
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="6">6 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </div>

            {/* Range */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Range (miles) *
              </label>
              <input
                type="number"
                name="range"
                value={vehicleData.range}
                onChange={handleChange}
                placeholder="Enter range in miles"
                min="0"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={vehicleData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Price */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={vehicleData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={vehicleData.description}
                onChange={handleChange}
                placeholder="Enter vehicle description"
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#374151",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.borderColor = "#d1d5db";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: isSubmitting ? "#9ca3af" : "#3b82f6",
                color: "white",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = "#3b82f6";
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
