import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";

export const loginUser = async (data) => {
  const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, data);
  return response.data;
};