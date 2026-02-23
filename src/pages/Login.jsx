import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLogin } from '../store/authSlice';
import API from '../api/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Save to Redux
      dispatch(setLogin({
        token: data.token,
        user_type: data.user_type,
        user: data.user
      }));

      // Role-based navigation
      const role = data.user_type?.toLowerCase();
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'client') navigate('/client/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/profile');

    } catch (error) {
      alert(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              autoComplete="email"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="text-left">
            <label className="block text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              autoComplete="current-password"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" virtual="true" className="text-sm text-indigo-400 hover:text-indigo-300">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Don't have an account? {' '}
          <Link to="/register" className="text-indigo-400 font-medium hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;