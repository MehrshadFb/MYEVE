import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { createVehicle } from '../../services/api';

function AddVehicle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    name: '',
    description: '',
    brand: '',
    model: '',
    quantity: 0,
    price: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    // Validate required fields
    if (
      !vehicleData.name ||
      !vehicleData.brand ||
      !vehicleData.model ||
      !vehicleData.price
    ) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    // Validate numeric fields
    if (isNaN(vehicleData.price) || parseFloat(vehicleData.price) <= 0) {
      setMessage({ type: 'error', text: 'Price must be a positive number' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(vehicleData.quantity) || parseInt(vehicleData.quantity) < 0) {
      setMessage({
        type: 'error',
        text: 'Quantity must be a non-negative number',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createVehicle({
        name: vehicleData.name,
        description: vehicleData.description,
        brand: vehicleData.brand,
        model: vehicleData.model,
        quantity: parseInt(vehicleData.quantity),
        price: parseFloat(vehicleData.price),
      });

      setMessage({ type: 'success', text: response.message });

      // Clear form after successful submission
      setVehicleData({
        name: '',
        description: '',
        brand: '',
        model: '',
        quantity: 0,
        price: '',
      });

      // Redirect to manage page after a short delay
      setTimeout(() => {
        navigate('/manage');
      }, 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create vehicle',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/manage');
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          padding: '120px 20px 40px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>
            Access Denied
          </h1>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            Only administrators can access this page.
          </p>
          <button
            onClick={handleBack}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '120px 20px 40px 20px',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e2e8f0',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 10px 0',
              }}
            >
              Add New Vehicle
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#64748b',
                margin: 0,
              }}
            >
              Add a new vehicle to the inventory
            </p>
          </div>
          <button
            onClick={handleBack}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4b5563';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6b7280';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              backgroundColor:
                message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#059669' : '#dc2626',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Vehicle Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Vehicle Name *
              </label>
              <input
                type="text"
                name="name"
                value={vehicleData.name}
                onChange={handleChange}
                placeholder="Enter vehicle name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Brand */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={vehicleData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Model */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                placeholder="Enter model name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={vehicleData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Price */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={vehicleData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: 'span 2' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={vehicleData.description}
                onChange={handleChange}
                placeholder="Enter vehicle description"
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: isSubmitting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.background = '#3b82f6';
                }
              }}
            >
              {isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
