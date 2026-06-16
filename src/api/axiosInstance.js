import axios from 'axios';
import { store } from '../store';
import { setLogout } from '../store/authSlice';

// 1. Detect if the app is running locally or on Vercel
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// 2. Set the Base URL based on the environment
// Change '5000' to whatever port your backend runs on locally (e.g., 8000 or 5000)
const baseURL = isLocalhost 
  ? 'http://localhost:7000/api' 
  : `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({
  baseURL: baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(setLogout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;