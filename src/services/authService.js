import axios from "axios";

const API = "https://wb-be-lc6x.onrender.com/api/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};