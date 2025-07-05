import { Link } from "react-router-dom";
import Header from "../../components/Header";

function Vehicles() {
  const allVehicles = [
    {
      id: 1,
      name: "Tesla Model S",
      price: "$89,990",
      category: "Sedan",
      specs: "396 mi range • 0-60 in 3.1s • 670 hp"
    },
    {
      id: 2,
      name: "Ford Mustang Mach-E",
      price: "$42,995",
      category: "SUV",
      specs: "300 mi range • 0-60 in 3.8s • 346 hp"
    },
    {
      id: 3,
      name: "Chevrolet Bolt EUV",
      price: "$27,495",
      category: "Crossover",
      specs: "247 mi range • 0-60 in 7.0s • 200 hp"
    },
    {
      id: 4,
      name: "Rivian R1T",
      price: "$73,000",
      category: "Truck",
      specs: "314 mi range • 0-60 in 3.0s • 835 hp"
    },
    {
      id: 5,
      name: "Lucid Air",
      price: "$87,400",
      category: "Sedan",
      specs: "520 mi range • 0-60 in 2.8s • 819 hp"
    },
    {
      id: 6,
      name: "Tesla Model Y",
      price: "$44,990",
      category: "SUV",
      specs: "330 mi range • 0-60 in 3.5s • 384 hp"
    }
  ];

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
            All Electric Vehicles
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Browse our complete collection of electric vehicles from all major manufacturers.
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
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
            color: "#1e293b",
            
          }}>
            Available Vehicles
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            width: "100%",
            maxWidth: "100%",
            padding: "0 40px",
            boxSizing: "border-box"
          }}>
            {allVehicles.map(vehicle => (
              <div key={vehicle.id} style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
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
                  background: `linear-gradient(45deg, #3b82f6, #8b5cf6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem"
                }}>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
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
                      fontWeight: "500"
                    }}>{vehicle.category}</span>
                  </div>
                  <p style={{
                    color: "#64748b",
                    marginBottom: "16px",
                    lineHeight: "1.5",
                    fontSize: "0.9rem"
                  }}>{vehicle.specs}</p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#3b82f6"
                    }}>{vehicle.price}</span>
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
        </div>
      </section>
    </div>
  );
}

export default Vehicles; 