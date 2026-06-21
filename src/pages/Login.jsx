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
      
      const userType = data.user_type || data.user?.user_type;

      if (!userType) {
        throw new Error("User role is missing. Contact support.");
      }

      dispatch(setLogin({
        token: data.token,
        user_type: userType, 
        user: data.user
      }));

      const role = userType.toLowerCase();
      
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else if (role === 'client') navigate('/client/dashboard'); 
      else navigate('/profile');

    } catch (error) {
      console.error("Login failed:", error);
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
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
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
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* Google Login Button */}
        <a href={`${import.meta.env.VITE_API_URL}/auth/google`} className="block">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded transition duration-200"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            Continue with Google
          </button>
        </a>

        <p className="mt-8 text-center text-gray-400">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;