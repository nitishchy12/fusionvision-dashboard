import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5002";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAllIntel = async () => {
  const response = await api.get("/api/data/all");
  return response.data;
};

export const fetchSummary = async () => {
  const response = await api.get("/api/summary");
  return response.data;
};

export const seedDemoData = async () => {
  const response = await api.post("/api/data/demo-seed");
  return response.data;
};

export const uploadIntelData = async (formData) => {
  const response = await api.post("/api/data/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
