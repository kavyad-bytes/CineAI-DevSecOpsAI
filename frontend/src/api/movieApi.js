import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/movies";

export const getMovies = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/search?q=${query}`);
  return response.data;
};

export const aiSearchMovies = async (query) => {
  const response = await axios.post(`${API_BASE_URL}/ai-search`, {
    query,
  });
  return response.data;
};

export const uploadMovie = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};