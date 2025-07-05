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

export default api;
