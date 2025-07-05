import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signUp = async (userData) => {
  const response = await api.post("/signup", userData);
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await api.post("/signin", credentials);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const deleteUserById = async (id) => {
  const response = await api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getAllAddresses = async () => {
  const response = await api.get("/addresses", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getAllAddressesByUserId = async (userId) => {
  const response = await api.get(`/addresses/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/addresses/${id}`, addressData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export default api;
