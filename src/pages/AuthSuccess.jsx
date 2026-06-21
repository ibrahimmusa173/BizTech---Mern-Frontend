import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from '../store/authSlice';
import API from '../api/axiosInstance';

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user_type = params.get('user_type');

    console.log('AuthSuccess — token:', !!token, 'user_type:', user_type); // debug

    if (token && user_type) {
      // Store token in localStorage first so axiosInstance can use it
      localStorage.setItem('token', token);

      // Fetch full user profile using the token
      API.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(({ data }) => {
          dispatch(setLogin({
            token,
            user_type,
            user: data.data  // full user object from /api/auth/profile
          }));

          const role = user_type.toLowerCase();
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'vendor') navigate('/vendor/dashboard');
          else navigate('/client/dashboard');
        })
        .catch((err) => {
          console.error('Failed to fetch profile after Google login:', err);
          // Even if profile fetch fails, still log them in with basic info
          dispatch(setLogin({
            token,
            user_type,
            user: { user_type }
          }));
          const role = user_type.toLowerCase();
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'vendor') navigate('/vendor/dashboard');
          else navigate('/client/dashboard');
        });
    } else {
      console.error('AuthSuccess — missing token or user_type in URL');
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white text-lg">Signing you in with Google...</p>
    </div>
  );
};

export default AuthSuccess;