import { Link } from "react-router-dom";

function Vehicles() {
  const allVehicles = [
  {
    id: 1,
    name: "Tesla Model S",
    price: "$89,990",
    category: "Sedan",
    specs: "396 mi range • 0-60 in 3.1s • 670 hp",
    image: "https://media.ed.edmunds-media.com/tesla/model-s/2025/oem/2025_tesla_model-s_sedan_plaid_fq_oem_1_1600.jpg" 
  },
  {
    id: 2,
    name: "Ford Mustang Mach-E",
    price: "$42,995",
    category: "SUV",
    specs: "300 mi range • 0-60 in 3.8s • 346 hp",
    image: "https://cardealerstg.blob.core.windows.net/butlergroup/vehicles/1147912/pictures/7887ab3d-2691-4c4a-ba8e-99d317ff7ae8-gallery.jpg"
  },
  {
    id: 3,
    name: "Chevrolet Bolt EUV",
    price: "$27,495",
    category: "Crossover",
    specs: "247 mi range • 0-60 in 7.0s • 200 hp",
    image: "https://www.davischev.com/wp-content/uploads/2022/11/image-18_11zon-1.png"
  },
  {
    id: 4,
    name: "Rivian R1T",
    price: "$73,000",
    category: "Truck",
    specs: "314 mi range • 0-60 in 3.0s • 835 hp",
    image: "https://www.iihs.org/cdn-cgi/image/width=636/api/ratings/model-year-images/3215/"
  },
  {
    id: 5,
    name: "Lucid Air",
    price: "$87,400",
    category: "Sedan",
    specs: "520 mi range • 0-60 in 2.8s • 819 hp",
    image: "https://lucidmotors.com/media/image/jellybeans/pure.webp"
  },
  {
    id: 6,
    name: "Tesla Model Y",
    price: "$44,990",
    category: "SUV",
    specs: "330 mi range • 0-60 in 3.5s • 384 hp",
    image: "https://images.ctfassets.net/3xid768u5joa/2z0qi9r7H4JCO4MBY97n2h/670df090c1b0a58a48ba8984739b3a32/Model-Y-Colour-Guide-Header-Red_multi-coat.webp"
  }
];


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "10px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        boxShadow: "0 20px 20px rgba(0,0,0,0.1)"
      }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700", 
                color: "#1e293b",
                margin: 0
              }}>
                MYEVE
              </h1>
            </Link>
          <nav style={{ display: "flex", gap: "30px" }}>
            <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
            <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
            <Link to="/about" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>About</Link>
          </nav>
        </div>
        <Link 
          to="/signin" 
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#2563eb";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Sign In
        </Link>
      </header>

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
                <div style={{ height: "200px", overflow: "hidden" }}>
  <img
    src={vehicle.image}
    alt={vehicle.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />
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