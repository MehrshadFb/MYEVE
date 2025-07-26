import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllVehicles } from "../../services/api";
import { getAverageRating } from "../../utils/AnalyticsHelper";
import Header from "../../components/Header";

function Featured() {
  const [loading, setLoading] = useState(true);
  const [topVehiclesByType, setTopVehiclesByType] = useState({});
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getAllVehicles();
        
        // Group vehicles by type and get top 10 rated for each type
        const groupedByType = {};
        
        data.forEach(vehicle => {
          const type = vehicle.type;
          if (!groupedByType[type]) {
            groupedByType[type] = [];
          }
          groupedByType[type].push({
            ...vehicle,
            averageRating: getAverageRating(vehicle.reviews || [])
          });
        });

        // Sort each type by rating and take top 10
        const topRatedByType = {};
        Object.keys(groupedByType).forEach(type => {
          topRatedByType[type] = groupedByType[type]
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 10);
        });

        setTopVehiclesByType(topRatedByType);
        
        // Set the first vehicle type as the active tab
        const firstType = Object.keys(topRatedByType)[0];
        if (firstType) {
          setActiveTab(firstType);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '1.5rem',
          color: '#64748b'
        }}>
          Loading featured vehicles...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      <Header />

      {/* Content */}
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
            Featured Electric Vehicles
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Discover our handpicked selection of the most innovative and exciting electric vehicles on the market.
          </p>
        </div>
      </section>

      {/* Featured Content */}
      <section style={{
        padding: "80px 0px",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%", padding: "0 0px" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#1e293b"
          }}>
            Top Rated Vehicles by Category
          </h2>
          
          {/* Tabs */}
          {Object.keys(topVehiclesByType).length > 0 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "60px",
              flexWrap: "wrap",
              gap: "8px"
            }}>
              {Object.keys(topVehiclesByType).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  style={{
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    border: "2px solid",
                    borderRadius: "25px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "capitalize",
                    backgroundColor: activeTab === type ? "#3b82f6" : "transparent",
                    borderColor: activeTab === type ? "#3b82f6" : "#cbd5e1",
                    color: activeTab === type ? "white" : "#64748b"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== type) {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.color = "#3b82f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== type) {
                      e.target.style.borderColor = "#cbd5e1";
                      e.target.style.color = "#64748b";
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          
          {/* Display vehicles for active tab */}
          {activeTab && topVehiclesByType[activeTab] && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
              width: "100%",
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 40px",
              boxSizing: "border-box"
            }}>
              {topVehiclesByType[activeTab].map((vehicle, index) => (
                <Link 
                  key={vehicle.vid} 
                  to={`/vehicles/${vehicle.vid}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    position: "relative",
                    zIndex: 1,
                    willChange: "transform",
                    border: "2px solid transparent",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      backgroundColor: index < 3 ? "#fbbf24" : "#94a3b8",
                      color: "white",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: "700"
                    }}>
                      #{index + 1}
                    </div>
                    
                    {/* Vehicle Image */}
                    <div style={{ 
                      width: "100%", 
                      height: "200px", 
                      marginBottom: "16px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#e2e8f0"
                    }}>
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img 
                          src={vehicle.images[0].url} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "3rem",
                          color: "#94a3b8"
                        }}>
                          🚗
                        </div>
                      )}
                    </div>
                    
                    {/* Vehicle Info */}
                    <h4 style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#1e293b"
                    }}>
                      {vehicle.brand} {vehicle.model}
                    </h4>
                    
                    <p style={{
                      color: "#64748b",
                      marginBottom: "12px",
                      fontSize: "0.875rem"
                    }}>
                      {vehicle.year} • {vehicle.seats} seats • {vehicle.range}km range
                    </p>
                    
                    {/* Rating */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: "12px" 
                    }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            color: vehicle.averageRating >= star ? '#fbbf24' : '#e0e0e0',
                            fontSize: '1.25rem',
                            marginRight: 2,
                          }}
                        >
                          ★
                        </span>
                      ))}
                      <span style={{ color: '#64748b', fontSize: '0.875rem', marginLeft: 8 }}>
                        {vehicle.averageRating > 0 ? vehicle.averageRating.toFixed(1) : 'No rating'}
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#3b82f6"
                    }}>
                      ${Number(vehicle.price).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {Object.keys(topVehiclesByType).length === 0 && (
            <div style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: "1.25rem",
              padding: "60px 20px"
            }}>
              No vehicles found to feature.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Featured; 