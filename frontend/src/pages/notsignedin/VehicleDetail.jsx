import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleById, submitReview, addToCart } from "../../services/api";
import { getAverageRating } from "../../utils/AnalyticsHelper";
import Header from "../../components/Header";

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to submit a review.');
        return;
      }

      console.log('Submitting review for vehicle:', vehicle.vid);
      console.log('Review data:', { rating: reviewStars, comment: reviewText });

      await submitReview(vehicle.vid, {
        rating: reviewStars,
        comment: reviewText,
      });

      setReviewSubmitted(true);
      setReviewText("");
      setReviewStars(0);
      setHoverStars(0);
      
      // Refresh vehicle data to show new review
      const updatedVehicle = await getVehicleById(id);
      setVehicle(updatedVehicle);
      
      // Reset submission state after a delay
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      
      // More detailed error handling
      if (error.response?.status === 401) {
        alert('Please sign in to submit a review.');
      } else if (error.response?.status === 400) {
        alert('Invalid review data. Please check your rating and comment.');
      } else if (error.response?.status === 404) {
        alert('Vehicle not found.');
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        alert(`Server Error: ${error.response.data.error}`);
      } else {
        alert('Failed to submit review. Please try again.');
      }
      
      setReviewSubmitted(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ vehicleId: vehicle.vid, quantity: 1 });
      alert(`Added ${vehicle.brand} ${vehicle.model} to cart!`);
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart");
    }
  };

  if (loading)
    return (
      <div className="vehicle-detail-loading">Loading vehicle details...</div>
    );
  if (error) return <div className="vehicle-detail-error">Error: {error}</div>;
  if (!vehicle)
    return <div className="vehicle-detail-empty">No vehicle found.</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100vw' }}>
      <Header />
      <div
        className="vehicle-detail"
        style={{
          width: '100vw',
          marginTop: 70,
          padding: '2.5rem 4vw 2rem 4vw',
          border: 'none',
          borderRadius: 0,
          background: '#fff',
          boxShadow: 'none',
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Vehicle Images */}
        <div style={{ flex: '0 0 420px', width: 500 }}>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 500 }}>
            <img
              src={vehicle.images?.[currentImageIndex]?.url || vehicle.images?.[0]?.url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              style={{
                width: '100%',
                height: 600,
                maxWidth: 500,
                borderRadius: 12,
                boxShadow: '0 2px 12px #e0e0e0',
                objectFit: 'contain',
                background: '#f5f5f5',
                transition: 'all 0.3s ease-in-out',
              }}
            />
          </div>
          
          {/* Thumbnails if more images */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {vehicle.images.map((img, idx) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={`thumb-${idx}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: currentImageIndex === idx ? '3px solid #1976d2' : '2px solid #e0e0e0',
                    background: '#f5f5f5',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: currentImageIndex === idx ? 1 : 0.7,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (currentImageIndex !== idx) {
                      e.target.style.opacity = '0.9';
                      e.target.style.borderColor = '#1976d2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentImageIndex !== idx) {
                      e.target.style.opacity = '0.7';
                      e.target.style.borderColor = '#e0e0e0';
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Right: Vehicle Details */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#222', marginBottom: 0 }}>
              {vehicle.brand} <span style={{ color: '#1976d2' }}>{vehicle.model}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
                {vehicle.year}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Year
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ color: '#666', fontSize: '1.1rem', background: '#f0f4fa', padding: '0.3rem 1rem', borderRadius: 6, display: 'inline-block' }}>{vehicle.type}</div>
            
            {/* Average Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: getAverageRating(vehicle.reviews) >= star ? '#fbbf24' : '#e0e0e0',
                    fontSize: '1.5rem',
                    marginRight: 2,
                  }}
                >
                  ★
                </span>
              ))}
              <span style={{ color: '#64748b', fontSize: '1rem', marginLeft: 8 }}>
                {vehicle.reviews && vehicle.reviews.length > 0 ? getAverageRating(vehicle.reviews).toFixed(1) : 'No rating'}
              </span>
            </div>
          </div>
          {/* price */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{  color: '#000000ff', fontSize: '1.4rem', fontWeight: 'bold' }}>
                  Price:
                  <span style={{ color: '#1976d2', fontWeight: 700, fontSize: '1.5rem', marginLeft: "10px" }}>${Number(vehicle.price).toLocaleString()}</span>
                </div>
                <div style={{ color: '#000000ff',fontSize: '1.1rem' }}><strong>Range:</strong> {vehicle.range} km</div>
                <div style={{ color: '#000000ff',fontSize: '1.1rem' }}><strong>Seats:</strong> {vehicle.seats}</div>
                <div style={{ color: '#000000ff',fontSize: '1.1rem' }}>
                  <span style={{
                  color:
                    vehicle.quantity === 0
                    ? "#ef4444"
                    : vehicle.quantity <= 3
                    ? "#fbbf24"
                    : "#22c55e",
                  fontWeight: 700
                  }}>
                  {vehicle.quantity === 0
                    ? "Out of Stock"
                    : vehicle.quantity <= 3
                    ? "Low Stock"
                    : "In Stock"}
                  </span>
                </div>
                </div>
                <button
                onClick={handleAddToCart}
                style={{
                  margin: '12px 0 18px 0',
                  padding: '0.8rem 2.2rem',
                  background: vehicle.quantity === 0 ? '#e0e0e0' : '#1976d2',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: vehicle.quantity === 0 ? '#888' : '#fff',
                  cursor: vehicle.quantity === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px #eee',
                  transition: 'all 0.3s ease',
                }}
                disabled={vehicle.quantity === 0}
                onMouseEnter={(e) => {
                  if (vehicle.quantity > 0) {
                    e.target.style.background = '#1565c0';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (vehicle.quantity > 0) {
                    e.target.style.background = '#1976d2';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px #eee';
                  }
                }}
                >
                {vehicle.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <div style={{ color: '#000000ff',fontSize: '1.4rem', marginBottom: 10 }}>
                <strong>Description:</strong> 
                <br />
                <span style={{ fontSize: '1rem', color: '#555' }}>{vehicle.description || 'No description provided.'}</span>
                </div>
              </div>
              </div>
              {/* Below: Reviews and Review Form */}
      <div style={{ width: '100vw', margin: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', padding: '0 4vw' }}>
        {/* Reviews List */}
        <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e0e0', padding: '2rem 1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.2rem', color: '#1976d2' }}>Reviews</h3>
          {vehicle.reviews && vehicle.reviews.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {vehicle.reviews.map((review) => (
                <li
                  key={review.rid}
                  style={{
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {review.user && (
                      <span style={{ fontWeight: 600, color: '#222', marginRight: 8 }}>{review.user.username}</span>
                    )}
                    <span style={{ color: '#888', fontSize: '0.95rem', marginRight: 8 }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    <span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{ color: review.rating >= star ? '#ffd700' : '#e0e0e0', fontSize: '1.3rem', marginRight: 2 }}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  <div style={{ color: '#444', fontSize: '1.05rem' }}>{review.comment}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: '#888', fontSize: '1rem' }}>No reviews yet.</div>
          )}
        </div>
        {/* Leave a Review */}
        <div style={{ flex: 1, minWidth: 340, background: '#f8fafd', borderRadius: 12, boxShadow: '0 2px 12px #e0e0e0', padding: '2rem 1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.3rem', color: '#1976d2' }}>Leave a Review</h3>
          {localStorage.getItem('token') ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: 'pointer',
                      fontSize: '2rem',
                      color: (hoverStars || reviewStars) >= star ? '#ffd700' : '#e0e0e0',
                      transition: 'color 0.2s',
                      marginRight: 4,
                    }}
                    onMouseEnter={() => setHoverStars(star)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setReviewStars(star)}
                    role="button"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: 12, color: '#888', fontSize: '1rem' }}>
                  {reviewStars ? `${reviewStars}/5` : 'Select rating'}
                </span>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                placeholder="Write your review here..."
                style={{
                  color: '#000000ff',
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  resize: 'vertical',
                  background: '#fff',
                }}
              />
              <button
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7rem 2rem',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: reviewStars && reviewText ? 'pointer' : 'not-allowed',
                  opacity: reviewStars && reviewText ? 1 : 0.6,
                  boxShadow: '0 2px 8px #eee',
                  marginBottom: '0.5rem',
                }}
                disabled={!reviewStars || !reviewText || reviewSubmitted}
                onClick={handleSubmitReview}
              >
                {reviewSubmitted ? 'Review Submitted!' : 'Submit Review'}
              </button>
            </>
          ) : (
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: '1rem' }}>
              You must be signed in to leave a review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
