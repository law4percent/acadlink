import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Access token not found.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Optionally, export a pre-configured axios instance (optional but useful)
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
