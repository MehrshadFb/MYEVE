import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle, updateVehicle } from "../../services/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Header from "../../components/Header";

function VehicleList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchVehicles = async () => {
    try {
      const data = await getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter and search vehicles
  useEffect(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply brand filter
    if (filterBrand !== "all") {
      filtered = filtered.filter(vehicle => vehicle.brand === filterBrand);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filterBrand]);

  const handleDelete = async (vid) => {
    try {
      await deleteVehicle(vid);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingId(vehicle.vid);
    setEditingData({
      name: vehicle.name,
      description: vehicle.description,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      quantity: vehicle.quantity,
      price: vehicle.price
    });
  };

  const handleSaveVehicle = async () => {
    try {
      await updateVehicle(editingId, editingData);
      setEditingId(null);
      setEditingData({});
      fetchVehicles();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleEditingDataChange = (field, value) => {
    setEditingData({ ...editingData, [field]: value });
  };

  // Get unique brands for filter
  const uniqueBrands = [...new Set(vehicles.map(vehicle => vehicle.brand))];

  // Show loading while checking user
  if (!user) {
    return <div>Loading...</div>;
  }

  // Don't render anything for non-admin users as they will be redirected
  if (user.role !== "admin") {
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
      <div style={{ 
        maxWidth: "100%",
        margin: "0 auto",
        padding: "80px 20px 20px 20px",
        color: "#1e293b" 
      }}>
        {/* Page Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 10px 0",
          }}>
            Vehicle Management
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "#64748b",
            margin: 0,
          }}>
            Edit and manage all vehicles in the system
          </p>
        </div>

        {/* Search & Filter Section */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#1e293b"
          }}>
            Search & Filter Vehicles
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px"
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                Brand Filter
              </label>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
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
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#1e293b"
          }}>
            Vehicle List ({filteredVehicles.length} vehicles)
          </h3>
          
          {filteredVehicles.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px",
              color: "#6b7280",
              fontSize: "16px"
            }}>
              No vehicles found matching your criteria.
            </div>
          ) : (
            <div style={{
              overflowX: "auto",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white"
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0"
                  }}>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Name</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Brand</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Model</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Year</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Quantity</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Price</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.vid} style={{
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="text"
                          value={editingData.name}
                          onChange={(e) => handleEditingDataChange("name", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.name
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="text"
                          value={editingData.brand}
                          onChange={(e) => handleEditingDataChange("brand", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.brand
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="text"
                          value={editingData.model}
                          onChange={(e) => handleEditingDataChange("model", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.model
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="number"
                          value={editingData.year}
                          onChange={(e) => handleEditingDataChange("year", e.target.value)}
                          min="1900"
                          max={new Date().getFullYear() + 2}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.year
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="number"
                          value={editingData.quantity}
                          onChange={(e) => handleEditingDataChange("quantity", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.quantity
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <input
                          type="number"
                          value={editingData.price}
                          onChange={(e) => handleEditingDataChange("price", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        `$${vehicle.price}`
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.vid ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={handleSaveVehicle}
                            style={{
                              background: "#059669",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontSize: "12px",
                              cursor: "pointer"
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              background: "#6b7280",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontSize: "12px",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            style={{
                              background: "#3b82f6",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontSize: "12px",
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.vid)}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontSize: "12px",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default VehicleList; 