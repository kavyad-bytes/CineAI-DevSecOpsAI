import axios from "axios";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL || "http://cineai.local/api/auth";

export const registerUser = async (email, password) => {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, {
    email,
    password,
  });

  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, {
    email,
    password,
  });

  return response.data;
};