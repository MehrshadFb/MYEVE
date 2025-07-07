import { useEffect, useState } from "react";
import { getAllVehicles } from "../../services/api";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("brand");
  const { user } = useAuth();

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Get unique values for filters
  const uniqueBrands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  const uniqueTypes = [...new Set(vehicles.map(vehicle => vehicle.type || "Unknown"))];
  
  // Price ranges
  const priceRanges = [
    { label: "Under $25,000", min: 0, max: 25000 },
    { label: "$25,000 - $50,000", min: 25000, max: 50000 },
    { label: "$50,000 - $75,000", min: 50000, max: 75000 },
    { label: "$75,000 - $100,000", min: 75000, max: 100000 },
    { label: "Over $100,000", min: 100000, max: Infinity }
  ];

  // Filter and search vehicles
  useEffect(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.description && vehicle.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(vehicle => selectedBrands.includes(vehicle.brand));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(vehicle => selectedTypes.includes(vehicle.type || "Unknown"));
    }

    // Apply price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(vehicle => {
        return selectedPriceRanges.some(rangeLabel => {
          const range = priceRanges.find(r => r.label === rangeLabel);
          if (!range) return false;
          return vehicle.price >= range.min && vehicle.price <= range.max;
        });
      });
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, selectedBrands, selectedTypes, selectedPriceRanges]);

  // Toggle filter selections
  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const togglePriceRange = (rangeLabel) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeLabel) 
        ? prev.filter(r => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedPriceRanges([]);
    setSearchTerm("");
  };

  // Get total active filters count
  const getActiveFiltersCount = () => {
    return selectedBrands.length + selectedTypes.length + selectedPriceRanges.length;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        textAlign: "center",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ padding: "0 0px", width: "100%" }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            marginBottom: "20px"
          }}>
            All Vehicles
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Browse our complete collection of vehicles from all major manufacturers.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section style={{
        padding: "40px 0",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ 
          width: "100%", 
          padding: "0 40px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{
            backgroundColor: "#f8fafc",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "20px",
              color: "#1e293b"
            }}>
              Search & Filter Vehicles
            </h3>
            
            {/* Search Bar and Filter Button */}
            <div style={{
              display: "flex",
              gap: "16px",
              marginBottom: "20px",
              alignItems: "center"
            }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name, brand, model, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "12px 16px",
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
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#1e293b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.color = "#1e293b";
                }}
              >
                <span style={{ fontSize: "16px" }}>🔍</span>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                marginTop: "16px"
              }}>
                {/* Filter Tabs */}
                <div style={{
                  display: "flex",
                  borderBottom: "1px solid #e2e8f0",
                  marginBottom: "20px"
                }}>
                  {[
                    { id: "brand", label: "Brand", count: selectedBrands.length },
                    { id: "type", label: "Type", count: selectedTypes.length },
                    { id: "pricing", label: "Pricing", count: selectedPriceRanges.length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id)}
                      style={{
                        padding: "12px 20px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: activeFilterTab === tab.id ? "#3b82f6" : "#64748b",
                        fontWeight: "500",
                        cursor: "pointer",
                        borderBottom: activeFilterTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                        transition: "all 0.3s ease",
                        position: "relative"
                      }}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          marginLeft: "6px"
                        }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Filter Content */}
                <div style={{ minHeight: "200px" }}>
                  {/* Brand Filters */}
                  {activeFilterTab === "brand" && (
                    <div>
                      <h4 style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: "#1e293b"
                      }}>
                        Select Brands
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "12px"
                      }}>
                        {uniqueBrands.map(brand => (
                          <label key={brand} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: selectedBrands.includes(brand) ? "#eff6ff" : "transparent",
                            border: selectedBrands.includes(brand) ? "1px solid #3b82f6" : "1px solid transparent"
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6"
                              }}
                            />
                            <span style={{
                              fontSize: "14px",
                              color: "#374151"
                            }}>
                              {brand}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type Filters */}
                  {activeFilterTab === "type" && (
                    <div>
                      <h4 style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: "#1e293b"
                      }}>
                        Select Types
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "12px"
                      }}>
                        {uniqueTypes.map(type => (
                          <label key={type} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: selectedTypes.includes(type) ? "#eff6ff" : "transparent",
                            border: selectedTypes.includes(type) ? "1px solid #3b82f6" : "1px solid transparent"
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleType(type)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6"
                              }}
                            />
                            <span style={{
                              fontSize: "14px",
                              color: "#374151"
                            }}>
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range Filters */}
                  {activeFilterTab === "pricing" && (
                    <div>
                      <h4 style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: "#1e293b"
                      }}>
                        Select Price Ranges
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "12px"
                      }}>
                        {priceRanges.map(range => (
                          <label key={range.label} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: selectedPriceRanges.includes(range.label) ? "#eff6ff" : "transparent",
                            border: selectedPriceRanges.includes(range.label) ? "1px solid #3b82f6" : "1px solid transparent"
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedPriceRanges.includes(range.label)}
                              onChange={() => togglePriceRange(range.label)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6"
                              }}
                            />
                            <span style={{
                              fontSize: "14px",
                              color: "#374151"
                            }}>
                              {range.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Actions */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e2e8f0"
                }}>
                  <button
                    onClick={clearAllFilters}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "white",
                      color: "#64748b",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#ef4444";
                      e.target.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                      e.target.style.color = "#64748b";
                    }}
                  >
                    Clear All Filters
                  </button>
                  
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{
                      fontSize: "14px",
                      color: "#64748b"
                    }}>
                      {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section style={{
        padding: "40px 0 80px 0",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ 
          width: "100%", 
          padding: "0 40px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px"
          }}>
            <h2 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0
            }}>
              Available Vehicles
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px"
            }}>
              <span style={{
                fontSize: "1rem",
                color: "#64748b",
                fontWeight: "500"
              }}>
                {filteredVehicles.length} vehicles found
              </span>
              {user?.role === "admin" && (
                <Link 
                  to="/add-vehicle"
                  style={{
                    background: "#059669",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
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
                  <span style={{ fontSize: "16px" }}>+</span>
                  Add Vehicle
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b"
            }}>
              Loading vehicles...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b"
            }}>
              No vehicles found matching your criteria.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "30px"
            }}>
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.vid} style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid #e2e8f0"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-8px)";
                  e.target.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                }}
                >
                  <div style={{
                    height: "200px",
                    background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "2rem"
                  }}>
                    {vehicle.name}
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px"
                    }}>
                      <h3 style={{
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        color: "#1e293b"
                      }}>{vehicle.name}</h3>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        textTransform: "capitalize"
                      }}>{vehicle.brand}</span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px"
                    }}>
                      <span style={{
                        color: "#64748b",
                        fontSize: "0.9rem"
                      }}>Model: {vehicle.model}</span>
                      <span style={{
                        color: "#64748b",
                        fontSize: "0.9rem"
                      }}>Quantity: {vehicle.quantity}</span>
                    </div>

                    {vehicle.description && (
                      <p style={{
                        color: "#64748b",
                        marginBottom: "16px",
                        lineHeight: "1.5",
                        fontSize: "0.9rem"
                      }}>{vehicle.description}</p>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#3b82f6"
                      }}>${vehicle.price}</span>
                      <button style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#3b82f6",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#2563eb";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#3b82f6";
                      }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Vehicles;