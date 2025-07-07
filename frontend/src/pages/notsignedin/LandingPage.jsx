import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";

function LandingPage() {
  const [activeTab, setActiveTab] = useState("featured");

  const featuredVehicles = [
    {
      id: 1,
      name: "Tesla Model S",
      price: "$89,990",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
      description: "Luxury electric sedan with 396-mile range",
      specs: "396 mi range • 0-60 in 3.1s • 670 hp"
    },
    {
      id: 2,
      name: "Ford Mustang Mach-E",
      price: "$42,995",
      image: "https://images.unsplash.com/photo-1617470706008-e0947b9c0c0b?w=400&h=300&fit=crop",
      description: "Electric SUV with iconic Mustang styling",
      specs: "300 mi range • 0-60 in 3.8s • 346 hp"
    },
    {
      id: 3,
      name: "Chevrolet Bolt EUV",
      price: "$27,495",
      image: "https://images.unsplash.com/photo-1617470706008-e0947b9c0c0b?w=400&h=300&fit=crop",
      description: "Affordable electric crossover",
      specs: "247 mi range • 0-60 in 7.0s • 200 hp"
    }
  ];

  const categories = [
    { id: "featured", name: "Featured" },
    { id: "sedans", name: "Sedans" },
    { id: "suvs", name: "SUVs" },
    { id: "trucks", name: "Trucks" }
  ];

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
        <div style={{width: "100%" }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            marginBottom: "20px",
            background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Drive the Future
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Discover the latest electric vehicles from top manufacturers. 
            Zero emissions, maximum performance, and cutting-edge technology.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              to="/signup"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "16px 32px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
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
              Browse Vehicles
            </Link>
            <button style={{
              background: "transparent",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
{/* Features Section */}
<section style={{
  padding: "80px 0px",
  backgroundColor: "white",
  width: "100vw",
  marginLeft: "calc(-50vw + 50%)",
  overflow: "hidden" // Prevents any potential overflow issues
}}>
  <div style={{ width: "100%"}}>
    <h2 style={{
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "60px",
      color: "#1e293b"
    }}>
      Why Choose Electric?
    </h2>
    <div style={{
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        width: "100%",
        padding: "0 40px",
        boxSizing: "border-box"
    }}>
      {[
        {
          icon: "⚡",
          title: "Zero Emissions",
          description: "Drive guilt-free with zero tailpipe emissions and help protect our environment."
        },
        {
          icon: "💰",
          title: "Lower Costs",
          description: "Save money on fuel and maintenance with electric vehicles' efficiency."
        },
        {
          icon: "🚀",
          title: "Instant Torque",
          description: "Experience immediate acceleration and smooth, powerful performance."
        },
        {
          icon: "🔋",
          title: "Advanced Tech",
          description: "Cutting-edge battery technology and smart features for modern driving."
        }
      ].map((feature, index) => (
        <div key={index} style={{
          textAlign: "center",
          padding: "40px 20px",
          borderRadius: "16px",
          backgroundColor: "#f8fafc",
          transition: "all 0.3s ease",
          position: "relative", // Needed for z-index to work
          zIndex: 1, // Ensures element stays above others
          willChange: "transform" // Optimizes animation performance
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
          e.currentTarget.style.backgroundColor = "#f8fafc"; // Explicitly set
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.backgroundColor = "#f8fafc"; // Explicitly set
        }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{feature.icon}</div>
          <h3 style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            marginBottom: "15px",
            color: "#1e293b"
          }}>{feature.title}</h3>
          <p style={{
            color: "#64748b",
            lineHeight: "1.6",
            fontSize: "0.95rem"
          }}>{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Featured Vehicles Section */}
      <section id="vehicles" style={{
        padding: "80px 0px",
        backgroundColor: "#f1f5f9",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "40px",
            color: "#1e293b"
          }}>
            Featured Electric Vehicles
          </h2>
          
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "40px",
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === category.id ? "#3b82f6" : "transparent",
                  color: activeTab === category.id ? "white" : "#64748b",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Vehicle Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            width: "100%",
            maxWidth: "100%",
            padding: "0 40px",
            boxSizing: "border-box"
          }}>
            {featuredVehicles.map(vehicle => (
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
                  {vehicle.name}
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#1e293b"
                  }}>{vehicle.name}</h3>
                  <p style={{
                    color: "#64748b",
                    marginBottom: "16px",
                    lineHeight: "1.5"
                  }}>{vehicle.description}</p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                  }}>
                    <span style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#3b82f6"
                    }}>{vehicle.price}</span>
                    <span style={{
                      fontSize: "0.875rem",
                      color: "#64748b"
                    }}>{vehicle.specs}</span>
                  </div>
                  <button style={{
                    width: "100%",
                    padding: "12px",
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "80px 0px",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        textAlign: "center",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "20px"
          }}>
            Ready to Go Electric?
          </h2>
          <p style={{
            fontSize: "1.2rem",
            marginBottom: "40px",
            opacity: 0.9
          }}>
            Join thousands of drivers who've made the switch to electric vehicles. 
            Start your journey towards a sustainable future today.
          </p>
          <Link 
            to="/signup"
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              display: "inline-block"
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
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 0px",
        backgroundColor: "#1e293b",
        color: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <p style={{ opacity: 0.8 }}>
            © 2024 EVStore. All rights reserved. Driving the future of transportation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;