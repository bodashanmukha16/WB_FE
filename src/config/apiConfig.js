// Centralized API Configuration sourced from VITE_API_URL environment variable
const getBaseApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Trim trailing slash if present
    return envUrl.replace(/\/+$/, "");
  }
  // Fallback default
  return "https://wb-be-q2u6.onrender.com/api";
};

export const BASE_API_URL = getBaseApiUrl();

export const API_ENDPOINTS = {
  AUTH: `${BASE_API_URL}/auth`,
  ENROLLMENTS: `${BASE_API_URL}/enrollments`
};

export default BASE_API_URL;
