import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleById, submitReview } from "../../services/api";

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleSubmitReview = async () => {
    await submitReview(vehicle.vid, {
      rating: reviewStars,
      comment: reviewText,
    });
    setReviewSubmitted(true);
    setReviewText("");
    setReviewStars(0);
    setHoverStars(0);
    const updatedVehicle = await getVehicleById(id);
    setVehicle(updatedVehicle);
    setReviewSubmitted(false);
  };

  if (loading)
    return (
      <div className="vehicle-detail-loading">Loading vehicle details...</div>
    );
  if (error) return <div className="vehicle-detail-error">Error: {error}</div>;
  if (!vehicle)
    return <div className="vehicle-detail-empty">No vehicle found.</div>;

  return (
    <div
      className="vehicle-detail"
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        padding: "2.5rem",
        border: "1px solid #e0e0e0",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "0 0 380px" }}>
          <img
            src={vehicle.images?.[0]?.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            style={{
              width: "100%",
              maxWidth: "380px",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e0e0",
              objectFit: "cover",
              background: "#f5f5f5",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              marginBottom: "0.5rem",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#222",
            }}
          >
            {vehicle.brand}{" "}
            <span style={{ color: "#1976d2" }}>{vehicle.model}</span>
          </h2>
          <span
            style={{
              display: "inline-block",
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              color: "#666",
              background: "#f0f4fa",
              padding: "0.3rem 1rem",
              borderRadius: 6,
            }}
          >
            {vehicle.type}
          </span>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              color: "#444",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Price:</strong>{" "}
              <span style={{ color: "#1976d2", fontWeight: 600 }}>
                ${Number(vehicle.price).toLocaleString()}
              </span>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Quantity:</strong> {vehicle.quantity}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Range:</strong> {vehicle.range} km
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Seats:</strong> {vehicle.seats}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Description:</strong>{" "}
              <span style={{ color: "#555" }}>
                {vehicle.description || "No description provided."}
              </span>
            </li>
          </ul>
          <button
            disabled
            style={{
              marginTop: "1rem",
              padding: "0.8rem 2.2rem",
              background: "#e0e0e0",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#888",
              cursor: "not-allowed",
              boxShadow: "0 2px 8px #eee",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "2.5rem",
          padding: "2rem 1.5rem",
          background: "#f8fafd",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e0e0e0",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            fontWeight: 600,
            fontSize: "1.3rem",
            color: "#1976d2",
          }}
        >
          Leave a Review
        </h3>
        {localStorage.getItem("token") ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    fontSize: "2rem",
                    color:
                      (hoverStars || reviewStars) >= star
                        ? "#ffd700"
                        : "#e0e0e0",
                    transition: "color 0.2s",
                    marginRight: 4,
                  }}
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(0)}
                  onClick={() => setReviewStars(star)}
                  role="button"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </span>
              ))}
              <span
                style={{
                  marginLeft: 12,
                  color: "#888",
                  fontSize: "1rem",
                }}
              >
                {reviewStars ? `${reviewStars}/5` : "Select rating"}
              </span>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              placeholder="Write your review here..."
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                fontSize: "1rem",
                marginBottom: "1rem",
                resize: "vertical",
                background: "#fff",
              }}
            />
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 2rem",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: reviewStars && reviewText ? "pointer" : "not-allowed",
                opacity: reviewStars && reviewText ? 1 : 0.6,
                boxShadow: "0 2px 8px #eee",
                marginBottom: "0.5rem",
              }}
              disabled={!reviewStars || !reviewText || reviewSubmitted}
              onClick={handleSubmitReview}
            >
              {reviewSubmitted ? "Review Submitted!" : "Submit Review"}
            </button>
          </>
        ) : (
          <div
            style={{ color: "#888", fontSize: "1rem", marginBottom: "1rem" }}
          >
            You must be signed in to leave a review.
          </div>
        )}
      </div>
      {/* Reviews List */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e0e0e0",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#1976d2",
          }}
        >
          Reviews
        </h3>
        {vehicle.reviews && vehicle.reviews.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {vehicle.reviews.map((review) => (
              <li
                key={review.rid}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {review.user && (
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#222",
                        marginRight: 8,
                      }}
                    >
                      {review.user.username}
                    </span>
                  )}
                  <span
                    style={{
                      color: "#888",
                      fontSize: "0.95rem",
                      marginRight: 8,
                    }}
                  >
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: review.rating >= star ? "#ffd700" : "#e0e0e0",
                          fontSize: "1.3rem",
                          marginRight: 2,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                  <span
                    style={{
                      marginLeft: 8,
                      color: "#1976d2",
                      fontWeight: 500,
                    }}
                  ></span>
                </div>
                <div style={{ color: "#444", fontSize: "1.05rem" }}>
                  {review.comment}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#888", fontSize: "1rem" }}>No reviews yet.</div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;
