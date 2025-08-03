import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAllVehicles, deleteReview } from "../../services/api";
import Header from "../../components/Header";
import useAuth from "../../context/useAuth";

function UserReviews() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const username = location.state?.username || "User";

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      try {
        const vehicles = await getAllVehicles();
        // Filter reviews for the specific user
        const userReviews = vehicles.flatMap((vehicle) =>
          (vehicle.reviews || [])
            .filter((review) => review.userId === userId)
            .map((review) => ({
              ...review,
              vehicleBrand: vehicle.brand,
              vehicleModel: vehicle.model,
              vehicleVid: vehicle.vid,
            }))
        );
        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserReviews();
    }
  }, [userId]);

  // Filter reviews based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(review =>
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    }
  }, [reviews, searchTerm]);

  const handleDeleteReview = async (vehicleId, reviewId) => {
    try {
      await deleteReview(vehicleId, reviewId);
      setReviews(prev => prev.filter(r => r.rid !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role !== "admin") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
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
            Reviews by {username}
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "#64748b",
            margin: 0,
          }}>
            Manage all reviews submitted by this user
          </p>
        </div>

        {/* Back Button */}
        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={() => navigate("/manage")}
            style={{
              background: "#6b7280",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#4b5563";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6b7280";
            }}
          >
            ← Back to User Management
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#1e293b"
          }}>
            Search Reviews
          </h3>
          <input
            type="text"
            placeholder="Search by comment, vehicle brand, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#1e293b",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Reviews List */}
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
            Reviews ({filteredReviews.length} found)
          </h3>
          
          {loading ? (
            <div style={{
              textAlign: "center",
              padding: "48px",
              color: "#6b7280",
              fontSize: "16px"
            }}>
              Loading reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px",
              color: "#6b7280",
              fontSize: "16px"
            }}>
              {searchTerm ? `No reviews found matching "${searchTerm}"` : "This user has not submitted any reviews yet."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredReviews.map((review) => (
                <div
                  key={review.rid}
                  style={{
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px"
                    }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1e293b"
                      }}>
                        {review.vehicleBrand} {review.vehicleModel}
                      </h4>
                      <div style={{
                        color: "#fbbf24",
                        fontSize: "1.2rem",
                      }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: review.rating >= star ? "#fbbf24" : "#e0e0e0",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      marginBottom: "12px"
                    }}>
                      Submitted on {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <p style={{
                      color: "#374151",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      margin: 0
                    }}>
                      {review.comment}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.vehicleVid, review.rid)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#b91c1c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#dc2626";
                    }}
                  >
                    Delete Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserReviews;
