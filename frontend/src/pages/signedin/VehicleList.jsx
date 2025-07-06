import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle, createVehicle, updateVehicle } from "../../services/api";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
    type: "sedan",
    status: "available",
    price: "",
    description: "",
    imageUrl: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

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
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(vehicle => vehicle.type === filterType);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === filterStatus);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filterType, filterStatus]);

  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await createVehicle(newVehicle);
      fetchVehicles();
      setNewVehicle({
        make: "",
        model: "",
        year: "",
        type: "sedan",
        status: "available",
        price: "",
        description: "",
        imageUrl: ""
      });
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingId(vehicle.id);
    setEditingData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      price: vehicle.price,
      description: vehicle.description,
      imageUrl: vehicle.imageUrl
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

  return (
    <div style={{ color: "#1e293b" }}>
      {/* Add New Vehicle Section */}
      <div style={{
        backgroundColor: "#f8fafc",
        padding: "24px",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "1px solid #e2e8f0"
      }}>
        <h3 style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#1e293b"
        }}>
          Add New Vehicle
        </h3>
        <form onSubmit={handleAddVehicle} style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Make *
            </label>
            <input
              name="make"
              placeholder="Vehicle Make"
              value={newVehicle.make}
              onChange={handleInputChange}
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
              Model *
            </label>
            <input
              name="model"
              placeholder="Vehicle Model"
              value={newVehicle.model}
              onChange={handleInputChange}
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
              Year *
            </label>
            <input
              name="year"
              type="number"
              placeholder="Year"
              value={newVehicle.year}
              onChange={handleInputChange}
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
              Type *
            </label>
            <select 
              name="type" 
              value={newVehicle.type} 
              onChange={handleInputChange}
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
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="sports">Sports</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Status *
            </label>
            <select 
              name="status" 
              value={newVehicle.status} 
              onChange={handleInputChange}
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
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Price *
            </label>
            <input
              name="price"
              type="number"
              placeholder="Daily Rate"
              value={newVehicle.price}
              onChange={handleInputChange}
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
          <div style={{ gridColumn: "span 2" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Vehicle description"
              value={newVehicle.description}
              onChange={handleInputChange}
              rows="3"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "white",
                color: "#1e293b",
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Image URL
            </label>
            <input
              name="imageUrl"
              type="url"
              placeholder="Vehicle image URL"
              value={newVehicle.imageUrl}
              onChange={handleInputChange}
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
          <div style={{ gridColumn: "span 2" }}>
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
              Add Vehicle
            </button>
          </div>
        </form>
      </div>

      {/* Search and Filter Section */}
      <div style={{
        backgroundColor: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "1px solid #e2e8f0"
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
          gap: "16px"
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
              placeholder="Search by make, model, or description..."
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
              Vehicle Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
              <option value="all">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="sports">Sports</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          <div>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "14px"
            }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc"
        }}>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            margin: 0,
            color: "#1e293b"
          }}>
            Vehicle List ({filteredVehicles.length} vehicles)
          </h3>
        </div>
        
        {filteredVehicles.length === 0 ? (
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#64748b"
          }}>
            No vehicles found matching your criteria.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0"
                }}>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px"
                  }}>Make</th>
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
                  }}>Type</th>
                  <th style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px"
                  }}>Status</th>
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
                  <tr key={vehicle.id} style={{
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.id ? (
                        <input
                          type="text"
                          value={editingData.make}
                          onChange={(e) => handleEditingDataChange("make", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        />
                      ) : (
                        vehicle.make
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.id ? (
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
                      {editingId === vehicle.id ? (
                        <input
                          type="number"
                          value={editingData.year}
                          onChange={(e) => handleEditingDataChange("year", e.target.value)}
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
                      {editingId === vehicle.id ? (
                        <select
                          value={editingData.type}
                          onChange={(e) => handleEditingDataChange("type", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        >
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="truck">Truck</option>
                          <option value="sports">Sports</option>
                          <option value="luxury">Luxury</option>
                          <option value="electric">Electric</option>
                        </select>
                      ) : (
                        <span style={{
                          textTransform: "capitalize",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#f1f5f9",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}>
                          {vehicle.type}
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.id ? (
                        <select
                          value={editingData.status}
                          onChange={(e) => handleEditingDataChange("status", e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            width: "100%"
                          }}
                        >
                          <option value="available">Available</option>
                          <option value="rented">Rented</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: vehicle.status === "available" ? "#dcfce7" : 
                                           vehicle.status === "rented" ? "#fef3c7" : "#fee2e2",
                          color: vehicle.status === "available" ? "#059669" : 
                                 vehicle.status === "rented" ? "#d97706" : "#dc2626"
                        }}>
                          {vehicle.status}
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.id ? (
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
                        `$${vehicle.price}/day`
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      {editingId === vehicle.id ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={handleSaveVehicle}
                            style={{
                              background: "#059669",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontWeight: "500",
                              cursor: "pointer",
                              fontSize: "12px"
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
                              fontWeight: "500",
                              cursor: "pointer",
                              fontSize: "12px"
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
                              fontWeight: "500",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              fontWeight: "500",
                              cursor: "pointer",
                              fontSize: "12px"
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
  );
}

export default VehicleList; 