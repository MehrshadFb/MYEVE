import { useEffect, useState } from "react";
import { getAllVehicles } from "../../services/api";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const { user } = useAuth();

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
    if (filterBrand !== "all") {
      filtered = filtered.filter(vehicle => vehicle.brand === filterBrand);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filterBrand]);

  // Get unique brands for filter
  const uniqueBrands = [...new Set(vehicles.map(vehicle => vehicle.brand))];

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
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Search Vehicles
                </label>
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
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
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
                    padding: "12px 16px",
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