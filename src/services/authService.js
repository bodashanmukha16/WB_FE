import axios from "axios";

const API = "https://wb-be-q2u6.onrender.com/api/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};