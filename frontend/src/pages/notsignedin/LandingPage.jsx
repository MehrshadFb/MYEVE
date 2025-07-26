import { Link } from "react-router-dom";
import Header from "../../components/Header";

function LandingPage() {
  

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
              to="/vehicles"
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
      marginBottom: "10px",
      marginTop: "20px",
      color: "#1e293b"
    }}>
      Why Choose Electric?
    </h2>
    <div style={{
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        width: "100%",
        padding: "0px 40px",
        marginBottom: "20px",
        boxSizing: "border-box"
    }}>
      {[
        {
          image: "/zero-emissions.png", // Add your image to public folder
          title: "Zero Emissions",
          description: "Drive guilt-free with zero tailpipe emissions and help protect our environment."
        },
        {
          image: "/lower-costs.png", // Add your image to public folder
          title: "Lower Costs",
          description: "Save money on fuel and maintenance with electric vehicles' efficiency."
        },
        {
          image: "/instant-torque.png", // Add your image to public folder
          title: "Instant Torque",
          description: "Experience immediate acceleration and smooth, powerful performance."
        },
        {
          image: "/advanced-tech.png", // Add your image to public folder
          title: "Advanced Tech",
          description: "Cutting-edge battery technology and smart features for modern driving."
        }
      ].map((feature, index) => (
        <div key={index} style={{
          textAlign: "center",
          padding: "40px 20px",
          borderRadius: "50px",
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
          <h3 style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#1e293b"
          }}>{feature.title}</h3>
          
          <div style={{ 
            width: "80px", 
            height: "80px", 
            margin: "0 auto 20px auto",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e2e8f0"
          }}>
            <img 
              src={feature.image} 
              alt={feature.title}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain"
              }}
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div style={{
              display: "none",
              fontSize: "2rem",
              color: "#64748b"
            }}>
              {/* Fallback icons */}
              {index === 0 && "⚡"}
              {index === 1 && "💰"}
              {index === 2 && "🚀"}
              {index === 3 && "🔋"}
            </div>
          </div>
          
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

{/* New Section - YouTube Videos */}
<section style={{
  padding: "80px 0px",
  backgroundColor: "#f1f5f9",
  width: "100vw",
  marginLeft: "calc(-50vw + 50%)",
  overflow: "hidden"
}}>
  <div style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
    <h2 style={{
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "60px",
      color: "#1e293b"
    }}>
      New
    </h2>
    
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      {[
        {
          title: "GMC HUMMER EV",
          videoId: "Joa71AjfJqw",
          description: "The GMC HUMMER EV elevates your drive to a whole new level. Experience available CrabWalk, available Extract Mode, available Watts To Freedom or available Super Cruise hands-free driving."
        },
        {
          title: "2025 Chevy Equinox EV",
          videoId: "LXXa1CnngJY", // Replace with actual video ID
          description: "From experiencing its premium tech features to enjoying all the value you deserve. Wherever your Equinox EV takes you, rest assured that you’re unlocking the ultimate EV experience. "
        },
        {
          title: "2025 Tesla Model Y",
          videoId: "iPJDW5EaIzE", // Replace with actual video ID
          description: "Redesigned from end to end, check out the upgrades to the new Model Y that make the best-selling car in the world even better "
        }
      ].map((video, index) => (
        <div key={index} style={{
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        }}
        >
          {/* YouTube Video Embed */}
          <div style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            overflow: "hidden"
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
            />
          </div>
          
          {/* Video Info */}
          <div style={{ padding: "24px" }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1e293b"
            }}>
              {video.title}
            </h3>
            <p style={{
              color: "#64748b",
              lineHeight: "1.6",
              fontSize: "0.95rem"
            }}>
              {video.description}
            </p>
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
        padding: "20px 0px 20px 0px",
        backgroundColor: "#1e293b",
        color: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ 
          width: "100%", 
          padding: "0 40px", 
          boxSizing: "border-box",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* Main Footer Content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px"
          }}>
            {/* Company Info */}
            <div>
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                marginBottom: "15px"
              }}>
                MYEVE
              </h3>
              <p style={{
                opacity: 0.8,
                lineHeight: "1.6",
                marginBottom: "15px",
                fontSize: "0.85rem"
              }}>
                Leading the electric vehicle revolution with innovative technology, 
                sustainable transportation solutions, and exceptional customer service.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  { name: "Browse Vehicles", link: "/vehicles" },
                  { name: "Featured Cars", link: "/featured" },
                  { name: "About Us", link: "/about" },
                  { name: "Loan Calculator", link: "/loan-calculator" },
                  { name: "Shopping Cart", link: "/cart" }
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <Link 
                      to={item.link} 
                      style={{ 
                        color: "white", 
                        textDecoration: "none", 
                        opacity: 0.8,
                        transition: "opacity 0.3s ease",
                        fontSize: "0.8rem"
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = "1"}
                      onMouseLeave={(e) => e.target.style.opacity = "0.8"}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Customer Support */}
            <div>
              <h4 style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                Customer Support
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Help Center",
                  "Contact Support",
                  "Warranty Info",
                  "Shipping & Returns",
                  "FAQ"
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <a 
                      href="#" 
                      style={{ 
                        color: "white", 
                        textDecoration: "none", 
                        opacity: 0.8,
                        transition: "opacity 0.3s ease",
                        fontSize: "0.8rem"
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = "1"}
                      onMouseLeave={(e) => e.target.style.opacity = "0.8"}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                Legal
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Accessibility",
                  "Legal Notice"
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <a 
                      href="#" 
                      style={{ 
                        color: "white", 
                        textDecoration: "none", 
                        opacity: 0.8,
                        transition: "opacity 0.3s ease",
                        fontSize: "0.8rem"
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = "1"}
                      onMouseLeave={(e) => e.target.style.opacity = "0.8"}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}>
            <p style={{ opacity: 0.8, margin: 0, fontSize: "0.75rem" }}>
              © 2025 MYEVE. All rights reserved. Driving the future of transportation.
            </p>
            <p style={{ opacity: 0.8, margin: 0, fontSize: "0.75rem" }}>
              Made with ❤️ for a sustainable future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;