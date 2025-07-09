// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api', // 👈 no need to repeat in each call
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
