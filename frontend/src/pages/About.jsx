import { Link } from "react-router-dom";

function About() {
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
              EV buttplugs
            </h1>
          </Link>
          <nav style={{ display: "flex", gap: "30px" }}>
            <Link to="/featured" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Featured</Link>
            <Link to="/vehicles" style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}>Vehicles</Link>
            <Link to="/about" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}>About</Link>
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
        <div style={{ padding: "0 40px", width: "100%" }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            marginBottom: "20px"
          }}>
            About EVStore
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Leading the charge towards a sustainable future with electric vehicles.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section style={{
        padding: "80px 40px",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "60px",
            alignItems: "center"
          }}>
            <div>
              <h2 style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "30px",
                color: "#1e293b"
              }}>
                Our Mission
              </h2>
              <p style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#64748b",
                marginBottom: "20px"
              }}>
                At EVStore, we believe in the power of electric vehicles to transform transportation and protect our planet. 
                Our mission is to make electric vehicles accessible to everyone by providing a comprehensive platform 
                for discovering, comparing, and purchasing the latest electric vehicles.
              </p>
              <p style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#64748b"
              }}>
                We partner with leading manufacturers to bring you the most innovative and reliable electric vehicles 
                on the market, all while providing exceptional customer service and support.
              </p>
            </div>
            <div style={{
              backgroundColor: "#f8fafc",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🌱</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "15px",
                color: "#1e293b"
              }}>Sustainability First</h3>
              <p style={{
                color: "#64748b",
                lineHeight: "1.6"
              }}>
                Every electric vehicle we offer helps reduce carbon emissions and create a cleaner future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "80px 40px",
        backgroundColor: "#f1f5f9",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#1e293b"
          }}>
            Our Impact
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px"
          }}>
            {[
              { number: "10,000+", label: "EVs Sold", icon: "🚗" },
              { number: "50+", label: "Manufacturers", icon: "🏭" },
              { number: "100,000+", label: "Tons CO2 Saved", icon: "🌍" },
              { number: "99%", label: "Customer Satisfaction", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} style={{
                textAlign: "center",
                padding: "40px 20px",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{stat.icon}</div>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#3b82f6",
                  marginBottom: "10px"
                }}>{stat.number}</div>
                <div style={{
                  fontSize: "1.1rem",
                  color: "#64748b",
                  fontWeight: "500"
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{
        padding: "80px 40px",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#1e293b"
          }}>
            Our Team
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px"
          }}>
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                bio: "Passionate about sustainable transportation and making EVs accessible to everyone."
              },
              {
                name: "Michael Chen",
                role: "Head of Technology",
                bio: "Leading our digital platform development and customer experience innovation."
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Partnerships",
                bio: "Building relationships with leading EV manufacturers and expanding our network."
              }
            ].map((member, index) => (
              <div key={index} style={{
                textAlign: "center",
                padding: "40px 20px",
                backgroundColor: "#f8fafc",
                borderRadius: "16px",
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
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "600"
                }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#1e293b"
                }}>{member.name}</h3>
                <p style={{
                  color: "#3b82f6",
                  fontWeight: "500",
                  marginBottom: "15px"
                }}>{member.role}</p>
                <p style={{
                  color: "#64748b",
                  lineHeight: "1.6"
                }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About; 