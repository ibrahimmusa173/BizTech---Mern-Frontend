// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
    token: localStorage.getItem('token') || null,
    user_type: localStorage.getItem('user_type') || null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.user_type = action.payload.user_type;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user_type', action.payload.user_type);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.user_type = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user_type');
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;