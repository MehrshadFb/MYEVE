import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import {
  getAllAddressesByUserId,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../../services/api';

const AddressList = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    province: '',
    country: '',
    zip: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const userId = user?.id;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAddressesByUserId(userId);
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      await createAddress({ ...newAddress, userId });
      setNewAddress({
        street: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        phone: '',
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingId(address.id);
    setEditingData({
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      zip: address.zip,
      phone: address.phone,
    });
  };

  const handleSaveAddress = async () => {
    try {
      await updateAddress(editingId, editingData);
      setEditingId(null);
      setEditingData({});
      fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEditingDataChange = (field, value) => {
    setEditingData({ ...editingData, [field]: value });
  };

  if (!userId) {
    return <div>Loading user data...</div>;
  }

  if (loading) {
    return <div>Loading addresses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Street"
          value={newAddress.street}
          onChange={(e) =>
            setNewAddress({ ...newAddress, street: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="City"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Province"
          value={newAddress.province}
          onChange={(e) =>
            setNewAddress({ ...newAddress, province: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Country"
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress({ ...newAddress, country: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={newAddress.zip}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zip: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone (optional)"
          value={newAddress.phone}
          onChange={(e) =>
            setNewAddress({ ...newAddress, phone: e.target.value })
          }
        />
      </div>
      <button onClick={handleAddAddress}>Add Address</button>

      <h2>Address List</h2>
      <table>
        <thead>
          <tr>
            <th>Street</th>
            <th>City</th>
            <th>Province</th>
            <th>Country</th>
            <th>Zip Code</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.length > 0 &&
            addresses.map((address) => (
              <tr key={address.id}>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.street}
                      onChange={(e) =>
                        handleEditingDataChange('street', e.target.value)
                      }
                    />
                  ) : (
                    address.street
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.city}
                      onChange={(e) =>
                        handleEditingDataChange('city', e.target.value)
                      }
                    />
                  ) : (
                    address.city
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.province}
                      onChange={(e) =>
                        handleEditingDataChange('province', e.target.value)
                      }
                    />
                  ) : (
                    address.province
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.country}
                      onChange={(e) =>
                        handleEditingDataChange('country', e.target.value)
                      }
                    />
                  ) : (
                    address.country
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.zip}
                      onChange={(e) =>
                        handleEditingDataChange('zip', e.target.value)
                      }
                    />
                  ) : (
                    address.zip
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <input
                      type="text"
                      value={editingData.phone}
                      onChange={(e) =>
                        handleEditingDataChange('phone', e.target.value)
                      }
                    />
                  ) : (
                    address.phone
                  )}
                </td>
                <td>
                  {editingId === address.id ? (
                    <>
                      <button onClick={handleSaveAddress}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditAddress(address)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(address.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressList;
