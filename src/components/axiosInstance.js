import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Backend server URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if backend sends cookies or credentials
});

export default axiosInstance;
