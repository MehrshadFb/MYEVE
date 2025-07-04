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

export default api;
