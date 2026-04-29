import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://cineai.local/api/movies";

const getAuthHeaders = () => {
  const token = localStorage.getItem("cineai_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getMovies = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/search?q=${query}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const aiSearchMovies = async (query) => {
  const response = await axios.post(
    `${API_BASE_URL}/ai-search`,
    { query },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const uploadMovie = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("cineai_token")}`,
    },
  });

  return response.data;
};