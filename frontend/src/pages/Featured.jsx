import { Link } from "react-router-dom";

function Featured() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        boxShadow: "0 2px 20px rgba(0,0,0,0.1)"
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
            <Link to="/featured" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
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
        <div style={{ padding: "0 40px", width: "100%" }}>
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
        padding: "80px 20px",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%", padding: "0 20px" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#1e293b"
          }}>
            This Week's Highlights
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            width: "100%",
            maxWidth: "100%"
          }}>
            {[
              {
                title: "Tesla Model S Plaid",
                description: "The fastest production car ever made",
                price: "$135,990",
                image: "🚗"
              },
              {
                title: "Rivian R1T",
                description: "Adventure-ready electric pickup truck",
                price: "$73,000",
                image: "🚛"
              },
              {
                title: "Lucid Air",
                description: "Luxury meets performance",
                price: "$87,400",
                image: "🏎️"
              }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: "#f8fafc",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px)";
                e.target.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>{item.image}</div>
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#1e293b"
                }}>{item.title}</h3>
                <p style={{
                  color: "#64748b",
                  marginBottom: "20px"
                }}>{item.description}</p>
                <div style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#3b82f6"
                }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Featured; 