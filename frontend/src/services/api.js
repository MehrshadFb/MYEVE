import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await api.post("/refresh", { refreshToken });
          const { token } = response.data;

          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token is also expired, redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const signUp = async (userData) => {
  const response = await api.post("/signup", userData);
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await api.post("/signin", credentials);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/refresh", { refreshToken });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const deleteUserById = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);
  return response.data;
};

export const getAllAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

export const getAllAddressesByUserId = async (userId) => {
  const response = await api.get(`/addresses/${userId}`);
  return response.data;
};

export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/addresses/${id}`, addressData);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post("/vehicles", vehicleData);
  return response.data;
};

export const getAllVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

export const getVehicleById = async (vid) => {
  const response = await api.get(`/vehicles/${vid}`);
  return response.data;
};

export const updateVehicle = async (vid, vehicleData) => {
  const response = await api.put(`/vehicles/${vid}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (vid) => {
  const response = await api.delete(`/vehicles/${vid}`);
  return response.data;
};

export const uploadVehicleImages = async (vid, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  const response = await api.post(`/vehicles/${vid}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const submitReview = async (vid, reviewData) => {
  const response = await api.post(`/vehicles/${vid}/reviews`, reviewData);
  return response.data;
};

export const deleteReview = async (vid, rid) => {
  const response = await api.delete(`/vehicles/${vid}/reviews/${rid}`);
  return response.data;
};
// 🛒 Shopping Cart APIs
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async ({ vehicleId, quantity = 1 }) => {
  const response = await api.post("/cart/add", { vehicleId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/item/${itemId}`, { quantity });
    return response.data;
  } catch (err) {
    console.error("updateCartItem error:", err.response?.data || err.message);
    throw err;
  }
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};

// Order API functions
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Admin order functions
export const getAllOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(
    `/admin/orders${queryString ? `?${queryString}` : ""}`
  );
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await api.put(`/admin/orders/${orderId}`, statusData);
  return response.data;
};

// CSV API functions
export const exportVehiclesCSV = async () => {
  const response = await api.post("/vehicles/csv/export");
  return response.data;
};

export const importVehiclesCSV = async (csvFile) => {
  const formData = new FormData();
  formData.append('csvFile', csvFile);
  
  const response = await api.post("/vehicles/csv/import", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadVehiclesCSV = async () => {
  const response = await api.get("/vehicles/csv/download", {
    responseType: 'blob',
  });
  
  // Create blob link to download the file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'vehicles.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return { success: true, message: 'CSV downloaded successfully' };
};

export default api;
