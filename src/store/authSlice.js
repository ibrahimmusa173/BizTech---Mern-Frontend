import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
    token: localStorage.getItem('token') || null,
    // CRITICAL: Read user_type from localStorage so it persists on refresh
    user_type: localStorage.getItem('user_type') || null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.user_type = action.payload.user_type;
      
      // Save to LocalStorage properly
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      
      if (action.payload.user_type) {
        localStorage.setItem('user_type', action.payload.user_type);
      }
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.user_type = null;
      
      localStorage.clear(); // Clear everything to be safe
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;