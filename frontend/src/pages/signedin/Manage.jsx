import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useEffect, useState } from "react";
import UsersList from "./UsersList";
import AddressList from "./AddressList";
import Header from "../../components/Header";
import { getAllVehicles, deleteReview } from "../../services/api";

function Manage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allReviews, setAllReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Redirect customers to main page
  useEffect(() => {
    if (user && user.role === "customer") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const vehicles = await getAllVehicles();
          // Flatten all reviews with vehicle info
          const reviews = vehicles.flatMap((vehicle) =>
            (vehicle.reviews || []).map((review) => ({
              ...review,
              vehicleBrand: vehicle.brand,
              vehicleModel: vehicle.model,
              vehicleVid: vehicle.vid,
            }))
          );
          setAllReviews(reviews);
        } catch (err) {
          setAllReviews([]);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [user]);

  const handleDeleteReview = async (vid, rid) => {
    await deleteReview(vid, rid);
    setAllReviews((prev) => prev.filter((r) => r.rid !== rid));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Don't render anything for customers as they will be redirected
  if (user.role === "customer") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "0px 0",
        width: "100%",
      }}
    >
      <Header />
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "2px solid #e2e8f0",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 10px 0",
              }}
            >
              Welcome, {user.username}!
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#64748b",
                margin: 0,
              }}
            >
              Role:{" "}
              <span
                style={{
                  fontWeight: "600",
                  color: user.role === "admin" ? "#dc2626" : "#059669",
                }}
              >
                {user.role}
              </span>
            </p>
          </div>
        </div>

        {user.role === "admin" && (
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Admin Dashboard
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Manage users, vehicles, and view system information.
            </p>

            <div
              style={{
                padding: "0 40px",
                marginBottom: "30px",
                boxSizing: "border-box",
              }}
            >
              <button
                onClick={() => navigate("/add-vehicle")}
                style={{
                  background: "#059669",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  marginBottom: "20px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#047857";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#059669";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Add Vehicles
              </button>
            </div>

            <UsersList />
            {/* Reviews List for Admin */}
            <div style={{ marginTop: "40px", padding: "0 40px" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "20px",
                }}
              >
                All Reviews
              </h2>
              {loadingReviews ? (
                <div style={{ color: "#64748b", fontSize: "1rem" }}>
                  Loading reviews...
                </div>
              ) : allReviews.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "1rem" }}>
                  No reviews found.
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {allReviews.map((review) => (
                    <li
                      key={review.rid}
                      style={{
                        marginBottom: "1.5rem",
                        paddingBottom: "1rem",
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#222",
                            marginBottom: 4,
                          }}
                        >
                          {review.user?.username ||
                            `User ${review.userId?.slice(0, 6)}`}
                        </div>
                        <div
                          style={{
                            color: "#888",
                            fontSize: "0.95rem",
                            marginBottom: 4,
                          }}
                        >
                          {new Date(review.createdAt).toLocaleDateString()} |
                          Vehicle: {review.vehicleBrand} {review.vehicleModel}
                        </div>
                        <div
                          style={{
                            color: "#fbbf24",
                            fontSize: "1.2rem",
                            marginBottom: 4,
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{
                                color:
                                  review.rating >= star ? "#fbbf24" : "#e0e0e0",
                              }}
                            >
                              ★
                            </span>
                          ))}{" "}
                        </div>
                        <div style={{ color: "#444", fontSize: "1.05rem" }}>
                          {review.comment}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteReview(review.vehicleId, review.rid)
                        }
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: "pointer",
                          marginLeft: "20px",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#b91c1c")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#dc2626")
                        }
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {user.role === "customer" && (
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Customer Dashboard
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              Manage your addresses and account information.
            </p>
            <AddressList />
          </div>
        )}
      </div>
    </div>
  );
}

export default Manage;
