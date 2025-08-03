import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle, updateVehicle, uploadVehicleImages, uploadVehicleImageUrls, downloadVehiclesCSV } from "../../services/api";
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
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);
  const [uploadMethod, setUploadMethod] = useState('files'); // 'files' or 'urls'

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

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Handle numeric fields
        if (sortBy === "price" || sortBy === "quantity" || sortBy === "year" || sortBy === "amountSold") {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        } else {
          // Handle string fields
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filterBrand, sortBy, sortOrder]);

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

  const handleEditDescription = (vehicle) => {
    setEditingDescriptionId(vehicle.vid);
    setCurrentDescription(vehicle.description || "");
    setDescriptionModalOpen(true);
  };

  const handleSaveDescription = async () => {
    try {
      await updateVehicle(editingDescriptionId, { description: currentDescription });
      setDescriptionModalOpen(false);
      setEditingDescriptionId(null);
      setCurrentDescription("");
      fetchVehicles();
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleCancelDescription = () => {
    setDescriptionModalOpen(false);
    setEditingDescriptionId(null);
    setCurrentDescription("");
  };

  // Photo upload handlers
  const handleEditPhotos = (vehicle) => {
    setEditingPhotoId(vehicle.vid);
    setSelectedFiles([]);
    setImageUrls(['']);
    setUploadMethod('files');
    setPhotoModalOpen(true);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleAddUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveUrlField = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleUploadPhotos = async () => {
    if (uploadMethod === 'files') {
      if (selectedFiles.length === 0) {
        alert("Please select at least one file to upload.");
        return;
      }
    } else {
      const validUrls = imageUrls.filter(url => url.trim() !== '');
      if (validUrls.length === 0) {
        alert("Please enter at least one valid image URL.");
        return;
      }
    }

    setUploadLoading(true);
    try {
      if (uploadMethod === 'files') {
        await uploadVehicleImages(editingPhotoId, selectedFiles);
      } else {
        const validUrls = imageUrls.filter(url => url.trim() !== '');
        await uploadVehicleImageUrls(editingPhotoId, validUrls);
      }
      setPhotoModalOpen(false);
      setEditingPhotoId(null);
      setSelectedFiles([]);
      setImageUrls(['']);
      fetchVehicles(); // Refresh the vehicle list
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCancelPhotoUpload = () => {
    setPhotoModalOpen(false);
    setEditingPhotoId(null);
    setSelectedFiles([]);
    setImageUrls(['']);
  };

  const handleDownloadCSV = async () => {
    try {
      await downloadVehiclesCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // If clicking the same field, toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking a different field, sort ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return " ↕";
    return sortOrder === "asc" ? " ↑" : " ↓";
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
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
              color: "#1e293b"
            }}>
              Search & Filter Vehicles
            </h3>
            <button
              onClick={handleDownloadCSV}
              style={{
                background: "#059669",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#047857"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#059669"}
            >
              <span>📥</span>
              Download CSV
            </button>
          </div>
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
            <div>
              <label style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
                <option value="">No Sorting</option>
                <option value="model">Model</option>
                <option value="year">Year</option>
                <option value="quantity">Quantity</option>
                <option value="price">Price</option>
                <option value="amountSold">Times Ordered</option>
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
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
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
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
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
                    }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "70px"
                        }}
                      >
                        Brand
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      <button
                        
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "70px"
                        }}
                      >
                        Model
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      <button
                        onClick={() => handleSort("year")}
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "60px"
                        }}
                      >
                        Year{getSortIcon("year")}
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      <button
                        onClick={() => handleSort("quantity")}
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "80px"
                        }}
                      >
                        Quantity{getSortIcon("quantity")}
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      <button
                        onClick={() => handleSort("price")}
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "60px"
                        }}
                      >
                        Price{getSortIcon("price")}
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      <button
                        onClick={() => handleSort("amountSold")}
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: "600",
                          color: "#374151",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          width: "100%",
                          minWidth: "120px"
                        }}
                      >
                        Times Ordered{getSortIcon("amountSold")}
                      </button>
                    </th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Description</th>
                    <th style={{
                      padding: "16px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px"
                    }}>Photos</th>
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
                        `$${Number(vehicle.price).toLocaleString()}`
                      )}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b",
                      fontWeight: "500"
                    }}>
                      {vehicle.amountSold || 0}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      <button
                        onClick={() => handleEditDescription(vehicle)}
                        style={{
                          background: "#8b5cf6",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Edit Description
                      </button>
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "#1e293b"
                    }}>
                      <button
                        onClick={() => handleEditPhotos(vehicle)}
                        style={{
                          background: "#f59e0b",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Add Photos
                      </button>
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

        {/* Description Edit Modal */}
        {descriptionModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#1e293b"
              }}>
                Edit Description
              </h3>
              <textarea
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                placeholder="Enter vehicle description..."
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1e293b",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                  boxSizing: "border-box"
                }}
              />
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "16px"
              }}>
                <button
                  onClick={handleCancelDescription}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDescription}
                  style={{
                    background: "#059669",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Save Description
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Modal */}
        {photoModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#1e293b"
              }}>
                Upload Vehicle Photos
              </h3>

              {/* Upload Method Selection */}
              <div style={{
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}>
                <p style={{
                  margin: "0 0 12px 0",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Choose upload method:
                </p>
                <div style={{
                  display: "flex",
                  gap: "16px"
                }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151"
                  }}>
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="files"
                      checked={uploadMethod === 'files'}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      style={{
                        marginRight: "8px"
                      }}
                    />
                    Upload Files
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151"
                  }}>
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="urls"
                      checked={uploadMethod === 'urls'}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      style={{
                        marginRight: "8px"
                      }}
                    />
                    Add Image URLs
                  </label>
                </div>
              </div>

              {/* File Upload Section */}
              {uploadMethod === 'files' && (
                <div style={{
                  marginBottom: "16px"
                }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    Select Photos (Multiple files allowed)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px dashed #d1d5db",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb",
                      color: "#1e293b",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  />
                  {selectedFiles.length > 0 && (
                    <div style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                      border: "1px solid #bfdbfe"
                    }}>
                      <p style={{
                        margin: "0 0 8px 0",
                        fontWeight: "500",
                        color: "#1e40af",
                        fontSize: "14px"
                      }}>
                        Selected Files ({selectedFiles.length}):
                      </p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} style={{
                          fontSize: "12px",
                          color: "#1e40af",
                          marginBottom: "4px"
                        }}>
                          • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* URL Input Section */}
              {uploadMethod === 'urls' && (
                <div style={{
                  marginBottom: "16px"
                }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    Image URLs
                  </label>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "8px",
                      alignItems: "center"
                    }}>
                      <input
                        type="url"
                        placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          fontSize: "14px",
                          backgroundColor: "white",
                          color: "#1e293b",
                          boxSizing: "border-box"
                        }}
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUrlField(index)}
                          style={{
                            background: "#dc2626",
                            color: "white",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddUrlField}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                      marginTop: "8px"
                    }}
                  >
                    + Add Another URL
                  </button>
                </div>
              )}

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
              }}>
                <button
                  onClick={handleCancelPhotoUpload}
                  disabled={uploadLoading}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "14px",
                    cursor: uploadLoading ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    opacity: uploadLoading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadPhotos}
                  disabled={uploadLoading || (uploadMethod === 'files' ? selectedFiles.length === 0 : imageUrls.filter(url => url.trim() !== '').length === 0)}
                  style={{
                    background: (uploadMethod === 'files' ? selectedFiles.length === 0 : imageUrls.filter(url => url.trim() !== '').length === 0) ? "#9ca3af" : "#f59e0b",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "14px",
                    cursor: (uploadLoading || (uploadMethod === 'files' ? selectedFiles.length === 0 : imageUrls.filter(url => url.trim() !== '').length === 0)) ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    opacity: (uploadLoading || (uploadMethod === 'files' ? selectedFiles.length === 0 : imageUrls.filter(url => url.trim() !== '').length === 0)) ? 0.6 : 1
                  }}
                >
                  {uploadLoading ? "Uploading..." : `Upload ${uploadMethod === 'files' ? 'Photos' : 'URLs'}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleList; 