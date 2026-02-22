import axios from 'axios';
import { store } from '../store'; // Import store to dispatch logout
import { setLogout } from '../store/authSlice';

const API = axios.create({
  baseURL: 'http://localhost:7000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// NEW: Add a response interceptor to handle expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear state and kick to login
      store.dispatch(setLogout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;