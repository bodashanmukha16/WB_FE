import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};