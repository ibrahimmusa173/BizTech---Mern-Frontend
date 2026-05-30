import axios from 'axios';
import { store } from '../store';
import { setLogout } from '../store/authSlice';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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