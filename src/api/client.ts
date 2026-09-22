import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.1.32:3000/";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response?.data,
  async (error) => {
    error.response?.data 
    if (error.response?.status === 401) {
   
      await SecureStore.deleteItemAsync("authToken");
    }
  
const  data = error.response?.data 
    return Promise.reject(data || "Something went wrong");
  }
);